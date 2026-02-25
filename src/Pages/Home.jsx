import React from 'react';
import Navbar from "../Componenet/Navbar";
import Sidebar from "../Componenet/Sidebar";
import { Outlet } from 'react-router-dom';

const Home = () => {
    return (

        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">


            <Sidebar className="h-full shrink-0" />


            <div className="flex flex-col flex-1 min-w-0">


                <Navbar />


                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">

                        {/* Default dashboard card will be rendered by the index route (Dashboard) */}
                        <Outlet />

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;