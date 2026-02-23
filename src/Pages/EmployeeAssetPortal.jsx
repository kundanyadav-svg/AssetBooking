import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
    Package, AlertTriangle, CheckCircle2,
    Activity, Boxes, Loader2, Clock,
    HelpCircle, AlertCircle
} from 'lucide-react';
import { useSelector } from "react-redux";

const EmployeeAssetPortal = () => {
    const { userData } = useSelector(state => state.user);
    const userId = userData?.id;

    const [assets, setAssets] = useState([]);
    const [myAssignments, setMyAssignments] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [actionLoading, setActionLoading] = useState(null);



    const loadData = useCallback(async () => {
        if (!userId) return;



        try {
            setLoading(true);

            //  Fetch Global Inventory
            const assetRes = await axios.get('http://localhost:8080/api/assets/all', { withCredentials: true });
            setAssets(assetRes.data || []);


            //  Fetch User's currently assigned assets (from AseetAssignmentContoller)
            const assignmentRes = await axios.get('http://localhost:8080/api/my-assignments', { withCredentials: true });
            setMyAssignments(assignmentRes.data || []);


            // Fetch User's request history (from RequestController)
            const requestRes = await axios.get(`http://localhost:8080/api/requests/user/${userId}`, { withCredentials: true });
            setMyRequests(requestRes.data || []);

        } catch (err) {
            console.error(err);
            showMsg('error', 'Failed to sync with the asset server');
        } finally {
            setLoading(false);
        }



    }, [userId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };


    const availableInventory = useMemo(() => {
        return assets.filter(a => a.status !== 'UNAVAILABLE');
    }, [assets]);


    const handleRequestAsset = async (assetId) => {
        setActionLoading(assetId);
        try {
            // Matches @PostMapping("/create") in RequestController
            await axios.post(`http://localhost:8080/api/requests/create?userId=${userId}&assetId=${assetId}`, {}, { withCredentials: true });
            showMsg('success', 'Asset request submitted');
            loadData();
        } catch (err) {
            showMsg('error', err.response?.data || 'Request failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReportBroken = async (assetId) => {
        if (!window.confirm("Marking as broken triggers an automatic replacement. Proceed?")) return;
        setActionLoading(assetId);
        try {
            // Matches @PostMapping("/system/{assetId}/{userId}") in RequestController
            await axios.post(`http://localhost:8080/api/requests/system/${assetId}/${userId}`, {}, { withCredentials: true });
            showMsg('success', 'Reported successfully.');
            loadData();
        } catch (err) {
            showMsg('error', 'Failed to process report');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && !userId) return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Initializing Portal...</p>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Employee Portal</h1>
                {message.text && (
                    <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xl animate-in slide-in-from-top-5 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}
            </div>


            {/* My Current Gear Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                    <Activity className="text-rose-500" size={20} /> My Current Gear
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAssignments.length > 0 ? myAssignments.map(assign => (
                        <div key={assign.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 flex justify-between items-center shadow-lg">
                            <div className="space-y-1">
                                <h4 className="font-black text-slate-800 text-lg">{assign.asset.name}</h4>
                                <p className="text-xs font-mono text-slate-400">SN: {assign.asset.serial}</p>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${assign.status === 'BROKEN' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {assign.status}
                                </span>
                            </div>
                            {assign.status !== 'BROKEN' && (
                                <button
                                    onClick={() => handleReportBroken(assign.asset.id)}
                                    disabled={actionLoading === assign.id}
                                    className="px-5 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
                                >
                                    {actionLoading === assign.id ? <Loader2 className="animate-spin" size={14}/> : <AlertTriangle size={14} />}
                                    Broken
                                </button>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold text-sm uppercase tracking-widest">
                            No assets currently assigned to you.
                        </div>
                    )}
                </div>
            </section>



            {/* Inventory List Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                    <Boxes className="text-emerald-500" size={20} /> Available Inventory
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {availableInventory.length > 0 ? availableInventory.map(asset => {
                        const isOutOfStock = asset.quantity <= 0;
                        return (
                            <div key={asset.id} className={`bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm transition-all flex flex-col items-center text-center ${isOutOfStock ? 'opacity-60' : 'hover:shadow-xl'}`}>
                                <Package className="text-slate-300 mb-4" size={32} />
                                <h5 className="font-bold text-slate-800 text-sm mb-1">{asset.name}</h5>
                                <p className={`text-[10px] font-black uppercase mb-4 ${isOutOfStock ? 'text-rose-500' : 'text-emerald-600'}`}>
                                    {isOutOfStock ? 'Request Pending / Out of Stock' : `${asset.quantity} Available`}
                                </p>
                                <button
                                    onClick={() => handleRequestAsset(asset.id)}
                                    disabled={actionLoading === asset.id || isOutOfStock}
                                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-[10px] uppercase hover:bg-emerald-600 transition-all disabled:bg-slate-200"
                                >
                                    {isOutOfStock ? "Unavailable" : "Request Asset"}
                                </button>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-10 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                            No inventory records found in database.
                        </div>
                    )}
                </div>
            </section>



            {/* Request History Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                    <Clock className="text-blue-500" size={20} /> My Request History
                </h2>
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                        <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <th className="px-10 py-5">Asset</th>
                            <th className="px-10 py-5">Type</th>
                            <th className="px-10 py-5 text-right">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {myRequests.length > 0 ? (

                            myRequests.map(req => (


                                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-6 font-bold text-slate-800">{req.item}</td>
                                    <td className="px-10 py-6">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${
                                                req.requestType === 'SYSTEM_GENERATED' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                {req.requestType?.replace('_', ' ')}
                                            </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                req.requestStatus === 'ASSIGNE' ? 'bg-emerald-100 text-emerald-700' :
                                                    req.requestStatus === 'REJECTE' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {req.requestStatus}
                                            </span>
                                    </td>
                                </tr>


                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-10 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <HelpCircle className="text-slate-200" size={40} />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No request history found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        </tbody>
                    </table>

                </div>
            </section>
        </div>
    );
};

export default EmployeeAssetPortal;