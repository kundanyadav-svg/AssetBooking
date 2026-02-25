import React from 'react';
import { Bell, ChevronDown, Sparkles } from 'lucide-react';
import { useSelector } from "react-redux";

const Navbar = () => {
    const { userData } = useSelector(state => state.user);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm shadow-slate-200/50">
            {/* Left side: Brand Identity */}
            <div className="flex items-center gap-5 group cursor-default">
                <div className="relative">
                    <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-black text-lg tracking-tighter">AF</span>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -top-1 -right-1">
                        <Sparkles size={12} className="text-emerald-500 animate-pulse" />
                    </div>
                </div>

                <div className="hidden sm:block">
                    <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                        Asset<span className="text-emerald-500">Flow</span>
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Workspace Intelligence</p>
                    </div>
                </div>
            </div>

            {/* Right side: User Actions */}
            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <button className="relative group p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all duration-300 border border-transparent hover:border-emerald-100">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-200"></span>
                </button>

                {/* Vertical Divider */}
                <div className="h-8 w-[1px] bg-slate-100 hidden sm:block"></div>

                {/* Profile Section */}
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="hidden sm:flex flex-col items-end">
                        <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                            {userData?.name || 'Administrator'}
                        </p>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-md border border-emerald-100 uppercase tracking-widest mt-0.5">
                            {userData?.role?.replace('ROLE_', '') || 'Super Admin'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 p-1 pl-1 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md group">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-inner overflow-hidden relative">
                            {/* Gradient Overlay for Avatar */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            {(userData?.name?.charAt(0) || 'A').toUpperCase()}
                        </div>
                        <ChevronDown size={14} className="text-slate-400 mr-2 group-hover:text-emerald-500 transition-colors" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;