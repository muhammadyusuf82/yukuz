import React, { useState, useEffect } from 'react';
import {
    FaUserTie, FaSearch, FaBox, FaPhone, FaEnvelope,
    FaMapMarkerAlt, FaBuilding, FaPlus, FaStar, FaSync, FaEdit, FaTrash, FaTimes, FaCube, FaTruckLoading
} from 'react-icons/fa';

const SendersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [senders, setSenders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form & Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSender, setEditingSender] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', birth_date: '',
        username: '', phone_number: '', email: '',
        address: '', password: '', role: 'shipper'
    });

    // Loads Modal states
    const [showLoads, setShowLoads] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userLoads, setUserLoads] = useState([]);
    const [loadsLoading, setLoadsLoading] = useState(false);

    const fetchToken = async () => {
        try {
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: "admin", password: "123", phone_number: "+998993967336" })
            });
            const data = await response.json();
            return data.access || data.token;
        } catch (e) { throw e; }
    };

    const fetchSenders = async () => {
        try {
            setLoading(true);
            const token = await fetchToken();
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/users-admin/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            const data = await response.json();
            const users = Array.isArray(data) ? data : (data.results || []);
            const shippers = users.filter(u => ['shipper', 'client'].includes(u.role));
            setSenders(shippers.map(s => ({
                id: s.id,
                name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.username,
                first_name: s.first_name, last_name: s.last_name,
                birth_date: s.birth_date,
                phone: s.phone_number, email: s.email,
                location: s.address, username: s.username
            })));
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const fetchUserLoads = async (user) => {
        setSelectedUser(user);
        setShowLoads(true);
        setLoadsLoading(true);
        try {
            const token = await fetchToken();
            const res = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/?owner__username=${user.username}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            const data = await res.json();
            setUserLoads(Array.isArray(data) ? data : (data.results || []));
        } catch (e) { console.error(e); } finally { setLoadsLoading(false); }
    };

    useEffect(() => { fetchSenders(); }, []);

    const handleOpenModal = (sender = null) => {
        if (sender) {
            setEditingSender(sender);
            setFormData({
                first_name: sender.first_name || '',
                last_name: sender.last_name || '',
                birth_date: sender.birth_date || '',
                username: sender.username || '',
                phone_number: sender.phone || '',
                email: sender.email || '',
                address: sender.location || '',
                password: '',
                role: 'shipper'
            });
        } else {
            setEditingSender(null);
            setFormData({
                first_name: '', last_name: '', birth_date: '',
                username: '', phone_number: '', email: '',
                address: '', password: '', role: 'shipper'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await fetchToken();
            const url = editingSender
                ? `https://tokennoty.pythonanywhere.com/api/users-admin/${editingSender.id}/`
                : `https://tokennoty.pythonanywhere.com/api/users-admin/`;

            const payload = { ...formData };
            if (editingSender && !payload.password) delete payload.password;

            const res = await fetch(url, {
                method: editingSender ? 'PATCH' : 'POST',
                headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) { setIsModalOpen(false); fetchSenders(); }
        } catch (e) { alert("Xatolik!"); }
    };

    const filtered = senders.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div><h2 className="text-2xl font-bold text-gray-900">Yuk Beruvchilar</h2><p className="text-gray-600">Platforma mijozlari boshqaruvi</p></div>
                <div className="flex gap-3">
                    <button onClick={fetchSenders} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"><FaSync className={loading ? "animate-spin" : ""} /></button>
                    <button onClick={() => handleOpenModal()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"><FaPlus /> Yuk beruvchi qo'shish</button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((sender) => (
                    <div key={sender.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                        <div className="p-6 bg-linear-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><FaUserTie size={80} /></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white text-xl font-bold border border-white/30">{sender.name[0]}</div>
                                <div><h3 className="text-white font-bold text-lg leading-tight">{sender.name}</h3><p className="text-blue-100 text-xs mt-1">@{sender.username}</p></div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 text-sm"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><FaPhone /></div> {sender.phone}</div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm"><div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500"><FaEnvelope /></div> {sender.email}</div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm"><div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500"><FaMapMarkerAlt /></div> {sender.location}</div>
                        </div>
                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex gap-2">
                            <button onClick={() => handleOpenModal(sender)} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"><FaEdit /> Tahrirlash</button>
                            <button onClick={() => fetchUserLoads(sender)} className="flex-1 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-sm font-bold text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-100 transition-all"><FaBox /> Yuklari</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Loads Modal */}
            {showLoads && (
                <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
                        <div className="px-6 py-5 border-b bg-gray-50/50 flex justify-between items-center">
                            <div><h3 className="text-xl font-bold text-gray-800">{selectedUser?.name}</h3><p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">E'lon qilingan barcha yuklar</p></div>
                            <button onClick={() => setShowLoads(false)} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"><FaTimes className="text-gray-400" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
                            {loadsLoading ? <div className="py-20 text-center"><FaSync className="animate-spin text-4xl text-blue-600 mx-auto" /><p className="mt-4 text-gray-500">Yuklar yuklanmoqda...</p></div> : (
                                <div className="grid gap-4">
                                    {userLoads.length > 0 ? userLoads.map(load => (
                                        <div key={load.id} className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-300 transition-all flex justify-between items-center shadow-sm">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FaTruckLoading size={24} /></div>
                                                <div><div className="text-lg font-bold text-gray-800">{load.freight_type || "Maxsus yuk"}</div><div className="text-sm text-gray-500 flex items-center gap-2 mt-1"><FaMapMarkerAlt className="text-blue-400" /> {load.origin} ➔ {load.destination}</div></div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-blue-600 font-bold text-xl">{load.price ? `${load.price} $` : 'Kelishiladi'}</div>
                                                <div className="text-[10px] font-black uppercase text-gray-400 mt-1 bg-gray-100 px-2 py-0.5 rounded-md inline-block">{load.weight} t / {load.volume} m³</div>
                                            </div>
                                        </div>
                                    )) : <div className="text-center py-20 text-gray-400"><FaCube className="mx-auto text-5xl mb-4 opacity-20" /><p className="text-lg">Bu foydalanuvchida hali yuklar mavjud emas</p></div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal (Senders) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">{editingSender ? "Ma'lumotlarni tahrirlash" : "Yangi yuk beruvchi qo'shish"}</h3>
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
                                <div className="col-span-full"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parol</label><input type="password" placeholder="******" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!editingSender} /></div>
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

export default SendersPage;
