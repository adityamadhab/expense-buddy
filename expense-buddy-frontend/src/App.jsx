import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { IndexPage } from './pages/IndexPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { SupportPage } from './pages/SupportPage';
import { DashBoard } from './pages/DashBoard';
import { ProfilePage } from './pages/ProfilePage';
import { ExpensePage } from './pages/ExpensePage';
import { StatisticsPage } from './pages/StatisticsPage';
import { UnderConstruction } from './pages/UnderConstruction';
import { GroupExpensePage } from './pages/GroupExpensePage';
import LoadingBar from 'react-top-loading-bar'

axios.defaults.baseURL = "http://localhost:3000/api/v1";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState();

  useEffect(() => {
    setProgress(10);
    setTimeout(() => {
      setProgress(30);
    }, 200);
    setTimeout(() => {
      setProgress(70);
    }, 300);
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);
  return (
    <div>
      <LoadingBar color='#f11946' height={'5px'} progress={progress} onLoaderFinished={() => setProgress(0)} />
      <Routes>
        <Route index path='/' element={<IndexPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/expense' element={<ExpensePage />} />
        <Route path='/statistics' element={<StatisticsPage />} />
        <Route path='/group-expense' element={<GroupExpensePage />} />
        <Route path='/underconstruction' element={<UnderConstruction />} />
      </Routes>
    </div>
  );
}


export default App;
