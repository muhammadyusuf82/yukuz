// components/pages/SupportPage.jsx
import React, { useState } from 'react';
import {
    FaHeadset, FaSearch, FaFilter, FaClock, FaCheck,
    FaTimes, FaUser, FaEnvelope, FaPhone, FaTicketAlt,
    FaExclamationCircle, FaComment, FaPaperPlane, FaStar
} from 'react-icons/fa';

const SupportPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const tickets = [
        {
            id: 'TICKET-1001',
            user: 'Akmal Karimov',
            email: 'akmal@example.com',
            subject: 'Yuk narxi haqida savol',
            message: 'Yuk narxi qanday hisoblanadi?',
            status: 'open',
            priority: 'high',
            createdAt: '2024-01-15 10:30',
            assignedTo: 'Admin',
            lastReply: '2024-01-15 11:15'
        },
        {
            id: 'TICKET-1002',
            user: 'John Doe',
            email: 'john@example.com',
            subject: 'To\'lov muammosi',
            message: 'To\'lov qaytarilmadi',
            status: 'in_progress',
            priority: 'high',
            createdAt: '2024-01-14 14:20',
            assignedTo: 'Support Team',
            lastReply: '2024-01-15 09:30'
        },
        {
            id: 'TICKET-1003',
            user: 'Ali Valiyev',
            email: 'ali@example.com',
            subject: 'Haydovchi tasdiqlash',
            message: 'Haydovchi tasdiqlash qancha vaqt oladi?',
            status: 'resolved',
            priority: 'medium',
            createdAt: '2024-01-13 11:10',
            assignedTo: 'Verification Team',
            lastReply: '2024-01-14 16:45'
        },
        {
            id: 'TICKET-1004',
            user: 'Sherzod Qodirov',
            email: 'sherzod@example.com',
            subject: 'Platforma taklifi',
            message: 'Yangi funksiyalar taklifi',
            status: 'closed',
            priority: 'low',
            createdAt: '2024-01-12 09:15',
            assignedTo: 'Product Team',
            lastReply: '2024-01-13 14:20'
        },
        {
            id: 'TICKET-1005',
            user: 'Nodir Sobirov',
            email: 'nodir@example.com',
            subject: 'Texnik muammo',
            message: 'Ilova ishlamayapti',
            status: 'open',
            priority: 'high',
            createdAt: '2024-01-15 08:45',
            assignedTo: 'Tech Support',
            lastReply: '2024-01-15 09:00'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-600';
            case 'in_progress': return 'bg-yellow-100 text-yellow-600';
            case 'resolved': return 'bg-green-100 text-green-600';
            case 'closed': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open': return 'Ochiq';
            case 'in_progress': return 'Jarayonda';
            case 'resolved': return 'Yechilgan';
            case 'closed': return 'Yopilgan';
            default: return 'Noma\'lum';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-600';
            case 'medium': return 'bg-yellow-100 text-yellow-600';
            case 'low': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'high': return 'Yuqori';
            case 'medium': return 'O\'rta';
            case 'low': return 'Past';
            default: return 'Noma\'lum';
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            ticket.status === statusFilter;

        const matchesPriority =
            priorityFilter === 'all' ||
            ticket.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Statistik ma'lumotlar
    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Qo'llab-quvvatlash</h2>
                <p className="text-gray-600">Mijozlar bilan muloqot va yordam so'rovlari</p>
            </div>

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FaTicketAlt className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Jami so'rovlar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <FaExclamationCircle className="text-red-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.open}</div>
                            <div className="text-sm text-gray-600">Ochiq so'rovlar</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <FaClock className="text-yellow-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                            <div className="text-sm text-gray-600">Jarayonda</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FaCheck className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.resolved}</div>
                            <div className="text-sm text-gray-600">Yechilgan</div>
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
                                placeholder="Ticket ID, mijoz yoki mavzu bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Barcha holatlar</option>
                            <option value="open">Ochiq</option>
                            <option value="in_progress">Jarayonda</option>
                            <option value="resolved">Yechilgan</option>
                            <option value="closed">Yopilgan</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Barcha ustuvorlik</option>
                            <option value="high">Yuqori</option>
                            <option value="medium">O'rta</option>
                            <option value="low">Past</option>
                        </select>

                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <FaPaperPlane /> Yangi javob
                        </button>
                    </div>
                </div>
            </div>

            {/* Ticketlar ro'yxati */}
            <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 md:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <FaHeadset className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{ticket.id}</h3>
                                        <p className="text-sm text-gray-600">{ticket.subject}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(ticket.status)}`}>
                                        {getStatusText(ticket.status)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                                        {getPriorityText(ticket.priority)}
                                    </span>
                                </div>
                            </div>

                            {/* Ma'lumotlar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaUser className="text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">{ticket.user}</div>
                                            <div className="text-sm text-gray-600">{ticket.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaClock className="text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">{ticket.createdAt}</div>
                                            <div className="text-sm text-gray-600">Yaratilgan</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaUser className="text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">{ticket.assignedTo}</div>
                                            <div className="text-sm text-gray-600">Mas'ul</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaComment className="text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-900">{ticket.lastReply}</div>
                                            <div className="text-sm text-gray-600">Oxirgi javob</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Xabar */}
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-gray-700">{ticket.message}</p>
                            </div>

                            {/* Harakatlar */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                {ticket.status !== 'closed' && ticket.status !== 'resolved' ? (
                                    <>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            <FaCheck /> Yechildi
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <FaComment /> Javob yozish
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <FaComment /> Ko'rish
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                            <FaStar /> Baholash
                                        </button>
                                    </>
                                )}
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    <FaTimes /> Yopish
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bo'sh holat */}
            {filteredTickets.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl">
                    <FaHeadset className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Ticketlar topilmadi</h3>
                    <p className="text-gray-500">Qidiruv shartlariga mos keladigan ticketlar yo'q</p>
                </div>
            )}

            {/* Statistika diagrammasi */}
            <div className="mt-8 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Qo'llab-quvvatlash statistikasi</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <FaHeadset className="text-4xl text-gray-300 mb-3 mx-auto" />
                        <div className="text-gray-400">Statistika diagrammasi</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
