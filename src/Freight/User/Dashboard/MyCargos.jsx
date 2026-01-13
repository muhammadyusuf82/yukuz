import React, { useEffect, useState, useMemo } from "react";
import {
  FaMapMarkerAlt, FaFlagCheckered, FaBox, FaClock,
  FaArrowUp, FaArrowDown, FaWallet, FaCheckCircle
} from "react-icons/fa";

const MyCargos = ({ onFreightDetail }) => {
  const baseUrl = 'https://tokennoty.pythonanywhere.com/api/freight/?owner__username='
  const token = localStorage.getItem('token')
  const [user, setUser] = useState()
  const [data, setData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const promise = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
          method: 'GET',
          headers: { 'Authorization': `Token ${token}` }
        })
        const res = await promise.json()
        setUser(res)
        const url = baseUrl + res.username;

        const get_freight = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Token ${token}` }
        })
        const response = await get_freight.json()
        setData(response)
      } catch (error) {
        console.log(error);
      }
    }
    loadData()
  }, [])

  // Statisika hisoblash qismi
  const statistics = useMemo(() => {
    const totalCount = data.length;
    const deliveredCount = data.filter(item => item.is_shipped === true).length;
    const inProgressCount = data.filter(item => item.status === "waiting for driver").length; // Sample status
    const totalEarnings = data.reduce((sum, item) => sum + parseFloat(item.freight_rate_amount || 0), 0);

    return {
      totalCount,
      deliveredCount,
      inProgressCount,
      totalEarnings,
      // Foizlar (Sample logic: hozircha static yoki o'sishni ko'rsatish uchun)
      percentTotal: 12,
      percentDelivered: 8,
      percentInProgress: -5,
      percentEarnings: 15
    };
  }, [data]);

  // Pulni qisqartirib chiqarish funksiyasi
  const formatMoney = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1).replace(/\.0$/, '') + ' mln';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1).replace(/\.0$/, '') + ' ming';
    }
    return amount;
  };

  const results = useMemo(() => [
    {
      id: 1,
      icon: FaBox,
      icon_color: '#4361ee',
      icon_bg: '#eceffd',
      benefit: statistics.percentTotal >= 0,
      percent: Math.abs(statistics.percentTotal),
      total: statistics.totalCount,
      title: "Umumiy yuklar"
    },
    {
      id: 2,
      icon: FaCheckCircle,
      icon_color: '#4cc9f0',
      icon_bg: '#edf9fd',
      benefit: statistics.percentDelivered >= 0,
      percent: Math.abs(statistics.percentDelivered),
      total: statistics.deliveredCount,
      title: "Yetkazilgan"
    },
    {
      id: 3,
      icon: FaClock,
      icon_color: '#ffcc02',
      icon_bg: '#fff9e6',
      benefit: statistics.percentInProgress >= 0,
      percent: Math.abs(statistics.percentInProgress),
      total: statistics.inProgressCount,
      title: "Jarayonda"
    },
    {
      id: 4,
      icon: FaWallet,
      icon_color: '#f72585',
      icon_bg: '#fee9f3',
      benefit: statistics.percentEarnings >= 0,
      percent: Math.abs(statistics.percentEarnings),
      total: formatMoney(statistics.totalEarnings),
      title: "Jami daromad"
    },
  ], [statistics]);

  const handleFreightDetailClick = (freightData) => {
    onFreightDetail('Batafsil', freightData.id, freightData);
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">

        {/* Statistika Cardlari */}
        <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-3 sm:py-4 md:py-5 lg:py-6">
          {results.map((item, index) => (
            <div key={index} className="bg-linear-to-br from-[#4361ee] to-[#7209b7] shadow-lg rounded-xl sm:rounded-2xl pt-1 transform hover:-translate-y-0.5 duration-300 overflow-hidden">
              <div className="w-full h-full bg-white p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{ background: item.icon_bg }}>
                    <item.icon className="text-lg sm:text-xl md:text-2xl" style={{ color: item.icon_color }} />
                  </div>
                  <p className='flex gap-1 items-center rounded-lg py-1 px-2 text-xs sm:text-sm' style={{
                    background: item.benefit === true ? '#edf9fd' : '#fee9f3',
                    color: item.benefit === true ? '#67d1f3' : '#f72585'
                  }}>
                    {item.benefit === true ? <FaArrowUp className='text-xs' /> : <FaArrowDown className='text-xs' />}
                    <span>{item.percent}%</span>
                  </p>
                </div>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mt-3 sm:mt-4'>{item.total}</h1>
                <h3 className='text-[10px] sm:text-xs md:text-sm text-[#6c757d] uppercase mt-1'>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Yuklar Ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 transition-all hover:shadow-2xl hover:scale-[1.02]">
              <div className="bg-blue-600 p-4 flex justify-between items-center">
                <span className="text-white font-black tracking-widest uppercase text-sm">ID: #{item.id}</span>
                <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-white text-xs font-bold capitalize">{item.status}</span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="flex flex-col items-center gap-1 z-10">
                    <FaMapMarkerAlt className="text-blue-600 text-xl" />
                    <div className="w-0.5 h-12 bg-dashed bg-blue-200"></div>
                    <FaFlagCheckered className="text-green-600 text-xl" />
                  </div>

                  <div className="flex flex-col gap-8">
                    <div>
                      <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">Yuklash manzili</p>
                      <p className="text-blue-900 font-semibold">{item.route_starts_where_data.region}</p>
                      <p className="text-blue-700 text-sm">{item.route_starts_where_data.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">Tushirish manzili</p>
                      <p className="text-blue-900 font-semibold">{item.route_ends_where_data.region}</p>
                      <p className="text-blue-700 text-sm">{item.route_ends_where_data.city}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-bold">{item.weight} kg</p>
                    <p className="text-blue-600 text-xs">Og'irlik</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-bold">{item.volume} m³</p>
                    <p className="text-blue-600 text-xs">Hajm</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-blue-600 text-2xl font-black mb-3">
                    {item.freight_rate_amount ? item.freight_rate_amount.split('.')[0] : '0'} soʻm
                  </p>
                  <button
                    onClick={() => handleFreightDetailClick(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Batafsil ko'rish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyCargos;
