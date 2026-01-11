// components/pages/LoadsPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaBox, FaSearch, FaFilter, FaEdit, FaTrash, FaEye,
    FaSyncAlt, FaDownload, FaChevronLeft, FaChevronRight,
    FaCheck, FaClock, FaTruck, FaTimes
} from 'react-icons/fa';

const LoadsPage = ({ showToast }) => {
    const [loads, setLoads] = useState([]);
    const [filteredLoads, setFilteredLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingLoad, setEditingLoad] = useState(null);
    const [deleteLoadId, setDeleteLoadId] = useState(null);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

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
                const token = data.token || data.access_token || data.access || data.accessToken || (data.data && data.data.token) || (data.data && data.data.access_token);
                if (token) {
                    localStorage.removeItem('access_token');
                    localStorage.setItem('access_token', token);
                    return token;
                }
            }
        } catch (error) {
            console.error('Token olishda xatolik:', error);
        }
        return null;
    };

    // Barcha yuklarni olish
    const fetchAllLoads = async () => {
        try {
            setLoading(true);

            let token = localStorage.getItem('access_token');
            if (!token) {
                token = await getAuthToken();
            }

            if (!token) {
                showToast('Token olishda xatolik', 'error');
                setLoading(false);
                return;
            }

            // API dan barcha yuklarni olish (limit yo'q, barchasini olish)
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Barcha yuklar:', data);

                // Agar data results ichida bo'lsa
                const loadsData = data.results || data;

                // Teskari tartibda (eng yangilari birinchi)
                setLoads(loadsData.reverse());
                setFilteredLoads(loadsData.reverse());
            } else {
                showToast('Yuklarni yuklashda xatolik', 'error');
            }
        } catch (error) {
            console.error('Yuklarni olishda xatolik:', error);
            showToast('Server bilan aloqa yo\'q', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Component mount bo'lganda yuklarni olish
    useEffect(() => {
        fetchAllLoads();
    }, []);

    // Filter va qidiruvni qo'llash
    useEffect(() => {
        let result = loads;

        // Status bo'yicha filter
        if (statusFilter !== 'all') {
            result = result.filter(load => {
                if (statusFilter === 'active') {
                    return load.status === 'active' || load.situation === 'FAOL';
                } else if (statusFilter === 'pending') {
                    return load.status === 'pending' || load.situation === 'KUTILMOQDA';
                } else if (statusFilter === 'completed') {
                    return load.status === 'completed' || load.situation === 'YAKUNLANDI' || load.is_shipped === true;
                } else if (statusFilter === 'cancelled') {
                    return load.status === 'cancelled' || load.situation === 'BEKOR_QILINGAN';
                }
                return true;
            });
        }

        // Qidiruv bo'yicha filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(load => {
                return (
                    (load.id && load.id.toString().toLowerCase().includes(term)) ||
                    (load.route_starts_where_city && load.route_starts_where_city.toLowerCase().includes(term)) ||
                    (load.route_ends_where_city && load.route_ends_where_city.toLowerCase().includes(term)) ||
                    (load.freight_type && load.freight_type.toLowerCase().includes(term))
                );
            });
        }

        // Saralash
        result.sort((a, b) => {
            let aValue, bValue;

            if (sortBy === 'created_at') {
                aValue = new Date(a.created_at || a.created_date || 0);
                bValue = new Date(b.created_at || b.created_date || 0);
            } else if (sortBy === 'price') {
                aValue = parseFloat(a.freight_rate_amount || a.price || 0);
                bValue = parseFloat(b.freight_rate_amount || b.price || 0);
            } else {
                aValue = a[sortBy] || '';
                bValue = b[sortBy] || '';
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredLoads(result);
        setCurrentPage(1); // Filter o'zgarganda 1-sahifaga qaytish
    }, [loads, statusFilter, searchTerm, sortBy, sortOrder]);

    // Pagination hisoblash
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLoads = filteredLoads.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLoads.length / itemsPerPage);

    // Yukni tahrirlash
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

            const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${loadId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                showToast('Yuk muvaffaqiyatli yangilandi', 'success');
                fetchAllLoads(); // Yangilangan ro'yxatni olish
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
                fetchAllLoads(); // Yangilangan ro'yxatni olish
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

    // Status rangini aniqlash
    const getStatusColor = (status, isShipped) => {
        if (isShipped === true) {
            return { text: 'Yakunlangan', color: 'text-green-600 bg-green-50' };
        }

        if (status === 'active' || status === 'FAOL') {
            return { text: 'Faol', color: 'text-blue-600 bg-blue-50' };
        } else if (status === 'pending' || status === 'KUTILMOQDA') {
            return { text: 'Kutilmoqda', color: 'text-yellow-600 bg-yellow-50' };
        } else if (status === 'completed' || status === 'YAKUNLANDI') {
            return { text: 'Yakunlangan', color: 'text-green-600 bg-green-50' };
        } else if (status === 'cancelled') {
            return { text: 'Bekor qilingan', color: 'text-red-600 bg-red-50' };
        } else {
            return { text: status || 'Noma\'lum', color: 'text-gray-600 bg-gray-50' };
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        if (!value) return '0 so\'m';

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

    // Vaqtni formatlash
    const formatDate = (dateString) => {
        if (!dateString) return 'Noma\'lum';

        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Sort qilish uchun funksiya
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // CSV export qilish
    const handleExportCSV = () => {
        const csvContent = [
            ['ID', 'Yo\'nalish', 'Yuk turi', 'Og\'irlik (kg)', 'Hajm (m³)', 'Narx', 'Status', 'Yaratilgan sana'],
            ...filteredLoads.map(load => [
                console.log(load),
                load.id,
                `${load.route_starts_where_data.city || 'N/A'} → ${load.route_ends_where_data.city || 'N/A'}`,
                load.freight_type || 'N/A',
                load.weight || '0',
                load.volume || '0',
                formatCurrency(load.freight_rate_amount || load.price),
                getStatusColor(load.status, load.is_shipped).text,
                formatDate(load.created_at)
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yuklar_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showToast('CSV fayl yuklab olindi', 'success');
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Barcha Yuklar</h2>
                <p className="text-gray-600">Platformadagi barcha yuklarni boshqarish</p>
            </div>

            {/* Filter va qidiruv paneli */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex-1 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ID, manzil yoki yuk turi bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Barcha statuslar</option>
                            <option value="active">Faol</option>
                            <option value="pending">Kutilmoqda</option>
                            <option value="completed">Yakunlangan</option>
                            <option value="cancelled">Bekor qilingan</option>
                        </select>

                        <button
                            onClick={fetchAllLoads}
                            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaSyncAlt /> Yangilash
                        </button>

                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FaDownload /> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Yuklar jadvali */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="p-4 text-left text-sm font-medium text-gray-700 cursor-pointer"
                                    onClick={() => handleSort('id')}
                                >
                                    <div className="flex items-center gap-1">
                                        ID
                                        {sortBy === 'id' && (
                                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Yo'nalish</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Yuk turi</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Og'irlik</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Narx</th>
                                <th
                                    className="p-4 text-left text-sm font-medium text-gray-700 cursor-pointer"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center gap-1">
                                        Sana
                                        {sortBy === 'created_at' && (
                                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-700">Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // Loading state
                                Array(5).fill(0).map((_, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td colSpan="8" className="p-4">
                                            <div className="animate-pulse space-y-3">
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                <div className="h-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : currentLoads.length === 0 ? (
                                <tr className="border-t border-gray-200">
                                    <td colSpan="8" className="p-8 text-center">
                                        <FaBox className="text-4xl text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">Yuklar topilmadi</p>
                                    </td>
                                </tr>
                            ) : (
                                currentLoads.map((load) => {
                                    const statusInfo = getStatusColor(load.status, load.is_shipped);

                                    return (
                                        <tr key={load.id} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="p-4 text-sm text-gray-900 font-medium">#{load.id}</td>
                                            <td className="p-4">
                                                <div className="text-sm text-gray-900 font-medium">
                                                    {load.route_starts_where_data.city || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500">→</div>
                                                <div className="text-sm text-gray-900 font-medium">
                                                    {load.route_ends_where_data.city || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {load.freight_type || 'N/A'}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {load.weight || 0} kg
                                            </td>
                                            <td className="p-4 text-sm text-gray-900 font-medium">
                                                {formatCurrency(load.freight_rate_amount || load.price)}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {formatDate(load.created_at)}
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
                                                        onClick={() => setEditingLoad(load)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        onClick={() => setDeleteLoadId(load.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {filteredLoads.length} ta yukdan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLoads.length)} tasi ko'rsatilmoqda
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Yukni tahrirlash modali */}
            {editingLoad && (
                <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center z-9999 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Yukni tahrirlash (#{editingLoad.id})</h3>
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
                                    freight_rate_amount: formData.get('price'),
                                    weight: formData.get('weight'),
                                    volume: formData.get('volume'),
                                    freight_type: formData.get('freight_type'),
                                    route_starts_where_lat: formData.get('from_city'),
                                    route_ends_where_lat: formData.get('to_city'),
                                    description: formData.get('description')
                                };
                                handleEditLoad(editingLoad.id, updatedData);
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Qayerdan</label>
                                        <input
                                            type="number"
                                            name="from_city"
                                            defaultValue={editingLoad.route_starts_where_lat || ''}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Qayerga</label>
                                        <input
                                            type="number"
                                            name="to_city"
                                            defaultValue={editingLoad.route_ends_where_lat || ''}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Narx (so'm)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            defaultValue={editingLoad.freight_rate_amount || editingLoad.price || 0}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Og'irlik (kg)</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            defaultValue={editingLoad.weight || 0}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Hajm (m³)</label>
                                        <input
                                            type="number"
                                            name="volume"
                                            defaultValue={editingLoad.volume || 0}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Yuk turi</label>
                                        <input
                                            type="text"
                                            name="freight_type"
                                            defaultValue={editingLoad.freight_type || ''}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Izoh</label>
                                    <textarea
                                        name="description"
                                        defaultValue={editingLoad.description || ''}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
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
                <div className="fixed inset-0 bg-[rgb(0,0,0,0.8)] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-9999 p-4">
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
        </div>
    );
};

export default LoadsPage;
