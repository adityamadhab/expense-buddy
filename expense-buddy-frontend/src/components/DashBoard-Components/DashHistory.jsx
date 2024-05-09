import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function DashHistory() {
    const [history, setHistory] = useState([]);
    const [sortedHistory, setSortedHistory] = useState([]);
    const [sortOption, setSortOption] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('/history', {
                    headers: { Authorization: localStorage.getItem("token") }
                });
                setHistory(response.data.allHistory);
                setSortedHistory(response.data.allHistory);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        return { formattedDate, formattedTime };
    };

    const handleSortChange = (event) => {
        const selectedOption = event.target.value;
        setSortOption(selectedOption);
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        let sortedHistory;
        switch (selectedOption) {
            case 'today':
                sortedHistory = history.filter((item) => new Date(item.date) >= today);
                break;
            case 'yesterday':
                sortedHistory = history.filter((item) => new Date(item.date) >= yesterday && new Date(item.date) < today);
                break;
            case 'last7days':
                sortedHistory = history.filter((item) => new Date(item.date) >= last7Days);
                break;
            case 'lastmonth':
                sortedHistory = history.filter((item) => new Date(item.date) >= lastMonth);
                break;
            default:
                sortedHistory = history;
        }
        setSortedHistory(sortedHistory);
    };

    return (
        <div>
            <div class="flex justify-end mb-5">
                <select value={sortOption} onChange={handleSortChange} className="mt-4">
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 days</option>
                    <option value="lastmonth">Last month</option>
                </select>
            </div>
            <div className="overflow-y-auto max-h-[350px]">
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Time</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHistory.map((item, index) => {
                            const { formattedDate, formattedTime } = formatDate(item.date);
                            const isExpense = item.type === 'Expense';
                            const amountColor = isExpense ? 'text-red-500' : 'text-green-500';
                            const amountSign = isExpense ? '-' : '+';
                            return (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-200'}>
                                    <td className="p-3">{formattedDate}</td>
                                    <td className="p-3">{formattedTime}</td>
                                    <td className="p-3">{item.type}</td>
                                    <td className={`p-3 ${amountColor}`}>{`${amountSign}Rs.${Math.abs(item.amount).toFixed(2)}`}</td>
                                    <td className="p-3">{item.description}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {sortedHistory.length === 0 && <p>No history available.</p>}

            </div>
        </div>
    );
}