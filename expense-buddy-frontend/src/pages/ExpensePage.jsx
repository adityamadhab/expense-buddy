import { useNavigate } from "react-router-dom";
import { DashFooter } from "../components/DashBoard-Components/DashFooter";
import { DashNav } from "../components/DashBoard-Components/DashNav";
import { Sidebar } from "../components/DashBoard-Components/Sidebar";
import { ExpenseMain } from "../components/Expense-Components/ExpenseMain";
import { useEffect } from "react";

export function ExpensePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, []);

    return (
        <div className="h-screen">
            <div className="flex">
                <Sidebar />
                <div className="bg-gray-200 w-full p-4">
                    <DashNav />
                    <ExpenseMain />
                </div>
            </div>
            <DashFooter />
        </div>
    )
}