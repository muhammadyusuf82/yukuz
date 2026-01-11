// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   // Main icons
//   FaTruckLoading,
//   FaTimes,
//   FaTachometerAlt,
//   FaBox,
//   FaClock,
//   FaTruck,
//   FaUsers,
//   FaUserTie,
//   FaUserCheck,
//   FaCreditCard,
//   FaMoneyBillWave,
//   FaChartBar,
//   FaCog,
//   FaHeadset,
//   FaHistory,
//   FaChevronRight,
//   FaBars,
//   FaBell,
//   FaEnvelope,
//   FaSearch,
//   FaArrowUp,
//   FaArrowDown,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaChartLine,
//   FaEdit,
//   FaTrash,
//   FaDownload,
//   FaPlus,
//   FaCamera,
//   FaCheck,
//   FaExclamationTriangle,
//   FaInfo,
//   // Additional icons
//   FaTruckMoving,
//   FaCogs,
//   FaWallet,
//   FaCheckDouble,
//   FaSort,
//   FaFilter,
//   FaUserCircle,
//   FaSignOutAlt,
//   FaSyncAlt
// } from 'react-icons/fa';

// const YukAdminPanel = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [currentPage, setCurrentPage] = useState('dashboard');
//   const [modals, setModals] = useState({
//     addUser: false,
//     editLoad: false,
//     confirm: false
//   });
//   const [toasts, setToasts] = useState([]);
//   const [statsData, setStatsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [previousStats, setPreviousStats] = useState(null);
//   const [statsHistory, setStatsHistory] = useState([]);
//   const [lastUpdateTime, setLastUpdateTime] = useState(null);
//   const [manualRefresh, setManualRefresh] = useState(false);

//   // Token olish funksiyasi
//   const getAuthToken = async () => {
//     try {
//       const response = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           password: "123",
//           phone_number: "+998993967336"
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Token API javobi:', data);
//         const token = data.token || data.access_token || data.access;
//         if (token) {
//           localStorage.removeItem('access_token');
//           localStorage.setItem('access_token', token);
//           return token;
//         }
//       } else {
//         const errorText = await response.text();
//         console.error('Token olishda xatolik:', response.status, errorText);
//       }
//     } catch (error) {
//       console.error('Token olishda tarmoq xatosi:', error);
//     }
//     return null;
//   };

//   // API dan statistik ma'lumotlarni olish
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);

//         // Token ni olish
//         let token = localStorage.getItem('access_token');
//         if (!token) {
//           token = await getAuthToken();
//         }

//         if (!token) {
//           showToast('Token olishda xatolik', 'error');
//           setLoading(false);
//           return;
//         }

//         console.log('Token mavjud, API ga so\'rov yuborilmoqda...');

//         // Token bilan so'rov yuborish
//         const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight-stats-all/', {
//           headers: {
//             'Authorization': `Token ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         console.log('API javobi:', response.status);

//         if (response.ok) {
//           const data = await response.json();
//           console.log('API dan kelgan ma\'lumotlar:', data);

//           // Tarixni saqlash
//           const newStats = {
//             ...data,
//             timestamp: new Date().toISOString()
//           };

//           // Oldingi ma'lumotlarni olish
//           const storedHistory = JSON.parse(localStorage.getItem('admin_stats_history')) || [];

//           // Yangi tarixni qo'shish (faqat 10 ta oxirgisini saqlash)
//           const updatedHistory = [...storedHistory, newStats].slice(-10);
//           localStorage.setItem('admin_stats_history', JSON.stringify(updatedHistory));
//           setStatsHistory(updatedHistory);

//           // Oldingi statistikani o'rnatish (agar tarixda kamida 2 ta ma'lumot bo'lsa)
//           if (updatedHistory.length >= 2) {
//             const prev = updatedHistory[updatedHistory.length - 2];
//             setPreviousStats(prev);
//           } else {
//             setPreviousStats(null);
//           }

//           setStatsData(data);
//         } else if (response.status === 403) {
//           showToast('Kirish ruxsati yo\'q. Token yangilanmoqda...', 'warning');

//           // Tokenni yangilashga urinish
//           const newToken = await getAuthToken();
//           if (newToken) {
//             // Yangi token bilan qayta urinish
//             setTimeout(() => fetchStats(), 1000);
//           } else {
//             showToast('Autentifikatsiya xatosi', 'error');
//           }
//         } else {
//           const errorText = await response.text();
//           console.error('API dan ma\'lumot olishda xatolik:', response.status, errorText);
//           showToast('Statistik ma\'lumotlarni yuklashda xatolik', 'error');
//         }
//       } catch (error) {
//         console.error('API dan ma\'lumot olishda xatolik:', error);
//         showToast('Server bilan aloqa yo\'q', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();

