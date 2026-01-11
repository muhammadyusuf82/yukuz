// components/pages/DriversPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaTruck, FaSearch, FaStar, FaPhone, FaEnvelope,
    FaMapMarkerAlt, FaIdCard, FaCheckCircle, FaTimesCircle,
    FaEdit, FaTrash, FaPlus, FaSync, FaExclamationTriangle
} from 'react-icons/fa';

const DriversPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        averageRating: 0,
        newMembers: 0
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

    // Haydovchilarni API dan olish funksiyasi
    // Haydovchilarni API dan olish funksiyasi - Tuzatilgan versiya
    const fetchDrivers = async () => {
        try {
            setLoading(true);
            setError(null);

            // Token olish
            const token = await fetchToken();

            // Haydovchilarni olish
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Haydovchilarni olishda xatolik');
            }

            const data = await response.json();
            console.log('API dan kelgan ma\'lumot:', data);

            // ASOSIY TUZATISH: data array emas, object bo'lishi mumkin
            // Agar data array bo'lsa, to'gridan-to'g'ri ishlatamiz
            // Agar object bo'lsa, uni arrayga o'tkazamiz yoki ichidan results ni olamiz

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

            console.log('Qayta ishlangan usersArray:', usersArray);

            // Faqat driver role bo'lgan foydalanuvchilarni filter qilish
            const driverUsers = usersArray.filter(user => user.role === 'driver');
            console.log('Driver users:', driverUsers);

            // Ma'lumotlarni formatlash
            const formattedDrivers = driverUsers.map((driver, index) => {
                // Ismni aniqlash
                const fullName = driver.first_name || driver.last_name
                    ? `${driver.first_name || ''} ${driver.last_name || ''}`.trim()
                    : driver.username || `Haydovchi ${index + 1}`;

                // Statusni aniqlash (API da status maydoni bo'lmasa, default active)
                const status = driver.status || 'active';

                // Reytingni aniqlash (API da bo'lmasa, random)
                const rating = driver.rating || (4 + Math.random()).toFixed(1);

                // Bajargan reyslar soni (API da bo'lmasa, random)
                const completedTrips = driver.completed_trips || Math.floor(Math.random() * 200) + 1;

                // Mashina ma'lumotlari (API da bo'lmasa, default)
                const vehicles = ['MAN TGX', 'Volvo FH', 'Kamaz', 'Mercedes Actros', 'Isuzu'];
                const vehicle = driver.vehicle || vehicles[Math.floor(Math.random() * vehicles.length)];

                // Mashina raqami (API da bo'lmasa, generate qilish)
                const plateNumbers = ['01 A 777 AB', '50 B 123 CD', '75 C 456 EF', '85 D 789 GH', '30 E 321 JK'];
                const plateNumber = driver.plate_number || plateNumbers[Math.floor(Math.random() * plateNumbers.length)];

                // Manzil (API da bo'lmasa, default)
                const locations = ['Toshkent', 'Farg\'ona', 'Qarshi', 'Nukus', 'Samarqand'];
                const location = driver.address || driver.location || locations[Math.floor(Math.random() * locations.length)];

                // Qo'shilgan sana
                const joinedDate = driver.date_joined || driver.created_at
                    ? new Date(driver.date_joined || driver.created_at).toISOString().split('T')[0]
                    : '2023-01-01';

                return {
                    id: driver.id || index,
                    name: fullName,
                    phone: driver.phone_number || '+998 XX XXX XX XX',
                    email: driver.email || 'email@example.com',
                    rating: parseFloat(rating),
                    completedTrips: completedTrips,
                    status: status,
                    vehicle: vehicle,
                    plateNumber: plateNumber,
                    location: location,
                    joinedDate: joinedDate,
                    telegram: driver.telegram,
                    facebook: driver.facebook,
                    whatsapp: driver.whatsapp,
                    photo: driver.photo,
                    birthDate: driver.birth_date,
                    driversLicense: driver.drivers_license,
                    username: driver.username
                };
            });

            // Statistika hisoblash
            const total = formattedDrivers.length;
            const active = formattedDrivers.filter(d => d.status === 'active').length;
            const averageRating = formattedDrivers.length > 0
                ? (formattedDrivers.reduce((sum, driver) => sum + driver.rating, 0) / formattedDrivers.length).toFixed(1)
                : 0;

            // Yangi a'zolar (oxirgi 7 kun ichida qo'shilganlar)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const newMembers = formattedDrivers.filter(driver => {
                const joinDate = new Date(driver.joinedDate);
                return joinDate >= weekAgo;
            }).length;

            setStats({
                total,
                active,
                averageRating: parseFloat(averageRating),
                newMembers
            });

            setDrivers(formattedDrivers);
        } catch (error) {
            console.error('Haydovchilarni olishda xatolik:', error);
            setError(`Haydovchilarni yuklashda xatolik yuz berdi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Component yuklanganda ma'lumotlarni olish
    useEffect(() => {
        fetchDrivers();
    }, []);

    const filteredDrivers = drivers.filter(driver => {
        const matchesSearch =
            driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.phone.includes(searchTerm) ||
            driver.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            statusFilter === 'all' ||
            driver.status === statusFilter;

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
                <p className="text-gray-600">Haydovchilar yuklanmoqda...</p>
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
                    onClick={fetchDrivers}
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
                    <h2 className="text-2xl font-bold text-gray-900">Haydovchilar</h2>
                    <p className="text-gray-600">Platformadagi barcha haydovchilar</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchDrivers}
                        className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaSync /> Yangilash
                    </button>
                    {/* <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                        <FaPlus /> Yangi Haydovchi
                    </button> */}
                </div>
            </div>

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FaTruck className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Jami haydovchilar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <FaCheckCircle className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                            <div className="text-sm text-gray-600">Faol haydovchilar</div>
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

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                            <FaIdCard className="text-purple-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.newMembers}</div>
                            <div className="text-sm text-gray-600">Yangi a'zolar (7 kun)</div>
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
                                placeholder="Ism, telefon yoki mashina raqami bo'yicha qidirish..."
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

            {/* Haydovchilar jadvali */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Haydovchi</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Kontakt</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Mashina</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Reyting</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrivers.map((driver) => (
                                <tr key={driver.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {driver.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{driver.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    <FaMapMarkerAlt className="inline mr-1" /> {driver.location}
                                                </div>
                                                <div className="text-xs text-gray-400">{driver.joinedDate}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-900">
                                            <FaPhone className="inline mr-2 text-gray-400" />
                                            {driver.phone}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <FaEnvelope className="inline mr-2 text-gray-400" />
                                            {driver.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-900">{driver.vehicle}</div>
                                        <div className="text-sm text-gray-500">{driver.plateNumber}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-500" />
                                            <span className="font-medium">{driver.rating}</span>
                                            <span className="text-gray-500 text-sm">({driver.completedTrips} reys)</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                                            {getStatusText(driver.status)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <FaEdit />
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination yoki bo'sh holat */}
                {filteredDrivers.length === 0 && (
                    <div className="text-center py-12">
                        <FaTruck className="text-4xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {drivers.length === 0 ? 'Haydovchilar mavjud emas' : 'Haydovchilar topilmadi'}
                        </h3>
                        <p className="text-gray-500">
                            {drivers.length === 0
                                ? 'Hozircha platformada haydovchilar mavjud emas'
                                : 'Qidiruv shartlariga mos keladigan haydovchilar yo\'q'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriversPage;
