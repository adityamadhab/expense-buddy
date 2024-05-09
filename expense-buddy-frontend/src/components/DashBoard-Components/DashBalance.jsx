import { useEffect, useState } from "react";
import axios from "axios";

export function DashBalance() {
    const [ balance, setBalance ] = useState('');
    const [ income, setIncome ] = useState('');
    const [ expense, setExpense ] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get('/balance', {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        const fetchIncome = async () => {
            try {
                const response = await axios.get('/income/total', {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setIncome(response.data.totalIncome);
            } catch(error) {
                console.error("Error fetching income data:", error);
            }
        }
        const fetchExpense = async () => {
            try {
                const response = await axios.get('/expense/total', {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setExpense(response.data.totalExpense);
            } catch(error) {
                console.error("Error fetching income data:", error);
            }
        }
        fetchBalance();
        fetchIncome();
        fetchExpense();
    }, []);


    return (
        <div>
            <h4 className="text-lg font-semibold mb-4">Your Balance</h4>
            <h1 id="balance" className="text-3xl font-bold mb-6">Rs. {balance}</h1>
            <div className="inc-exp-container bg-white rounded-lg p-4 flex justify-between items-center mb-6">
                <div className="text-center">
                    <h4>Income</h4>
                    <p id="money-plus" className="money plus text-green-500">+Rs. {income}</p>
                </div>
                <div className="text-center">
                    <h4>Expense</h4>
                    <p id="money-minus" className="money minus text-red-500">-Rs. {expense}</p>
                </div>
            </div>
        </div>
    )
}