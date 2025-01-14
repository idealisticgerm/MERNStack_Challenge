import axios from "axios";
import Transaction from "../models/Transaction.js";

export const SeedController = async (req, res) => {
    try {
        const {data} = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        await Transaction.deleteMany({});
        await Transaction.insertMany(data);
        res.status(200).json({message: 'Database initialized with seed data.'});
    } catch (err) {
        res.status(500).json({message: 'Error initializing database', error: err.message});
    }
}

// Get all transactions

export const GetAllTransactionController = async (req, res) => {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const Items_perPage = 10;
    const month = parseInt(req.query.month) || null;


    const query = {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { price: !isNaN(parseFloat(search)) ? parseFloat(search) : undefined },
        ].filter(Boolean) // Filter out undefined values
    };

    if (month !== null) {
        query.$expr = query.$expr || {};
        query.$expr.$eq = [{ $month: "$dateOfSale" }, month];
    }


    console.log(query);

    try {
        const skip = (page - 1) * Items_perPage;
        const count = await Transaction.countDocuments(query);
        const products = await Transaction.find(query).skip(skip).limit(Items_perPage);
        const pageCount = Math.ceil(count / Items_perPage);
        res.status(200).json({
            Pagination: {
                count,
                pageCount,
                currentPage: page
            },
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
}

// Statistics Controller
export const StatisticsController = async (req, res) => {
    const { month } = req.query ;

    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    // Get total sale amount, total sold items, and total not sold items
    try {
        const totalSaleAmount = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                    },
                    sold: true // Only sold items
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$price" }
                }
            }
        ]);

        const totalSoldItems = await Transaction.countDocuments({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            },
            sold: true // Only sold items
        });

        const totalNotSoldItems = await Transaction.countDocuments({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            },
            sold: false // Only not sold items
        });

        return res.json({
            totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Bar Chart Controller
export const BarChartController = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        // Define price ranges
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity } // For 901 and above
        ];

        const results = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                },
                price: { $gte: range.min, $lt: range.max === Infinity ? Number.MAX_SAFE_INTEGER : range.max },
            });

            return {
                range: `${range.min} - ${range.max === Infinity ? 'above 901' : range.max}`,
                count,
            };
        }));

        return res.json(results);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const PieChartController = async (req, res) => {
    const { month } = req.query;

    // Check if the month query parameter is provided
    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        // Use aggregation to group by category and count items
        const results = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)] // Match month
                    }
                }
            },
            {
                $group: {
                    _id: "$category", // Group by category
                    count: { $sum: 1 } // Count the number of items in each category
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    category: "$_id", // Include category name
                    count: 1 // Include count
                }
            }
        ]);

        // Send the results as a response
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const CombinedAPIController = async (req, res) => {
    const { month } = req.query;

    // Check if the month query parameter is provided
    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        // Fetch statistics
        const totalSaleAmountData = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                    },
                    sold: true // Only sold items
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$price" }
                }
            }
        ]);

        const totalSoldItems = await Transaction.countDocuments({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            },
            sold: true // Only sold items
        });

        const totalNotSoldItems = await Transaction.countDocuments({
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            },
            sold: false // Only not sold items
        });

        const statistics = {
            totalSaleAmount: totalSaleAmountData.length ? totalSaleAmountData[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        };

        // Fetch bar chart data
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity }
        ];

        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                },
                price: { $gte: range.min, $lt: range.max === Infinity ? Number.MAX_SAFE_INTEGER : range.max },
            });

            return {
                range: `${range.min} - ${range.max === Infinity ? 'above 901' : range.max}`,
                count,
            };
        }));

        // Fetch pie chart data
        const pieChartData = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)] // Match month
                    }
                }
            },
            {
                $group: {
                    _id: "$category", // Group by category
                    count: { $sum: 1 } // Count the number of items in each category
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    category: "$_id", // Include category name
                    count: 1 // Include count
                }
            }
        ]);

        // Combine results
        const combinedResponse = {
            statistics,
            barChartData,
            pieChartData
        };

        return res.json(combinedResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

