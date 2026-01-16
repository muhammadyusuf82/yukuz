import React, { useState, useEffect } from 'react';
import {
    FaTruck, FaPhone, FaStar, FaInbox, FaStarHalfAlt,
    FaCheckCircle, FaMapMarkerAlt, FaComment, FaTruckLoading,
    FaMapMarkedAlt, FaArrowUp
} from "react-icons/fa";

// Reyting komponenti (Haydovchilar.jsx dan olindi)
function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            <FaStar className="text-yellow-400 w-3 h-3" />
            <FaStar className="text-yellow-400 w-3 h-3" />
            <FaStar className="text-yellow-400 w-3 h-3" />
            <FaStar className="text-yellow-400 w-3 h-3" />
            <FaStarHalfAlt className="text-yellow-400 w-3 h-3" />
            <span className="font-semibold text-gray-900 ml-1">{rating || '4.5'}</span>
            <span className="text-xs text-gray-500">(124)</span>
        </div>
    );
}

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthToken = async () => {
        try {
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: "123",
                    phone_number: "+998993967336"
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token || data.access_token || data.access;
                if (token) {
                    localStorage.setItem('access_token', token);
                    return token;
                }
            }
        } catch (error) {
            console.error('Token olishda xato:', error);
        }
        return null;
    };

    useEffect(() => {
        const fetchDrivers = async () => {
            setLoading(true);
            try {
                // Haydovchilar (transport) API dan ma'lumot olish
                const baseUrl = 'https://tokennoty.pythonanywhere.com/api/transport/';
                const response = await fetch(baseUrl);

                if (response.ok) {
                    const transports = await response.json();

                    // Har bir transport uchun yulduzchalarni olish (Haydovchilar.jsx dagi mantiq)
                    const result = await Promise.all(
                        transports.map(async (item) => {
                            try {
                                const starsRes = await fetch(`${baseUrl}${item.id}/stars/`);
                                const stars = starsRes.ok ? await starsRes.json() : null;
                                return { ...item, stars };
                            } catch (e) {
                                return item;
                            }
                        })
                    );
                    setDrivers(result);
                }
            } catch (error) {
                console.error("Haydovchilarni yuklashda xato:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-4xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Haydovchilar jamoasi yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="bg-transparent space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-800">Haydovchilar jamoasi</h2>
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold">
                        Jami: {drivers.length} ta haydovchi
                    </span>
                </div>

                {drivers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl border-2 border-dashed border-slate-200">
                        <div className="bg-slate-50 p-6 rounded-3xl mb-4">
                            <FaInbox className="text-5xl text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">Hozircha haydovchilar yo'q</h3>
                        <p className="text-slate-400 text-center px-6">Tizimda ro'yxatdan o'tgan haydovchilar topilmadi.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {drivers.map(driver => (
                            <div key={driver.id} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden relative transition-all hover:-translate-y-2 duration-300 hover:shadow-xl group">
                                {/* Featured Badge */}
                                <div className="absolute top-4 right-4 bg-linear-to-r from-blue-600 to-purple-700 text-white text-[10px] font-bold py-1 px-3 rounded-full z-10 uppercase tracking-wider">
                                    Top Haydovchi
                                </div>

                                {/* Haydovchi Profili */}
                                <div className="p-6 border-b border-gray-50 flex items-start gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
                                            {(driver.owner_first_name?.[0] || 'D')}{(driver.owner_last_name?.[0] || '')}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                {driver.owner_first_name} {driver.owner_last_name}
                                            </h3>
                                            <FaCheckCircle className="text-green-500 w-3.5 h-3.5" title="Tasdiqlangan" />
                                        </div>
                                        <StarRating rating={driver.stars?.rating} />
                                        <div className="text-[10px] text-gray-400 font-mono mt-1">ID: #{driver.id}</div>
                                    </div>
                                </div>

                                {/* Transport Tafsilotlari */}
                                <div className="p-5 border-b border-gray-50">
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Telefon</div>
                                            <div className="font-bold text-gray-800 text-sm font-mono">+998992221133</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Transport</div>
                                            <div className="font-bold text-gray-800 text-sm capitalize">{driver.vehicle_category || 'Yuk mashinasi'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Sig'imi</div>
                                            <div className="font-bold text-gray-800 text-sm">{driver.available_tonnage || '0'} tonna</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Holat</div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <span className="font-bold text-gray-800 text-sm">Bo'sh</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Joylashuv xaritasi (Haydovchilar.jsx stili) */}
                                    <div className="h-32 bg-linear-to-br from-cyan-50 to-blue-100 rounded-2xl mt-4 relative border border-blue-50/50 overflow-hidden">
                                        <div className="absolute w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-md animate-pulse" style={{ top: '40%', left: '45%' }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                                            <FaMapMarkedAlt className="text-4xl text-blue-900" />
                                        </div>
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-800 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                            Toshkent, Yunusobod
                                        </div>
                                    </div>
                                </div>

                                {/* Statistika qismi */}
                                <div className="px-5 py-3 grid grid-cols-3 gap-2 text-center bg-slate-50/50 border-b border-gray-50">
                                    <div>
                                        <div className="text-sm font-black text-blue-600">89</div>
                                        <div className="text-[9px] text-gray-400 uppercase font-bold">Yakunlangan</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-blue-600">1</div>
                                        <div className="text-[9px] text-gray-400 uppercase font-bold">Faol</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-blue-600">12.5M</div>
                                        <div className="text-[9px] text-gray-400 uppercase font-bold">Daromad</div>
                                    </div>
                                </div>

                                {/* Harakatlar tugmalari */}
                                <div className="p-4 flex gap-2">
                                    <a href={`tel:${driver.phone_number || '+998992221133'}`} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-[11px] hover:text-white hover:border-green-500 hover:bg-green-500 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
                                        <FaPhone className="w-3 h-3" />Qo'ng'iroq
                                    </a>
                                    <button className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-[11px] hover:text-white hover:border-blue-500 hover:bg-blue-500 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
                                        <FaComment className="w-3 h-3" />Xabar
                                    </button>
                                    <button className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-[11px] hover:text-white hover:border-purple-600 hover:bg-purple-600 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
                                        <FaTruckLoading className="w-3.5 h-3.5" />Yuk
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drivers;
