import React, { useState } from 'react';
import axios from 'axios';

export const ExpenseForm = ({ addExpense, setShowExpenseForm }) => {
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/expense/add', {
        amount: expenseAmount,
        description: expenseDescription,
        category: expenseCategory
      }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      if (response.status === 200) {
        setSuccessMessage('Expense added successfully.');
        setExpenseAmount('');
        setExpenseDescription('');
        setExpenseCategory('');
        addExpense(); // Trigger the callback to update the history
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md relative">
        <button onClick={() => setShowExpenseForm(false)} className="absolute top-0 right-0 -mt-4 -mr-4 bg-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-2">Add Expense</h2>
        <form onSubmit={handleAddExpense} className="flex flex-col space-y-2">
          <input
            type="number"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder="Amount"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            value={expenseDescription}
            onChange={(e) => setExpenseDescription(e.target.value)}
            placeholder="Description"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <select
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Fuel">Fuel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Recharge">Recharge</option>
            <option value="Pets">Pets</option>
            <option value="Holidays">Holidays</option>
            <option value="Kids">Kids</option>
            <option value="Insurance">Insurance</option>
            <option value="Energy">Energy</option>
            <option value="Others">Others</option>
          </select>
          <button type="submit" className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
            Add Expense
          </button>
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};
