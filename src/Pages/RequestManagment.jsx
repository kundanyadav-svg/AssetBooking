import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    ClipboardList, ShieldAlert, Loader2,
    AlertCircle, Package, CheckCircle, Lock,
    ChevronLeft, ChevronRight, Hash
} from 'lucide-react';
import { useSelector } from "react-redux";

const RequestManagement = () => {
    const { userData } = useSelector(state => state.user);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const [confirmModal, setConfirmModal] = useState({ show: false, request: null, status: 'APPROVE' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchAllRequests = useCallback(async (page) => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/requests/all', {
                params: { page: page, size: pageSize },
                withCredentials: true
            });
            setRequests(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error("Queue fetch error", err);
            showMsg('error', "Could not sync with server");
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchAllRequests(currentPage);
    }, [currentPage, fetchAllRequests]);

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleProcess = async (requestId, statusAction) => {
        try {
            await axios.put(
                `http://localhost:8080/api/requests/${requestId}/status`,
                null,
                {
                    params: { status: statusAction },
                    withCredentials: true
                }
            );
            showMsg('success', `Request updated to ${statusAction}`);
            setConfirmModal({ show: false, request: null, status: 'APPROVE' });
            fetchAllRequests(currentPage);
        } catch (err) {
            showMsg('error', err.response?.data || "Transaction failed");
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };

    if (loading && requests.length === 0) return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-slate-500 font-bold tracking-widest text-xs uppercase text-center">
                Syncing Asset History...
            </p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <ClipboardList size={32} className="text-blue-600"/> Request Management
                </h1>
                {message.text && (
                    <div className={`px-6 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 animate-in slide-in-from-top-2 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                        {message.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                        {message.text}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                            <th className="px-8 py-6">Asset Detail</th>
                            <th className="px-8 py-6">Quantity</th> {/* ADDED QUANTITY COLUMN */}
                            <th className="px-8 py-6">Employee</th>
                            <th className="px-8 py-6">Request Type</th>
                            <th className="px-8 py-6">Current Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    No active requests found.
                                </td>
                            </tr>
                        ) : (
                            requests.map(req => {
                                const isLocked = req.requestStatus === 'ASSIGNE';
                                return (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl ${req.requestType === 'SYSTEM_GENERATED' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                                    {req.requestType === 'SYSTEM_GENERATED' ? <ShieldAlert size={20}/> : <Package size={20}/>}
                                                </div>
                                                <span className="font-black text-slate-800 tracking-tight">{req.item}</span>
                                            </div>
                                        </td>
                                        {/* DISPLAY QUANTITY */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 bg-slate-100 w-fit px-3 py-1 rounded-lg">
                                                <Hash size={12} className="text-slate-400"/>
                                                <span className="font-black text-slate-700">{req.quantity || 1}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{req.user?.name}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{req.user?.dept}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${req.requestType === 'SYSTEM_GENERATED' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    {req.requestType?.replace('_', ' ')}
                                                </span>
                                        </td>
                                        <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    req.requestStatus === 'ASSIGNE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        req.requestStatus === 'REJECTE' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {req.requestStatus}
                                                </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {isLocked ? (
                                                <div className="flex items-center justify-end gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                    <Lock size={14}/> Assigned
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmModal({ show: true, request: req, status: req.requestStatus })}
                                                    className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-10 py-6 bg-slate-50/50 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Showing Page <span className="text-slate-900">{currentPage + 1}</span> of <span className="text-slate-900">{totalPages}</span>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <ChevronLeft size={18}/>
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1 || totalPages === 0}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <ChevronRight size={18}/>
                        </button>
                    </div>
                </div>
            </div>

            {confirmModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl border border-slate-100 scale-in-center">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <ClipboardList size={32}/>
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight">Modify Status</h3>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Update workflow for <span className="text-blue-600 font-bold">{confirmModal.request?.item}</span></p>
                            {/* SHOW QUANTITY IN MODAL */}
                            <p className="text-xs font-black text-slate-400 uppercase mt-1">Quantity Requested: {confirmModal.request?.quantity || 1}</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Workflow Action</label>
                            <select
                                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:border-blue-500 outline-none transition-all cursor-pointer"
                                value={confirmModal.status}
                                onChange={(e) => setConfirmModal({...confirmModal, status: e.target.value})}
                            >
                                <option value="APPROVE">Approve Request</option>
                                <option value="ASSIGNE">Finalize Assignment</option>
                                <option value="REJECTE">Reject Request</option>
                                <option value="DRAFT">Reset to Pending</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mt-10">
                            <button
                                onClick={() => handleProcess(confirmModal.request.id, confirmModal.status)}
                                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmModal({ show: false, request: null, status: 'APPROVE' })}
                                className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestManagement;