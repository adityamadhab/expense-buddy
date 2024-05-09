import React, { useEffect } from 'react';
import { Sidebar } from '../components/DashBoard-Components/Sidebar';
import { DashNav } from '../components/DashBoard-Components/DashNav';
import { DashBalance } from '../components/DashBoard-Components/DashBalance';
import { DashHistory } from '../components/DashBoard-Components/DashHistory';
import { DashFooter } from '../components/DashBoard-Components/DashFooter';
import { useNavigate } from 'react-router-dom';

export function DashBoard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, []);

  return (
    <div className='h-screen'>
      <div className="flex">
        <Sidebar />
        <div className="main--content bg-gray-200 w-full p-4">
          <DashNav />
          <div className="container">
            <DashBalance />
            <h3 className="text-lg font-semibold mb-2">History</h3>
            <DashHistory />
          </div>
        </div>
      </div>
      <DashFooter />
    </div>
  );
}
