import React, { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import {
  FaTruckLoading,
  FaUsers,
  FaWifi,
  FaUserSlash,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaPlus,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMapMarkerAlt,
  FaPhone,
  FaComment,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkedAlt,
  FaUser,
  FaWeight,
  FaRulerCombined,
  FaDollarSign,
  FaCube,
  FaTruck,
  FaBoxOpen,
  FaGlobe,
  FaRulerHorizontal,
  FaRulerVertical
} from 'react-icons/fa';

// Simple Star Rating Component
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      <FaStar className="text-yellow-400 w-3 h-3" />
      <FaStar className="text-yellow-400 w-3 h-3" />
      <FaStar className="text-yellow-400 w-3 h-3" />
      <FaStar className="text-yellow-400 w-3 h-3" />
      <FaStarHalfAlt className="text-yellow-400 w-3 h-3" />
      <span className="font-semibold text-gray-900 ml-1">{rating}</span>
      <span className="text-xs text-gray-500">(124)</span>
    </div>
  );
}

// Stat Card Component - Now extracted
function StatCard({ title, value, trend, trendUp, icon: Icon, gradient }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative overflow-hidden transition-all hover:-translate-y-2 duration-300 hover:shadow-xl">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradient}`} />
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon className="text-xl" />
        </div>
        <span className="bg-green-50 text-green-600 text-sm font-semibold py-1 px-3 rounded-full flex items-center gap-1">
          <FaArrowUp />{trend}
        </span>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

// Select Dropdown Component
function Select({ options, label, value, onChange }) {
  return (
    <div className="relative">
      <select 
        className="py-3 px-4 border border-gray-300 rounded-xl text-sm bg-white text-gray-700 cursor-pointer appearance-none pr-10 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 w-full"
        value={value}
        onChange={onChange}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </div>
    </div>
  );
}

// Modal Component
function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Driver Card Component
function DriverCard({ driver }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Featured Badge */}
      <div className="absolute top-4 right-4 bg-linear-to-r from-blue-600 to-purple-700 text-white text-xs font-semibold py-1 px-3 rounded-xl z-10">Featured</div>

      {/* Driver Info */}
      <div className="p-6 border-b border-gray-100 flex items-start gap-4">
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm">
            {driver.owner_first_name.charAt(0)}{driver.owner_last_name.charAt(0)}
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white bg-green-500"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900">{driver.owner_first_name} {driver.owner_last_name}</h3>
            <FaCheckCircle className="text-green-500 w-4 h-4" title="Tasdiqlangan" />
          </div>
          <StarRating rating={driver.rating} />
          <div className="font-mono text-sm text-gray-500 mb-2">id</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-blue-600 w-3 h-3" />
            location
          </div>
        </div>
      </div>

      {/* Driver Details */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Telefon</div>
            <div className="font-semibold text-gray-900 font-mono">+998992221133</div>
            {/* {console.log(driver)} */}
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transport</div>
            <div className="font-semibold text-gray-900">{driver.vehicle_category}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ro'yxatdan o'tgan</div>
            <div className="font-semibold text-gray-900">{driver.created_at.split('T')[0]}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Holat</div>
            <div className="font-semibold text-gray-900">Online</div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-48 bg-linear-to-br from-cyan-50 to-blue-100 rounded-xl mt-4 relative">
          <div className="absolute w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-md" style={{ top: '40%', left: '30%' }}>
            <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <div className="text-center">
              <FaMapMarkedAlt className="text-4xl mb-2 mx-auto" />
              <div>Real vaqtda joylashuv</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-3 gap-4 text-center bg-gray-50">
        <div>
          <div className="text-xl font-bold text-blue-600">89</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Yakunlangan</div>
        </div>
        <div>
          <div className="text-xl font-bold text-blue-600">1</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Faol</div>
        </div>
        <div>
          <div className="text-xl font-bold text-blue-600">12.5M</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Daromad</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-3">
        <button className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-sm hover:text-white hover:border-green-500 hover:bg-green-500 transition-all flex items-center justify-center gap-2">
          <FaPhone className="w-4 h-4" />Qo'ng'iroq
        </button>
        <button className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-sm hover:text-white hover:border-blue-500 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
          <FaComment className="w-4 h-4" />Xabar
        </button>
        <button className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-sm hover:text-white hover:border-purple-500 hover:bg-purple-500 transition-all flex items-center justify-center gap-2">
          <FaTruckLoading className="w-4 h-4" />Yuk
        </button>
      </div>
    </div>
  );
}