//     // Har 60 soniyada yangilash
//     const interval = setInterval(fetchStats, 60000);
//     return () => clearInterval(interval);
//   }, []);


//   // Foiz hisoblash funksiyasi - yaxshilangan
//   const calculatePercentage = (current, previous) => {
//     if (!previous || previous === 0) {
//       return current > 0 ? 100 : 0;
//     }

//     // Kichik o'zgarishlarni aniqlash
//     const change = ((current - previous) / previous) * 100;

//     // Agar o'zgarish juda kichik bo'lsa (< 0.1%), 0 deb hisoblash
//     if (Math.abs(change) < 0.1) {
//       return 0;
//     }

//     return Math.round(change * 10) / 10; // 1 o'nli xonagacha
//   };

//   // Statistika tendentsiyasini aniqlash
//   const getTrend = (current, previous, value) => {
//     if (!previous || previous === 0) {
//       return current > 0 ? 'up' : 'same';
//     }

//     const change = ((current - previous) / previous) * 100;

//     // Agar o'zgarish juda kichik bo'lsa (< 0.1%), "same" deb hisoblash
//     if (Math.abs(change) < 0.1) {
//       return 'same';
//     }

//     return current > previous ? 'up' : 'down';
//   };

//   // Stats data - API dan kelgan ma'lumotlar asosida
//   const stats = useMemo(() => {
//     if (!statsData) {
//       return [
//         {
//           title: 'Umumiy Yuklar',
//           value: 0,
//           icon: <FaBox />,
//           trend: 'up',
//           trendValue: 0,
//           color: 'text-blue-500 bg-blue-50'
//         },
//         {
//           title: 'Yakunlangan',
//           value: 0,
//           icon: <FaCheckDouble />,
//           trend: 'up',
//           trendValue: 0,
//           color: 'text-green-500 bg-green-50'
//         },
//         {
//           title: 'Jarayonda',
//           value: 0,
//           icon: <FaClock />,
//           trend: 'down',
//           trendValue: 0,
//           color: 'text-yellow-500 bg-yellow-50'
//         },
//         {
//           title: 'Kutilayotgan',
//           value: 0,
//           icon: <FaClock />,
//           trend: 'down',
//           trendValue: 0,
//           color: 'text-red-500 bg-red-50'
//         },
//         {
//           title: 'Foydalanuvchilar',
//           value: 0,
//           icon: <FaUsers />,
//           trend: 'up',
//           trendValue: 0,
//           color: 'text-indigo-500 bg-indigo-50'
//         },
//         {
//           title: 'Umumiy Daromad',
//           value: 0,
//           icon: <FaWallet />,
//           trend: 'up',
//           trendValue: 0,
//           color: 'text-purple-500 bg-purple-50'
//         },
//       ];
//     }

//     const prev = previousStats || {};

//     console.log('Oldingi ma\'lumotlar:', prev);
//     console.log('Joriy ma\'lumotlar:', statsData);

//     return [
//       {
//         title: 'Umumiy Yuklar',
//         value: statsData.freights || 0,
//         icon: <FaBox />,
//         trend: getTrend(statsData.freights || 0, prev.freights || 0),
//         trendValue: calculatePercentage(statsData.freights || 0, prev.freights || 0),
//         color: 'text-blue-500 bg-blue-50'
//       },
//       {
//         title: 'Yakunlangan',
//         value: statsData.delivered || 0,
//         icon: <FaCheckDouble />,
//         trend: getTrend(statsData.delivered || 0, prev.delivered || 0),
//         trendValue: calculatePercentage(statsData.delivered || 0, prev.delivered || 0),
//         color: 'text-green-500 bg-green-50'
//       },
//       {
//         title: 'Jarayonda',
//         value: statsData.delivering || 0,
//         icon: <FaClock />,
//         trend: getTrend(statsData.delivering || 0, prev.delivering || 0),
//         trendValue: calculatePercentage(statsData.delivering || 0, prev.delivering || 0),
//         color: 'text-yellow-500 bg-yellow-50'
//       },
//       {
//         title: 'Kutilayotgan',
//         value: statsData.waiting || 0,
//         icon: <FaClock />,
//         trend: getTrend(statsData.waiting || 0, prev.waiting || 0),
//         trendValue: calculatePercentage(statsData.waiting || 0, prev.waiting || 0),
//         color: 'text-red-500 bg-red-50'
//       },
//       {
//         title: 'Foydalanuvchilar',
//         value: statsData.users || 0,
//         icon: <FaUsers />,
//         trend: getTrend(statsData.users || 0, prev.users || 0),
//         trendValue: calculatePercentage(statsData.users || 0, prev.users || 0),
//         color: 'text-indigo-500 bg-indigo-50'
//       },
//       {
//         title: 'Umumiy Daromad',
//         value: statsData.profit || 0,
//         icon: <FaWallet />,
//         trend: getTrend(statsData.profit || 0, prev.profit || 0),
//         trendValue: calculatePercentage(statsData.profit || 0, prev.profit || 0),
//         color: 'text-purple-500 bg-purple-50'
//       },
//     ];
//   }, [statsData, previousStats]);

