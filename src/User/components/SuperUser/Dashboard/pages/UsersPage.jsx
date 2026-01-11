import React, { useEffect, useState } from 'react';
import {
  FaPlus, FaDownload, FaEdit, FaTrash, FaSpinner,
  FaTimes, FaUserAlt, FaPhoneAlt, FaLock, FaEnvelope,
  FaUserTag, FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const baseUrl = 'https://tokennoty.pythonanywhere.com';

  // Form holati - Email qo'shildi
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '', // Yangi maydon
    role: 'driver',
    is_active: true,
  });

  // --- TOKEN OLISH ---
  const getAuthToken = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "admin",
          password: "123",
          phone_number: "+998993967336"
        }),
      });
      const data = await response.json();
      return data.token || data.access;
    } catch (error) {
      console.error('Token olishda xato:', error);
      return null;
    }
  };

  // --- GET USERS ---
  const fetchUsersData = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${baseUrl}/api/users-admin/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Yuklashda xato:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  // --- CREATE / UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getAuthToken();

    const url = isEditing
      ? `${baseUrl}/api/users-admin/${currentUser.id}/`
      : `${baseUrl}/api/users-admin/`;

    const method = isEditing ? 'PATCH' : 'POST';

    // API ga yuboriladigan ma'lumotlar
    const payload = { ...formData };
    if (isEditing && !payload.password) delete payload.password;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(isEditing ? "Muvaffaqiyatli yangilandi!" : "Yangi foydalanuvchi qo'shildi!");
        setModalOpen(false);
        fetchUsersData();
      } else {
        const errData = await response.json();
        alert("Xatolik: " + JSON.stringify(errData));
      }
    } catch (error) {
      alert("Server bilan aloqa xatosi!");
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) return;
    const token = await getAuthToken();
    try {
      const response = await fetch(`${baseUrl}/api/users-admin/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      username: '', password: '', first_name: '', last_name: '',
      phone_number: '', email: '', role: 'driver', is_active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData({
      username: user.username,
      password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      email: user.email || '',
      role: user.role || 'driver',
      is_active: user.is_active,
    });
    setModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Foydalanuvchilar</h1>
          <p className="text-slate-500 mt-1">Boshqaruv paneli orqali userlarni tahrirlash</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <FaDownload className="mr-2 text-slate-400" /> Eksport
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <FaPlus className="mr-2" /> Qo'shish
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center py-24">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-slate-400 font-medium">Ma'lumotlar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Foydalanuvchi</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontakt</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Roli</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center">
                        <div className="w-11 h-11 rounded-full bg-linear-to-tr from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-lg shadow-inner mr-4">
                          {user.first_name ? user.first_name[0] : 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{user.first_name} {user.last_name}</div>
                          <div className="text-xs text-slate-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-slate-700 font-medium">{user.phone_number}</div>
                      <div className="text-xs text-slate-400">{user.email || 'Email yo\'q'}</div>
                    </td>
                    <td className="p-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-tight shadow-sm ${user.role === 'driver' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-violet-50 text-violet-700 border border-violet-100'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button onClick={() => openEditModal(user)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><FaEdit /></button>
                      <button onClick={() => handleDelete(user.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CHIROYLI MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-999 flex items-center justify-center p-4">
          <div className="bg-white max-h-full rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto border border-white/20 transform transition-all">
            <div className="px-3 py-1 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  {isEditing ? "Tahrirlash" : "Yangi foydalanuvchi"}
                </h3>
                <p className="text-xs text-slate-400 font-bold">Barcha maydonlarni to'ldiring</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 hover:rotate-90 transition-all shadow-sm"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ism</label>
                  <input
                    type="text" required
                    placeholder="Masalan: Ali"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Familiya</label>
                  <input
                    type="text" required
                    placeholder="Masalan: Valiyev"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text" required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Elektron pochta (Email)</label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email" required
                    placeholder="user@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {!isEditing && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parol</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password" required={!isEditing}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                <div className="relative group">
                  <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text" required
                    placeholder="+998"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol</label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all text-sm font-bold text-slate-700"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="driver">Haydovchi</option>
                    <option value="client">Mijoz</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div
                  className={`mt-4 flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${formData.is_active ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                >
                  <span className="text-xs font-black uppercase">Status: {formData.is_active ? 'Faol' : 'Nofaol'}</span>
                  {formData.is_active ? <FaCheckCircle /> : <FaExclamationCircle />}
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm uppercase tracking-widest"
                >
                  Yopish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all text-sm uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95"
                >
                  {isEditing ? "Saqlash" : "Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
