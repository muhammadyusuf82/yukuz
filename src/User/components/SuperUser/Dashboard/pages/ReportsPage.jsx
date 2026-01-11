// components/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaChartBar, FaDownload, FaCalendar, FaFilter,
    FaFileExcel, FaFilePdf, FaPrint, FaChartLine,
    FaChartPie, FaTable, FaArrowUp, FaArrowDown,
    FaExclamationTriangle, FaSpinner, FaSyncAlt
} from 'react-icons/fa';

const ReportsPage = () => {
    const [reportType, setReportType] = useState('all');
    const [dateRange, setDateRange] = useState('month');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // API dan keladigan ma'lumotlar uchun state'lar
    const [reports, setReports] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [quarterlyReport, setQuarterlyReport] = useState([]);

    // API endpointlari
    const API_BASE_URL = 'https://tokennoty.pythonanywhere.com';

    // Token olish funksiyasi
    const getAuthToken = async () => {
        try {
            // LocalStorage dan token borligini tekshirish
            const storedToken = localStorage.getItem('access_token');
            if (storedToken) {
                return storedToken;
            }

            // Yangi token olish
            console.log('Token olish...');
            const response = await fetch(`${API_BASE_URL}/api/token/`, {
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

                // Turli xil token kalitlari uchun tekshirish
                const token = data.token || data.access_token || data.access;

                if (token) {
                    localStorage.setItem('access_token', token);
                    console.log('Token saqlandi:', token.substring(0, 20) + '...');
                    return token;
                } else {
                    console.error('Token topilmadi API javobida:', data);
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

    // Ma'lumotlarni yuklash
    const fetchData = async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        }
        setRefreshing(true);
        setError(null);

        const token = await getAuthToken();
        console.log('Fetched token:', token ? 'Mavjud' : 'Yo\'q');

        if (!token) {
            setError('Autentifikatsiya muvaffaqiyatsiz. Iltimos, qaytadan urinib ko\'ring.');
            setLoading(false);
            setRefreshing(false);

            // Demo ma'lumotlarni ko'rsatish
            setDemoData();
            return;
        }

        const headers = {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            console.log('Ma\'lumotlar yuklanmoqda...');

            // API endpointlarini tekshirish
            const endpoints = [
                { name: 'statistics', url: `${API_BASE_URL}/api/statistics/` },
                { name: 'reports', url: `${API_BASE_URL}/api/reports/` },
                { name: 'quarterly', url: `${API_BASE_URL}/api/quarterly/` }
            ];

            const results = {};

            // Har bir endpoint uchun alohida so'rov
            for (const endpoint of endpoints) {
                try {
                    console.log(`Fetching ${endpoint.name} from ${endpoint.url}`);
                    const response = await fetch(endpoint.url, { headers });

                    if (response.ok) {
                        const data = await response.json();
                        results[endpoint.name] = data;
                        console.log(`${endpoint.name} ma'lumotlari olingan:`, data.length || 'data');
                    } else {
                        console.warn(`${endpoint.name} endpoint 404 yoki xato:`, response.status);
                        results[endpoint.name] = null;
                    }
                } catch (err) {
                    console.warn(`${endpoint.name} endpoint xatosi:`, err);
                    results[endpoint.name] = null;
                }
            }

            // Ma'lumotlarni formatlash
            formatAndSetData(
                results.statistics,
                results.reports,
                results.quarterly
            );

        } catch (err) {
            console.error('Ma\'lumotlarni yuklashda xatolik:', err);
            setError('Ma\'lumotlarni yuklashda xatolik yuz berdi. Demo ma\'lumotlar ko\'rsatilmoqda.');

            // Agar API ishlamasa, demo ma'lumotlarni ko'rsatish
            setDemoData();
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // API ma'lumotlarini formatlash
    const formatAndSetData = (statsData, reportsData, quarterlyData) => {
        // Agar API ma'lumotlari bo'lsa, ulardan foydalanish
        if (statsData && Array.isArray(statsData) && statsData.length > 0) {
            console.log('Statistics API dan:', statsData);
            const formattedStats = statsData.map(stat => ({
                label: stat.label || stat.name || 'Ko\'rsatkich',
                value: stat.value || stat.amount || '0',
                change: stat.change || stat.percentage || '+0%',
                trend: (stat.change && stat.change.includes('-')) ? 'down' : 'up'
            }));
            setStatistics(formattedStats);
        } else {
            console.log('Statistics API bo\'sh, demo ma\'lumotlar ishlatilmoqda');
            setStatistics(getDemoStatistics());
        }

        // Reports ma'lumotlari
        if (reportsData && Array.isArray(reportsData) && reportsData.length > 0) {
            console.log('Reports API dan:', reportsData);
            const reportIcons = {
                financial: FaChartLine,
                finance: FaChartLine,
                loads: FaChartBar,
                shipments: FaChartBar,
                drivers: FaChartPie,
                customers: FaTable,
                clients: FaTable,
                payments: FaChartLine,
                growth: FaChartBar,
                default: FaChartBar
            };

            const reportColors = {
                financial: 'bg-blue-100 text-blue-600',
                finance: 'bg-blue-100 text-blue-600',
                loads: 'bg-green-100 text-green-600',
                shipments: 'bg-green-100 text-green-600',
                drivers: 'bg-purple-100 text-purple-600',
                customers: 'bg-yellow-100 text-yellow-600',
                clients: 'bg-yellow-100 text-yellow-600',
                payments: 'bg-red-100 text-red-600',
                growth: 'bg-indigo-100 text-indigo-600',
                default: 'bg-gray-100 text-gray-600'
            };

            const formattedReports = reportsData.map((report, index) => ({
                id: report.id || index + 1,
                title: report.title || report.name || 'Hisobot',
                type: report.type || report.category || 'default',
                period: report.period || report.date || `${new Date().getFullYear()} yil`,
                description: report.description || 'Tahliliy hisobot',
                icon: reportIcons[report.type] || reportIcons[report.category] || FaChartBar,
                color: reportColors[report.type] || reportColors[report.category] || 'bg-gray-100 text-gray-600',
                size: report.size || `${Math.floor(Math.random() * 20) + 1}.${Math.floor(Math.random() * 9)} MB`,
                format: report.format || 'PDF',
                url: report.url || report.file_url || null
            }));
            setReports(formattedReports);
        } else {
            console.log('Reports API bo\'sh, demo ma\'lumotlar ishlatilmoqda');
            setReports(getDemoReports());
        }

        // Quarterly report ma'lumotlari
        if (quarterlyData && Array.isArray(quarterlyData) && quarterlyData.length > 0) {
            console.log('Quarterly API dan:', quarterlyData);
            setQuarterlyReport(quarterlyData);
        } else {
            console.log('Quarterly API bo\'sh, demo ma\'lumotlar ishlatilmoqda');
            setQuarterlyReport(getDemoQuarterlyReport());
        }
    };

    // Demo ma'lumotlar
    const getDemoStatistics = () => [
        { label: 'Umumiy daromad', value: '124,500,000 so\'m', change: '+24.8%', trend: 'up' },
        { label: 'Yakunlangan yuklar', value: '942', change: '+8.3%', trend: 'up' },
        { label: 'Faol haydovchilar', value: '156', change: '+12.5%', trend: 'up' },
        { label: 'Yangi mijozlar', value: '284', change: '+15.2%', trend: 'up' },
        { label: 'O\'rtacha reyting', value: '4.7', change: '+0.3%', trend: 'up' },
        { label: 'Muvaffaqiyat darajasi', value: '94.2%', change: '+2.1%', trend: 'up' }
    ];

    const getDemoReports = () => [
        {
            id: 1,
            title: 'Moliya hisoboti',
            type: 'financial',
            period: '2024 Yanvar',
            description: 'Platformaning moliyaviy ko\'rsatkichlari',
            icon: FaChartLine,
            color: 'bg-blue-100 text-blue-600',
            size: '12.5 MB',
            format: 'PDF'
        },
        {
            id: 2,
            title: 'Yuklar statistikasi',
            type: 'loads',
            period: '2024 Yanvar',
            description: 'Yuklarning holati va tarqalishi',
            icon: FaChartBar,
            color: 'bg-green-100 text-green-600',
            size: '8.2 MB',
            format: 'Excel'
        },
        {
            id: 3,
            title: 'Haydovchilar faolligi',
            type: 'drivers',
            period: '2024 Yanvar',
            description: 'Haydovchilarning faollik darajasi',
            icon: FaChartPie,
            color: 'bg-purple-100 text-purple-600',
            size: '5.7 MB',
            format: 'PDF'
        },
        {
            id: 4,
            title: 'Mijozlar bazasi',
            type: 'customers',
            period: '2024 Yanvar',
            description: 'Mijozlar tahlili va ko\'rsatkichlari',
            icon: FaTable,
            color: 'bg-yellow-100 text-yellow-600',
            size: '15.3 MB',
            format: 'Excel'
        },
        {
            id: 5,
            title: 'To\'lovlar tahlili',
            type: 'payments',
            period: '2023 Dekabr',
            description: 'To\'lovlar va tranzaksiyalar statistikasi',
            icon: FaChartLine,
            color: 'bg-red-100 text-red-600',
            size: '9.8 MB',
            format: 'PDF'
        },
        {
            id: 6,
            title: 'Platforma o\'sishi',
            type: 'growth',
            period: '2023 Yillik',
            description: 'Platformaning o\'sish ko\'rsatkichlari',
            icon: FaChartBar,
            color: 'bg-indigo-100 text-indigo-600',
            size: '22.1 MB',
            format: 'PDF'
        }
    ];

    const getDemoQuarterlyReport = () => [
        { indicator: 'Umumiy daromad', q1: '28,450,000', q2: '31,200,000', q3: '35,750,000', q4: '38,100,000', change: '+34.1%', changeType: 'positive' },
        { indicator: 'Yakunlangan yuklar', q1: '210', q2: '245', q3: '268', q4: '219', change: '+4.3%', changeType: 'positive' },
        { indicator: 'Yangilangan haydovchilar', q1: '42', q2: '38', q3: '45', q4: '31', change: '-26.2%', changeType: 'negative' },
        { indicator: 'O\'rtacha reyting', q1: '4.5', q2: '4.6', q3: '4.7', q4: '4.8', change: '+6.7%', changeType: 'positive' }
    ];

    const setDemoData = () => {
        setStatistics(getDemoStatistics());
        setReports(getDemoReports());
        setQuarterlyReport(getDemoQuarterlyReport());
    };

    // Hisobotni yuklab olish
    const handleDownloadReport = async (reportId) => {
        const token = await getAuthToken();
        if (!token) {
            setError('Yuklab olish uchun autentifikatsiya kerak');
            return;
        }

        try {
            // Agar report url bo'lsa, shundan foydalanish
            const report = reports.find(r => r.id === reportId);
            if (report && report.url) {
                window.open(report.url, '_blank');
                return;
            }

            // Aks holda, download endpointiga murojaat qilish
            const response = await fetch(
                `${API_BASE_URL}/api/reports/${reportId}/download/`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${reportId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                // Agar download endpointi ishlamasa, foydalanuvchiga xabar
                setError('Yuklab olish funksiyasi hozircha mavjud emas. Iltimos, keyinroq urinib ko\'ring.');
            }
        } catch (err) {
            console.error('Download error:', err);
            setError('Hisobotni yuklab olishda xatolik. Internet aloqasini tekshiring.');
        }
    };

    // Komponent yuklanganda ma'lumotlarni olish
    useEffect(() => {
        fetchData();
    }, []);

    // Filter qilingan hisobotlar
    const filteredReports = reportType === 'all'
        ? reports
        : reports.filter(report => report.type === reportType);

    return (
        <div>
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Hisobotlar</h2>
                        <p className="text-gray-600">Platforma statistikasi va tahliliy hisobotlar</p>
                    </div>
                    <button
                        onClick={() => fetchData(false)}
                        disabled={refreshing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-blue-400"
                    >
                        <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Yuklanmoqda...' : 'Yangilash'}
                    </button>
                </div>
            </div>

            {/* Xatolik xabari */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-500" />
                    <div className="text-red-700">{error}</div>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-500 hover:text-red-700 text-lg"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Yuklash ko'rsatkichi */}
            {loading && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                    <FaSpinner className="animate-spin text-blue-500" />
                    <div className="text-blue-700">Ma'lumotlar yuklanmoqda...</div>
                </div>
            )}

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {statistics.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600">{stat.label}</div>
                            <span className={`text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.trend === 'up' ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter va qidiruv */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setReportType('all')}
                            className={`px-4 py-2 rounded-lg font-medium ${reportType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Barchasi
                        </button>
                        <button
                            onClick={() => setReportType('financial')}
                            className={`px-4 py-2 rounded-lg font-medium ${reportType === 'financial' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Moliya
                        </button>
                        <button
                            onClick={() => setReportType('loads')}
                            className={`px-4 py-2 rounded-lg font-medium ${reportType === 'loads' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Yuklar
                        </button>
                        <button
                            onClick={() => setReportType('drivers')}
                            className={`px-4 py-2 rounded-lg font-medium ${reportType === 'drivers' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Haydovchilar
                        </button>
                        <button
                            onClick={() => setReportType('customers')}
                            className={`px-4 py-2 rounded-lg font-medium ${reportType === 'customers' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Mijozlar
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="week">Oxirgi hafta</option>
                            <option value="month">Oxirgi oy</option>
                            <option value="quarter">Oxirgi chorak</option>
                            <option value="year">Oxirgi yil</option>
                            <option value="all">Barcha vaqt</option>
                        </select>

                        <div className="text-sm text-gray-500">
                            API: {API_BASE_URL}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hisobotlar ro'yxati */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                    <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${report.color}`}>
                                    <report.icon className="text-xl" />
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                    {report.format}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{report.description}</p>

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                <span className="flex items-center gap-1">
                                    <FaCalendar />
                                    {report.period}
                                </span>
                                <span>{report.size}</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownloadReport(report.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaDownload /> Yuklab olish
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <FaPrint />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Diagramma va grafiklar */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Yuklar oqimi</h3>
                        <span className="text-sm text-gray-600">Oylik statistika</span>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <FaChartLine className="text-4xl text-gray-300 mb-3 mx-auto" />
                            <div className="text-gray-400">Yuklar oqimi diagrammasi</div>
                            <div className="text-sm text-gray-500 mt-2">
                                API: /api/charts/loads-flow/
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Daromad tahlili</h3>
                        <span className="text-sm text-gray-600">Yo'nalishlar bo'yicha</span>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <FaChartPie className="text-4xl text-gray-300 mb-3 mx-auto" />
                            <div className="text-gray-400">Daromad tahlili diagrammasi</div>
                            <div className="text-sm text-gray-500 mt-2">
                                API: /api/charts/revenue-analysis/
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Choraklik hisobot */}
            <div className="mt-8 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Choraklik hisobot</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <FaFileExcel /> Excel
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                            <FaFilePdf /> PDF
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left text-sm font-medium text-gray-700">Ko'rsatkich</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-700">Q1</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-700">Q2</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-700">Q3</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-700">Q4</th>
                                <th className="p-3 text-left text-sm font-medium text-gray-700">O'zgarish</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quarterlyReport.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="p-3 text-sm text-gray-900">{item.indicator}</td>
                                    <td className="p-3 text-sm text-gray-600">{item.q1}</td>
                                    <td className="p-3 text-sm text-gray-600">{item.q2}</td>
                                    <td className="p-3 text-sm text-gray-600">{item.q3}</td>
                                    <td className="p-3 text-sm text-gray-600">{item.q4}</td>
                                    <td className={`p-3 text-sm font-semibold ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {item.change}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bo'sh holat */}
            {filteredReports.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <FaChartBar className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Hisobotlar topilmadi</h3>
                    <p className="text-gray-500">Tanlangan filter bo'yicha hisobotlar yo'q</p>
                </div>
            )}

            {/* API ma'lumotlari */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="font-semibold mb-2">API ma'lumotlari:</div>
                <div>Base URL: {API_BASE_URL}</div>
                <div>Token endpoint: /api/token/</div>
                <div>Hisobotlar: {reports.length} ta (API: {reports.some(r => r.url) ? 'Mavjud' : 'Demo'})</div>
                <div>Statistika: {statistics.length} ta (API: {statistics.length > 0 && statistics[0].label !== 'Umumiy daromad' ? 'Mavjud' : 'Demo'})</div>
            </div>
        </div>
    );
};

export default ReportsPage;
