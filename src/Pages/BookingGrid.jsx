import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Armchair, CheckCircle2, AlertCircle, BookmarkCheck, Loader2, Info } from 'lucide-react';






const BookingGrid = () => {
    // Standard ISO string (YYYY-MM-DD) for backend compatibility


    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);



    const [seats, setSeats] = useState([]);


    const [selectedSeat, setSelectedSeat] = useState(null);


    const [myBooking, setMyBooking] = useState(null);


    const [loading, setLoading] = useState(false);


    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchPageData = async () => {
        try {
            setLoading(true);
            setMessage({ type: '', text: '' });

            // 1. Fetch overall seat status (Red/Green grid)
            const statusRes = await axios.get(`http://localhost:8080/api/bookings/status?date=${selectedDate}`, {
                withCredentials: true
            });
            setSeats(statusRes.data || []);


            // 2. Fetch specific user booking for this date
            try {
                const mySeatRes = await axios.get(`http://localhost:8080/api/bookings/my-seat?date=${selectedDate}`, {
                    withCredentials: true
                });
                setMyBooking(mySeatRes.data || null);
            } catch (error) {
                const errorData = error.response?.data;


                // Handle  GlobalExceptionHandler "No booking found" message
                if (typeof errorData === 'string' && errorData.includes("No booking found")) {
                    setMyBooking(null);


                    // We set no message here to keep the UI clean, or use 'info' type
                } else {
                    throw error;
                }
            }



        } catch (error) {
            console.error("Fetch Error:", error);
            setMessage({
                type: 'error',
                text: 'Unexpected error: ' + (error.response?.data || error.message)
            });
        } finally {
            setLoading(false);
        }
    };


    // Initial data fetch and whenever selectedDate changes
    useEffect(() => {
        // Reset local states immediately when date changes to prevent "flickering"
        setMyBooking(null);
        setSelectedSeat(null);
        setMessage({ type: '', text: '' });
        fetchPageData();
    }, [selectedDate]);



    const handleBooking = async () => {
        if (!selectedSeat) return;

        try {
            await axios.post('http://localhost:8080/api/bookings/book', {
                seatNo: selectedSeat,
                date: selectedDate
            }, { withCredentials: true });

            setMessage({ type: 'success', text: `Success! Seat ${selectedSeat} is now reserved.` });
            fetchPageData();
        } catch (error) {
            const errorMsg = error.response?.data || 'Booking failed.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-700">



            {/* Header / Date Selection */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reserve Seat</h2>
                    <p className="text-slate-500 font-medium">
                        Availability for <span className="text-emerald-600 font-bold">
                            {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </p>
                </div>
                <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 transition-transform group-hover:rotate-12" size={20} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-black text-slate-700 shadow-inner cursor-pointer"
                    />
                </div>
            </div>



            {/* User's Current Booking Card */}
            {myBooking && (
                <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl shadow-emerald-200/50 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-xl border border-white/20">
                            <BookmarkCheck size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-100 mb-1">Your Reservation</p>
                            <h3 className="text-2xl font-bold">
                                Seat #{myBooking.seatNo} confirmed on {new Date(myBooking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </h3>
                        </div>
                    </div>
                </div>
            )}



            {/* Seat Map Legend */}
            <div className="flex gap-10 justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2.5"><div className="w-4 h-4 bg-emerald-100 border border-emerald-200 rounded-lg"></div> Available</div>
                <div className="flex items-center gap-2.5"><div className="w-4 h-4 bg-rose-100 border border-rose-200 rounded-lg"></div> Occupied</div>
                <div className="flex items-center gap-2.5"><div className="w-4 h-4 bg-emerald-600 rounded-lg shadow-sm"></div> Your Seat</div>
            </div>



            {/* The Grid */}
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 min-h-[500px] flex flex-col items-center justify-center relative">
                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-emerald-500" size={48} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Map...</p>
                    </div>
                ) : (

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-6">
                        {seats.map((seat) => {
                            const isMine = myBooking?.seatNo === seat.seatNo;

                            return (

                                <button
                                    key={seat.seatNo}
                                    disabled={seat.booked || myBooking}
                                    onClick={() => setSelectedSeat(seat.seatNo)}
                                    className={`
                                        w-16 h-16 rounded-[1.25rem] flex flex-col items-center justify-center transition-all relative group
                                        ${isMine ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110 z-10' :
                                        seat.booked ? 'bg-rose-50 text-rose-200 cursor-not-allowed border border-rose-100/50' :
                                            selectedSeat === seat.seatNo ? 'bg-slate-900 text-white shadow-2xl -translate-y-2' :
                                                'bg-white text-emerald-600 border-2 border-slate-50 hover:border-emerald-200 hover:bg-emerald-50/50'}
                                    `}
                                >
                                    <Armchair size={24} className={isMine ? "animate-pulse" : ""} />
                                    <span className="text-[10px] font-black mt-1.5">{seat.seatNo}</span>
                                    {isMine && <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-600 font-black text-[10px]">✓</div>}
                                </button>


                            );
                        })}
                    </div>
                )}
            </div>



            {/* Selection Bar */}
            {selectedSeat && !myBooking && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 animate-in slide-in-from-bottom-10">
                    <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl border border-white/10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                <Armchair className="text-slate-900" size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Ready to Book</p>
                                <h4 className="text-xl font-bold">Seat #{selectedSeat}</h4>
                            </div>
                        </div>
                        <button
                            onClick={handleBooking}
                            className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black transition-all hover:bg-emerald-400 active:scale-95"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            )}



            {/* Unified Feedback Toast */}
            {message.text && (
                <div className={`p-6 rounded-3xl flex items-center gap-4 font-black text-sm shadow-2xl animate-in zoom-in-95 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        message.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={24} /> :
                        message.type === 'info' ? <Info size={24} /> :
                            <AlertCircle size={24} />}
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default BookingGrid;