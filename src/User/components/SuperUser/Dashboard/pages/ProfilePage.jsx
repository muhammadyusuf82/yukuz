import React from 'react';
import { FaCamera } from 'react-icons/fa';

const ProfilePage = () => {
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // showToast('Profil muvaffaqiyatli yangilandi', 'success');
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Profil Sozlamalari</h2>
        <p className="text-gray-600">Admin profil ma'lumotlari</p>
      </div>

      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <form onSubmit={handleSaveProfile}>
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              AS
            </div>
            <button type="button" className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center mx-auto">
              <FaCamera className="mr-2" /> Rasmni o'zgartirish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ism</label>
              <input
                type="text"
                defaultValue="Admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Familiya</label>
              <input
                type="text"
                defaultValue="Super"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Elektron pochta</label>
            <input
              type="email"
              defaultValue="admin@yuk.uz"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Parolni o'zgartirish</label>
            <input
              type="password"
              placeholder="Yangi parol"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <p className="text-sm text-gray-500 mt-2">Agar parolni o'zgartirmoqchi bo'lmasangiz, bo'sh qoldiring</p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button type="submit" className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow">
              Profilni yangilash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
