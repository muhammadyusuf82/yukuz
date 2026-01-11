// components/pages/WithdrawalsPage.jsx
import React, { useState } from 'react';
import {
    FaMoneyBillWave, FaSearch, FaFilter, FaCheck, FaTimes,
    FaClock, FaUser, FaWallet, FaCalendar, FaCreditCard,
    FaExclamationTriangle, FaPrint
} from 'react-icons/fa';

const WithdrawalsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const withdrawals = [
        {
            id: 'WDL-1001',
            user: 'John Doe',
            userType: 'driver',
            amount: '500,000 so\'m',
            method: 'Bank kartasi',
            account: '**** **** **** 1234',
            requestedDate: '2024-01-15',
            status: 'pending',
            notes: 'Haydovchi pul yechib olish so\'rovi'
        },
        {
            id: 'WDL-1002',
            user: 'Ali Valiyev',
            userType: 'driver',
            amount: '750,000 so\'m',
            method: 'Humo',
            account: '**** **** **** 5678',
            requestedDate: '2024-01-14',
            status: 'completed',
            completedDate: '2024-01-15',
            notes: 'Haydovchi pul yechib olish so\'rovi'
        },
        {
            id: 'WDL-1003',
            user: 'Kamoliddin Nurmatov',
            userType: 'sender',
            amount: '1,200,000 so\'m',
            method: 'Bank o\'tkazmasi',
            account: 'TBC Bank',
            requestedDate: '2024-01-13',
            status: 'cancelled',
            notes: 'Beruvchi pul yechib olish so\'rovi'
        },
        {
            id: 'WDL-1004',
            user: 'Doston Karimov',
            userType: 'driver',
            amount: '350,000 so\'m',
            method: 'Uzcard',
            account: '**** **** **** 9012',
            requestedDate: '2024-01-12',
            status: 'pending',
            notes: 'Haydovchi pul yechib olish so\'rovi'
        },
        {
            id: 'WDL-1005',
            user: 'Sherzod Qodirov',
            userType: 'sender',
            amount: '2,000,000 so\'m',
            method: 'Payme',
            account: '+998 93 345 67 89',
            requestedDate: '2024-01-11',
            status: 'completed',
            completedDate: '2024-01-12',
            notes: 'Beruvchi pul yechib olish so\'rovi'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-600';
            case 'processing': return 'bg-blue-100 text-blue-600';
            case 'completed': return 'bg-green-100 text-green-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Kutilmoqda';
            case 'processing': return 'Jarayonda';
            case 'completed': return 'Yakunlangan';
            case 'cancelled': return 'Rad etilgan';
            default: return 'Noma\'lum';
        }
    };

    const getUserTypeColor = (type) => {
        switch (type) {
            case 'driver': return 'bg-blue-100 text-blue-600';
            case 'sender': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getUserTypeText = (type) => {
        switch (type) {
            case 'driver': return 'Haydovchi';
            case 'sender': return 'Yuk Beruvchi';
            default: return 'Noma\'lum';
        }
    };

    const filteredWithdrawals = withdrawals.filter(withdrawal => {
        const matchesSearch =
            withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            withdrawal.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            withdrawal.account.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            statusFilter === 'all' ||
            withdrawal.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    // Statistik hisoblar
    const pendingAmount = withdrawals
        .filter(w => w.status === 'pending')
        .reduce((sum, w) => sum + parseInt(w.amount.replace(/[^0-9]/g, '')), 0);

    const completedAmount = withdrawals
        .filter(w => w.status === 'completed')
        .reduce((sum, w) => sum + parseInt(w.amount.replace(/[^0-9]/g, '')), 0);

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Yechib Olishlar</h2>
                <p className="text-gray-600">Platforma a'zolarining pul yechib olish so'rovlari</p>
            </div>

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FaMoneyBillWave className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{withdrawals.length}</div>
                            <div className="text-sm text-gray-600">Jami so'rovlar</div>
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
                                {pendingAmount.toLocaleString()} so'm
                            </div>
                            <div className="text-sm text-gray-600">Kutilayotgan</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <FaCheck className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {completedAmount.toLocaleString()} so'm
                            </div>
                            <div className="text-sm text-gray-600">Yakunlangan</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                            <FaTimes className="text-red-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {withdrawals.filter(w => w.status === 'cancelled').length}
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
                                placeholder="ID, mijoz yoki hisob raqami bo'yicha qidirish..."
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
                            onClick={() => setStatusFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Kutilmoqda
                        </button>
                        <button
                            onClick={() => setStatusFilter('completed')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Yakunlangan
                        </button>
                        <button
                            onClick={() => setStatusFilter('cancelled')}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${statusFilter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Rad etilgan
                        </button>
                    </div>
                </div>
            </div>

            {/* Yechib olish so'rovlari */}
            <div className="space-y-4">
                {filteredWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 md:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                                        <FaMoneyBillWave className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{withdrawal.id}</h3>
                                        <p className="text-sm text-gray-600">{withdrawal.notes}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(withdrawal.status)}`}>
                                        {getStatusText(withdrawal.status)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getUserTypeColor(withdrawal.userType)}`}>
                                        {getUserTypeText(withdrawal.userType)}
                                    </span>
                                </div>
                            </div>

                            {/* Ma'lumotlar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaUser className="text-gray-600" />
                                        <div className="font-medium text-gray-900">{withdrawal.user}</div>
                                    </div>
                                    <div className="text-sm text-gray-600">Mijoz</div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaWallet className="text-gray-600" />
                                        <div className="font-medium text-gray-900">{withdrawal.amount}</div>
                                    </div>
                                    <div className="text-sm text-gray-600">Miqdor</div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaCreditCard className="text-gray-600" />
                                        <div className="font-medium text-gray-900">{withdrawal.method}</div>
                                    </div>
                                    <div className="text-sm text-gray-600">Usul</div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaCalendar className="text-gray-600" />
                                        <div className="font-medium text-gray-900">{withdrawal.requestedDate}</div>
                                    </div>
                                    <div className="text-sm text-gray-600">So'ralgan sana</div>
                                </div>
                            </div>

                            {/* Hisob ma'lumotlari */}
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <FaExclamationTriangle className="text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Hisob ma'lumotlari</span>
                                </div>
                                <p className="text-blue-600">{withdrawal.account}</p>
                            </div>

                            {/* Harakatlar tugmalari */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                {withdrawal.status === 'pending' && (
                                    <>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            <FaCheck /> Tasdiqlash
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                            <FaTimes /> Rad etish
                                        </button>
                                    </>
                                )}
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <FaPrint /> Chek chiqarish
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                    <FaUser /> Mijoz ma'lumoti
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bo'sh holat */}
            {filteredWithdrawals.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <FaMoneyBillWave className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Yechib olish so'rovlari topilmadi</h3>
                    <p className="text-gray-500">Hozircha yangi yechib olish so'rovlari yo'q</p>
                </div>
            )}
        </div>
    );
};

export default WithdrawalsPage;
