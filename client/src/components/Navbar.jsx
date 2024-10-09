// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4 text-white">
                <li>
                    <Link to="/" className="hover:underline">Transactions</Link>
                </li>
                <li>
                    <Link to="/statistics" className="hover:underline">Statistics</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
