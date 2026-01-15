import React, { useState, useEffect, useMemo } from 'react'
import { FaPlus, FaCircleCheck, FaClock, FaCreditCard, FaFilter, FaCheck, FaGavel } from "react-icons/fa6";
import {
    FaBox, FaWallet, FaMobileAlt, FaArrowUp, FaArrowDown,
    FaMapMarkerAlt, FaFlagCheckered, FaWeightHanging, FaRulerCombined,
    FaSnowflake, FaBiohazard, FaChevronLeft, FaChevronRight,
    FaSyncAlt, FaExclamationTriangle
} from "react-icons/fa";

// Token olish funksiyasi
const getAuthToken = async () => {
    try {
        const response = await fetch('https://tokennoty.pythonanywhere.com/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: "123",
                phone_number: "+998993967336"
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Token API javobi (to\'liq):', JSON.stringify(data, null, 2));
            const token = data.token || data.access_token || data.access || data.accessToken || (data.data && data.data.token) || (data.data && data.data.access_token);
            if (token) {
                localStorage.removeItem('access_token');
                localStorage.setItem('access_token', token);
                console.log('Yangi token saqlandi:', token.substring(0, 20) + '...');
                console.log('Token uzunligi:', token.length);
                return token;
            } else {
                console.error('Token topilmadi. API javobi:', JSON.stringify(data, null, 2));
                console.error('API javobidagi barcha kalitlar:', Object.keys(data));
            }
        } else {
            const errorText = await response.text();
            console.error('Token olishda xatolik:', response.status, response.statusText, errorText);
        }
    } catch (error) {
        console.error('Token olishda tarmoq xatosi:', error);
    }
    return null;
};

