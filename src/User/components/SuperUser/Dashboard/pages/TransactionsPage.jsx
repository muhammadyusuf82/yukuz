// components/pages/TransactionsPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaCreditCard, FaSearch, FaFilter, FaDownload, FaPrint,
    FaCheckCircle, FaTimesCircle, FaClock, FaExchangeAlt,
    FaUser, FaMoneyBillWave, FaCalendar, FaSpinner,
    FaMapMarkerAlt, FaTruck, FaBox, FaMoneyBill
} from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';

const TransactionsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formatlovchi funksiya - katta sonlarni qisqartirish
    const formatAmount = (amount) => {
        if (amount >= 1000000000) {
            return (amount / 1000000000).toFixed(1) + 'B';
        } else if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'K';
        } else {
            return amount.toString();
        }
    };

    // To'liq formatda ko'rsatish (alert yoki batafsil ko'rish uchun)
    const formatFullAmount = (amount) => {
        return amount.toLocaleString('uz-UZ');
    };

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

    // API dan ma'lumotlarni olish
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);

            // Token ni olish
            let token = localStorage.getItem('access_token');
            if (!token) {
                token = await getAuthToken();
            }

            if (!token) {
                throw new Error('Token olishda xatolik');
            }

            const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    // Tokenni yangilash
                    token = await getAuthToken();
                    if (token) {
                        // Qayta urinish
                        return fetchTransactions();
                    }
                }
                throw new Error(`HTTP xatosi! Status: ${response.status}`);
            }

            const data = await response.json();

            // API dan kelgan ma'lumotlarni formatlash
            const formattedData = data.map(item => {
                // To'lov miqdori
                const amount = parseFloat(item.freight_rate_amount) || 0;

                // Tranzaksiya ID
                const transactionId = item.id ? `TXN-${item.id}` : `FRT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

                // To'lov turi
                const transactionType = getTransactionType(item);

                // To'lov holati
                const transactionStatus = getTransactionStatus(item);

                // Foydalanuvchi nomi
                const userName = getTransactionUser(item);

                // Sana
                const transactionDate = formatDate(item.created_at);

                // Tavsif
                const description = getTransactionDescription(item);

                // Marshrut
                const route = `${item.route_starts_where_data.city || item.route_starts_where_region} → ${item.route_ends_where_data.city || item.route_ends_where_region}`;

                return {
                    id: transactionId,
                    originalId: item.id,
                    amount: amount,
                    amountValue: amount,
                    type: transactionType,
                    status: transactionStatus,
                    user: userName,
                    date: transactionDate,
                    description: description,
                    route: route,
                    weight: item.weight,
                    volume: item.volume,
                    freightType: item.freight_type,
                    paymentMethod: item.payment_method,
                    originalData: item
                };
            });

            setTransactions(formattedData);
            setError(null);
        } catch (err) {
            console.error('API xatosi:', err);
            setError('Ma\'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.');

            // Agar API bo'sh bo'lsa, demo ma'lumotlarni ko'rsatamiz
            if (transactions.length === 0) {
                setTransactions(getDemoData());
            }
        } finally {
            setLoading(false);
        }
    };

    // Tranzaksiya turini aniqlash
    const getTransactionType = (item) => {
        // Freight API asosan yuk to to'lovlari
        return 'payment';
    };

    // Tranzaksiya holatini aniqlash
    const getTransactionStatus = (item) => {
        const status = item.status?.toLowerCase();
        const statusMap = {
            'delivered': 'completed',
            'completed': 'completed',
            'paid': 'completed',
            'success': 'completed',
            'active': 'pending',
            'pending': 'pending',
            'in_progress': 'pending',
            'in_transit': 'pending',
            'cancelled': 'cancelled',
            'failed': 'cancelled',
            'rejected': 'cancelled'
        };

        return statusMap[status] || 'pending';
    };

    // Foydalanuvchi nomini olish
    const getTransactionUser = (item) => {
        if (item.owner_first_name && item.owner_last_name) {
            return `${item.owner_first_name} ${item.owner_last_name}`;
        }
        if (item.owner_username) {
            return item.owner_username;
        }
        return 'Noma\'lum foydalanuvchi';
    };

    // Sana formatlash
    const formatDate = (dateString) => {
        if (!dateString) return 'Noma\'lum sana';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // Tranzaksiya tavsifini olish
    const getTransactionDescription = (item) => {
        if (item.description_uz) return item.description_uz;
        if (item.description_ru) return item.description_ru;
        if (item.freight_type) return `${item.freight_type} yuk to'lovi`;

        return 'Yuk to\'lovi';
    };

    // Demo ma'lumotlar (API bo'sh bo'lsa)
    const getDemoData = () => {
        return [
            {
                id: 'TXN-1',
                amount: 1500000,
                amountValue: 1500000,
                type: 'payment',
                status: 'completed',
                user: 'admin',
                date: '2025-12-19 14:22',
                description: 'Construction materials yuk to\'lovi',
                route: 'Tashkent → Namangan',
                weight: 12000,
                volume: '45.50',
                freightType: 'Construction materials',
                paymentMethod: 'bank_transfer'
            },
            {
                id: 'TXN-2',
                amount: 5000000,
                amountValue: 5000000,
                type: 'payment',
                status: 'pending',
                user: 'Ali Valiyev',
                date: '2025-12-20 10:30',
                description: 'Mevalar yuk to\'lovi',
                route: 'Andijon → Tashkent',
                weight: 8000,
                volume: '32.00',
                freightType: 'Fruits',
                paymentMethod: 'cash'
            },
            {
                id: 'TXN-3',
                amount: 12000000,
                amountValue: 12000000,
                type: 'payment',
                status: 'completed',
                user: 'Sherzod Qodirov',
                date: '2025-12-18 16:45',
                description: 'Qurilish materiallari',
                route: 'Samarqand → Buxoro',
                weight: 25000,
                volume: '85.00',
                freightType: 'Construction materials',
                paymentMethod: 'bank_transfer'
            },
            {
                id: 'TXN-4',
                amount: 750000,
                amountValue: 750000,
                type: 'payment',
                status: 'completed',
                user: 'Nodir Sobirov',
                date: '2025-12-17 09:15',
                description: 'Oziq-ovqat mahsulotlari',
                route: 'Farg\'ona → Marg\'ilon',
                weight: 5000,
                volume: '18.00',
                freightType: 'Food products',
                paymentMethod: 'cash'
            },
            {
                id: 'TXN-5',
                amount: 3500000,
                amountValue: 3500000,
                type: 'payment',
                status: 'cancelled',
                user: 'John Doe',
                date: '2025-12-16 14:20',
                description: 'Elektronika',
                route: 'Tashkent → Navoiy',
                weight: 3000,
                volume: '12.50',
                freightType: 'Electronics',
                paymentMethod: 'card'
            }
        ];
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-600';
            case 'pending': return 'bg-yellow-100 text-yellow-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Yakunlangan';
            case 'pending': return 'Kutilmoqda';
            case 'cancelled': return 'Rad etilgan';
            default: return 'Noma\'lum';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'payment': return 'bg-blue-100 text-blue-600';
            case 'withdrawal': return 'bg-purple-100 text-purple-600';
            case 'refund': return 'bg-orange-100 text-orange-600';
            case 'commission': return 'bg-indigo-100 text-indigo-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'payment': return 'Yuk to\'lovi';
            case 'withdrawal': return 'Yechib olish';
            case 'refund': return 'Qaytarish';
            case 'commission': return 'Komissiya';
            default: return 'Noma\'lum';
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.route.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            transaction.status === statusFilter;

        const matchesType =
            typeFilter === 'all' ||
            transaction.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Statistik hisoblar
    const totalAmount = transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.amountValue || 0), 0);

    const pendingAmount = transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + (t.amountValue || 0), 0);

    // Ko'rish funksiyasi
    const handleView = (transaction) => {
        const details = `
Tranzaksiya ma'lumotlari:

ID: ${transaction.id}
Mijoz: ${transaction.user}
Miqdor: ${formatFullAmount(transaction.amount)} UZS (${formatAmount(transaction.amount)} UZS)
Turi: ${getTypeText(transaction.type)}
Holati: ${getStatusText(transaction.status)}
Sana: ${transaction.date}

Yuk ma'lumotlari:
Marshrut: ${transaction.route}
Yuk turi: ${transaction.freightType || 'Noma\'lum'}
Og'irligi: ${transaction.weight ? `${transaction.weight} kg` : 'Noma\'lum'}
Hajmi: ${transaction.volume || 'Noma\'lum'}
To'lov usuli: ${getPaymentMethodText(transaction.paymentMethod)}
Tavsif: ${transaction.description}
        `;

        alert(details);
    };

    // To'lov usulini o'zbek tilida ko'rsatish
    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'bank_transfer': return 'Bank orqali';
            case 'cash': return 'Naqd pul';
            case 'card': return 'Karta orqali';
            default: return method || 'Noma\'lum';
        }
    };

    // Export funksiyasi
    const handleExport = () => {
        // CSV formatida export qilish
        const csvContent = [
            ['ID', 'Mijoz', 'Miqdor (UZS)', 'Qisqa miqdor', 'Marshrut', 'Yuk turi', 'Holati', 'Sana'],
            ...filteredTransactions.map(t => [
                t.id,
                t.user,
                formatFullAmount(t.amount),
                `${formatAmount(t.amount)} UZS`,
                t.route,
                t.freightType,
                getStatusText(t.status),
                t.date
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `yuk_tolovlari_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Yuklash holatini ko'rsatish
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Yuk to'lovlari yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Yuk To'lovlari</h2>
                <p className="text-gray-600">Platformadagi barcha yuk to'lovlari va tranzaksiyalar</p>

                {/* Xato yoki ma'lumot yo'qligi */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                            <FaTimesCircle />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Yangilash tugmasi */}
                <button
                    onClick={fetchTransactions}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <FaSpinner className={loading ? 'animate-spin' : ''} />
                    Ro'yxatni yangilash
                </button>
            </div>

            {/* Statistik kartalar - qisqartirilgan formatda */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FaMoneyBillWave className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatAmount(totalAmount)} UZS
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="text-xs text-gray-500">
                                    ({formatFullAmount(totalAmount)} UZS)
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">Jami to'lovlar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <FaCheckCircle className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {transactions.filter(t => t.status === 'completed').length}
                            </div>
                            <div className="text-sm text-gray-600">Yakunlangan</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <FaClock className="text-yellow-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatAmount(pendingAmount)} UZS
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="text-xs text-gray-500">
                                    ({formatFullAmount(pendingAmount)} UZS)
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">Kutilayotgan</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                            <FaTimesCircle className="text-red-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {transactions.filter(t => t.status === 'cancelled').length}
                            </div>
                            <div className="text-sm text-gray-600">Rad etilgan</div>
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
                                placeholder="ID, mijoz, marshrut yoki yuk turi bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Barcha turlar</option>
                            <option value="payment">Yuk to'lovi</option>
                            <option value="withdrawal">Yechib olish</option>
                            <option value="refund">Qaytarish</option>
                            <option value="commission">Komissiya</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Barcha holatlar</option>
                            <option value="completed">Yakunlangan</option>
                            <option value="pending">Kutilmoqda</option>
                            <option value="cancelled">Rad etilgan</option>
                        </select>

                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaDownload /> Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Tranzaksiyalar jadvali - qisqartirilgan formatda */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Mijoz</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Marshrut</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Miqdor</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Holat</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Sana</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{transaction.id}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            <div className="flex items-center gap-1 mt-1">
                                                <FaBox className="text-gray-400 text-xs" />
                                                <span>{transaction.freightType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <FaUser className="text-blue-600 text-sm" />
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900 block">{transaction.user}</span>
                                                <span className="text-xs text-gray-500">{getPaymentMethodText(transaction.paymentMethod)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-red-500 text-sm" />
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{transaction.route}</div>
                                                <div className="text-xs text-gray-500">
                                                    {transaction.weight ? `${transaction.weight} kg` : ''} {transaction.volume ? `| ${transaction.volume} m³` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {formatAmount(transaction.amount)} UZS
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span className="text-xs">
                                                ({formatFullAmount(transaction.amount)} UZS)
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">{getTypeText(transaction.type)}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                                            {getStatusText(transaction.status)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {transaction.date}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleView(transaction)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Ko'rish"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => window.print()}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Chop etish"
                                            >
                                                <FaPrint />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Bo'sh holat */}
                {filteredTransactions.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <FaTruck className="text-4xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Yuk to'lovlari topilmadi</h3>
                        <p className="text-gray-500">Qidiruv shartlariga mos keladigan yuk to'lovlari yo'q</p>
                        <button
                            onClick={fetchTransactions}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Yangilash
                        </button>
                    </div>
                )}
            </div>

            {/* Qo'shimcha ma'lumotlar paneli */}
            {filteredTransactions.length > 0 && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistika</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaBox className="text-blue-600 text-xl" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
                                    <div className="text-sm text-gray-600">Jami yuklar</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaTruck className="text-green-600 text-xl" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {transactions.reduce((sum, t) => sum + (parseFloat(t.weight) || 0), 0).toLocaleString('uz-UZ')} kg
                                    </div>
                                    <div className="text-sm text-gray-600">Umumiy og'irlik</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaMoneyBill className="text-purple-600 text-xl" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {transactions.filter(t => t.status === 'completed').length}
                                    </div>
                                    <div className="text-sm text-gray-600">To'langan yuklar</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* O'rtacha to'lov */}
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FaMoneyBillWave className="text-gray-600 text-xl" />
                            <div>
                                <div className="text-lg font-semibold text-gray-900">
                                    O'rtacha to'lov: {formatAmount(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)} UZS
                                </div>
                                <div className="text-sm text-gray-600">
                                    ({formatFullAmount(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)} UZS)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
