import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/HomePage.jsx';
import Login from './pages/LoginPage.jsx';
import Register from './pages/RegisterPage.jsx';
import Account from './pages/UserPage.jsx'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
        </Routes>
    );
};

export default App;
