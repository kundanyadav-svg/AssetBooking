import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, Trash2, ChevronUp, ChevronDown,
    RefreshCw, AlertCircle, CheckCircle2,
    Boxes, HardDrive, Edit3, Loader2
} from 'lucide-react';

const AssetManagement = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [updatingId, setUpdatingId] = useState(null);

    const [newAsset, setNewAsset] = useState({
        serial: '', name: '', status: 'AVAILABLE', quantity: 1
    });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/assets/all', { withCredentials: true });
            setAssets(res.data);
        } catch (err) {
            showMsg('error', 'Failed to load assets');
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    //   Matches your @PostMapping("/update-status/{id}")
    const handleStatusChange = async (id, newStatus) => {
        if (updatingId) return;
        setUpdatingId(id);

        try {
            // Uses POST and @RequestParam String status as per your backend snippet
            await axios.post(
                `http://localhost:8080/api/assets/update-status/${id}?status=${newStatus}`,
                {},
                { withCredentials: true }
            );



            // Update local state for immediate UI feedback
            setAssets(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
            showMsg('success', `Status changed to ${newStatus}`);
        } catch (err) {
            showMsg('error', 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleAddAsset = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/assets/add', newAsset, { withCredentials: true });
            showMsg('success', 'Asset added successfully');


            setNewAsset({ serial: '', name: '', status: 'AVAILABLE', quantity: 1 });
            fetchAssets();
        } catch (err) {
            showMsg('error', 'Serial number must be unique');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent delete? This cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:8080/api/assets/delete/${id}`, { withCredentials: true });
            showMsg('success', 'Asset removed');
            fetchAssets();
        } catch (err) {
            showMsg('error', 'Delete failed');
        }
    };

    const adjustQuantity = async (id, type, currentQty) => {
        if (updatingId) return;
        if (type === 'decrease' && currentQty <= 0) return;
        const endpoint = type === 'increase' ? 'increase' : 'decrease';

        try {
            setUpdatingId(id);
            await axios.put(`http://localhost:8080/api/assets/${endpoint}/${id}?count=1`, {}, { withCredentials: true });
            fetchAssets();
        } catch (err) {
            showMsg('error', 'Update failed');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 animate-in fade-in duration-700">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200">
                            <Boxes className="text-white" size={32} />
                        </div>
                        Inventory Manager
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {message.text && (
                        <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-lg animate-in slide-in-from-right-4 ${
                            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}
                </div>
            </div>

            {/* QUICK ADD PANEL */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl">
                <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input required className="px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500"
                           value={newAsset.serial} onChange={e => setNewAsset({...newAsset, serial: e.target.value})} placeholder="Serial ID" />

                    <input required className="px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500"
                           value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} placeholder="Asset Name" />

                    <select className="px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none"
                            value={newAsset.status} onChange={e => setNewAsset({...newAsset, status: e.target.value})}>
                        <option className="text-slate-900" value="AVAILABLE">Available</option>
                        <option className="text-slate-900" value="UNAVAILABLE">Unavailable</option>
                        <option className="text-slate-900" value="BROKEN">Broken</option>
                    </select>

                    <input type="number" min="1" className="px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none"
                           value={newAsset.quantity} onChange={e => setNewAsset({...newAsset, quantity: parseInt(e.target.value)})} />

                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black transition-all active:scale-95">
                        Add Asset
                    </button>
                </form>
            </div>

            {/* ASSET TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                        <th className="px-10 py-6">Hardware Item</th>
                        <th className="px-10 py-6">Status Control</th>
                        <th className="px-10 py-6 text-center">In Stock</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {assets.map(asset => (
                        <tr key={asset.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl transition-all">
                                        <HardDrive size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg">{asset.name}</p>
                                        <p className="text-xs font-mono text-slate-400">{asset.serial}</p>
                                    </div>
                                </div>
                            </td>

                            {/* PRETTY STATUS SELECTOR */}
                            <td className="px-10 py-8">
                                <div className="relative inline-block w-40">
                                    <select
                                        disabled={updatingId === asset.id}
                                        value={asset.status}
                                        onChange={(e) => handleStatusChange(asset.id, e.target.value)}
                                        className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase ring-1 ring-inset outline-none transition-all cursor-pointer ${
                                            asset.status === 'AVAILABLE'
                                                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200 hover:ring-emerald-400'
                                                : asset.status === 'BROKEN' ? 'bg-rose-50 text-rose-600 ring-rose-200 hover:ring-rose-400'
                                                    : 'bg-slate-100 text-slate-500 ring-slate-200 hover:ring-slate-400'
                                        }`}
                                    >
                                        <option value="AVAILABLE">Available</option>
                                        <option value="UNAVAILABLE">Unavailable</option>
                                        <option value="BROKEN">Broken</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                        <Edit3 size={12} />
                                    </div>
                                </div>
                            </td>

                            <td className="px-10 py-8">
                                <div className="flex items-center justify-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-fit mx-auto">
                                    <button disabled={updatingId === asset.id} onClick={() => adjustQuantity(asset.id, 'decrease', asset.quantity)} className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"><ChevronDown size={20}/></button>
                                    <span className="font-black text-slate-700 text-lg min-w-[1.5ch] text-center">{asset.quantity}</span>
                                    <button disabled={updatingId === asset.id} onClick={() => adjustQuantity(asset.id, 'increase', asset.quantity)} className="p-1.5 text-slate-400 hover:text-emerald-500 disabled:opacity-30"><ChevronUp size={20}/></button>
                                </div>
                            </td>

                            <td className="px-10 py-8 text-right">
                                <button onClick={() => handleDelete(asset.id)} className="p-3 text-slate-300 hover:text-rose-600 active:scale-90 transition-all"><Trash2 size={22}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetManagement;