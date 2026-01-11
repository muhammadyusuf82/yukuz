import React, { useState, useEffect } from 'react';
import {
    FaUserCheck, FaSearch, FaCheck, FaTimes, FaEye,
    FaBox, FaWeightHanging, FaRulerCombined, FaMapMarkerAlt,
    FaMoneyBillWave, FaClock, FaExclamationTriangle, FaSpinner, FaInfoCircle
} from 'react-icons/fa';

const VerificationPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFreight, setSelectedFreight] = useState(null);

    // 1. Token olish funksiyasi (Siz bergan kod)
    const getAuthToken = async () => {
        try {
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: "admin",
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
            console.error('Token olishda tarmoq xatosi:', error);
        }
        return localStorage.getItem('access_token'); // Agar xato bo'lsa eskisi
    };

    // 2. API dan ma'lumotlarni olish (Token bilan)
    const fetchVerifications = async () => {
        try {
            setLoading(true);
            const token = await getAuthToken(); // So'rovdan oldin tokenni olamiz

            const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight/?moderation_succeeded=False', {
                headers: {
                    'Authorization': `Token ${token}`, // Tokenni headerga qo'shamiz
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Xato: ${response.status}`);
            const data = await response.json();
            setVerifications(data);
        } catch (err) {
            setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Token muddati o'tgan bo'lishi mumkin.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifications();
    }, []);

    // 3. Tasdiqlash funksiyasi (Token bilan)
    const handleAccept = async (freight) => {
        if (!window.confirm("Ushbu yukni tasdiqlaysizmi?")) return;

        try {
            const token = await getAuthToken();
            const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${freight.id}/accept/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...freight, moderation_succeeded: true })
            });

            if (response.ok) {
                alert("Yuk muvaffaqiyatli tasdiqlandi!");
                setVerifications(prev => prev.filter(item => item.id !== freight.id));
                setSelectedFreight(null);
            } else {
                alert("Tasdiqlashda xatolik yuz berdi.");
            }
        } catch (err) {
            alert("Server bilan aloqa uzildi.");
        }
    };

    // 4. Bekor qilish funksiyasi (Token bilan)
    const handleReject = async (freight) => {
        if (!window.confirm("Ushbu yukni rad etasizmi?")) return;

        try {
            const token = await getAuthToken();
            const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${freight.id}/reject/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...freight, moderation_succeeded: false })
            });

            if (response.ok) {
                alert("Yuk rad etildi.");
                setVerifications(prev => prev.filter(item => item.id !== freight.id));
                setSelectedFreight(null);
            } else {
                alert("Rad etishda xatolik yuz berdi.");
            }
        } catch (err) {
            alert("Server bilan aloqa uzildi.");
        }
    };

    const filteredVerifications = verifications.filter(item =>
        item.freight_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner_first_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FaBox className="text-blue-600" /> Yuklar Moderatsiyasi
                </h1>
                <p className="text-gray-500">Tasdiqlanishi kutilayotgan yuk e'lonlari ro'yxati</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-50">
                    <FaSearch className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Yuk turi yoki egasi bo'yicha qidirish..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={fetchVerifications}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Yangilash
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-500" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-500">Xavfsiz ulanish o'rnatilmoqda...</p>
                    </div>
                ) : filteredVerifications.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <FaBox className="text-xl" />
                                </div>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded uppercase">
                                    Kutilmoqda
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.freight_type}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                                <FaClock /> {new Date(item.created_at).toLocaleDateString()}
                            </p>

                            <div className="space-y-2 mb-6 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Egasi:</span>
                                    <span className="font-semibold text-gray-800">{item.owner_first_name} {item.owner_last_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Og'irlik:</span>
                                    <span className="font-semibold">{item.weight} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Narxi:</span>
                                    <span className="font-semibold text-green-600">{Number(item.freight_rate_amount).toLocaleString()} {item.freight_rate_currency}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAccept(item)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                    <FaCheck /> Tasdiqlash
                                </button>
                                <button
                                    onClick={() => handleReject(item)}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                >
                                    <FaTimes /> Rad etish
                                </button>
                                <button
                                    onClick={() => setSelectedFreight(item)}
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <FaEye />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedFreight && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FaInfoCircle className="text-blue-600" /> Yuk tafsilotlari
                            </h2>
                            <button onClick={() => setSelectedFreight(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <FaTimes className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <DetailItem icon={<FaBox />} label="Yuk turi" value={selectedFreight.freight_type} />
                                <DetailItem icon={<FaWeightHanging />} label="Og'irlik" value={`${selectedFreight.weight} kg`} />
                                <DetailItem icon={<FaRulerCombined />} label="Hajmi" value={`${selectedFreight.volume} m³`} />
                                <DetailItem icon={<FaMoneyBillWave />} label="Valyuta" value={selectedFreight.freight_rate_currency} />
                            </div>
                            <div className="space-y-4">
                                <DetailItem icon={<FaMapMarkerAlt className="text-red-500" />} label="Qayerdan" value={`${selectedFreight.route_starts_where_lat}, ${selectedFreight.route_starts_where_lon}`} />
                                <DetailItem icon={<FaMapMarkerAlt className="text-green-500" />} label="Qayerga" value={`${selectedFreight.route_ends_where_lat}, ${selectedFreight.route_ends_where_lon}`} />
                                <DetailItem icon={<FaMoneyBillWave className="text-green-600" />} label="To'lov" value={selectedFreight.payment_method} />
                                <DetailItem icon={<FaClock />} label="Boshlanish vaqti" value={new Date(selectedFreight.route_start_time_from).toLocaleString()} />
                            </div>
                            <div className="col-span-full bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold mb-2">Izoh (UZ):</h4>
                                <p className="text-gray-600 italic">{selectedFreight.description_uz || "Izoh mavjud emas"}</p>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex gap-4">
                            <button onClick={() => handleAccept(selectedFreight)} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">Tasdiqlash</button>
                            <button onClick={() => handleReject(selectedFreight)} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">Rad etish</button>
                        </div>
                    </div>
                </div>
            )}

            {!loading && filteredVerifications.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                    <FaBox className="text-6xl text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">Moderatsiyaga yuklar yo'q</h3>
                    <p className="text-gray-400">Hozircha barcha yuklar ko'rib chiqilgan.</p>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">{icon}</div>
        <div>
            <p className="text-xs text-gray-400 uppercase font-bold">{label}</p>
            <p className="font-semibold text-gray-800 capitalize">{value || 'Noma\'lum'}</p>
        </div>
    </div>
);

export default VerificationPage;
