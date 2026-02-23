import React from 'react';
import BookingGrid from "./BookingGrid.jsx";

const Dashboard = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>welcome to Aseet_Request And Book your seat for today...</p>

            <BookingGrid/>
        </div>
    );
};

export default Dashboard;

