import { DashFooter } from "../components/DashBoard-Components/DashFooter";
import { DashNav } from "../components/DashBoard-Components/DashNav";
import { Sidebar } from "../components/DashBoard-Components/Sidebar";
import { SplitExpense } from "../components/Split-Components/SplitExpense";

export function GroupExpensePage() {
    return (
        <div className="h-screen">
            <div className="flex">
                <Sidebar />
                <div className="bg-gray-200 w-full p-4">
                    <DashNav />
                    <div className="mt-4">
                        <SplitExpense />
                    </div>
                </div>
            </div>
            <DashFooter />
        </div>
    )
}