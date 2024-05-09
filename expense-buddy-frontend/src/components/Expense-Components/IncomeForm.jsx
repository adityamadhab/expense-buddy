import React, { useState } from 'react';
import axios from 'axios';

export const IncomeForm = ({ setShowIncomeForm }) => {
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/income/add', {
        amount: incomeAmount,
        description: incomeDescription,
        source: incomeSource
      }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      if (response.status === 200) {
        setSuccessMessage('Income added successfully.');
        setIncomeAmount('');
        setIncomeDescription('');
        setIncomeSource('');
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md relative">
        <button onClick={() => setShowIncomeForm(false)} className="absolute top-0 right-0 -mt-4 -mr-4 bg-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-2">Add Income</h2>
        <form onSubmit={handleAddIncome} className="flex flex-col space-y-2">
          <input
            type="number"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            placeholder="Amount"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            value={incomeDescription}
            onChange={(e) => setIncomeDescription(e.target.value)}
            placeholder="Description"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <select
            value={incomeSource}
            onChange={(e) => setIncomeSource(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Source</option>
            <option value="Salary">Salary</option>
            <option value="Shares">Shares</option>
            <option value="Family-Allowance">Family Allowance</option>
            <option value="Refunds">Refunds</option>
            <option value="Sales">Sales</option>
            <option value="Gifts">Gifts</option>
            <option value="Properties-Rent">Properties Rent</option>
            <option value="Others">Others</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
            Add Income
          </button>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};
