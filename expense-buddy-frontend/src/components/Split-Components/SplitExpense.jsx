import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function SplitExpense() {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState('');
    const [numPeople, setNumPeople] = useState(1);
    const [splitAmount, setSplitAmount] = useState(0);
    const [updatedExpense, setUpdatedExpense] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('/expense/all', {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setExpenses(response.data);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchExpenses();
    }, []);

    const handleSplit = async () => {
        if (!selectedExpense || numPeople < 1) {
            setError('Please select an expense and enter a valid number of people.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`/expense/split/${selectedExpense}`, {
                numPeople
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });

            if (response.status === 200) {
                const { updatedExpense } = response.data;
                setSplitAmount(updatedExpense.amount / numPeople);
                setUpdatedExpense(updatedExpense);
            } else {
                setError('Failed to split the expense.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-10">
            <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900">Split Expense</h2>
                <p className="mt-2 text-gray-600">Select an expense and split it among multiple people.</p>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Select Expense:</label>
                    <select
                        value={selectedExpense}
                        onChange={(e) => setSelectedExpense(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="" disabled>Select an expense</option>
                        {expenses.map(expense => (
                            <option key={expense._id} value={expense._id}>
                                {expense.description} - Rs.{expense.amount}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Number of People:</label>
                    <input
                        type="number"
                        value={numPeople}
                        onChange={(e) => setNumPeople(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-12 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        min="1"
                    />
                </div>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <button
                    onClick={handleSplit}
                    className={`mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Splitting...' : 'Split Expense'}
                </button>

                {splitAmount > 0 && (
                    <div className="mt-4">
                        <p className="text-green-600 font-semibold">Each person needs to pay: Rs.{splitAmount.toFixed(2)}</p>
                    </div>
                )}

                {updatedExpense && (
                    <div className="mt-4 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3">
                        <p className="font-semibold">Your expense for {updatedExpense.description} has been updated to Rs.{updatedExpense.amount.toFixed(2)}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