// Main Component
function Haydovchilar() {
  const [activeTab, setActiveTab] = useState('all');
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [transportData, setTransportData] = useState([]);

  // Form states for adding new transport/driver according to API structure
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [ownerUsername, setOwnerUsername] = useState('admin'); // Default as per API
  const [availableTonnage, setAvailableTonnage] = useState('');
  const [availableVolume, setAvailableVolume] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [height, setHeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [weight, setWeight] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('');
  const [loadingMethod, setLoadingMethod] = useState('');
  const [transportationRateCurrency, setTransportationRateCurrency] = useState('UZS');
  const [transportationRatePerKm, setTransportationRatePerKm] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const baseUrl = 'https://tokennoty.pythonanywhere.com/api/transport/'
      const res = await fetch(baseUrl)
      const transports = await res.json()
      const result = await Promise.all(
        transports.map(async (item) => {
          const starsRes = await fetch(`${baseUrl}${item.id}/stars/`)
          const stars = await starsRes.json()
          return { ...item, stars }
        }))
      setTransportData(result)
    })()
  }, []);
  // console.log(transportData);

  // Tab Component
  function Tab({ id, label, badge, active }) {
    return (
      <button className={`relative py-4 px-6 font-medium whitespace-nowrap border-b-2 transition-colors ${active ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`} onClick={() => setActiveTab(id)}>
        {label}
        {badge && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    );
  }

  // Status options
  const statusOptions = [
    { value: 'all', label: 'Barcha holatlar' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'busy', label: 'Band' }
  ];

  // Vehicle options
  const vehicleOptions = [
    { value: 'all', label: 'Barcha transportlar' },
    { value: 'truck', label: 'Yuk mashinasi' },
    { value: 'van', label: 'Furgon' },
    { value: 'pickup', label: 'Pikap' },
    { value: 'refrigerator', label: 'Refrijerator' }
  ];

  // Vehicle category options for form
  const vehicleCategoryOptions = [
    { value: '', label: 'Tanlang' },
    { value: 'truck', label: 'Yuk mashinasi' },
    { value: 'van', label: 'Furgon' },
    { value: 'refrigerator', label: 'Refrijerator' },
    { value: 'container', label: 'Konteyner' },
    { value: 'platform', label: 'Platforma' },
    { value: 'tanker', label: 'Sisterna' }
  ];

  // Body type options
  const bodyTypeOptions = [
    { value: '', label: 'Tanlang' },
    { value: 'closed', label: 'Yopiq' },
    { value: 'open', label: 'Ochiq' },
  ];

  // Loading method options
  const loadingMethodOptions = [
    { value: '', label: 'Tanlang' },
    { value: 'top', label: 'Yuqoridan' },
    { value: 'back', label: 'Orqadan' },
  ];

  // Currency options
  const currencyOptions = [
    { value: 'UZS', label: "So'm" },
  ];

  // Rating options
  const ratingOptions = [
    { value: 'all', label: 'Barcha reytinglar' },
    { value: '5', label: '5 ★' },
    { value: '4', label: '4+ ★' },
    { value: '3', label: '3+ ★' },
    { value: '2', label: '2+ ★' }
  ];

  const handleAddDriver = async () => {
    // Prepare the data according to API structure
    const formData = {
      username: ownerFirstName,
      password: password,
      owner_first_name: ownerFirstName,
      owner_last_name: ownerLastName,
      owner_username: ownerUsername,
      available_tonnage: availableTonnage ? parseFloat(availableTonnage) : null,
      available_volume: availableVolume ? parseFloat(availableVolume) : null,
      body_type: bodyType || null,
      height: height || null,
      length: length || null,
      width: width || null,
      weight: weight ? parseFloat(weight) : null,
      vehicle_category: vehicleCategory || null,
      loading_method: loadingMethod || null,
      transportation_rate_currency: transportationRateCurrency || null,
      transportation_rate_per_km: transportationRatePerKm ? parseFloat(transportationRatePerKm) : null,
      public: isPublic,
      phone_number: '1234',
      photo: photo, // This should be handled as a file upload
    };

    console.log('Form data to be posted:', formData);
    
    const token = "3e6927a8c5a99d414fe2ca5f2c2435edb6ada1ba";
    try {
      const datab = JSON.stringify(formData)
      const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${token}`
        },
        body: datab,
      });

      if (response.ok) {
        alert("Yuk muvaffaqiyatli qo'shildi!");
        onRefresh(); // Ro'yxatni yangilash
        onClose();   // Modalni yopish
        }
    } catch (err) {
      console.error("Tarmoq xatosi:", err);
      // alert("Server bilan aloqa yo'q yoki internet past.");
    }

    // Close modal and show notification
    setShowAddDriverModal(false);
    setShowNotification(true);
    // Reset form
    setOwnerFirstName('');
    setOwnerLastName('');
    setOwnerUsername('admin');
    setAvailableTonnage('');
    setAvailableVolume('');
    setBodyType('');
    setHeight('');
    setLength('');
    setWidth('');
    setWeight('');
    setVehicleCategory('');
    setLoadingMethod('');
    setTransportationRateCurrency('USD');
    setTransportationRatePerKm('');
    setIsPublic(false);
    setPhoto(null);
    
    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/10 to-purple-50/10 font-sans text-gray-800">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Haydovchilar</h1>
            <p className="text-gray-600 text-lg">Barcha haydovchilarni boshqaring, kuzating va yuk biriktiring</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Jami Haydovchilar" value={transportData.length} trend="15%" trendUp={true} icon={FaUsers} gradient="from-blue-600 to-purple-700" />
            <StatCard title="Online" value="0" trend="8%" trendUp={true} icon={FaWifi} gradient="from-cyan-400 to-cyan-500" />
            <StatCard title="Offline" value="0" trend="3%" trendUp={false} icon={FaUserSlash} gradient="from-yellow-500 to-orange-400" />
            <StatCard title="Tasdiqlangan" value={transportData.length} trend="24%" trendUp={true} icon={FaCheckCircle} gradient="from-purple-700 to-blue-600" />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 max-lg:min-w-2/3">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" className="min-w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100" placeholder="Haydovchi ismi, ID yoki telefon raqami bo'yicha qidirish..." />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="min-w-50"><Select options={statusOptions} label="Holat" /></div>
              <div className="min-w-50"><Select options={vehicleOptions} label="Transport" /></div>
              <div className="min-w-50"><Select options={ratingOptions} label="Reyting" /></div>
              <button 
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                onClick={() => setShowAddDriverModal(true)}
              >
                <FaPlus />Haydovchi qo'shish
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            <Tab id="all" label="Barcha haydovchilar" active={activeTab === 'all'} />
            <Tab id="online" label="Online"  active={activeTab === 'online'} />
            <Tab id="verified" label="Tasdiqlangan" active={activeTab === 'verified'} />
            <Tab id="available" label="Bo'sh"  active={activeTab === 'available'} />
            <Tab id="top" label="Top reyting" active={activeTab === 'top'} />
            <Tab id="new" label="Yangi qo'shilgan" active={activeTab === 'new'} />
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {transportData.map(driver => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">1-9 of 156 haydovchilar</div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 border border-gray-300 rounded-xl bg-white text-gray-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"><FaChevronLeft /></button>
              <button className="w-9 h-9 border rounded-xl flex items-center justify-center bg-blue-600 text-white border-blue-600 transition-all">1</button>
              <button className="w-9 h-9 border border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">2</button>
              <button className="w-9 h-9 border border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">3</button>
              <button className="w-9 h-9 border border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">4</button>
              <button className="w-9 h-9 border border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">5</button>
              <button className="w-9 h-9 border border-gray-300 rounded-xl bg-white text-gray-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"><FaChevronRight /></button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Driver Modal */}
      <Modal isOpen={showAddDriverModal} title="Yangi haydovchi qo'shish" onClose={() => setShowAddDriverModal(false)}>
        <div className="space-y-4">
          {/* Owner Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              Haydovchi ma'lumotlari
            </h4>
            <div className="grid grid-cols-2 gap-3">
            <div className='my-2'>
                <label className="block text-xs text-gray-500 mb-1">Username *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Username"
                  value={ownerUsername}
                  onChange={(e) => setOwnerUsername(e.target.value)}
                  required
                />
              </div>
              <div className='my-2'>
                <label className="block text-xs text-gray-500 mb-1">Password *</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Parol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ism *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ism"
                  value={ownerFirstName}
                  onChange={(e) => setOwnerFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Familiya *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Familiya"
                  value={ownerLastName}
                  onChange={(e) => setOwnerLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* <div className="mt-3">
              <label className="block text-xs text-gray-500 mb-1">Foydalanuvchi nomi</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="admin"
                value={ownerUsername}
                onChange={(e) => setOwnerUsername(e.target.value)}
              />
            </div> */}
          </div>

          {/* Vehicle Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaTruck className="w-4 h-4" />
              Transport ma'lumotlari
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Transport turi</label>
                <Select
                  options={vehicleCategoryOptions}
                  value={vehicleCategory}
                  onChange={(e) => setVehicleCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Kuzov turi</label>
                <Select
                  options={bodyTypeOptions}
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Yuklash usuli</label>
                <Select
                  options={loadingMethodOptions}
                  value={loadingMethod}
                  onChange={(e) => setLoadingMethod(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaRulerCombined className="w-4 h-4" />
              O'lchamlari
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <FaRulerHorizontal className="w-3 h-3" /> Uzunlik (m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="15.00"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <FaRulerVertical className="w-3 h-3" /> Balandlik (m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="12.00"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Kenglik (m)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="50.00"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaWeight className="w-4 h-4" />
              Sig'imi
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Og'irlik (kg) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="100"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mavjud tonnaj</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Tonnaj"
                  value={availableTonnage}
                  onChange={(e) => setAvailableTonnage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mavjud hajm (m³)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Hajm"
                  value={availableVolume}
                  onChange={(e) => setAvailableVolume(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaDollarSign className="w-4 h-4" />
              Narxlar
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valyuta</label>
                <Select
                  options={currencyOptions}
                  value={transportationRateCurrency}
                  onChange={(e) => setTransportationRateCurrency(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Narx (1 km uchun)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="0.00"
                  value={transportationRatePerKm}
                  onChange={(e) => setTransportationRatePerKm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaCube className="w-4 h-4" />
              Rasm
            </h4>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Transport rasmi</label>
              <input
                type="file"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <div>
              <div className="font-medium text-sm text-gray-700">Ommaviy transport</div>
              <div className="text-xs text-gray-500">Bu transport barcha foydalanuvchilar uchun ko'rinadi</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              onClick={() => setShowAddDriverModal(false)}
            >
              Bekor qilish
            </button>
            <button
              className="flex-1 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
              onClick={handleAddDriver}
            >
              Saqlash
            </button>
          </div>
        </div>
      </Modal>

      {/* Driver Details Modal */}
      <Modal isOpen={showDriverModal} title="John Doe - Ma'lumotlar" onClose={() => setShowDriverModal(false)} >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold">J</div>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">John Doe</h3>
              <div className="text-sm text-gray-500">DRV-001</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Telefon</div>
              <div className="font-semibold">+99890 123 45 67</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="font-semibold">john.doe@example.com</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Joylashuv</div>
              <div className="font-semibold">Toshkent, Yunusobod</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className="font-semibold">Online</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Assign Load Modal */}
      <Modal isOpen={showAssignModal} title="John Doe ga yuk biriktirish" onClose={() => setShowAssignModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Yukni tanlang</label>
            <Select
              options={[
                { value: '', label: 'Yukni tanlang...' },
                { value: 'load1', label: 'YUK-2024-001 - Toshkent → Samarqand' },
                { value: 'load2', label: 'YUK-2024-004 - Buxoro → Navoiy' },
                { value: 'load3', label: 'YUK-2024-008 - Toshkent → Nukus' }
              ]}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Qo'shimcha ma'lumot</label>
            <textarea className="w-full p-3 border border-gray-300 rounded-xl font-sans resize-none focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" rows="3" placeholder="Haydovchiga qo'shimcha ko'rsatmalar..." />
          </div>
        </div>
      </Modal>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 p-4 rounded-xl shadow-lg z-50 flex items-center gap-3 bg-green-500 text-white animate-slide-in">
          <FaCheckCircle />
          <span>Yangi haydovchi qo'shildi!</span>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Haydovchilar;