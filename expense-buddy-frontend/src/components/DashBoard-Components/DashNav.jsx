import { Link } from "react-router-dom";

export function DashNav() {
    return (
        <div className="main--content bg-gray-200 w-full p-4">
            <div className="header--wrapper bg-white rounded-lg p-4 mb-4 flex justify-between items-center">
                <Link to={'/dashboard'} className="header--title cursor-pointer">
                    <span className="font-bold">Primary</span>
                    <h2 className="text-2xl font-extrabold text-purple-700">Expense Explorer</h2>
                </Link>
                <div className="user--info flex items-center">
                    <div className="search--box bg-purple-200 rounded-lg flex items-center gap-2 px-3 py-1">
                        <i className="fas fa-search text-purple-700"></i>
                        <input type="text" placeholder="Search" className="bg-transparent focus:outline-none" />
                    </div>
                    <Link to={'/profile'} className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 rounded-full ml-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}