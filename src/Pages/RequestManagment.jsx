import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    ClipboardList, ShieldAlert, Loader2,
    AlertCircle, Package, Filter, CheckCircle, Lock,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSelector } from "react-redux";

const RequestManagement = () => {


    const { userData } = useSelector(state => state.user);



    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("ALL");



    // Pagination States
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const [confirmModal, setConfirmModal] = useState({ show: false, request: null, status: 'APPROVE' });
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchAllRequests = useCallback(async (page) => {
        try {
            setLoading(true);
            // Fetching requests with page and size parameters matching RequestController
            const res = await axios.get('http://localhost:8080/api/requests/all', {
                params: {
                    page: page,
                    size: pageSize
                },
                withCredentials: true
            });

            // Spring Page object puts data in .content and metadata in totalPages
            setRequests(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error("Queue fetch error", err);
            showMsg('error', "Could not sync with server");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data whenever the page changes
    useEffect(() => {
        fetchAllRequests(currentPage);
    }, [currentPage, fetchAllRequests]);

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleProcess = async (requestId, statusAction) => {
        try {
            // PUT request using status as a query parameter as expected by RequestController
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


    const filteredRequests = requests.filter(req => {
        return filterType === "ALL" || req.requestStatus === filterType;
    });




    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };


    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };


    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-slate-500 font-bold tracking-widest text-xs uppercase text-center">
                Syncing Asset History...
            </p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <ClipboardList size={32} className="text-blue-600"/> Request Management
                </h1>
                {message.text && (
                    <div className={`px-6 py-2 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                        {message.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                        {message.text}
                    </div>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="flex-1 px-6 py-3 bg-slate-50 rounded-2xl font-bold text-slate-600 outline-none border-none focus:ring-2 focus:ring-blue-500"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="DRAFT">Pending (Draft)</option>
                        <option value="APPROVE">Approved</option>
                        <option value="ASSIGNE">Assigned (Locked)</option>
                        <option value="REJECTE">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Request Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <th className="px-8 py-5">Asset</th>
                        <th className="px-8 py-5">User</th>
                        <th className="px-8 py-5">Type</th>
                        <th className="px-8 py-5">Current Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map(req => {
                        const isPermanentlyLocked = req.requestStatus === 'ASSIGNE';
                        return (
                            <tr key={req.id} className={`transition-colors ${isPermanentlyLocked ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'}`}>
                                <td className="px-8 py-6 font-bold text-slate-800">
                                    <div className="flex items-center gap-3">
                                        {req.requestType === 'SYSTEM_GENERATED' ?
                                            <ShieldAlert size={18} className="text-rose-500"/> :
                                            <Package size={18} className="text-blue-500"/>}
                                        {req.item}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-slate-700">{req.user?.name}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{req.user?.dept}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${
                                            req.requestType === 'SYSTEM_GENERATED' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {req.requestType?.replace('_', ' ')}
                                        </span>
                                </td>
                                <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            req.requestStatus === 'APPROVE' || req.requestStatus === 'ASSIGNE' ? 'bg-emerald-100 text-emerald-700' :
                                                req.requestStatus === 'REJECTE' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {req.requestStatus}
                                        </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {isPermanentlyLocked ? (
                                        <div className="flex items-center justify-end gap-2 text-slate-400 font-bold text-[10px] uppercase">
                                            <Lock size={12} /> Asset Assigned
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmModal({ show: true, request: req, status: req.requestStatus })}
                                            className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                                        >
                                            Update Status
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Page {currentPage + 1} of {totalPages}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95"
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal remains the same */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ClipboardList size={32}/>
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight">Modify Status</h3>
                            <p className="text-slate-500 text-sm mt-2">Adjust status for <b>{confirmModal.request.item}</b></p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Choose Status Action</label>
                            <select
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={confirmModal.status}
                                onChange={(e) => setConfirmModal({...confirmModal, status: e.target.value})}
                            >
                                <option value="APPROVE">Approve</option>
                                <option value="ASSIGNE">Finalize Assignment</option>
                                <option value="REJECTE">Reject</option>
                                <option value="DRAFT">Reset to Pending (Draft)</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mt-10">
                            <button
                                onClick={() => handleProcess(confirmModal.request.id, confirmModal.status)}
                                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all"
                            >
                                Confirm Change
                            </button>
                            <button
                                onClick={() => setConfirmModal({ show: false, request: null, status: 'APPROVE' })}
                                className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black uppercase text-xs hover:bg-slate-200 transition-all"
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