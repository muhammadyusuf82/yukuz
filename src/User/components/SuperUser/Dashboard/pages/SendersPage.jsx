// components/pages/SendersPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaUserTie, FaSearch, FaBox, FaPhone, FaEnvelope,
    FaMapMarkerAlt, FaBuilding, FaCheckCircle, FaTimesCircle,
    FaEdit, FaTrash, FaPlus, FaStar, FaSync, FaExclamationTriangle
} from 'react-icons/fa';

const SendersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [senders, setSenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        totalLoads: 0,
        companies: 0,
        averageRating: 0
    });

    // API uchun token olish funksiyasi
    const fetchToken = async () => {
        try {
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: "admin",
                    password: "123",
                    phone_number: "+998993967336"
                })
            });

            if (!response.ok) {
                throw new Error('Token olishda xatolik');
            }

            const data = await response.json();
            // Token turli kalitlarda kelishi mumkin
            const token = data.access || data.token || data.access_token || data.auth_token;

            if (!token) {
                throw new Error('Token response da token topilmadi');
            }

            return token;
        } catch (error) {
            console.error('Token olishda xatolik:', error);
            throw error;
        }
    };

    // Yuk beruvchilarni API dan olish funksiyasi
    const fetchSenders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Token olish
            const token = await fetchToken();

            // Foydalanuvchilarni olish
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Ma\'lumotlarni olishda xatolik');
            }

            const data = await response.json();

            // ASOSIY TUZATISH: data array emas, object bo'lishi mumkin
            let usersArray = [];

            if (Array.isArray(data)) {
                // Agar data to'g'ridan-to'g'ri array bo'lsa
                usersArray = data;
            } else if (data.results && Array.isArray(data.results)) {
                // Agar pagination bilan kelgan bo'lsa (results ichida)
                usersArray = data.results;
            } else if (typeof data === 'object' && data !== null) {
                // Agar bitta object bo'lsa, uni array ichiga solamiz
                usersArray = [data];
            } else {
                // Boshqa holatda bo'sh array
                usersArray = [];
            }

            // Yuk beruvchilarni filter qilish (role: 'sender' yoki 'client')
            const senderUsers = usersArray.filter(user =>
                user.role === 'sender' || user.role === 'client' || user.role === 'customer'
            );

            // Ma'lumotlarni formatlash
            const formattedSenders = senderUsers.map((sender, index) => {
                // Ismni aniqlash
                const fullName = sender.first_name || sender.last_name
                    ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim()
                    : sender.username || `Yuk Beruvchi ${index + 1}`;

                // Kompaniya nomi (API da bo'lmasa, default)
                const companies = ['Karimov Trade LLC', 'Sobirov Logistics', 'Qodirov Transport', 'Nurmatov Group', 'DK Logistics'];
                const company = sender.company || sender.organization || companies[Math.floor(Math.random() * companies.length)];

                // Statusni aniqlash (API da status maydoni bo'lmasa, default active)
                const status = sender.status || 'active';

                // Reytingni aniqlash (API da bo'lmasa, random)
                const rating = sender.rating || (4 + Math.random()).toFixed(1);

                // Yuklar soni (API da bo'lmasa, random)
                const totalLoads = sender.total_loads || Math.floor(Math.random() * 50) + 1;

                // Manzil (API da bo'lmasa, default)
                const locations = ['Toshkent', 'Farg\'ona', 'Buxoro', 'Samarqand', 'Nukus'];
                const location = sender.address || sender.location || locations[Math.floor(Math.random() * locations.length)];

                // Qo'shilgan sana
                const joinedDate = sender.date_joined || sender.created_at
                    ? new Date(sender.date_joined || sender.created_at).toISOString().split('T')[0]
                    : '2023-01-01';

                // Oxirgi faollik (API da bo'lmasa, random)
                const lastActivityDate = new Date();
                lastActivityDate.setDate(lastActivityDate.getDate() - Math.floor(Math.random() * 30));
                const lastActivity = lastActivityDate.toISOString().split('T')[0];

                return {
                    id: sender.id || index,
                    name: fullName,
                    company: company,
                    phone: sender.phone_number || '+998 XX XXX XX XX',
                    email: sender.email || 'email@example.com',
                    totalLoads: totalLoads,
                    rating: parseFloat(rating),
                    status: status,
                    location: location,
                    joinedDate: joinedDate,
                    lastActivity: lastActivity,
                    telegram: sender.telegram,
                    facebook: sender.facebook,
                    whatsapp: sender.whatsapp,
                    photo: sender.photo
                };
            });

            // Statistika hisoblash
            const total = formattedSenders.length;
            const totalLoads = formattedSenders.reduce((sum, sender) => sum + sender.totalLoads, 0);
            const companies = new Set(formattedSenders.map(s => s.company)).size;
            const averageRating = formattedSenders.length > 0
                ? (formattedSenders.reduce((sum, sender) => sum + sender.rating, 0) / formattedSenders.length).toFixed(1)
                : 0;

            setStats({
                total,
                totalLoads,
                companies,
                averageRating: parseFloat(averageRating)
            });

            setSenders(formattedSenders);
        } catch (error) {
            console.error('Yuk beruvchilarni olishda xatolik:', error);
            setError('Yuk beruvchilarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
        } finally {
            setLoading(false);
        }
    };

    // Component yuklanganda ma'lumotlarni olish
    useEffect(() => {
        fetchSenders();
    }, []);

    const filteredSenders = senders.filter(sender => {
        const matchesSearch =
            sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sender.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sender.phone.includes(searchTerm);

        const matchesFilter =
            statusFilter === 'all' ||
            sender.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-600';
            case 'inactive': return 'bg-red-100 text-red-600';
            case 'pending': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Faol';
            case 'inactive': return 'Nofaol';
            case 'pending': return 'Kutilmoqda';
            default: return 'Noma\'lum';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100">
                <FaSync className="text-4xl text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Yuk beruvchilar yuklanmoqda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100">
                <FaExclamationTriangle className="text-4xl text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Xatolik yuz berdi</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                    onClick={fetchSenders}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Qayta urinish
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Yuk Beruvchilar</h2>
                    <p className="text-gray-600">Platformadagi barcha yuk beruvchilar</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchSenders}
                        className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaSync /> Yangilash
                    </button>
                    <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                        <FaPlus /> Yangi Beruvchi
                    </button>
                </div>
            </div>

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FaUserTie className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Jami beruvchilar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <FaBox className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalLoads}</div>
                            <div className="text-sm text-gray-600">Umumiy yuklar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                            <FaBuilding className="text-purple-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.companies}</div>
                            <div className="text-sm text-gray-600">Kompaniyalar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <FaStar className="text-yellow-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                            <div className="text-sm text-gray-600">O'rtacha reyting</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter va qidiruv */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Ism, kompaniya yoki telefon bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Hammasi
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Faol
                        </button>
                        <button
                            onClick={() => setStatusFilter('inactive')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Nofaol
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Kutilmoqda
                        </button>
                    </div>
                </div>
            </div>

            {/* Beruvchilar ro'yxati - Grid ko'rinishi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSenders.map((sender) => (
                    <div key={sender.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Sarlavha qismi */}
                        <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                        {sender.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{sender.name}</h3>
                                        <p className="text-sm text-gray-600">{sender.company}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sender.status)}`}>
                                    {getStatusText(sender.status)}
                                </span>
                            </div>
                        </div>

                        {/* Kontakt ma'lumotlari */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FaPhone className="text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{sender.phone}</div>
                                        <div className="text-sm text-gray-600">Telefon</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FaEnvelope className="text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{sender.email}</div>
                                        <div className="text-sm text-gray-600">Email</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{sender.location}</div>
                                        <div className="text-sm text-gray-600">Manzil</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistik ma'lumotlar */}
                        <div className="p-4 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{sender.totalLoads}</div>
                                <div className="text-sm text-gray-600">Yuklar</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{sender.rating}</div>
                                <div className="text-sm text-gray-600">Reyting</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-medium text-gray-900">{sender.joinedDate}</div>
                                <div className="text-xs text-gray-500">Qo'shilgan</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-medium text-gray-900">{sender.lastActivity}</div>
                                <div className="text-xs text-gray-500">Oxirgi faollik</div>
                            </div>
                        </div>

                        {/* Harakatlar */}
                        <div className="p-4 border-t border-gray-200 flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <FaEdit /> Tahrirlash
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <FaBox /> Yuklari
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bo'sh holat */}
            {filteredSenders.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <FaUserTie className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {senders.length === 0 ? 'Yuk beruvchilar mavjud emas' : 'Yuk beruvchilar topilmadi'}
                    </h3>
                    <p className="text-gray-500">
                        {senders.length === 0
                            ? 'Hozircha platformada yuk beruvchilar mavjud emas'
                            : 'Qidiruv shartlariga mos keladigan beruvchilar yo\'q'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SendersPage;
