import React, { useState } from 'react';
import {
    User, Mail, Lock, Building2,
    ShieldCheck, X, Save, ShieldAlert,
    UserCog, ChevronDown
} from 'lucide-react';
import axios from "axios";
import {toast} from "react-toastify";

const Register = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
        dept: ''
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

          try {
               const response=await  axios.post("http://localhost:8080/auth/register",formData,{withCredentials:true});
                console.log(response.data);
                alert("User registered successfully!");
                setFormData({
                     name: '',
                     email: '',
                     password: '',
                     role: 'EMPLOYEE',
                     dept: ''
                });

                toast.success("User registered successfully!", );
              }
              catch(error)
              {
                    console.log("Error data:", error.response.data);


                    const msg =
                        typeof error.response.data === "string"
                            ? error.response.data
                            : error.response.data.message;

                    setError(msg);

          }


    };

    const getRoleTheme = (role) => {
        switch(role) {
            case 'ADMIN': return "border-red-200 bg-red-50 text-red-700";
            case 'ITSUPPORT': return "border-blue-200 bg-blue-50 text-blue-700";
            default: return "border-emerald-200 bg-emerald-50 text-emerald-700";
        }
    };

    return (

        /* This outer div ensures the card is centered if used as a full page */
        <div className="flex items-center justify-center min-h-screen w-full bg-slate-50 p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden font-sans">

                {/* Admin Header */}
                <div className="bg-slate-900 px-8 py-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                            <UserCog size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Register New User</h2>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Access Provisioning Console</p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-all">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="name"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="Enter name....."
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Department</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="dept"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="Sales"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Corporate Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="kundan123@gmail.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Temporary Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selector */}
                    <div className={`p-5 rounded-2xl border transition-colors flex items-center justify-between ${getRoleTheme(formData.role)}`}>
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} />
                            <div>
                                <p className="text-sm font-bold">System Role</p>
                                <p className="text-[11px] opacity-70 italic tracking-wide">Sets module permissions automatically</p>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="appearance-none bg-white/50 border border-current px-4 py-1.5 pr-8 rounded-lg font-bold text-xs cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-all"
                            >
                                <option value="EMPLOYEE">EMPLOYEE</option>
                                <option value="ITSUPPORT">ITSUPPORT</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-2 pointer-events-none" size={14} />
                        </div>
                    </div>

                    {/* Security Warning */}
                    {formData.role === 'ADMIN' && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-800 border border-red-100 rounded-xl">
                            <ShieldAlert size={20} className="shrink-0" />
                            <p className="text-xs font-medium">Critical: Admin roles grant full CRUD permissions over all system assets.</p>
                        </div>
                    )}

                    {
                        error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-800 border border-red-100 rounded-xl">
                                <ShieldAlert size={20} className="shrink-0" />
                                <p className="text-xs font-medium">{error}</p>
                            </div>
                        )

                    }

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-50">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
                        >
                            <Save size={18} />
                            Register User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;