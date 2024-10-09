import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import axios from 'axios';

const DropDown = ({ month, setMonth }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const toggle = () => {
        setOpen(!open);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !buttonRef.current.contains(event.target)
        ) {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (open) {
            gsap.fromTo(
                dropdownRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        } else {
            gsap.to(dropdownRef.current, {
                opacity: 0,
                y: -10,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => setOpen(false),
            });
        }

        // Event listener for clicks outside the dropdown
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleMonthSelect = (selectedMonth) => {
        setMonth(selectedMonth); // Set the selected month
        setOpen(false); // Close the dropdown after selection
    };
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]
    return (
        <div className="absolute top-0 right-28">
            <button
                id="dropdownDelayButton"
                ref={buttonRef}
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-4 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                onClick={toggle}
            >
                {month ? months[month - 1] : 'Select Month'}
                <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1l4 4 4-4"
                    />
                </svg>
            </button>

            <div
                id="dropdownDelay"
                ref={dropdownRef}
                className={`${
                    open ? '' : 'hidden'
                } z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
            >
                <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDelayButton"
                >
                    {months.map((monthName, index) => (
                        <li key={index}>
                            <a
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => handleMonthSelect(index + 1)} // Pass the month index (1-12)
                            >
                                {monthName}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DropDown;
