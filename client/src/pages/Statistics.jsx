import DropDown from "../components/DropDown.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "../components/Chart.jsx";

function Statistics() {
    const [statisticsData, setStatisticsData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [statmonth, setStatMonth] = useState(1);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        // Fetch statistics data
        axios.get(`http://localhost:3000/statistics?month=${statmonth}`)
            .then((response) => {
                setStatisticsData(response.data);
                console.log(response.data); // Log the actual data for inspection
            })
            .catch((error) => {
                console.log(error);
            });
    }, [statmonth]);

    useEffect(() => {
        // Fetch chart data
        axios.get(`http://localhost:3000/bar-chart?month=${statmonth}`)
            .then((response) => {
                setChartData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [statmonth]);

    return (
        <div className="my-24">
            <div className="flex justify-evenly items-center relative">
                <h1 className="text-5xl font-bold font-mono tracking-tight">
                    STATISTICS - <span className="text-4xl font-semibold mx-3">{months[statmonth - 1]}</span>
                </h1>
                <DropDown month={statmonth} setMonth={setStatMonth} />
            </div>

            <div className="flex justify-center items-center mt-24">
                <div className="h-[12em] w-[25em] bg-sky-200 rounded-[1.5em] text-black font-nunito p-[1em] flex justify-center items-left flex-col gap-[0.75em] backdrop-blur-[12px]">
                    {statisticsData ? (
                        <div className="mx-3 space-y-4">
                            <div className="flex justify-between">
                                <p className="text-xl font-semibold">Total Sale</p>
                                <p className="text-xl">{statisticsData.totalSaleAmount}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-xl font-semibold">Total Sold Items</p>
                                <p className="text-xl">{statisticsData.totalSoldItems}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-xl font-semibold">Total Not Sold Items</p>
                                <p className="text-xl">{statisticsData.totalNotSoldItems}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xl">Loading statistics...</p> // Loading state
                    )}
                </div>
            </div>
<div className="m-24">

            {chartData ? <Chart data={chartData} /> : <p>Loading chart data...</p>}
</div>
        </div>
    );
}

export default Statistics;
