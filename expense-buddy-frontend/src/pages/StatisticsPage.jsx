import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Sidebar } from '../components/DashBoard-Components/Sidebar';
import { DashNav } from '../components/DashBoard-Components/DashNav';
import { CategoryWidgets } from '../components/Statistics-Components/CategoryWidgets';
import axios from 'axios';
import { DashFooter } from '../components/DashBoard-Components/DashFooter';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Tooltip);

export function StatisticsPage() {
    const [expenseDetails, setExpenseDetails] = useState([]);
    const [incomeDetails, setIncomeDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, []);


    useEffect(() => {
        const fetchExpense = async function () {
            const res = await axios.get('/expense/total-by-category', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setExpenseDetails(res.data);
        }

        const fetchIncome = async function () {
            const res = await axios.get('/income/total-by-source', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setIncomeDetails(res.data);
        }

        fetchExpense();
        fetchIncome();
    }, []);

    const generateRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    const renderPieChart = (data) => {
        return (
            <div style={{ width: '300px', height: '300px', marginRight: '20px' }}>
                <Pie
                    data={{
                        labels: data.map((item) => item._id),
                        datasets: [{
                            data: data.map((item) => item.value),
                            backgroundColor: data.map(() => generateRandomColor()), // Generate random colors
                        }],
                    }}
                    options={{
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        const total = context.dataset.data.reduce((acc, cur) => acc + cur, 0);
                                        const percentage = parseFloat(((value / total) * 100).toFixed(2));
                                        return `${label}: Rs. ${value} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }}
                />
            </div>
        );
    };

    return (
        <div className='h-screen'>
            <div className='flex'>
                <Sidebar />
                <div className='bg-gray-200 flex-grow p-4'>
                    <DashNav />
                    <h1 className="text-2xl font-bold mb-4">Statistics of your expenses and incomes</h1>
                    <div className="container mx-auto p-4 flex justify-around items-center">
                        <div className="mb-8 flex items-center gap-14">
                            <h2 className="text-xl font-bold mb-2">Expenses</h2>
                            {renderPieChart(expenseDetails)}
                        </div>
                        <div className="flex items-center gap-14">
                            <h2 className="text-xl font-bold mb-2">Income</h2>
                            {renderPieChart(incomeDetails)}
                        </div>
                    </div>
                    <CategoryWidgets name={"Income by sources"} data={incomeDetails} />
                    <hr color="white" className="border-1 mt-4" />
                    <CategoryWidgets name={"Expenses by categories"} data={expenseDetails} />
                    <hr color="white" className="border-1 mt-4" />
                </div>
            </div>
            <DashFooter />
        </div>
    );
}
