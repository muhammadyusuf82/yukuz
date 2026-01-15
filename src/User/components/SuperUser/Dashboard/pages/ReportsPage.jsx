import React, { useState } from 'react';
import {
    FaUserTie, FaSearch, FaBox, FaPhone, FaEnvelope,
    FaMapMarkerAlt, FaBuilding, FaPlus, FaStar, FaSync, FaEdit
} from 'react-icons/fa';

const STATIC_SENDERS = [
    { id: 1, name: 'Aziz Karimov', company: 'Karimov Trade LLC', phone: '+998 90 123 45 67', email: 'aziz@trade.uz', totalLoads: 45, rating: 4.9, status: 'active', location: 'Toshkent', joinedDate: '2023-05-12' },
    { id: 2, name: 'Dilshod Sobirov', company: 'Sobirov Logistics', phone: '+998 93 555 22 11', email: 'info@sobirov.uz', totalLoads: 28, rating: 4.7, status: 'active', location: 'Samarqand', joinedDate: '2023-08-20' },
    { id: 3, name: 'Jasur Qodirov', company: 'Qodirov Transport', phone: '+998 99 888 77 66', email: 'jasur@qodirov.uz', totalLoads: 12, rating: 4.2, status: 'inactive', location: 'Buxoro', joinedDate: '2023-11-05' },
    { id: 4, name: 'Murod Nurmatov', company: 'Nurmatov Group', phone: '+998 97 444 33 22', email: 'murod@nurmatov.uz', totalLoads: 89, rating: 5.0, status: 'active', location: 'Andijon', joinedDate: '2023-01-15' },
];

const SendersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredSenders = STATIC_SENDERS.filter(sender => {
        const matchesSearch = sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sender.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'all' || sender.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Yuk Beruvchilar</h2>
                    <p className="text-gray-600">Platforma mijozlari ro'yxati</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md">
                    <FaPlus /> Yangi Beruvchi
                </button>
            </div>

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><FaUserTie size={20} /></div>
                    <div><div className="text-2xl font-bold text-gray-900">{STATIC_SENDERS.length}</div><div className="text-sm text-gray-500">Jami beruvchilar</div></div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><FaBox size={20} /></div>
                    <div><div className="text-2xl font-bold text-gray-900">174</div><div className="text-sm text-gray-500">Umumiy yuklar</div></div>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text" placeholder="Qidirish..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'inactive'].map(f => (
                        <button
                            key={f} onClick={() => setStatusFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {f === 'all' ? 'Hammasi' : f === 'active' ? 'Faol' : 'Nofaol'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSenders.map((sender) => (
                    <div key={sender.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{sender.name[0]}</div>
                                    <div><h3 className="font-bold text-gray-900">{sender.name}</h3><p className="text-xs text-gray-500">{sender.company}</p></div>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${sender.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {sender.status === 'active' ? 'Faol' : 'Nofaol'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600"><FaPhone className="text-blue-500" /> {sender.phone}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-600"><FaMapMarkerAlt className="text-red-500" /> {sender.location}</div>
                            <div className="flex justify-between pt-2 border-t border-gray-50">
                                <div className="text-center"><div className="text-lg font-bold text-blue-600">{sender.totalLoads}</div><div className="text-[10px] text-gray-400 uppercase">Yuklar</div></div>
                                <div className="text-center"><div className="text-lg font-bold text-yellow-500">{sender.rating}</div><div className="text-[10px] text-gray-400 uppercase">Reyting</div></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SendersPage;
