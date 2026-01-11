// components/pages/PendingLoadsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  FaClock, FaSearch, FaFilter, FaEye, FaCheck,
  FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaWeightHanging, FaRulerCombined, FaCalendar,
  FaExclamationTriangle, FaSync
} from 'react-icons/fa';

const PendingLoadsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Priority ni danger maydonidan aniqlash
  const getPriorityFromDanger = (danger) => {
    switch (danger) {
      case '3': return 'high';
      case '2': return 'medium';
      case '1': return 'low';
      default: return 'medium';
    }
  };

  // API uchun token olish funksiyasi
  const fetchToken = async () => {
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
        })
      });

      if (!response.ok) {
        throw new Error('Token olishda xatolik');
      }

      const data = await response.json();
      return data.token; // Token qaytariladi
    } catch (error) {
      console.error('Token olishda xatolik:', error);
      throw error;
    }
  };

  // Yuklarni API dan olish funksiyasi
  const fetchLoads = async () => {
    try {
      setLoading(true);
      setError(null);

      // Token olish
      const token = await fetchToken();

      // Yuklarni olish
      const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Yuklarni olishda xatolik');
      }

      const data = await response.json();

      // API dan kelgan ma'lumotlarni formatlash
      const formattedLoads = data.map(item => ({
        id: item.id || `YUK-${item.load_number || '0000'}`,
        from: item.route_starts_where_data.city || item.route_starts_where_region || 'Noma\'lum',
        to: item.route_ends_where_data.city || item.route_ends_where_region || 'Noma\'lum',
        cargo: item.freight_type || 'Noma\'lum',
        weight: item.weight ? `${item.weight} kg` : 'Noma\'lum',
        volume: item.volume ? `${item.volume} m³` : 'Noma\'lum',
        price: item.freight_rate_amount ? `${parseFloat(item.freight_rate_amount).toLocaleString()} ${item.freight_rate_currency || 'so\'m'}` : 'Noma\'lum',
        customer: item.owner_username || 'Noma\'lum',
        phone: item.owner_username ? `+${item.owner_username}` : '+998 XX XXX XX XX',
        date: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : 'Noma\'lum',
        priority: getPriorityFromDanger(item.danger),
        status: item.status
      }));

      // Faqat kutilayotgan yuklarni (statusi "waiting for driver" bo'lganlarni) filter qilish
      const pendingLoads = formattedLoads.filter(load =>
        load.status === "waiting for driver"
      );

      setLoads(pendingLoads);
    } catch (error) {
      console.error('Yuklarni olishda xatolik:', error);
      setError('Yuklarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  // Component yuklanganda ma'lumotlarni olish
  useEffect(() => {
    fetchLoads();
  }, []);

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

  const filteredLoads = loads.filter(load => {
    const matchesSearch =
      load.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      load.priority === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Yukni qabul qilish funksiyasi (API ga so'rov yuborish kerak)
  const handleAcceptLoad = async (loadId) => {
    try {
      const token = await fetchToken();

      // Bu yerda yukni qabul qilish uchun API endpointiga so'rov yuboriladi
      // API endpointi haqida aniq ma'lumot bo'lsa, shunga mos ravishda o'zgartiring
      const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${loadId}/accept/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        alert('Yuk muvaffaqiyatli qabul qilindi');
        // Qabul qilingan yukni ro'yxatdan o'chirish
        setLoads(prevLoads => prevLoads.filter(load => load.id !== loadId));
      } else {
        throw new Error('Yukni qabul qilishda xatolik');
      }
    } catch (error) {
      console.error('Yukni qabul qilishda xatolik:', error);
      alert('Yukni qabul qilishda xatolik yuz berdi');
    }
  };

  // Yukni rad etish funksiyasi
  const handleRejectLoad = async (loadId) => {
    if (window.confirm('Haqiqatan ham ushbu yukni rad qilmoqchimisiz?')) {
      try {
        const token = await fetchToken();

        // Bu yerda yukni rad etish uchun API endpointiga so'rov yuboriladi
        const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${loadId}/reject/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          alert('Yuk muvaffaqiyatli rad qilindi');
          // Rad etilgan yukni ro'yxatdan o'chirish
          setLoads(prevLoads => prevLoads.filter(load => load.id !== loadId));
        } else {
          throw new Error('Yukni rad etishda xatolik');
        }
      } catch (error) {
        console.error('Yukni rad etishda xatolik:', error);
        alert('Yukni rad etishda xatolik yuz berdi');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <FaSync className="text-4xl text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Yuklar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <FaExclamationTriangle className="text-4xl text-red-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Xatolik yuz berdi</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchLoads}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kutilayotgan Yuklar</h2>
          <p className="text-gray-600">Hozircha haydovchi topilmagan yuklar</p>
        </div>
        <button
          onClick={fetchLoads}
          className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <FaSync /> Yangilash
        </button>
      </div>

      {/* Filter va qidiruv paneli */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Yuk ID, manzil yoki mijoz bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Hammasi
            </button>
            <button
              onClick={() => setSelectedFilter('high')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${selectedFilter === 'high' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Yuqori
            </button>
            <button
              onClick={() => setSelectedFilter('medium')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${selectedFilter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              O'rta
            </button>
            <button
              onClick={() => setSelectedFilter('low')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${selectedFilter === 'low' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Past
            </button>
          </div>
        </div>
      </div>

      {/* Yuklar ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoads.map((load) => (
          <div key={load.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Sarlavha qismi */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FaClock className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">YUK-{load.id}</h3>
                  <p className="text-sm text-gray-500">Kutilmoqda</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(load.priority)}`}>
                {getPriorityText(load.priority)}
              </span>
            </div>

            {/* Yo'nalish */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span className="font-medium">{load.from}</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  <span className="font-medium">{load.to}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">Yo'nalish</div>
            </div>

            {/* Yuk ma'lumotlari */}
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <FaWeightHanging className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium">{load.weight}</div>
                  <div className="text-xs text-gray-500">Og'irlik</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaRulerCombined className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium">{load.volume}</div>
                  <div className="text-xs text-gray-500">Hajm</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium">{load.date}</div>
                  <div className="text-xs text-gray-500">Sana</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">$</span>
                </div>
                <div>
                  <div className="text-sm font-medium">{load.price}</div>
                  <div className="text-xs text-gray-500">Narx</div>
                </div>
              </div>
            </div>

            {/* Mijoz ma'lumotlari */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{load.customer}</h4>
                  <p className="text-sm text-gray-600">{load.cargo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`tel:${load.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <FaPhone className="text-sm" />
                  <span className="text-sm">{load.phone}</span>
                </a>
              </div>
            </div>

            {/* Harakatlar tugmalari */}
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => handleAcceptLoad(load.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaCheck /> Qabul qilish
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <FaEye /> Ko'rish
              </button>
              <button
                onClick={() => handleRejectLoad(load.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bo'sh holat */}
      {filteredLoads.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <FaClock className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {loads.length === 0 ? 'Kutilayotgan yuklar mavjud emas' : 'Qidiruv bo\'yicha yuklar topilmadi'}
          </h3>
          <p className="text-gray-500">
            {loads.length === 0
              ? 'Hozircha barcha yuklar haydovchi topdi'
              : 'Boshqa filter yoki qidiruv so\'zini sinab ko\'ring'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingLoadsPage;
