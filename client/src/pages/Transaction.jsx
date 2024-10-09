import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import DropDown from "../components/DropDown.jsx";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx"; // Updated import
import axios from "axios";

function Transaction() {
    const [transactionData, setTransactionData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [perPage, setPerPage] = useState(10); // Track number of items per page
    const [totalPages, setTotalPages] = useState(0); // Track total number of pages
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:3000/transactions?page=${currentPage}&limit=${perPage}&search=${search}&month=${month}`) // Update API call
            .then((response) => {
                setTransactionData(response.data.products); // Update products data
                console.log(response.data)
                setTotalPages(response.data.Pagination.pageCount); // Get total pages from the API response
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentPage, perPage,search,month]); // Fetch data when page or items per page change

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage); // Update current page when pagination changes
    };

    return (
        <>
            <div className="mx-auto flex justify-center items-center flex-col space-y-4">
                <div className="bg-blue-200 text-neutral-700 rounded-full px-6 py-4 mt-4">
                    <h1 className="text-4xl font-bold text-center flex flex-col space-y-4">
                        <span>Transaction</span>
                        <span>Dashboard</span>
                    </h1>
                </div>
            </div>

            <div className="flex justify-around mt-10 items-start relative">
                <SearchBar search={search} setSearch={setSearch}/>
                <DropDown month={month} setMonth={setMonth}/>
            </div>

            <div className="mx-10 my-24 ">
                <Table products={transactionData} />
            </div>

            <div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}

export default Transaction;
