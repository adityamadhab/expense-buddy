import React, { useEffect, useState } from 'react';
import { IncomeForm } from './IncomeForm';
import { ExpenseForm } from './ExpenseForm';
import { HistoryList } from './HistoryList';
import axios from 'axios';

export const ExpenseMain = () => {
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [expenseHistory, setExpenseHistory] = useState([]);

  const handleToggleIncomeForm = () => {
    setShowIncomeForm(!showIncomeForm);
  };

  const handleToggleExpenseForm = () => {
    setShowExpenseForm(!showExpenseForm);
  };

  useEffect(() => {
    const fetchExpenseHistory = async () => {
      try {
        const response = await axios.get('/expense/all', {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        setExpenseHistory(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchExpenseHistory();
  }, [])

  useEffect(() => {
    const fetchIncomeHistory = async () => {
      try {
        const response = await axios.get('/income/all', {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        setIncomeHistory(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchIncomeHistory();
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <p className="text-lg mb-4">Track your income and expenses effortlessly!</p>
        <div className="flex justify-center space-x-4">
          <button onClick={handleToggleIncomeForm} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
            Add Income
          </button>
          <button onClick={handleToggleExpenseForm} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
            Add Expense
          </button>
        </div>
      </div>

      {showIncomeForm && <IncomeForm setShowIncomeForm={setShowIncomeForm} />}
      {showExpenseForm && <ExpenseForm setShowExpenseForm={setShowExpenseForm} />}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Recent Income</h2>
        <HistoryList history={incomeHistory} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Recent Expense</h2>
        <HistoryList history={expenseHistory} />
      </div>
    </div>
  );
};
