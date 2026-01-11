// components/pages/ActiveLoadsPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaTruck, FaSearch, FaFilter, FaEye, FaPhone,
    FaMapMarkerAlt, FaUser, FaCalendar, FaClock,
    FaExclamationTriangle, FaCheckCircle, FaSync
} from 'react-icons/fa';

const ActiveLoadsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        delivering: 0,
        delayed: 0,
        todayFinishing: 0
    });

    // API uchun token olish funksiyasi - TO'G'IRLANGSIZ VERSIYA
    const fetchToken = async () => {
        try {
            console.log('Token olinmoqda...');
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

            console.log('Token response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Token olishda xatolik response:', errorText);
                throw new Error(`Token olishda xatolik: ${response.status}`);
            }

            const data = await response.json();
            console.log('Token olish response data:', data);

            // ASOSIY O'ZGARTIRISH: Tokenni qidirish turli kalitlarda
            const token = data.access || data.token || data.access_token || data.auth_token;

            if (!token) {
                console.error('Token topilmadi. Response:', data);
                throw new Error('Token response da token topilmadi. Qaytgan ma\'lumot: ' + JSON.stringify(data));
            }

            console.log('Token muvaffaqiyatli olingan:', token.substring(0, 20) + '...');
            return token;
        } catch (error) {
            console.error('Token olishda xatolik:', error);
            setError(`Token olishda xatolik: ${error.message}`);
            throw error;
        }
    };

    // Yuklarni API dan olish funksiyasi
    const fetchLoads = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Yuklar olinmoqda...');

            // Token olish
            const token = await fetchToken();
            console.log('Token olindi, uzunligi:', token.length);

            // Yuklarni olish
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Yuklar response status:', response.status);

            if (response.status === 401) {
                console.log('Token eskirgan...');
                throw new Error('Token eskirgan yoki noto\'g\'ri');
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Yuklarni olishda xatolik response:', errorText);
                throw new Error(`Yuklarni olishda xatolik: ${response.status}`);
            }

            const data = await response.json();
            console.log('Yuklar response data:', data);

            // API dan kelgan ma'lumotlarni formatlash va faqat faol yuklarni filter qilish
            const formattedLoads = data.map(item => {
                // Statusni aniqlash
                let status = 'delivering'; // default
                let progress = 50; // default progress

                if (item.status === 'accepted' || item.status === 'on the way' || item.status === 'delivering') {
                    status = 'delivering';
                } else if (item.status === 'delayed' || item.status === 'late') {
                    status = 'delayed';
                } else if (item.status === 'completed' || item.status === 'delivered') {
                    status = 'completed';
                }

                // Progressni hisoblash
                if (item.route_start_time_from && item.route_end_time_to) {
                    const startTime = new Date(item.route_start_time_from).getTime();
                    const endTime = new Date(item.route_end_time_to).getTime();
                    const currentTime = new Date().getTime();

                    if (currentTime >= endTime) {
                        progress = 100;
                    } else if (currentTime <= startTime) {
                        progress = 0;
                    } else {
                        progress = Math.round(((currentTime - startTime) / (endTime - startTime)) * 100);
                    }
                }

                // Bugun tugashini tekshirish
                const today = new Date().toISOString().split('T')[0];
                const expectedDate = item.route_end_time_to ?
                    new Date(item.route_end_time_to).toISOString().split('T')[0] : '';
                const isTodayFinishing = expectedDate === today;

                return {
                    id: item.id,
                    originalId: item.id,
                    from: item.route_starts_where_data.city || item.route_starts_where_region || 'Noma\'lum',
                    to: item.route_ends_where_data.city || item.route_ends_where_region || 'Noma\'lum',
                    cargo: item.freight_type || 'Noma\'lum',
                    driver: item.driver?.full_name || item.owner_username || 'Noma\'lum',
                    driverPhone: item.driver?.phone || item.owner_username || '+998 XX XXX XX XX',
                    truckNumber: item.vehicle_number || 'Noma\'lum',
                    price: item.freight_rate_amount ?
                        `${parseFloat(item.freight_rate_amount).toLocaleString('uz-UZ')} ${item.freight_rate_currency || 'so\'m'}` : 'Noma\'lum',
                    startDate: item.route_start_time_from ?
                        new Date(item.route_start_time_from).toISOString().split('T')[0] : 'Noma\'lum',
                    expectedDate: expectedDate || 'Noma\'lum',
                    status: status,
                    progress: progress,
                    isTodayFinishing: isTodayFinishing,
                    description: item.description_uz || item.description_ru || ''
                };
            });

            // Faqat faol yuklarni filter qilish (completed va waiting for driver emas)
            const activeLoads = formattedLoads.filter(load =>
                load.status !== 'completed' && load.status !== 'waiting for driver'
            );

            // Statistikani hisoblash
            const total = activeLoads.length;
            const delivering = activeLoads.filter(l => l.status === 'delivering').length;
            const delayed = activeLoads.filter(l => l.status === 'delayed').length;
            const todayFinishing = activeLoads.filter(l => l.isTodayFinishing).length;

            setStats({
                total,
                delivering,
                delayed,
                todayFinishing
            });

            setLoads(activeLoads);
        } catch (error) {
            console.error('Yuklarni olishda xatolik:', error);
            setError(`Yuklarni yuklashda xatolik yuz berdi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Component yuklanganda ma'lumotlarni olish
    useEffect(() => {
        fetchLoads();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivering': return 'bg-blue-100 text-blue-600';
            case 'delayed': return 'bg-red-100 text-red-600';
            case 'completed': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'delivering': return 'Yetkazilmoqda';
            case 'delayed': return 'Kechikdi';
            case 'completed': return 'Yakunlangan';
            default: return 'Noma\'lum';
        }
    };

    const filteredLoads = loads.filter(load => {
        const matchesSearch =
            load.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            load.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
            load.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            load.cargo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            statusFilter === 'all' ||
            load.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    // Qo'ng'iroq qilish funksiyasi
    const handleCallDriver = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100">
                <FaSync className="text-4xl text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Faol yuklar yuklanmoqda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100">
                <FaExclamationTriangle className="text-4xl text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Xatolik yuz berdi</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <div className="flex gap-3">
                    <button
                        onClick={fetchLoads}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Faol Yuklar</h2>
                    <p className="text-gray-600">Hozir yo'lda bo'lgan barcha yuklar</p>
                </div>
                <button
                    onClick={fetchLoads}
                    className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    <FaSync /> Yangilash
                </button>
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
                            <div className="text-sm text-gray-600">Faol yuklar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <FaCheckCircle className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.delivering}</div>
                            <div className="text-sm text-gray-600">To'g'ri ketayotgan</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <FaClock className="text-yellow-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.todayFinishing}</div>
                            <div className="text-sm text-gray-600">Bugun yakunlanishi</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                            <FaExclamationTriangle className="text-red-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.delayed}</div>
                            <div className="text-sm text-gray-600">Kechikkan yuklar</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Qidiruv */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Yuk ID, haydovchi, yuk yoki mashina raqami bo'yicha qidirish..."
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
                            onClick={() => setStatusFilter('delivering')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'delivering' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Yetkazilmoqda
                        </button>
                        <button
                            onClick={() => setStatusFilter('delayed')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'delayed' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Kechikkan
                        </button>
                    </div>
                </div>
            </div>

            {/* Faol yuklar ro'yxati */}
            <div className="space-y-4">
                {filteredLoads.map((load) => (
                    <div key={load.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 md:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <FaTruck className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">YUK-{load.id}</h3>
                                        <p className="text-sm text-gray-600">{load.cargo}</p>
                                        {load.description && (
                                            <p className="text-sm text-gray-500 mt-1">{load.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(load.status)}`}>
                                        {getStatusText(load.status)}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-600">
                                        {load.price}
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Yetkazish darajasi</span>
                                    <span>{load.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${load.status === 'delayed' ? 'bg-red-600' : 'bg-blue-600'}`}
                                        style={{ width: `${load.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Ma'lumotlar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{load.from} → {load.to}</div>
                                        <div className="text-sm text-gray-600">Yo'nalish</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FaUser className="text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{load.driver}</div>
                                        <div className="text-sm text-gray-600">{load.truckNumber}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FaPhone className="text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{load.driverPhone}</div>
                                        <div className="text-sm text-gray-600">Aloqa</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <FaCalendar className="text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{load.expectedDate}</div>
                                        <div className="text-sm text-gray-600">Kutilgan sana</div>
                                    </div>
                                </div>
                            </div>

                            {/* Harakatlar */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <FaEye /> Batafsil
                                </button>
                                <button
                                    onClick={() => handleCallDriver(load.driverPhone)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <FaPhone /> Qo'ng'iroq
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bo'sh holat */}
            {filteredLoads.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <FaTruck className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {loads.length === 0 ? 'Faol yuklar mavjud emas' : 'Qidiruv bo\'yicha yuklar topilmadi'}
                    </h3>
                    <p className="text-gray-500">
                        {loads.length === 0
                            ? 'Hozircha yo\'lda hech qanday yuk yo\'q'
                            : 'Boshqa qidiruv so\'zini sinab ko\'ring'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ActiveLoadsPage;