//   // Navigation items
//   const navItems = [
//     { id: 'dashboard', icon: <FaTachometerAlt />, label: 'Dashboard', section: 'Asosiy' },
//     {
//       id: 'loads',
//       icon: <FaBox />,
//       label: 'Barcha Yuklar',
//       badge: 12,
//       section: 'Yuk Boshqaruvi'
//     },
//     {
//       id: 'pending-loads',
//       icon: <FaClock />,
//       label: 'Kutilayotgan Yuklar',
//       badge: 3
//     },
//     {
//       id: 'active-loads',
//       icon: <FaTruckMoving />,
//       label: 'Faol Yuklar'
//     },
//     {
//       id: 'users',
//       icon: <FaUsers />,
//       label: 'Barcha Foydalanuvchilar',
//       section: 'Foydalanuvchilar'
//     },
//     {
//       id: 'drivers',
//       icon: <FaTruck />,
//       label: 'Haydovchilar'
//     },
//     {
//       id: 'senders',
//       icon: <FaUserTie />,
//       label: 'Yuk Beruvchilar'
//     },
//     {
//       id: 'verification',
//       icon: <FaUserCheck />,
//       label: 'Tasdiqlash',
//       badge: 5
//     },
//     {
//       id: 'transactions',
//       icon: <FaCreditCard />,
//       label: 'Tranzaksiyalar',
//       section: 'Moliya'
//     },
//     {
//       id: 'withdrawals',
//       icon: <FaMoneyBillWave />,
//       label: 'Yechib olishlar',
//       badge: 7
//     },
//     {
//       id: 'reports',
//       icon: <FaChartBar />,
//       label: 'Hisobotlar'
//     },
//     {
//       id: 'settings',
//       icon: <FaCog />,
//       label: 'Sozlamalar',
//       section: 'Platforma'
//     },
//     {
//       id: 'support',
//       icon: <FaHeadset />,
//       label: 'Qo\'llab-quvvatlash',
//       badge: 8
//     },
//     {
//       id: 'logs',
//       icon: <FaHistory />,
//       label: 'Audit Loglari'
//     },
//   ];

//   // Recent loads data
//   const recentLoads = [
//     {
//       id: '#YUK-2451',
//       route: 'Toshkent → Samarqand',
//       sender: { name: 'Akmal Karimov', avatar: 'AK' },
//       driver: { name: 'John Doe', avatar: 'JH' },
//       price: '850,000 so\'m',
//       status: 'active'
//     },
//     {
//       id: '#YUK-2450',
//       route: 'Farg\'ona → Toshkent',
//       sender: { name: 'Nodir Sobirov', avatar: 'NS' },
//       driver: { name: 'Ali Valiyev', avatar: 'AV' },
//       price: '1,200,000 so\'m',
//       status: 'pending'
//     },
//     {
//       id: '#YUK-2449',
//       route: 'Buxoro → Navoiy',
//       sender: { name: 'Sherzod Qodirov', avatar: 'SH' },
//       driver: null,
//       price: '2,500,000 so\'m',
//       status: 'pending'
//     }
//   ];

//   // Recent transactions
//   const recentTransactions = [
//     { id: '#TXN-7841', amount: '850,000 so\'m', type: 'Yuk to\'lovi', status: 'completed', time: '10:30 AM' },
//     { id: '#TXN-7840', amount: '1,200,000 so\'m', type: 'Yuk to\'lovi', status: 'pending', time: '09:15 AM' },
//     { id: '#TXN-7839', amount: '500,000 so\'m', type: 'Yechib olish', status: 'cancelled', time: 'Yesterday' },
//   ];

//   // Handle responsive sidebar
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setSidebarOpen(false);
//       } else {
//         setSidebarOpen(true);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Navigation functions
//   const navigateTo = (page) => {
//     setCurrentPage(page);
//     if (window.innerWidth < 1024) {
//       setSidebarOpen(false);
//     }
//   };

//   // Modal functions
//   const openModal = (modalName) => {
//     setModals(prev => ({ ...prev, [modalName]: true }));
//     document.body.style.overflow = 'hidden';
//   };

