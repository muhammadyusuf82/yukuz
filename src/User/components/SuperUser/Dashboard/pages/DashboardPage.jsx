// components/pages/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    FaBox,
    FaCheckDouble,
    FaClock,
    FaUsers,
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaSyncAlt,
    FaTrash,
    FaChartLine,
    FaEdit,
    FaExclamationTriangle,
    FaCheck,
    FaTimes,
    FaInfo
} from 'react-icons/fa';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const DashboardPage = ({
    navigateTo,
    showToast,
    openModal,
    formatCurrency,
    formatPercentage
}) => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previousStats, setPreviousStats] = useState(null);
    const [statsHistory, setStatsHistory] = useState([]);
    const [recentLoads, setRecentLoads] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [editingLoad, setEditingLoad] = useState(null);
    const [deleteLoadId, setDeleteLoadId] = useState(null);
    const [chartType, setChartType] = useState('line'); // 'line', 'bar', 'pie'
    const [firstLoadTime, setFirstLoadTime] = useState(null);

    // Token olish funksiyasi
    const getAuthToken = async () => {
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
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Token API javobi:', data);
                const token = data.token || data.access_token || data.access;
                if (token) {
                    localStorage.removeItem('access_token');
                    localStorage.setItem('access_token', token);
                    return token;
                }
            } else {
                const errorText = await response.text();
                console.error('Token olishda xatolik:', response.status, errorText);
            }
        } catch (error) {
            console.error('Token olishda tarmoq xatosi:', error);
        }
        return null;
    };

    // API dan statistik ma'lumotlarni olish
    const fetchStats = async () => {
        try {
            setLoading(true);

            // Token ni olish
            let token = localStorage.getItem('access_token');
            if (!token) {
                token = await getAuthToken();
            }

            if (!token) {
                showToast('Token olishda xatolik', 'error');
                setLoading(false);
                return;
            }

            console.log('Token mavjud, API ga so\'rov yuborilmoqda...');

            // Token bilan so'rov yuborish
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight-stats-all/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API javobi:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('API dan kelgan ma\'lumotlar:', data);

                // Tarixni saqlash
                const newStats = {
                    ...data,
                    timestamp: new Date().toISOString()
                };

                // Oldingi ma'lumotlarni olish
                const storedHistory = JSON.parse(localStorage.getItem('admin_stats_history')) || [];

                // Yangi tarixni qo'shish (faqat 10 ta oxirgisini saqlash)
                const updatedHistory = [...storedHistory, newStats].slice(-10);
                localStorage.setItem('admin_stats_history', JSON.stringify(updatedHistory));
                setStatsHistory(updatedHistory);

                // Oldingi statistikani o'rnatish (agar tarixda kamida 2 ta ma'lumot bo'lsa)
                if (updatedHistory.length >= 2) {
                    const prev = updatedHistory[updatedHistory.length - 2];
                    setPreviousStats(prev);
                } else {
                    setPreviousStats(null);
                }

                setStatsData(data);

                // Chart uchun ma'lumotlarni tayyorlash
                prepareChartData(updatedHistory);
            } else if (response.status === 403) {
                showToast('Kirish ruxsati yo\'q. Token yangilanmoqda...', 'warning');

                // Tokenni yangilashga urinish
                const newToken = await getAuthToken();
                if (newToken) {
                    // Yangi token bilan qayta urinish
                    setTimeout(() => fetchStats(), 1000);
                } else {
                    showToast('Autentifikatsiya xatosi', 'error');
                }
            } else {
                const errorText = await response.text();
                console.error('API dan ma\'lumot olishda xatolik:', response.status, errorText);
                showToast('Statistik ma\'lumotlarni yuklashda xatolik', 'error');
            }
        } catch (error) {
            console.error('API dan ma\'lumot olishda xatolik:', error);
            showToast('Server bilan aloqa yo\'q', 'error');
        } finally {
            setLoading(false);
        }
    };

    // So'nggi 3 ta yukni olish va birinchi yuk vaqtini olish
    const fetchRecentLoads = async () => {
        try {
            let token = localStorage.getItem('access_token');
            if (!token) {
                token = await getAuthToken();
            }

            if (!token) {
                return;
            }

            // Oxirgi 3 ta yukni olish
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('So\'nggi yuklar:', data);
                // API javobi results arrayini qaytarishi mumkin yoki to'g'ridan-to'g'ri array
                const loads = data.results || data;
                setRecentLoads(loads.slice(0, 3));

                // Birinchi yuk created_at ni olish (eng eski)
                if (loads.length > 0) {
                    const sortedLoads = [...loads].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    setFirstLoadTime(new Date(sortedLoads[0].created_at));
                }
            }
        } catch (error) {
            console.error('Yuklarni olishda xatolik:', error);
            showToast('Yuk ma\'lumotlarini yuklashda xatolik', 'error');
        }
    };

    // So'nggi tranzaksiyalarni olish (mock data, chunki alohida API yo'q)
    const fetchRecentTransactions = async () => {
        try {
            // Real API bo'lmasa, mock data
            setRecentTransactions([
                { id: '#TXN-7841', amount: '850,000', status: 'completed', created_at: new Date().toISOString() },
                { id: '#TXN-7840', amount: '1,200,000', status: 'pending', created_at: new Date().toISOString() },
                { id: '#TXN-7839', amount: '500,000', status: 'cancelled', created_at: new Date(Date.now() - 86400000).toISOString() },
            ]);
        } catch (error) {
            console.error('Tranzaksiyalarni olishda xatolik:', error);
            // Mock data
            setRecentTransactions([
                { id: '#TXN-7841', amount: '850,000', status: 'completed', created_at: new Date().toISOString() },
                { id: '#TXN-7840', amount: '1,200,000', status: 'pending', created_at: new Date().toISOString() },
                { id: '#TXN-7839', amount: '500,000', status: 'cancelled', created_at: new Date(Date.now() - 86400000).toISOString() },
            ]);
        }
    };

    // Chart uchun ma'lumotlarni tayyorlash (birinchi yuk vaqtiga qarab adjust)
    const prepareChartData = (history) => {
        if (!history || history.length === 0) return;

        const formattedData = history.map((item, index) => {
            let date = new Date(item.timestamp);
            if (firstLoadTime && index === 0) {
                date = firstLoadTime; // Birinchi entry ni birinchi yuk vaqtiga o'zgartirish
            }
            const timeLabel = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

            return {
                time: timeLabel,
                'Umumiy Yuklar': item.freights || 0,
                'Yakunlangan': item.delivered || 0,
                'Jarayonda': item.delivering || 0,
                'Kutilayotgan': item.waiting || 0,
                'Foydalanuvchilar': item.users || 0,
                'Daromad': item.profit ? item.profit / 1000000 : 0 // million so'm da
            };
        });

        setChartData(formattedData);
    };

    // Yukni o'zgartirish
    const handleEditLoad = async (loadId, updatedData) => {
        try {
            let token = localStorage.getItem('access_token');
            if (!token) {
                token = await getAuthToken();
            }

            if (!token) {
                showToast('Token olishda xatolik', 'error');
                return;
            }

            // Status ni API ga moslashtirish
            let apiStatus = updatedData.status;
            if (apiStatus === 'waiting') {
                apiStatus = 'waiting for driver';
            } else if (apiStatus === 'delivering') {
                apiStatus = 'delivering';
            } else if (apiStatus === 'delivered') {
                apiStatus = 'delivered';
            } else if (apiStatus === 'cancelled') {
                apiStatus = 'cancelled';
            }

            const apiData = {
                freight_rate_amount: updatedData.freight_rate_amount,
                status: apiStatus,
                description_uz: updatedData.description_uz // Agar uz tilida bo'lsa
            };

            const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${loadId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData)
            });

            if (response.ok) {
                showToast('Yuk muvaffaqiyatli yangilandi', 'success');
                fetchRecentLoads(); // Yangilangan ro'yxatni olish
                fetchStats(); // Statistikalarni yangilash
                setEditingLoad(null); // Modalni yopish
            } else {
                const errorData = await response.json();
                showToast(`Xatolik: ${JSON.stringify(errorData)}`, 'error');
            }
        } catch (error) {
            console.error('Yukni yangilashda xatolik:', error);
            showToast('Server bilan aloqa yo\'q', 'error');
        }
    };

    // Yukni o'chirish
    const handleDeleteLoad = async (loadId) => {
        try {
            let token = localStorage.getItem('access_token');
            if (!token) {
                token = await getAuthToken();
            }

            if (!token) {
                showToast('Token olishda xatolik', 'error');
                return;
            }

            const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${loadId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok || response.status === 204) {
                showToast('Yuk muvaffaqiyatli o\'chirildi', 'success');
                fetchRecentLoads(); // Yangilangan ro'yxatni olish
                fetchStats(); // Statistikalarni yangilash
                setDeleteLoadId(null); // Modalni yopish
            } else {
                const errorData = await response.json();
                showToast(`Xatolik: ${JSON.stringify(errorData)}`, 'error');
            }
        } catch (error) {
            console.error('Yukni o\'chirishda xatolik:', error);
            showToast('Server bilan aloqa yo\'q', 'error');
        }
    };

    // Foiz hisoblash funksiyasi (birinchi yuk vaqtiga qarab adjust agar previous yo'q bo'lsa)
    const calculatePercentage = (current, previous) => {
        if (!previous || previous === 0) {
            if (firstLoadTime) {
                const timeDiff = (new Date() - firstLoadTime) / (1000 * 60 * 60 * 24); // Kunlardagi farq
                return timeDiff > 0 ? Math.min(100, timeDiff * 10) : 0; // Masalan, har kun uchun 10%
            }
            return current > 0 ? 100 : 0;
        }

        const change = ((current - previous) / previous) * 100;

        if (Math.abs(change) < 0.1) {
            return 0;
        }

        return Math.round(change * 10) / 10;
    };

    // Statistika tendentsiyasini aniqlash
    const getTrend = (current, previous) => {
        if (!previous || previous === 0) {
            return current > 0 ? 'up' : 'same';
        }

        const change = ((current - previous) / previous) * 100;

        if (Math.abs(change) < 0.1) {
            return 'same';
        }

        return current > previous ? 'up' : 'down';
    };

    // Stats data - API dan kelgan ma'lumotlar asosida
    const stats = useMemo(() => {
        if (!statsData) {
            return [
                {
                    title: 'Umumiy Yuklar',
                    value: 0,
                    icon: <FaBox />,
                    trend: 'up',
                    trendValue: 0,
                    color: 'text-blue-500 bg-blue-50'
                },
                {
                    title: 'Yakunlangan',
                    value: 0,
                    icon: <FaCheckDouble />,
                    trend: 'up',
                    trendValue: 0,
                    color: 'text-green-500 bg-green-50'
                },
                {
                    title: 'Jarayonda',
                    value: 0,
                    icon: <FaClock />,
                    trend: 'down',
                    trendValue: 0,
                    color: 'text-yellow-500 bg-yellow-50'
                },
                {
                    title: 'Kutilayotgan',
                    value: 0,
                    icon: <FaClock />,
                    trend: 'down',
                    trendValue: 0,
                    color: 'text-red-500 bg-red-50'
                },
                {
                    title: 'Foydalanuvchilar',
                    value: 0,
                    icon: <FaUsers />,
                    trend: 'up',
                    trendValue: 0,
                    color: 'text-indigo-500 bg-indigo-50'
                },
                {
                    title: 'Umumiy Daromad',
                    value: 0,
                    icon: <FaWallet />,
                    trend: 'up',
                    trendValue: 0,
                    color: 'text-purple-500 bg-purple-50'
                },
            ];
        }

        const prev = previousStats || {};

        return [
            {
                title: 'Umumiy Yuklar',
                value: statsData.freights || 0,
                icon: <FaBox />,
                trend: getTrend(statsData.freights || 0, prev.freights || 0),
                trendValue: calculatePercentage(statsData.freights || 0, prev.freights || 0),
                color: 'text-blue-500 bg-blue-50'
            },
            {
                title: 'Yakunlangan',
                value: statsData.delivered || 0,
                icon: <FaCheckDouble />,
                trend: getTrend(statsData.delivered || 0, prev.delivered || 0),
                trendValue: calculatePercentage(statsData.delivered || 0, prev.delivered || 0),
                color: 'text-green-500 bg-green-50'
            },
            {
                title: 'Jarayonda',
                value: statsData.delivering || 0,
                icon: <FaClock />,
                trend: getTrend(statsData.delivering || 0, prev.delivering || 0),
                trendValue: calculatePercentage(statsData.delivering || 0, prev.delivering || 0),
                color: 'text-yellow-500 bg-yellow-50'
            },
            {
                title: 'Kutilayotgan',
                value: statsData.waiting || 0,
                icon: <FaClock />,
                trend: getTrend(statsData.waiting || 0, prev.waiting || 0),
                trendValue: calculatePercentage(statsData.waiting || 0, prev.waiting || 0),
                color: 'text-red-500 bg-red-50'
            },
            {
                title: 'Foydalanuvchilar',
                value: statsData.users || 0,
                icon: <FaUsers />,
                trend: getTrend(statsData.users || 0, prev.users || 0),
                trendValue: calculatePercentage(statsData.users || 0, prev.users || 0),
                color: 'text-indigo-500 bg-indigo-50'
            },
            {
                title: 'Umumiy Daromad',
                value: statsData.profit || 0,
                icon: <FaWallet />,
                trend: getTrend(statsData.profit || 0, prev.profit || 0),
                trendValue: calculatePercentage(statsData.profit || 0, prev.profit || 0),
                color: 'text-purple-500 bg-purple-50'
            },
        ];
    }, [statsData, previousStats, firstLoadTime]);

    // Format currency
    const formatCurrencyInternal = (value) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '0 so\'m';

        if (num >= 1000000) {
            const million = num / 1000000;
            return `${million.toFixed(1)}M so'm`;
        }

        if (num >= 1000) {
            const thousand = num / 1000;
            return `${thousand.toFixed(1)}K so'm`;
        }

        const roundedValue = Math.round(num);
        return new Intl.NumberFormat('uz-UZ').format(roundedValue) + ' so\'m';
    };

    // Foiz ko'rsatgichini formatlash
    const formatPercentageInternal = (value, trend) => {
        if (trend === 'same') return '0%';
        if (trend === 'up') return `+${value}%`;
        return `${value}%`;
    };

    // Yuk statusini formatlash va map qilish
    const formatLoadStatus = (status) => {
        const statusMap = {
            'waiting for driver': { text: 'Kutilmoqda', color: 'text-yellow-600 bg-yellow-50', internal: 'waiting' },
            'delivering': { text: 'Jarayonda', color: 'text-blue-600 bg-blue-50', internal: 'delivering' },
            'delivered': { text: 'Yakunlangan', color: 'text-green-600 bg-green-50', internal: 'delivered' },
            'cancelled': { text: 'Bekor qilingan', color: 'text-red-600 bg-red-50', internal: 'cancelled' }
        };

        const statusInfo = statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-50', internal: status };
        return statusInfo;
    };

    // Vaqtni formatlash
    const formatTime = (timestamp) => {
        if (!timestamp) return 'Noma\'lum';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Endi';
        if (diffMins < 60) return `${diffMins} min oldin`;
        if (diffHours < 24) return `${diffHours} soat oldin`;
        if (diffDays === 1) return 'Kecha';
        if (diffDays < 7) return `${diffDays} kun oldin`;

        return date.toLocaleDateString('uz-UZ');
    };

    // Chart ranglari
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Component mount bo'lganda ma'lumotlarni yuklash
    useEffect(() => {
        fetchStats();
        fetchRecentLoads();
        fetchRecentTransactions();
    }, []);

    const finalFormatCurrency = formatCurrency || formatCurrencyInternal;
    const finalFormatPercentage = formatPercentage || formatPercentageInternal;

    const handleRefresh = async () => {
        await fetchStats();
        await fetchRecentLoads();
        await fetchRecentTransactions();
    };

    // Yukni tahrirlash modalini ochish
    const openEditModal = (load) => {
        setEditingLoad(load);
    };

    // Yukni o'chirish modalini ochish
    const openDeleteModal = (loadId) => {
        setDeleteLoadId(loadId);
    };

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                {loading ? (
                    Array(6).fill(0).map((_, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                            <div className="animate-pulse">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-3 md:mb-4">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    <span className="text-lg md:text-xl">{stat.icon}</span>
                                </div>
                                {stat.trend === 'same' ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-gray-600 bg-gray-50">
                                        0%
                                    </span>
                                ) : (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                        {stat.trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                                        {finalFormatPercentage(stat.trendValue, stat.trend)}
                                    </span>
                                )}
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                {stat.title === 'Umumiy Daromad' ? finalFormatCurrency(stat.value) : stat.value.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">{stat.title}</div>
                        </div>
                    ))
                )}
            </div>

            {/* Statistika diagrammasi */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">Statistika Ma'lumotlari</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                        >
                            <option value="line">Chiziqli diagramma</option>
                            <option value="bar">Ustun diagramma</option>
                            <option value="pie">Pai diagramma</option>
                        </select>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⟳</span>
                                    Yangilanmoqda...
                                </>
                            ) : (
                                <>
                                    <FaSyncAlt /> Yangilash
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="h-64 md:h-80 overflow-hidden">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [`${value}`, 'Qiymat']}
                                        labelFormatter={(label) => `Vaqt: ${label}`}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="Umumiy Yuklar" stroke="#8884d8" activeDot={{ r: 8 }} style={{ marginTop: "50px" }} />
                                    <Line type="monotone" dataKey="Yakunlangan" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="Jarayonda" stroke="#ffc658" />
                                    <Line type="monotone" dataKey="Kutilayotgan" stroke="#ff8042" />
                                </LineChart>
                            ) : chartType === 'bar' ? (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Umumiy Yuklar" fill="#8884d8" />
                                    <Bar dataKey="Yakunlangan" fill="#82ca9d" />
                                    <Bar dataKey="Jarayonda" fill="#ffc658" />
                                    <Bar dataKey="Kutilayotgan" fill="#ff8042" />
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Umumiy Yuklar', value: statsData?.freights || 0 },
                                            { name: 'Yakunlangan', value: statsData?.delivered || 0 },
                                            { name: 'Jarayonda', value: statsData?.delivering || 0 },
                                            { name: 'Kutilayotgan', value: statsData?.waiting || 0 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {[
                                            { name: 'Umumiy Yuklar', value: statsData?.freights || 0 },
                                            { name: 'Yakunlangan', value: statsData?.delivered || 0 },
                                            { name: 'Jarayonda', value: statsData?.delivering || 0 },
                                            { name: 'Kutilayotgan', value: statsData?.waiting || 0 },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <FaChartLine className="text-4xl mb-3 mx-auto" />
                            <div>Ma'lumotlar yuklanmoqda...</div>
                        </div>
                    )}
                </div>
            </div>

            {/* So'nggi Yuklar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">So'nggi Yuklar</h3>
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 w-full sm:w-auto"
                        onClick={() => navigateTo('loads')}
                    >
                        Barchasini ko'rish
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Yo'nalish</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Narx</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLoads.map((load, index) => {
                                const statusInfo = formatLoadStatus(load.status);
                                return (
                                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-900 font-medium">#{load.id}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {load.route_starts_where_data.city} → {load.route_ends_where_data.city}
                                        </td>
                                        <td className="p-4 text-sm text-gray-900 font-medium">
                                            {finalFormatCurrency(load.freight_rate_amount)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    onClick={() => openEditModal(load)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    onClick={() => openDeleteModal(load.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* So'nggi Tranzaksiyalar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">So'nggi Tranzaksiyalar</h3>
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 w-full sm:w-auto"
                        onClick={() => navigateTo('transactions')}
                    >
                        Barchasini ko'rish
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Miqdor</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Vaqt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((tx, index) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-900 font-medium">{tx.id}</td>
                                    <td className="p-4 text-sm text-gray-900 font-medium">
                                        {finalFormatCurrency(tx.amount)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'completed' ? 'text-green-600 bg-green-50' :
                                            tx.status === 'pending' ? 'text-yellow-600 bg-yellow-50' :
                                                'text-red-600 bg-red-50'
                                            }`}>
                                            {tx.status === 'completed' ? 'Muvaffaqiyatli' :
                                                tx.status === 'pending' ? 'Kutilmoqda' : 'Rad etilgan'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {formatTime(tx.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Yukni tahrirlash modali */}
            {editingLoad && (
                <div className="fixed z-9999 inset-0 bg-[rgb(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Yukni tahrirlash</h3>
                            <button
                                onClick={() => setEditingLoad(null)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const updatedData = {
                                    freight_rate_amount: formData.get('freight_rate_amount'),
                                    status: formData.get('status'),
                                    description_uz: formData.get('description_uz')
                                };
                                handleEditLoad(editingLoad.id, updatedData);
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Narx</label>
                                        <input
                                            type="number"
                                            name="freight_rate_amount"
                                            defaultValue={editingLoad.freight_rate_amount}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            name="status"
                                            defaultValue={formatLoadStatus(editingLoad.status).internal}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="waiting">Kutilmoqda</option>
                                            <option value="delivering">Jarayonda</option>
                                            <option value="delivered">Yakunlangan</option>
                                            <option value="cancelled">Bekor qilingan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Izoh (UZ)</label>
                                        <textarea
                                            name="description_uz"
                                            defaultValue={editingLoad.description_uz}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditingLoad(null)}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Saqlash
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Yukni o'chirish tasdiqlash modali */}
            {deleteLoadId && (
                <div className="fixed inset-0 bg-[rgb(0,0,0,0.8)] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-999 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Yukni o'chirish</h3>
                            <button
                                onClick={() => setDeleteLoadId(null)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Haqiqatan ham <strong>#{deleteLoadId}</strong> ID li yukni o'chirmoqchimisiz?
                                Bu harakatni qaytarib bo'lmaydi.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setDeleteLoadId(null)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    onClick={() => handleDeleteLoad(deleteLoadId)}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardPage;
