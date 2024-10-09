import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Chart = ({ data }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return <p>No data available</p>;
    }


    const chartData = {
        labels: data.map(item => item.range), // Price ranges
        datasets: [
            {
                label: "Number of Items",
                data: data.map(item => item.count), // Counts
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};


Chart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            range: PropTypes.string.isRequired,
            count: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default Chart;