//   const closeModal = (modalName) => {
//     setModals(prev => ({ ...prev, [modalName]: false }));
//     document.body.style.overflow = 'auto';
//   };

//   // Toast functions
//   const showToast = (message, type = 'success') => {
//     const id = Date.now();
//     const newToast = {
//       id,
//       message,
//       type,
//       icon: type === 'success' ? <FaCheck /> :
//         type === 'error' ? <FaTimes /> :
//           type === 'warning' ? <FaExclamationTriangle /> :
//             <FaInfo />
//     };
//     setToasts(prev => [...prev, newToast]);

//     setTimeout(() => {
//       setToasts(prev => prev.filter(toast => toast.id !== id));
//     }, 5000);
//   };

//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   // Action functions
//   const handleEditLoad = (loadId) => {
//     showToast(`Yuk #${loadId} tahrirlanmoqda...`, 'info');
//     setTimeout(() => openModal('editLoad'), 500);
//   };

//   const handleDeleteLoad = (loadId) => {
//     openModal('confirm');
//   };

//   const handleAddUser = (e) => {
//     e.preventDefault();
//     closeModal('addUser');
//     showToast('Yangi foydalanuvchi muvaffaqiyatli qo\'shildi', 'success');
//   };

//   const handleSaveSettings = (e) => {
//     e.preventDefault();
//     showToast('Sozlamalar muvaffaqiyatli saqlandi', 'success');
//   };

//   const handleSaveProfile = (e) => {
//     e.preventDefault();
//     showToast('Profil muvaffaqiyatli yangilandi', 'success');
//   };

//   // Format currency
//   const formatCurrency = (value) => {
//     const num = typeof value === 'string' ? parseFloat(value) : value;
//     if (isNaN(num)) return '0 so\'m';

//     if (num >= 1000000) {
//       const million = num / 1000000;
//       return `${million.toFixed(1)}M so'm`;
//     }

//     if (num >= 1000) {
//       const thousand = num / 1000;
//       return `${thousand.toFixed(1)}K so'm`;
//     }

//     const roundedValue = Math.round(num);
//     return new Intl.NumberFormat('uz-UZ').format(roundedValue) + ' so\'m';
//   };

//   // Foiz ko'rsatgichini formatlash
//   const formatPercentage = (value, trend) => {
//     if (trend === 'same') return '0%';
//     if (trend === 'up') return `+${value}%`;
//     return `${value}%`;
//   };

//   // Yangilash funksiyasi
//   const handleRefresh = async () => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);

//         let token = localStorage.getItem('access_token');
//         if (!token) {
//           token = await getAuthToken();
//         }

//         if (!token) {
//           showToast('Token olishda xatolik', 'error');
//           setLoading(false);
//           return;
//         }

//         const response = await fetch('https://https://tokennoty.pythonanywhere.com/api/freight-stats-all/', {
//           headers: {
//             'Authorization': `Token ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (response.ok) {
//           const data = await response.json();
//           showToast('Ma\'lumotlar yangilandi', 'success');

//           // Tarixni yangilash
//           const newStats = {
//             ...data,
//             timestamp: new Date().toISOString()
//           };

//           const storedHistory = JSON.parse(localStorage.getItem('admin_stats_history')) || [];
//           const updatedHistory = [...storedHistory, newStats].slice(-10);
//           localStorage.setItem('admin_stats_history', JSON.stringify(updatedHistory));
//           setStatsHistory(updatedHistory);

//           if (updatedHistory.length >= 2) {
//             const prev = updatedHistory[updatedHistory.length - 2];
//             setPreviousStats(prev);
//           }

//           setStatsData(data);
//         } else {
//           showToast('Yangilashda xatolik', 'error');
//         }
//       } catch (error) {
//         showToast('Server bilan aloqa yo\'q', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   };


