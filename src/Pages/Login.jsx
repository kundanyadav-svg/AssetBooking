import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';
import axios from "axios";
import {toast} from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();


           try {
                  const response=await axios.post("http://localhost:8080/auth/login",{
                    email:email,
                    password:password
                  },{withCredentials:true});
                  console.log(response.data);

                   toast.success("Login successful!", );

                     window.location.href="/";
                    setError(null);
                } catch (error)

           {
               console.log("Error data:", error.response.data);

               const msg =
                   typeof error.response.data === "string"
                       ? error.response.data
                       : error.response.data.message;

               setError(msg);
               toast.error(msg);
           }

    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">

                {/* Branding Header */}
                <div className="bg-emerald-600 p-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                        <ShieldCheck className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">AssetFlow Portal</h1>
                    <p className="text-emerald-100 text-sm mt-1 opacity-80">Corporate Asset & Seat Booking</p>
                </div>

                {/* Login Form */}
                <div className="p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                Corporate Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group active:scale-95 mt-4"
                        >
                            Sign In
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {
                        error && <div className="mt-4 text-center">
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>

                    }

                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
              Internal System Use Only
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;