function Dashboard({ onFreightDetail }) {
    // --- STATES ---
    const [apiLoads, setApiLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Barchasi");
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null)

    // Yuklarni olish funksiyasi
    const fetchNotes = async () => {
        setLoading(true);
        setError(null);

        let token = localStorage.getItem('token');

        if (!token) {
            token = await getAuthToken();
        }

        if (!token) {
            setError("Token olishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/freight/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API javobi statusi:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('API dan kelgan ma\'lumotlar:', data);
                setApiLoads(data.reverse());
            } else if (response.status === 404) {
                console.log("API bo'sh yoki 404 xato");
                setApiLoads([]);
            } else {
                const errorText = await response.text();
                console.error("API dan xato keldi:", response.status, errorText);
                setError(`Server xatosi: ${response.status}`);

                const newToken = await getAuthToken();
                if (newToken) {
                    setTimeout(() => {
                        fetchNotes();
                    }, 1000);
                }
            }

            // Foydalanuvchi ma'lumotlarini (rolini) olish
            const userResponse = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log("API'dan kelgan foydalanuvchi ma'lumoti:", userData); // Tekshirish uchun

                // Agar ma'lumot massiv bo'lib kelsa, birinchisini olamiz
                if (Array.isArray(userData)) {
                    setUser(userData[0]);
                } else {
                    setUser(userData);
                }
            }
        } catch (err) {
            console.error("Internet yoki Server xatosi:", err);
            setError("Server bilan aloqa yo'q. Internetingizni tekshiring.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeToken = async () => {
            const existingToken = localStorage.getItem('access_token');
            if (!existingToken) {
                await getAuthToken();
            }
        };
        initializeToken().then(() => {
            fetchNotes();
        });
    }, []);

    const filterLoads = (loads, filterType) => {
        if (filterType === "Barchasi") return loads;

        return loads.filter(item => {
            if (filterType === "Faol") {
                return item.situation === "FAOL" || item.situation === "Featured";
            } else if (filterType === "Kutilmoqda") {
                return item.situation === "KUTILMOQDA";
            } else if (filterType === "Yakunlangan") {
                return item.situation === "YAKUNLANDI";
            }
            return true;
        });
    };

    const statistics = useMemo(() => {
        const totalCount = apiLoads.length;
        const deliveredCount = apiLoads.filter(item =>
            item.is_shipped === true ||
            item.status === 'completed' ||
            item.status === 'delivered'
        ).length;

        const inProgressCount = apiLoads.filter(item =>
            item.is_shipped === false ||
            item.is_shipped == null ||
            item.status === 'active' ||
            item.status === 'pending' ||
            !item.status
        ).length;

        const totalMoney = apiLoads.reduce((sum, item) => {
            const amount = parseFloat(item.freight_rate_amount) ||
                parseFloat(item.price) ||
                parseFloat(item.rate) ||
                0;
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const percentTotal = totalCount > 0 ? Math.min(100, Math.round((totalCount / 100) * 100)) : 0;
        const percentDelivered = totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0;
        const percentInProgress = totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0;
        const percentMoney = totalMoney > 0 ? 100 : 0;

        const formattedMoney = totalMoney.toLocaleString('uz-UZ');

        return {
            totalCount,
            deliveredCount,
            inProgressCount,
            totalMoney: formattedMoney,
            percentTotal,
            percentDelivered,
            percentInProgress,
            percentMoney
        };
    }, [apiLoads]);

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
            icon: FaCircleCheck,
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

    ], [statistics]);

    const actins = [
        { id: 1, icon: FaPlus, icon_color: '#4361ee', title: 'Yuk qo\'shish', action: () => onFreightDetail("Yuk qo'shish") },
        { id: 2, icon: FaBox, icon_color: '#4cc9f0', title: 'Yuklarim', action: () => onFreightDetail("Mening yuklarim") },
        { id: 3, icon: FaMapMarkerAlt, icon_color: '#f72585', title: 'Kuzatish', action: () => console.log("Kuzatish") },
        { id: 4, icon: FaCreditCard, icon_color: '#7209b7', title: 'To\'lov', action: () => onFreightDetail("To'lovlar") },
    ];

    const mappedLoads = useMemo(() => {
        return apiLoads.map((item, index) => {
            const fromCity = item.route_starts_where_data?.street ||
                item.route_starts_where_city ||
                item.origin_address ||
                item.from_city ||
                item.origin ||
                "Aniqlanmagan";

            const fromRegion = item.route_starts_where_data?.region ||
                item.route_starts_where_region ||
                (item.route_starts_where_lat ? `Lat: ${item.route_starts_where_lat}` : "Viloyat");

            const toCity = item.route_ends_where_data?.street ||
                item.route_ends_where_city ||
                item.destination_address ||
                item.to_city ||
                item.destination ||
                "Viloyat";

            const toRegion = item.route_ends_where_data?.region ||
                item.route_ends_where_region ||
                (item.route_ends_where_lat ? `Lat: ${item.route_ends_where_lat}` : "Viloyat");

            let situation = "FAOL";
            let situation_bg = 'bg-[#edf9fd]';
            let situation_color = 'text-[#4cc9f0]';

            if (item.featured === true || index === 0) {
                situation = "Featured";
                situation_bg = 'bg-gradient-to-r from-[#4361ee] to-[#7209b7]';
                situation_color = 'text-white';
            }
            else if (item.is_shipped === true || item.status === 'completed' || item.status === 'delivered') {
                situation = "YAKUNLANDI";
                situation_bg = 'bg-[#eceffd]';
                situation_color = 'text-[#4c68ef]';
            }
            else if (item.status === 'pending' || item.is_shipped === false) {
                situation = "KUTILMOQDA";
                situation_bg = 'bg-[#fee9f3]';
                situation_color = 'text-[#f72585]';
            }
            else if (item.status === 'active' || item.is_shipped === null || item.is_shipped === undefined) {
                situation = "FAOL";
                situation_bg = 'bg-[#edf9fd]';
                situation_color = 'text-[#4cc9f0]';
            }

            return {
                id: item.id || index,
                l_num: `#YUK-${item.id || index}`,
                situation: situation,
                situation_bg: situation_bg,
                situation_color: situation_color,
                from_province: fromCity,
                from_loc: fromRegion,
                to_province: toCity,
                to_loc: toRegion,
                ton: item.weight || item.tonnage || 0,
                m: item.volume || item.cubic_meter || 0,
                product: item.freight_type || item.product_type || item.title || "Yuk",
                type: item.body_type || item.vehicle_type || 'Yopiq',
                date: item.created_at ? item.created_at.slice(0, 10) :
                    (item.created_date ? item.created_date.slice(0, 10) : "Yangi"),
                price: item.freight_rate_amount || item.price || item.rate
                    ? parseInt(item.freight_rate_amount || item.price || item.rate).toLocaleString() + " so'm"
                    : "Kelishilgan",
                is_shipped: item.is_shipped,
                status: item.status,
                originalData: item
            }
        });
    }, [apiLoads]);

    const filteredLoads = useMemo(() => {
        return filterLoads(mappedLoads, filter);
    }, [mappedLoads, filter]);

    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLoads.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLoads.length / itemsPerPage);

    const getProductIcon = (product) => {
        if (product.toLowerCase().includes('muz')) return <FaSnowflake className="text-[#4361ee]" />;
        if (product.toLowerCase().includes('kimyo') || product.toLowerCase().includes('zararli'))
            return <FaBiohazard className="text-[#4361ee]" />;
        return <FaBox className="text-[#4361ee]" />;
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Hozirgina";

        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} soniya oldin`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} daqiqa oldin`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} soat oldin`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} kun oldin`;
        }

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) {
            return `${diffInWeeks} hafta oldin`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} oy oldin`;
        }

        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears} yil oldin`;
    };

    const recentActivity = apiLoads.slice(0, 3).map((item, i) => ({
        id: item.id || i,
        icon: i === 0 ? FaCheck : i === 1 ? FaGavel : FaExclamationTriangle,
        icon_color: i === 0 ? "text-[#4cc9f0]" : i === 1 ? "text-[#4361ee]" : "text-[#f72585]",
        title: item.is_shipped ? "Yuk yetkazildi" : "Yangi yuk qo'shildi",
        desc: item.freight_type || item.title || "Yuk",
        time: formatTimeAgo(item.created_at || item.updated_at || item.created_date)
    }));

    const handleRefresh = async () => {
        await fetchNotes();
    };

    const handleFreightDetailClick = (freightData) => {
        onFreightDetail('Batafsil', freightData.originalData?.id || freightData.id, freightData.originalData);
    };

    return (
        <div>
            <div className="w-full flex gap-3 sm:gap-4 md:gap-5 flex-col">
                <div className="w-full bg-white shadow-lg border border-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-center justify-between hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 sm:hover:-translate-y-2 duration-300">
                    <div className='w-full sm:w-3/6 text-center sm:text-left'>
                        <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2'>Xush kelibsiz, {user?.first_name || "Foydalanuvchi"}</h2>
                        <p className='text-sm sm:text-base md:text-lg text-gray-600'>Bugun nima qilmoqchisiz? Yuklar soni: {apiLoads.length}</p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto'>
                        <button
                            onClick={handleRefresh}
                            className='relative text-sm sm:text-base text-white font-semibold bg-[#415fe9] border-2 border-blue-500 rounded-lg sm:rounded-xl flex gap-1 sm:gap-2 items-center justify-center py-2 px-3 sm:py-2 sm:px-6 hover:shadow-xl transform hover:-translate-y-1 duration-300 cursor-pointer overflow-hidden group'>
                            <FaSyncAlt className='text-sm sm:text-base' />
                            Yangilash
                            <div className="absolute w-0 h-0 rounded-full bg-white/40 group-hover:w-40 group-hover:h-40 duration-500"></div>
                        </button>
                        <button className='relative text-sm sm:text-base text-[#415fe9] font-semibold bg-white border-2 border-blue-500 rounded-lg sm:rounded-xl flex gap-1 sm:gap-2 items-center justify-center py-2 px-3 sm:py-2 sm:px-6 hover:bg-[#415fe9] hover:text-white duration-300 cursor-pointer overflow-hidden group'>
                            <FaMobileAlt className='text-sm sm:text-base' />
                            Ilovani ko'rish
                            <div className="absolute w-0 h-0 rounded-full bg-white/40 group-hover:w-40 group-hover:h-40 duration-500"></div>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
                        >
                            Qayta urinish
                        </button>
                    </div>
                )}

                <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-3 sm:py-4 md:py-5 lg:py-6">
                    {results.map((item, index) => {
                        return (
                            <div key={index} className="bg-linear-to-br from-[#4361ee] to-[#7209b7] shadow-lg rounded-xl sm:rounded-2xl pt-1 transform hover:-translate-y-0.5 duration-300 overflow-hidden">
                                <div className="w-full h-full bg-white p-4 sm:p-5 md:p-6 lg:p-8">
                                    <div className="flex items-center justify-between">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{ background: item.icon_bg }}>
                                            <item.icon className="text-lg sm:text-xl md:text-2xl" style={{ color: item.icon_color }} />
                                        </div>
                                        <p className='flex gap-1 items-center rounded-lg py-1 px-2 text-xs sm:text-sm md:text-base' style={{
                                            background: item.benefit === true ? '#edf9fd' : '#fee9f3',
                                            color: item.benefit === true ? '#67d1f3' : '#f72585'
                                        }}>
                                            {item.benefit === true ? <FaArrowUp className='text-xs sm:text-sm' /> : <FaArrowDown className='text-xs sm:text-sm' />}
                                            <span>{item.percent}%</span>
                                        </p>
                                    </div>
                                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mt-3 sm:mt-4 md:mt-5'>{item.total}</h1>
                                    <h3 className='text-xs sm:text-sm md:text-base text-[#6c757d] uppercase mt-1 sm:mt-2'>{item.title}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="w-full bg-white shadow-lg border border-white rounded-2xl sm:rounded-3xl hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 sm:hover:-translate-y-2 duration-300">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold border-b border-gray-300 p-4 sm:p-5 md:p-6 lg:p-8">
                        Tezkor Amallar
                    </h1>
                    <div className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-2 sm:py-3 md:py-4 lg:py-5 px-2 sm:px-3 md:px-4 lg:px-6">
                        {actins
                            .filter(item => {
                                const isDriver = user?.role?.toLowerCase() === 'driver';
                                const isAddFreightAction = item.title === "Yuk qo'shish";
                                return !(isDriver && isAddFreightAction);
                            })
                            .map((item) => (
                                <div key={item.id} onClick={item.action} className="bg-white shadow-md border border-white rounded-lg flex gap-1 sm:gap-2 items-center flex-col p-2 sm:p-3 md:p-4 hover:border-blue-500 hover:shadow-lg transform hover:-translate-y-0.5 duration-300 cursor-pointer py-3 sm:py-4 md:py-5 lg:py-6">
                                    <item.icon style={{ color: item.icon_color }} className='text-base sm:text-lg md:text-xl' />
                                    <span className='text-xs sm:text-sm md:text-base text-center px-1'>{item.title}</span>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="w-full bg-white shadow-lg border border-white rounded-2xl sm:rounded-3xl hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 sm:hover:-translate-y-2 duration-300 my-5 sm:my-6 md:my-8 lg:my-10 py-5 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4 md:px-5 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-5 sm:mb-6 md:mb-8 lg:mb-10">
                        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center sm:text-left mb-4 sm:mb-0'>
                            Yuklar ({filteredLoads.length} ta)
                        </h1>
                        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
                            {["Barchasi", "Faol", "Kutilmoqda", "Yakunlangan"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setFilter(tab);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-2 rounded-full font-medium sm:font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 cursor-pointer ${filter === tab ? 'bg-[#4361ee] text-white shadow-lg scale-105' : 'bg-white text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4361ee]"></div>
                            <p className="mt-2 text-gray-600">Yuklanmoqda...</p>
                        </div>
                    ) : filteredLoads.length === 0 ? (
                        <div className="text-center py-10">
                            <FaBox className="inline-block text-4xl text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">
                                {filter === "Barchasi"
                                    ? "Hozircha yuklar yo'q"
                                    : `${filter} yuklar topilmadi`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                            {currentItems.map((item) => (
                                <div key={item.id} className="flex flex-col bg-white border border-gray-100 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg duration-300 hover:border-[#4361ee] transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl overflow-hidden">

                                    <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 pt-4 sm:pt-5 md:pt-6 lg:pt-8">
                                        <span className='text-xs sm:text-sm text-gray-400 font-bold tracking-wider'>{item.l_num}</span>
                                        <span className={`text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold py-0.5 sm:py-1 px-2 sm:px-3 rounded-lg ${item.situation_bg} ${item.situation_color}`}>
                                            {item.situation}
                                        </span>
                                    </div>

                                    <div className="border-t border-b border-gray-100 px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 space-y-3 sm:space-y-4 md:space-y-5">
                                        <div className="flex gap-2 sm:gap-3 md:gap-4 items-start">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <FaMapMarkerAlt className='text-sm sm:text-base md:text-lg text-[#4361ee]' />
                                            </div>
                                            <div>
                                                <h4 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800 leading-tight'>{item.from_province}</h4>
                                                <p className='text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1'>{item.from_loc}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 sm:gap-3 md:gap-4 items-start">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                                <FaFlagCheckered className='text-sm sm:text-base md:text-lg text-[#4361ee]' />
                                            </div>
                                            <div>
                                                <h4 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-800 leading-tight'>{item.to_province}</h4>
                                                <p className='text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1'>{item.to_loc}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-1 sm:gap-x-2 px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 bg-slate-50/50">
                                        <div className='flex gap-1 sm:gap-2 items-center text-xs sm:text-sm text-slate-600 font-medium'>
                                            <FaWeightHanging className='text-[#4361ee] text-xs sm:text-sm' />
                                            <span>{item.ton} kg</span>
                                        </div>
                                        <div className='flex gap-1 sm:gap-2 items-center text-xs sm:text-sm text-slate-600 font-medium'>
                                            <FaRulerCombined className='text-[#4361ee] text-xs sm:text-sm' />
                                            <span>{item.m} m³</span>
                                        </div>
                                        <div className='flex gap-1 sm:gap-2 items-center text-xs sm:text-sm text-slate-600 font-medium'>
                                            {getProductIcon(item.product)}
                                            <span className="truncate">{item.product}</span>
                                        </div>
                                        <div className='flex gap-1 sm:gap-2 items-center text-xs sm:text-sm text-slate-600 font-medium'>
                                            <FaClock className='text-[#4361ee] text-xs sm:text-sm' />
                                            <span className='truncate'>{item.date}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 mt-auto gap-2 sm:gap-3">
                                        <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#4361ee] text-center sm:text-left'>{item.price}</h2>
                                        <button
                                            onClick={() => handleFreightDetailClick(item)}
                                            className='bg-[#4361ee] text-white text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg sm:rounded-xl py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-5 hover:bg-[#324fdb] transition-all cursor-pointer active:scale-95 w-full sm:w-auto'
                                        >
                                            Batafsil ko'rish
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:text-[#4361ee] hover:border-[#4361ee] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft className='text-sm sm:text-base' />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full font-bold transition-all text-xs sm:text-sm md:text-base ${currentPage === i + 1 ? 'bg-[#4361ee] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-[#4361ee]'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:text-[#4361ee] hover:border-[#4361ee] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <FaChevronRight className='text-sm sm:text-base' />
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full bg-white shadow-lg border border-white rounded-2xl sm:rounded-3xl hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 sm:hover:-translate-y-2 duration-300">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-300 p-4 sm:p-5 md:p-6 lg:p-8 gap-3 sm:gap-0">
                        <h3 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center sm:text-left'>Real vaqtda xarita</h3>
                        <div className='flex gap-2 sm:gap-3'>
                            <button className='relative text-xs sm:text-sm md:text-base text-white font-semibold bg-[#415fe9] border-2 border-blue-500 rounded-lg sm:rounded-xl flex gap-1 sm:gap-2 items-center justify-center py-1.5 sm:py-2 px-2 sm:px-4 md:px-6 hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 duration-300 cursor-pointer overflow-hidden group'>
                                <FaSyncAlt className='text-sm sm:text-base' />
                                <span className='hidden sm:inline'>Yangilash</span>
                                <span className='sm:hidden'>Yangi</span>
                                <div className="absolute w-0 h-0 rounded-full bg-white/40 group-hover:w-40 group-hover:h-40 duration-500"></div>
                            </button>
                            <button className='relative text-xs sm:text-sm md:text-base text-[#415fe9] font-semibold bg-white border-2 border-blue-500 rounded-lg sm:rounded-xl flex gap-1 sm:gap-2 items-center justify-center py-1.5 sm:py-2 px-2 sm:px-4 md:px-6 hover:bg-[#415fe9] hover:text-white duration-300 cursor-pointer overflow-hidden group'>
                                <FaFilter className='text-sm sm:text-base' />
                                <span className='hidden sm:inline'>Filtr</span>
                                <div className="absolute w-0 h-0 rounded-full bg-white/40 group-hover:w-40 group-hover:h-40 duration-500"></div>
                            </button>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4 md:p-5 lg:p-8 w-full h-64 sm:h-80 md:h-96 lg:h-122.5 overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.5026388484!2d69.139281!3d41.2825125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a997129525f41!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Yuk.uz xaritasi"
                        ></iframe>
                    </div>
                </div>

                <div className="w-full bg-white shadow-lg border border-white rounded-2xl sm:rounded-3xl hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 sm:hover:-translate-y-2 duration-300">
                    <div className="border-b border-gray-300 p-4 sm:p-5 md:p-6 lg:p-8">
                        <h3 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold'>So'nggi Faoliyat</h3>
                    </div>

                    <div className="p-3 sm:p-4 md:p-5 lg:p-8 space-y-4 sm:space-y-5">
                        {recentActivity.length === 0 ? <p className="text-gray-400">Hozircha faollik yo'q</p> : recentActivity.map((item, index) => {
                            return (
                                <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-5 items-start sm:items-center">
                                    <item.icon className={`${item.icon_color} text-lg sm:text-xl mt-1 sm:mt-0`} />
                                    <div className="flex-1">
                                        <p className='text-sm sm:text-base md:text-lg font-medium'>{item.title}</p>
                                        <span className='text-xs sm:text-sm md:text-base text-[#6c757d]'>{item.desc}</span>
                                    </div>
                                    <p className='text-xs sm:text-sm md:text-base text-[#6c757d] text-right sm:text-left'>{item.time}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