//   // Render current page
//   const renderPage = () => {
//     switch (currentPage) {
//       case 'dashboard':
//         return (
//           <>
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
//               {loading ? (
//                 // Loading state
//                 Array(6).fill(0).map((_, index) => (
//                   <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
//                     <div className="animate-pulse">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
//                         <div className="h-6 w-16 bg-gray-200 rounded"></div>
//                       </div>
//                       <div className="h-8 bg-gray-200 rounded mb-2"></div>
//                       <div className="h-4 bg-gray-200 rounded"></div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 stats.map((stat, index) => (
//                   <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
//                     <div className="flex items-center justify-between mb-3 md:mb-4">
//                       <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
//                         <span className="text-lg md:text-xl">{stat.icon}</span>
//                       </div>
//                       {stat.trend === 'same' ? (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-gray-600 bg-gray-50">
//                           0%
//                         </span>
//                       ) : (
//                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
//                           {stat.trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
//                           {formatPercentage(stat.trendValue, stat.trend)}
//                         </span>
//                       )}
//                     </div>
//                     <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
//                       {stat.title === 'Umumiy Daromad' ? formatCurrency(stat.value) : stat.value.toLocaleString()}
//                     </div>
//                     <div className="text-sm text-gray-600">{stat.title}</div>
//                     {previousStats && (
//                       <div className="text-xs text-gray-400 mt-2">
//                         Oldingi: {stat.title === 'Umumiy Daromad' ?
//                           formatCurrency(previousStats[stat.title === 'Umumiy Yuklar' ? 'freights' :
//                             stat.title === 'Yakunlangan' ? 'delivered' :
//                               stat.title === 'Jarayonda' ? 'delivering' :
//                                 stat.title === 'Kutilayotgan' ? 'waiting' :
//                                   stat.title === 'Foydalanuvchilar' ? 'users' : 'profit']) :
//                           (previousStats[stat.title === 'Umumiy Yuklar' ? 'freights' :
//                             stat.title === 'Yakunlangan' ? 'delivered' :
//                               stat.title === 'Jarayonda' ? 'delivering' :
//                                 stat.title === 'Kutilayotgan' ? 'waiting' :
//                                   stat.title === 'Foydalanuvchilar' ? 'users' : 0] || 0).toLocaleString()}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Yangilash va qo'shimcha ma'lumotlar */}
//             <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Statistika Ma'lumotlari</h3>
//                   <p className="text-sm text-gray-600">
//                     Oxirgi yangilanish: {statsData && new Date().toLocaleTimeString('uz-UZ')}
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleRefresh}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="animate-spin">⟳</span>
//                         Yangilanmoqda...
//                       </>
//                     ) : (
//                       <>
//                         <FaSyncAlt /> Yangilash
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={() => {
//                       localStorage.removeItem('admin_stats_history');
//                       setStatsHistory([]);
//                       setPreviousStats(null);
//                       showToast('Tarix tozalandi', 'success');
//                     }}
//                     className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     <FaTrash /> Tarixni tozalash
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Yangilash tugmasi */}
//             {/* <div className="mb-6">
//               <button
//                 onClick={() => window.location.reload()}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <FaSyncAlt /> Ma'lumotlarni yangilash
//               </button>
//             </div> */}

//             {/* Chart */}
//             <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Oylik Statistika</h3>
//                 <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
//                   <option>Oxirgi 30 kun</option>
//                   <option>Oxirgi 90 kun</option>
//                   <option>Oxirgi 6 oy</option>
//                   <option>Oxirgi 1 yil</option>
//                 </select>
//               </div>
//               <div className="h-64 md:h-72 bg-gray-50 rounded-lg flex items-center justify-center">
//                 <div className="text-center text-gray-400">
//                   <FaChartLine className="text-4xl mb-3 mx-auto" />
//                   <div>Chart.js grafikasi</div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Tables */}
//             <div className="grid grid-cols-1 gap-4 md:gap-6">
//               {/* Recent Loads */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   <h3 className="text-lg font-semibold text-gray-900">So'nggi Yuklar</h3>
//                   <button
//                     type="submit"
//                     className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
//                   >
//                     Qo'shish
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">ID</th>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">Yo'nalish</th>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">Narx</th>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">Harakatlar</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {recentLoads.map((load, index) => (
//                         <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
//                           <td className="p-4 text-sm text-gray-900 font-medium">{load.id}</td>
//                           <td className="p-4 text-sm text-gray-600">{load.route}</td>
//                           <td className="p-4 text-sm text-gray-900 font-medium">{load.price}</td>
//                           <td className="p-4">
//                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${load.status === 'active' ? 'text-green-600 bg-green-50' :
//                               load.status === 'pending' ? 'text-yellow-600 bg-yellow-50' :
//                                 'text-gray-600 bg-gray-50'
//                               }`}>
//                               {load.status === 'active' ? 'Faol' : 'Kutilmoqda'}
//                             </span>
//                           </td>
//                           <td className="p-4">
//                             <div className="flex space-x-2">
//                               <button
//                                 className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               // onClick={() => handleEditLoad(load.id.slice(1))}
//                               >
//                                 <FaEdit />
//                               </button>
//                               <button
//                                 className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                 onClick={() => handleDeleteLoad(load.id.slice(1))}
//                               >
//                                 <FaTrash />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Recent Transactions */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   <h3 className="text-lg font-semibold text-gray-900">So'nggi Tranzaksiyalar</h3>
//                   <button
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 w-full sm:w-auto"
//                     onClick={() => navigateTo('transactions')}
//                   >
//                     Barchasini ko'rish
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">ID</th>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">Miqdor</th>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
//                         <th className="p-4 text-left text-sm font-medium text-gray-700">Vaqt</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {recentTransactions.map((tx, index) => (
//                         <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
//                           <td className="p-4 text-sm text-gray-900 font-medium">{tx.id}</td>
//                           <td className="p-4 text-sm text-gray-900 font-medium">{tx.amount}</td>
//                           <td className="p-4">
//                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'completed' ? 'text-green-600 bg-green-50' :
//                               tx.status === 'pending' ? 'text-yellow-600 bg-yellow-50' :
//                                 'text-red-600 bg-red-50'
//                               }`}>
//                               {tx.status === 'completed' ? 'Muvaffaqiyatli' :
//                                 tx.status === 'pending' ? 'Kutilmoqda' : 'Rad etilgan'}
//                             </span>
//                           </td>
//                           <td className="p-4 text-sm text-gray-600">{tx.time}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </>
//         );

//       case 'users':
//         return (
//           <div>
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Foydalanuvchilar Boshqaruvi</h2>
//                 <p className="text-gray-600">Barcha foydalanuvchilarni boshqarish</p>
//               </div>
//               <button
//                 className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center"
//                 onClick={() => openModal('addUser')}
//               >
//                 <FaPlus className="mr-2" /> Yangi Foydalanuvchi
//               </button>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Barcha Foydalanuvchilar</h3>
//                 <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center">
//                   <FaDownload className="mr-2" /> Export
//                 </button>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="p-4 text-left text-sm font-medium text-gray-700">Foydalanuvchi</th>
//                       <th className="p-4 text-left text-sm font-medium text-gray-700">Telefon</th>
//                       <th className="p-4 text-left text-sm font-medium text-gray-700">Rol</th>
//                       <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
//                       <th className="p-4 text-left text-sm font-medium text-gray-700">Harakatlar</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr className="border-t border-gray-200 hover:bg-gray-50">
//                       <td className="p-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                             AK
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900">Akmal Karimov</div>
//                             <div className="text-sm text-gray-500">akmal@example.com</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4 text-sm text-gray-600">+998 90 123 45 67</td>
//                       <td className="p-4">
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-green-600 bg-green-50">
//                           Yuk Beruvchi
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-green-600 bg-green-50">
//                           Faol
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex space-x-2">
//                           <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                             <FaEdit />
//                           </button>
//                           <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         );

//       case 'settings':
//         return (
//           <div>
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900">Sozlamalar</h2>
//               <p className="text-gray-600">Platforma sozlamalarini boshqarish</p>
//             </div>

//             <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">Umumiy Sozlamalar</h3>
//                 <p className="text-gray-600">Platformaning asosiy sozlamalari</p>
//               </div>

//               <form onSubmit={handleSaveSettings}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Platforma Nomi</label>
//                     <input
//                       type="text"
//                       defaultValue="Yuk.uz"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Platforma Valyutasi</label>
//                     <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
//                       <option value="UZS">So'm (UZS)</option>
//                       <option value="USD">USD</option>
//                       <option value="EUR">EUR</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Platforma Komissiyasi (%)</label>
//                   <input
//                     type="number"
//                     defaultValue="5"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                     min="0"
//                     max="50"
//                     step="0.1"
//                     required
//                   />
//                   <p className="text-sm text-gray-500 mt-2">Yuk narxidan olinadigan foiz</p>
//                 </div>

//                 <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
//                   <button type="button" className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
//                     Bekor qilish
//                   </button>
//                   <button type="submit" className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow">
//                     Saqlash
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         );

