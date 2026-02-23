import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar,
    Armchair,
    Filter,
    Loader2,
    Settings2,
    Save,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Inbox
} from 'lucide-react';




const BookingDetail = () => {

    // --- State for Pagination & Data ---
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    const pageSize = 8;




    // --- Filter & Capacity States ---
    const [filterDate, setFilterDate] = useState("");
    const [capacityDate, setCapacityDate] = useState(new Date().toISOString().split('T')[0]);
    const [totalSeats, setTotalSeats] = useState(20);
    const [isUpdatingCapacity, setIsUpdatingCapacity] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");




    useEffect(() => {
        fetchBookings(currentPage);
    }, [currentPage]);




    const fetchBookings = async (page) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/bookings/all', {
                params: {
                    page: page,
                    size: pageSize
                },
                withCredentials: true
            });

            setBookings(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };



    const handleUpdateCapacity = async () => {
        setIsUpdatingCapacity(true);
        try {
            await axios.put(`http://localhost:8080/api/seats?date=${capacityDate}&totalSeats=${totalSeats}`, {}, {
                withCredentials: true
            });
            setSuccessMsg(`Capacity set to ${totalSeats} for ${capacityDate}`);
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.error("Error updating capacity:", error);
        } finally {
            setIsUpdatingCapacity(false);
        }
    };



    // Client-side filtering (date only now)
    const filteredBookings = bookings.filter(booking => {
        if (!booking) return false;
        const matchesDate = filterDate ? booking?.date === filterDate : true;
        return matchesDate;
    });



    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4">


            {/* SECTION 1: SEAT CAPACITY MANAGEMENT */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                        <Settings2 size={20} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Configure Floor Capacity</h2>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Effective Date</label>
                        <input
                            type="date"
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={capacityDate}
                            onChange={(e) => setCapacityDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Total Seats Available</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={totalSeats}
                            onChange={(e) => setTotalSeats(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleUpdateCapacity}
                        disabled={isUpdatingCapacity}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                        {isUpdatingCapacity ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                        Apply Capacity
                    </button>

                    {successMsg && (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-in fade-in slide-in-from-left-4">
                            <CheckCircle2 size={16}/> {successMsg}
                        </div>
                    )}
                </div>
            </div>



            {/* SECTION 2: PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Intelligence</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Showing {bookings.length} of {totalElements} total records.</p>
                </div>
            </div>



            {/* SECTION 3: FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="date"
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-center gap-3 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] px-6 text-emerald-700 font-black text-xs uppercase tracking-widest">
                    <Filter size={16} />
                    {totalElements} Total Bookings
                </div>
            </div>



            {/* SECTION 4: TABLE + PAGINATION */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="px-10 py-6">Employee</th>
                            <th className="px-10 py-6">Department</th>
                            <th className="px-10 py-6">Seat Context</th>
                            <th className="px-10 py-6">Timeline</th>
                            <th className="px-10 py-6">Verification</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-24 text-center">
                                    <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={40} />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing with server...</p>
                                </td>
                            </tr>
                        ) : bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="p-6 bg-slate-50 rounded-full text-slate-200">
                                            <Inbox size={64} strokeWidth={1} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800">No Reservations Found</h3>
                                            <p className="text-slate-400 text-sm font-medium">The database is currently empty or no matches found.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking, idx) => (
                                <tr key={booking?.id ?? idx} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">{booking?.user?.name}</td>
                                    <td className="px-10 py-6">{booking?.user?.dept}</td>
                                    <td className="px-10 py-6">Station #{booking?.seatNo}</td>
                                    <td className="px-10 py-6">{booking?.date}</td>
                                    <td className="px-10 py-6">
                                        <span className="text-emerald-600 font-bold text-xs">Confirmed</span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>



                {!loading && totalPages > 0 && (
                    <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Showing page <span className="text-slate-900">{currentPage + 1}</span> of <span className="text-slate-900">{totalPages}</span>
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95"
                            >
                                <ChevronLeft size={14} /> Prev
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage >= totalPages - 1}
                                className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetail;
