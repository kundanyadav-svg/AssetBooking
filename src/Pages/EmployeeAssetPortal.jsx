import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
    Package, AlertTriangle, CheckCircle2,
    Activity, Boxes, Loader2, Clock,
    HelpCircle, AlertCircle, Hash
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

    // Local states for quantity inputs
    const [requestQuantities, setRequestQuantities] = useState({});
    const [brokenQuantities, setBrokenQuantities] = useState({});

    const loadData = useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const assetRes = await axios.get('http://localhost:8080/api/assets/all', { withCredentials: true });
            setAssets(assetRes.data || []);

            const assignmentRes = await axios.get('http://localhost:8080/api/my-assignments', { withCredentials: true });
            setMyAssignments(assignmentRes.data || []);

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

    const handleRequestAsset = async (assetId, stock) => {
        const qty = requestQuantities[assetId] || 1;
        if (qty > stock) {
            showMsg('error', `Only ${stock} items available in stock.`);
            return;
        }

        setActionLoading(`req-${assetId}`);
        try {
            // Updated API to include quantity parameter
            await axios.post(`http://localhost:8080/api/requests/create?userId=${userId}&assetId=${assetId}&quantity=${qty}`, {}, { withCredentials: true });
            showMsg('success', `Request for ${qty} asset(s) submitted`);
            setRequestQuantities(prev => ({ ...prev, [assetId]: 1 }));
            loadData();
        } catch (err) {
            showMsg('error', err.response?.data || 'Request failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReportBroken = async (assignmentId, maxQty) => {
        const qty = brokenQuantities[assignmentId] || 1;
        if (qty > maxQty) {
            showMsg('error', `You only have ${maxQty} of this asset.`);
            return;
        }

        if (!window.confirm(`Marking ${qty} item(s) as broken triggers automatic replacement. Proceed?`)) return;

        setActionLoading(`broken-${assignmentId}`);
        try {
            // Updated API: /api/requests/system/{assignmentId}/{userId}/{brokenCount}
            await axios.post(`http://localhost:8080/api/requests/system/${assignmentId}/${userId}/${qty}`, {}, { withCredentials: true });
            showMsg('success', `Reported ${qty} item(s) successfully.`);
            setBrokenQuantities(prev => ({ ...prev, [assignmentId]: 1 }));
            loadData();
        } catch (err) {
            showMsg('error', err.response?.data || 'Failed to process report');
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
            {/* Header omitted for brevity - same as original */}

            {/* My Current Gear Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                    <Activity className="text-rose-500" size={20} /> My Current Gear
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAssignments.length > 0 ? myAssignments.map(assign => (
                        <div key={assign.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col gap-4 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="font-black text-slate-800 text-lg">{assign.asset.name}</h4>
                                    <p className="text-xs font-mono text-slate-400">SN: {assign.asset.serial}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded flex items-center gap-1">
                                            <Hash size={10}/> Qty: {assign.quantity}
                                        </span>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${assign.status === 'BROKEN' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {assign.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {assign.status !== 'BROKEN' && (
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="number" min="1" max={assign.quantity}
                                        className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                                        value={brokenQuantities[assign.id] || 1}
                                        onChange={(e) => setBrokenQuantities({...brokenQuantities, [assign.id]: parseInt(e.target.value)})}
                                    />
                                    <button
                                        onClick={() => handleReportBroken(assign.id, assign.quantity)}
                                        disabled={actionLoading === `broken-${assign.id}`}
                                        className="flex-1 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        {actionLoading === `broken-${assign.id}` ? <Loader2 className="animate-spin" size={14}/> : <AlertTriangle size={14} />}
                                        Report Broken
                                    </button>
                                </div>
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
                                    {isOutOfStock ? 'Out of Stock' : `${asset.quantity} In Stock`}
                                </p>

                                <div className="flex flex-col gap-2 w-full">
                                    {!isOutOfStock && (
                                        <div className="flex items-center gap-2 px-2 bg-slate-50 border border-slate-100 rounded-lg">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Qty</span>
                                            <input
                                                type="number" min="1" max={asset.quantity}
                                                className="w-full py-1.5 bg-transparent text-xs font-bold outline-none"
                                                value={requestQuantities[asset.id] || 1}
                                                onChange={(e) => setRequestQuantities({...requestQuantities, [asset.id]: parseInt(e.target.value)})}
                                            />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleRequestAsset(asset.id, asset.quantity)}
                                        disabled={actionLoading === `req-${asset.id}` || isOutOfStock}
                                        className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-[10px] uppercase hover:bg-emerald-600 transition-all disabled:bg-slate-200"
                                    >
                                        {isOutOfStock ? "Unavailable" : "Request Asset"}
                                    </button>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-10 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                            No inventory records found.
                        </div>
                    )}
                </div>
            </section>

            {/* Request History Section - Added Quantity Column */}
            <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                    <Clock className="text-blue-500" size={20} /> My Request History
                </h2>
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                        <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <th className="px-10 py-5">Asset</th>
                            <th className="px-10 py-5">Qty</th>
                            <th className="px-10 py-5">Type</th>
                            <th className="px-10 py-5 text-right">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {myRequests.length > 0 ? myRequests.map(req => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-6 font-bold text-slate-800">{req.item}</td>
                                <td className="px-10 py-6 font-mono text-xs">{req.quantity || 1}</td>
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
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-10 py-20 text-center">
                                    <HelpCircle className="text-slate-200 mx-auto mb-2" size={40} />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No request history found.</p>
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