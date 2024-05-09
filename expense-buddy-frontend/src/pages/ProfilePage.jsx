import { useEffect, useState } from "react";
import { DashNav } from "../components/DashBoard-Components/DashNav";
import { Sidebar } from "../components/DashBoard-Components/Sidebar";
import axios from "axios";
import { DashFooter } from "../components/DashBoard-Components/DashFooter";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/user/profile', {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setFullname(response.data.user.fullname);
                setEmail(response.data.user.email);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchData();

    }, []);


    return (
        <div className="h-screen">
            <div className="flex">
                <Sidebar />
                <div className="bg-gray-200 w-full p-4">
                    <DashNav />
                    <div className="flex flex-col mx-auto items-center text-center max-w-lg ">
                        <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center mb-5">
                            <span className="text-2xl text-white">U</span>
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">{fullname}</h3>
                        Logged in as {fullname} ({email}) <br />
                    </div>
                </div>
            </div>
            <DashFooter />
        </div>
    )
}