//       case 'profile':
//         return (
//           <div>
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900">Profil Sozlamalari</h2>
//               <p className="text-gray-600">Admin profil ma'lumotlari</p>
//             </div>

//             <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
//               <form onSubmit={handleSaveProfile}>
//                 <div className="text-center mb-8">
//                   <div className="w-24 h-24 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
//                     AS
//                   </div>
//                   <button type="button" className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center mx-auto">
//                     <FaCamera className="mr-2" /> Rasmni o'zgartirish
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Ism</label>
//                     <input
//                       type="text"
//                       defaultValue="Admin"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Familiya</label>
//                     <input
//                       type="text"
//                       defaultValue="Super"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Elektron pochta</label>
//                   <input
//                     type="email"
//                     defaultValue="admin@yuk.uz"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                     required
//                   />
//                 </div>

//                 <div className="mb-8">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Parolni o'zgartirish</label>
//                   <input
//                     type="password"
//                     placeholder="Yangi parol"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                   />
//                   <p className="text-sm text-gray-500 mt-2">Agar parolni o'zgartirmoqchi bo'lmasangiz, bo'sh qoldiring</p>
//                 </div>

//                 <div className="pt-6 border-t border-gray-200">
//                   <button type="submit" className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow">
//                     Profilni yangilash
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <div className="text-center py-12">
//             <FaCogs className="text-4xl text-gray-400 mb-4 mx-auto" />
//             <h3 className="text-xl font-semibold text-gray-700">Sahifa tayyorlanmoqda</h3>
//           </div>
//         );
//     }
//   };

