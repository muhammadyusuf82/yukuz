// components/pages/LogsPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaHistory, FaSearch, FaEye, FaPlus, FaEdit, FaTrash,
    FaDatabase, FaDownload, FaChartPie, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

const LogsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- PAGINATION STATES ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Har bir sahifada 20 ta log

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // Token olish
                const tokenRes = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: "admin",
                        password: "123",
                        phone_number: "+998993967336"
                    })
                });
                const tokenData = await tokenRes.json();

                // Loglarni olish
                const logsRes = await fetch('https://tokennoty.pythonanywhere.com/api/audit-logs/', {
                    headers: {
                        'Authorization': `Token ${tokenData.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (logsRes.ok) {
                    const data = await logsRes.json();
                    setLogs(Array.isArray(data) ? data.reverse() : []);
                }
            } catch (err) {
                console.error("Logs fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Qidiruvdan so'ng filtrlangan ma'lumotlar
    const filteredLogs = logs.filter(log =>
        log.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- PAGINATION LOGIC ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Sahifa almashganda tepaga qaytarish
    };

    const getActionIcon = (action) => {
        switch (action.toLowerCase()) {
            case 'view': return <FaEye className="text-blue-500" />;
            case 'create': return <FaPlus className="text-green-500" />;
            case 'update': return <FaEdit className="text-yellow-500" />;
            case 'delete': return <FaTrash className="text-red-500" />;
            default: return <FaHistory className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header qismi (O'zgarishsiz) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <FaHistory className="text-blue-600" /> Tizim Loglari
                    </h1>
                    <p className="text-gray-600 mt-1">Jami {logs.length} ta harakat topildi</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:bg-gray-50">
                    <FaDownload /> Export CSV
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Table yoki action bo'yicha qidirish..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Qidirganda birinchi sahifaga qaytish
                        }}
                    />
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">ID</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Foydalanuvchi</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Harakat</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Jadval</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Holat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-left">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-20 font-bold text-blue-600">Yuklanmoqda...</td></tr>
                            ) : currentItems.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500">#{log.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">U</div>
                                            <span className="font-medium text-gray-900">User {log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getActionIcon(log.action)}
                                            <span className="capitalize font-medium text-gray-700">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 italic">{log.table}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase">Success</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION CONTROLS --- */}
                {!loading && totalPages > 1 && (
                    <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white">
                        <div className="text-sm text-gray-500 font-medium">
                            Sahifa <span className="text-blue-600 font-bold">{currentPage}</span> / {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'text-gray-300 border-gray-100' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                            >
                                <FaChevronLeft />
                            </button>

                            {/* Sahifa raqamlarini chiqarish (agar juda ko'p bo'lsa faqat bir qismini chiqarish mumkin) */}
                            <div className="hidden sm:flex gap-1">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Faqat joriy sahifa atrofidagilarni ko'rsatish (yoki hammasini ko'rsatish)
                                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => paginate(pageNum)}
                                                className={`w-10 h-10 rounded-lg border font-bold text-sm transition-all ${currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'text-gray-600 border-gray-200 hover:border-blue-400'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                    if (pageNum === currentPage - 3 || pageNum === currentPage + 3) return <span key={pageNum} className="px-2">...</span>;
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'text-gray-300 border-gray-100' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogsPage;
