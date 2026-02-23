import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    UserPlus,
    ShieldCheck,
    LogOut,
    LayoutDashboard,
    CalendarDays,
    Settings,
    Briefcase,
    Inbox
} from 'lucide-react';
import axios from "axios";
import { setuserData } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
    // Enhanced Link Classes with Centered Content
    const linkClass = ({ isActive }) =>
        `group flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
            isActive
                ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
        }`;

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    const handlelogout = async () => {
        try {
            await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
            dispatch(setuserData(null));
            window.location.href = "/login";
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    return (
        <aside className="w-72 bg-[#0f172a] h-screen flex flex-col sticky top-0 left-0 border-r border-slate-800/50 shadow-2xl">
            {/* Brand Header */}
            <div className="p-8 flex flex-col items-center gap-4 border-b border-slate-800/50">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <ShieldCheck className="text-white" size={24} />
                </div>
                <div className="text-center">
                    <h2 className="text-white font-black text-xl tracking-tight">AssetFlow</h2>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] mt-1">Enterprise Suite</p>
                </div>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 p-6 space-y-8 overflow-y-auto scrollbar-hide">
                <div>
                    <div className="mb-6 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] text-center">Management</div>
                    <ul className="space-y-2">
                        <li>
                            <NavLink to="/" end className={linkClass}>
                                <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-sm">Dashboard</span>
                            </NavLink>
                        </li>

                        {userData?.role === "ROLE_ADMIN" && (
                            <>
                                <li>
                                    <NavLink to="/register" className={linkClass}>
                                        <UserPlus size={20} />
                                        <span className="font-bold text-sm">Register User</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/bookingdetail" className={linkClass}>
                                        <CalendarDays size={20} />
                                        <span className="font-bold text-sm">All Bookings</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/assetmanagment" className={linkClass}>
                                        <Settings size={20} />
                                        <span className="font-bold text-sm">Asset Management</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        {userData.role === "EMPLOYEE" && (
                            <li>
                                <NavLink to="/employasstportal" className={linkClass}>
                                    <Briefcase size={20} />
                                    <span className="font-bold text-sm">Asset Portal</span>
                                </NavLink>
                            </li>
                        )}

                        {userData.role === "ITSUPPORT" && (
                            <li>
                                <NavLink to="/requestmanagment" className={linkClass}>
                                    <Inbox size={20} />
                                    <span className="font-bold text-sm">Request Desk</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

            {/* User Info & Footer actions */}
            <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
                <button
                    className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all duration-300 font-bold text-sm"
                    onClick={handlelogout}
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;