//   // Get page title
//   const getPageTitle = () => {
//     const titles = {
//       dashboard: 'Dashboard',
//       users: 'Foydalanuvchilar',
//       settings: 'Sozlamalar',
//       profile: 'Profil',
//       loads: 'Barcha Yuklar',
//       'pending-loads': 'Kutilayotgan Yuklar',
//       'active-loads': 'Faol Yuklar',
//       drivers: 'Haydovchilar',
//       senders: 'Yuk Beruvchilar',
//       verification: 'Tasdiqlash',
//       transactions: 'Tranzaksiyalar',
//       withdrawals: 'Yechib olishlar',
//       reports: 'Hisobotlar',
//       support: 'Qo\'llab-quvvatlash',
//       logs: 'Audit Loglari'
//     };
//     return titles[currentPage] || 'Dashboard';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Toast Container */}
//       <div className="fixed top-6 right-6 z-50 space-y-3">
//         {toasts.map((toast) => (
//           <div
//             key={toast.id}
//             className={`bg-white rounded-lg shadow-lg p-4 min-w-75 max-w-100 border-l-4 ${toast.type === 'success' ? 'border-green-500' :
//               toast.type === 'error' ? 'border-red-500' :
//                 toast.type === 'info' ? 'border-blue-500' :
//                   'border-yellow-500'
//               } flex items-start space-x-3 animate-fade-in`}
//           >
//             <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${toast.type === 'success' ? 'bg-green-500' :
//               toast.type === 'error' ? 'bg-red-500' :
//                 toast.type === 'info' ? 'bg-blue-500' :
//                   'bg-yellow-500'
//               }`}>
//               {toast.icon}
//             </div>
//             <div className="flex-1">
//               <div className="font-semibold text-sm text-gray-900">
//                 {toast.type === 'success' ? 'Muvaffaqiyat!' :
//                   toast.type === 'error' ? 'Xatolik!' :
//                     toast.type === 'info' ? 'Ma\'lumot!' : 'Ogohlantirish!'}
//               </div>
//               <div className="text-xs text-gray-600">{toast.message}</div>
//             </div>
//             <button
//               onClick={() => removeToast(toast.id)}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <FaTimes />
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } lg:translate-x-0`}>
//           <div className="h-full flex flex-col">
//             {/* Sidebar Header */}
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-9 h-9 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
//                   <FaTruckLoading />
//                 </div>
//                 <span className="text-lg font-bold text-blue-600">Yuk.uz Admin</span>
//               </div>
//               <button
//                 className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Sidebar Navigation */}
//             <div className="flex-1 overflow-y-auto p-4">
//               {navItems.map((item, index) => {
//                 const showSection = item.section && (!index || navItems[index - 1]?.section !== item.section);
//                 return (
//                   <React.Fragment key={item.id}>
//                     {showSection && (
//                       <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
//                         {item.section}
//                       </div>
//                     )}
//                     <button
//                       className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ${currentPage === item.id
//                         ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-sm'
//                         : 'text-gray-600 hover:bg-gray-50'
//                         }`}
//                       onClick={() => navigateTo(item.id)}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <span className="w-5">{item.icon}</span>
//                         <span className="text-sm">{item.label}</span>
//                       </div>
//                       {item.badge && (
//                         <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
//                           {item.badge}
//                         </span>
//                       )}
//                     </button>
//                   </React.Fragment>
//                 );
//               })}
//             </div>

//             {/* Sidebar Footer */}
//             <div className="p-4 border-t border-gray-200">
//               <button
//                 className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
//                 onClick={() => navigateTo('profile')}
//               >
//                 <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                   AS
//                 </div>
//                 <div className="flex-1 text-left">
//                   <div className="font-semibold text-gray-900">Admin Super</div>
//                   <div className="text-xs text-gray-500">Super Admin</div>
//                 </div>
//                 <FaChevronRight className="text-gray-400" />
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1 min-w-0">
//           {/* Header */}
//           <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <button
//                   className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                   onClick={() => setSidebarOpen(true)}
//                 >
//                   <FaBars />
//                 </button>
//                 <h1 className="text-xl font-semibold text-gray-900">
//                   {getPageTitle()}
//                 </h1>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="relative hidden md:block">
//                   <input
//                     type="text"
//                     placeholder="Qidirish..."
//                     className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                   />
//                   <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
//                     <FaBell />
//                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
//                   </button>
//                   <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//                     <FaEnvelope />
//                   </button>
//                   <button
//                     className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                     onClick={() => navigateTo('settings')}
//                   >
//                     <FaCog />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Content Area */}
//           <main className="p-4 md:p-6">
//             {renderPage()}
//           </main>
//         </div>
//       </div>

