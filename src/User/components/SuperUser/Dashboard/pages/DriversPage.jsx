import React, { useState, useEffect } from 'react';
import {
    FaTruck, FaSearch, FaStar, FaPhone, FaEnvelope,
    FaMapMarkerAlt, FaIdCard, FaCheckCircle, FaTimesCircle,
    FaEdit, FaTrash, FaPlus, FaSync, FaExclamationTriangle, FaTimes, FaCalendarAlt
} from 'react-icons/fa';

const DriversPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, averageRating: 0, newMembers: 0 });

    // Modal va Form statelari
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', birth_date: '',
        username: '', phone_number: '', email: '',
        address: '', password: '', role: 'driver'
    });

    const fetchToken = async () => {
        try {
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: "admin", password: "123", phone_number: "+998993967336" })
            });
            const data = await response.json();
            return data.access || data.token;
        } catch (error) { throw error; }
    };

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const token = await fetchToken();
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/users-admin/', {
                headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            let usersArray = Array.isArray(data) ? data : (data.results || []);
            const driverUsers = usersArray.filter(user => user.role === 'driver');

            const formattedDrivers = driverUsers.map((driver) => ({
                id: driver.id,
                name: `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || driver.username,
                first_name: driver.first_name,
                last_name: driver.last_name,
                phone: driver.phone_number || '+998 XX XXX XX XX',
                email: driver.email || 'email@example.com',
                rating: 4.8,
                completedTrips: 124,
                status: driver.is_active ? 'active' : 'inactive',
                vehicle: 'MAN TGX',
                plateNumber: '01 A 777 AB',
                location: driver.address || 'Toshkent',
                birth_date: driver.birth_date,
                username: driver.username,
                address: driver.address
            }));

            setStats({
                total: formattedDrivers.length,
                active: formattedDrivers.filter(d => d.status === 'active').length,
                averageRating: 4.8,
                newMembers: 3
            });
            setDrivers(formattedDrivers);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchDrivers(); }, []);

    const handleOpenModal = (driver = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData({
                first_name: driver.first_name || '',
                last_name: driver.last_name || '',
                birth_date: driver.birth_date || '',
                username: driver.username || '',
                phone_number: driver.phone || '',
                email: driver.email || '',
                address: driver.address || '',
                password: '',
                role: 'driver'
            });
        } else {
            setEditingDriver(null);
            setFormData({
                first_name: '', last_name: '', birth_date: '',
                username: '', phone_number: '', email: '',
                address: '', password: '', role: 'driver'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await fetchToken();
            const url = editingDriver
                ? `https://tokennoty.pythonanywhere.com/api/users-admin/${editingDriver.id}/`
                : `https://tokennoty.pythonanywhere.com/api/users-admin/`;

            const method = editingDriver ? 'PATCH' : 'POST';

            // Edit paytida parolni yubormaslik (agar bo'sh bo'lsa)
            const payload = { ...formData };
            if (editingDriver && !payload.password) delete payload.password;

            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchDrivers();
            } else {
                const errData = await response.json();
                alert(JSON.stringify(errData));
            }
        } catch (err) { alert("Xatolik yuz berdi"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Haydovchini o'chirishni xohlaysizmi?")) return;
        try {
            const token = await fetchToken();
            await fetch(`https://tokennoty.pythonanywhere.com/api/users-admin/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` }
            });
            fetchDrivers();
        } catch (err) { alert("O'chirishda xatolik!"); }
    };

    const filteredDrivers = drivers.filter(d =>
        (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.phone.includes(searchTerm)) &&
        (statusFilter === 'all' || d.status === statusFilter)
    );

    if (loading && drivers.length === 0) return <div className="p-10 text-center"><FaSync className="animate-spin mx-auto text-blue-600 text-3xl" /></div>;

    return (
        <div className="p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Haydovchilar</h2>
                    <p className="text-gray-600">Platformadagi barcha haydovchilar</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchDrivers} className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm">
                        <FaSync className={loading ? "animate-spin" : ""} /> Yangilash
                    </button>
                    <button onClick={() => handleOpenModal()} className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md">
                        <FaPlus /> Haydovchi qo'shish
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-lg"><FaTruck /></div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div className="mt-4"><h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Jami haydovchilar</h3><p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p></div>
                </div>
                {/* Boshqa stats cardlar ham shu ko'rinishda */}
            </div>

            {/* Filter/Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Ism yoki telefon orqali qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
            </div>

            {/* Jadval */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Haydovchi</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Kontakt</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Mashina</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDrivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">{driver.name[0]}</div>
                                            <div><div className="font-semibold text-gray-900">{driver.name}</div><div className="text-xs text-gray-500">{driver.location}</div></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{driver.phone}</div><div className="text-xs text-gray-500">{driver.email}</div></td>
                                    <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{driver.vehicle}</div><div className="text-xs text-gray-500">{driver.plateNumber}</div></td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${driver.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{driver.status === 'active' ? 'Faol' : 'Nofaol'}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(driver)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
                                            <button onClick={() => handleDelete(driver.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">{editingDriver ? "Haydovchini tahrirlash" : "Yangi haydovchi qo'shish"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ism</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} required /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Familiya</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} required /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tug'ilgan sana</label><input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} required /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} required /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                                <div className="col-span-full"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Manzil</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required /></div>
                                <div className="col-span-full"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parol {editingDriver && "(O'zgartirish shart emas)"}</label><input type="password" placeholder="******" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editingDriver} /></div>
                            </div>
                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">Bekor qilish</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Saqlash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriversPage;