//       {/* Add User Modal */}
//       {modals.addUser && (
//         <div className="fixed inset-0 bg-[rgb(0,0,0,0.8)] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">Yangi Foydalanuvchi Qo'shish</h3>
//               <button
//                 onClick={() => closeModal('addUser')}
//                 className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="p-6">
//               <form onSubmit={handleAddUser}>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Ism *</label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Familiya *</label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Telefon raqami *</label>
//                     <input
//                       type="tel"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
//                     <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
//                       <option>Tanlang</option>
//                       <option>Admin</option>
//                       <option>Haydovchi</option>
//                       <option>Yuk beruvchi</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => closeModal('addUser')}
//                     className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Bekor qilish
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
//                   >
//                     Qo'shish
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {modals.confirm && (
//         <div className="fixed inset-0 bg-[rgb(0,0,0,0.8)] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="bg-white rounded-xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">Tasdiqlash</h3>
//               <button
//                 onClick={() => closeModal('confirm')}
//                 className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="p-6">
//               <p className="text-gray-700">Haqiqatan ham o'chirmoqchimisiz?</p>
//             </div>
//             <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
//               <button
//                 onClick={() => closeModal('confirm')}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Bekor qilish
//               </button>
//               <button
//                 onClick={() => {
//                   closeModal('confirm');
//                   showToast('Muvaffaqiyatli o\'chirildi', 'success');
//                 }}
//                 className="px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
//               >
//                 O'chirish
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default YukAdminPanel;


// Admin.jsx (to'liq)
import React, { useState } from 'react';
import MainLayout from './Dashboard/pages/MainLayout';
import DashboardPage from './Dashboard/pages/DashboardPage';
import LoadsPage from './Dashboard/pages/LoadsPage';
import PendingLoadsPage from './Dashboard/pages/PendingLoadsPage';
import ActiveLoadsPage from './Dashboard/pages/ActiveLoadsPage';
import UsersPage from './Dashboard/pages/UsersPage';
import DriversPage from './Dashboard/pages/DriversPage';
import SendersPage from './Dashboard/pages/SendersPage';
import VerificationPage from './Dashboard/pages/VerificationPage';
import TransactionsPage from './Dashboard/pages/TransactionsPage';
import WithdrawalsPage from './Dashboard/pages/WithdrawalsPage';
import ReportsPage from './Dashboard/pages/ReportsPage';
import SettingsPage from './Dashboard/pages/SettingsPage';
import SupportPage from './Dashboard/pages/SupportPage';
import LogsPage from './Dashboard/pages/LogsPage';
import DefaultPage from './Dashboard/pages/DefaultPage';

const YukAdminPanel = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [modals, setModals] = useState({
    addUser: false,
    editLoad: false,
    confirm: false
  });
  const [toasts, setToasts] = useState([]);

  // Navigation functions
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Modal functions
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    document.body.style.overflow = 'auto';
  };

  // Toast functions
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      icon: type === 'success' ? '✓' :
        type === 'error' ? '✗' :
          type === 'warning' ? '⚠' : 'ℹ'
    };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Format currency
  const formatCurrency = (value) => {
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

  // Foiz ko'rsatgichini formatlash
  const formatPercentage = (value, trend) => {
    if (trend === 'same') return '0%';
    if (trend === 'up') return `+${value}%`;
    return `${value}%`;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            navigateTo={navigateTo}
            showToast={showToast}
            openModal={openModal}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
        );
      case 'loads':
        return <LoadsPage showToast={showToast} />;
      case 'pending-loads':
        return <PendingLoadsPage />;
      case 'active-loads':
        return <ActiveLoadsPage />;
      case 'users':
        return <UsersPage />;
      case 'drivers':
        return <DriversPage />;
      case 'senders':
        return <SendersPage />;
      case 'verification':
        return <VerificationPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'withdrawals':
        return <WithdrawalsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage showToast={showToast} />;
      case 'support':
        return <SupportPage />;
      case 'logs':
        return <LogsPage />;
      default:
        return <DefaultPage />;
    }
  };

  return (
    <MainLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      modals={modals}
      closeModal={closeModal}
      toasts={toasts}
      removeToast={removeToast}
      showToast={showToast}
    >
      {renderPage()}
    </MainLayout>
  );
};

export default YukAdminPanel;
