import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaTruckLoading, FaMapMarkerAlt, FaFlagCheckered, FaWeightHanging,
  FaRulerCombined, FaBox, FaTruck, FaCalendarAlt, FaBolt,
  FaShieldAlt, FaCalculator, FaRedo, FaShoppingCart,
  FaCheck, FaTimes, FaChartLine, FaSyncAlt,
  FaChevronDown, FaCheckCircle, FaExclamationTriangle, FaUsers,
  FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import Navbar from './Navbar/Navbar';

// Helper functions
const formatNumber = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Reusable Components
const IconButton = ({ icon: Icon, label, color = 'blue', onClick, ...props }) => (
  <button
    className={`flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-sm hover:text-white hover:border-${color}-500 hover:bg-${color}-500 transition-all flex items-center justify-center gap-2`}
    onClick={onClick}
    {...props}
  >
    <Icon className="w-4 h-4" />{label}
  </button>
);

const StatCard = ({ title, value, trend, trendUp, icon: Icon, gradient }) => {
  const gradientClasses = {
    'blue': 'from-blue-600 to-purple-700',
    'cyan': 'from-cyan-400 to-cyan-500',
    'yellow': 'from-yellow-500 to-orange-400',
    'purple': 'from-purple-700 to-blue-600'
  };
  
  const bgColor = gradient.includes('blue') ? 'bg-blue-50 text-blue-600' :
                  gradient.includes('cyan') ? 'bg-cyan-50 text-cyan-400' :
                  gradient.includes('yellow') ? 'bg-yellow-50 text-yellow-500' : 'bg-purple-50 text-purple-700';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:-translate-y-1 transition-transform relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClasses[gradient] || gradient}`} />
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon className="text-xl" />
        </div>
        <span className={`${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'} text-sm font-semibold py-1 px-3 rounded-full flex items-center gap-1`}>
          {trendUp ? <FaArrowUp /> : <FaArrowDown />}{trend}
        </span>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
};

const SelectInput = ({ label, icon: Icon, name, value, options, onChange, ...props }) => (
  <div className="form-group">
    <label className="form-label font-medium text-gray-700 mb-2 flex items-center gap-2">
      <Icon className="text-blue-600" />{label}
    </label>
    <select 
      className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white text-gray-700 cursor-pointer appearance-none pr-10 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      style={{
        backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22%236c757d%22 viewBox=%220 0 16 16%22%3E%3Cpath d=%22M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z%22/%3E%3C/svg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '16px'
      }}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
    >
      {options}
    </select>
  </div>
);

const InputField = ({ label, icon: Icon, name, value, onChange, type = 'number', ...props }) => (
  <div className="form-group">
    <label className="form-label font-medium text-gray-700 mb-2 flex items-center gap-2">
      <Icon className="text-blue-600" />{label}
    </label>
    <input 
      type={type}
      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      name={name}
      value={value}
      onChange={onChange}
      {...props}
    />
  </div>
);

// Data objects
const priceData = {
  cities: [
    { id: 'tashkent', name: 'Toshkent', zone: 'central' },
    { id: 'samarkand', name: 'Samarqand', zone: 'central' },
    { id: 'bukhara', name: 'Buxoro', zone: 'western' },
    { id: 'andijan', name: 'Andijon', zone: 'eastern' },
    { id: 'fergana', name: "Farg'ona", zone: 'eastern' },
    { id: 'namangan', name: 'Namangan', zone: 'eastern' },
    { id: 'nukus', name: 'Nukus', zone: 'western' },
    { id: 'qarshi', name: 'Qarshi', zone: 'central' },
    { id: 'termiz', name: 'Termiz', zone: 'southern' },
    { id: 'navoiy', name: 'Navoiy', zone: 'central' }
  ],
  
  distances: {
    'tashkent-samarkand': 300, 'tashkent-bukhara': 550,
    'fergana-tashkent': 280, 'andijan-namangan': 120,
    'tashkent-nukus': 1200, 'samarkand-bukhara': 270,
    'bukhara-navoiy': 120, 'tashkent-termiz': 700,
    'fergana-andijan': 60, 'namangan-tashkent': 280
  },
  
  multipliers: {
    cargoType: { general: 1.0, refrigerated: 1.3, dangerous: 1.5, fragile: 1.2, liquid: 1.4, oversized: 1.6 },
    vehicleType: { tent: 1.0, refrigerator: 1.3, open: 0.9, closed: 1.0, tank: 1.4, flatbed: 1.2 },
    deliveryType: { standard: 1.0, express: 1.5, same_day: 2.0 },
    insurance: { no: 0, basic: 0.01, full: 0.02 }
  },
  
  baseRates: { perKm: 500, perKg: 10, perM3: 2000 }
};

const vehicleTypes = [
  { type: 'Tent', pricePerKm: 500, deliveryTime: '2-3 kun', capacity: '20 tonna / 82 m³' },
  { type: 'Refrijerator', pricePerKm: 650, deliveryTime: '1-2 kun', capacity: '8 tonna / 35 m³' },
  { type: 'Ochiq Platforma', pricePerKm: 450, deliveryTime: '2-4 kun', capacity: '25 tonna / 60 m³' },
  { type: 'Sisterna', pricePerKm: 800, deliveryTime: '2-3 kun', capacity: '15 tonna / 30 m³' },
  { type: 'Furgon', pricePerKm: 350, deliveryTime: '1-2 kun', capacity: '3 tonna / 15 m³' }
];

const plans = [
  { id: 'starter', title: 'Boshlang\'ich', price: '500,000', featured: false },
  { id: 'professional', title: 'Professional', price: '1,200,000', featured: true },
  { id: 'business', title: 'Biznes', price: '3,500,000', featured: false }
];

const stats = [
  { title: 'Jami Buyurtmalar', value: '1,254', trend: '15%', trendUp: true, icon: FaTruckLoading, gradient: 'blue' },
  { title: 'O\'rtacha Narx', value: '850K', trend: '8%', trendUp: true, icon: FaChartLine, gradient: 'cyan' },
  { title: 'Faol Haydovchilar', value: '89', trend: '3%', trendUp: false, icon: FaUsers, gradient: 'yellow' },
  { title: 'Mijozlar', value: '456', trend: '24%', trendUp: true, icon: FaCheckCircle, gradient: 'purple' }
];

const initialFormData = {
  fromCity: '', toCity: '', weight: '1000', volume: '10',
  cargoType: 'general', vehicleType: 'tent', pickupDate: '',
  deliveryType: 'standard', insurance: 'no'
};

const initialPriceBreakdown = {
  basePrice: 0, distance: 0, typePrice: 0,
  deliveryPrice: 0, insurancePrice: 0, totalPrice: 0
};

// Main Pricing Component
const PricingPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [priceBreakdown, setPriceBreakdown] = useState(initialPriceBreakdown);
  const [notification, setNotification] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);

  // Set default date on mount
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({ ...prev, pickupDate: tomorrow.toISOString().split('T')[0] }));
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePrice = () => {
    const { fromCity, toCity, weight, volume, cargoType, vehicleType, deliveryType, insurance } = formData;
    
    if (!fromCity || !toCity) {
      showNotification('Iltimos, qayerdan va qayerga shaharlarni tanlang!', 'warning');
      return;
    }
    
    const weightNum = parseFloat(weight) || 0;
    const volumeNum = parseFloat(volume) || 0;
    
    if (weightNum <= 0 || volumeNum <= 0) {
      showNotification('Iltimos, og\'irlik va hajmni to\'g\'ri kiriting!', 'warning');
      return;
    }
    
    // Calculate distance
    const routeKey = `${fromCity}-${toCity}`;
    const distance = priceData.distances[routeKey] || (fromCity === toCity ? 50 : 300);
    
    // Calculate base price
    const basePrice = (distance * priceData.baseRates.perKm) +
                     (weightNum * priceData.baseRates.perKg) +
                     (volumeNum * priceData.baseRates.perM3);
    
    // Apply multipliers
    const cargoMultiplier = priceData.multipliers.cargoType[cargoType] || 1;
    const vehicleMultiplier = priceData.multipliers.vehicleType[vehicleType] || 1;
    const deliveryMultiplier = priceData.multipliers.deliveryType[deliveryType] || 1;
    
    let totalPrice = basePrice * cargoMultiplier * vehicleMultiplier * deliveryMultiplier;
    
    // Apply insurance
    const insuranceRate = priceData.multipliers.insurance[insurance] || 0;
    const insuranceAmount = totalPrice * insuranceRate;
    
    // Final price with commission
    totalPrice = Math.round(totalPrice + insuranceAmount + (totalPrice * 0.05));
    
    setPriceBreakdown({
      basePrice: Math.round(basePrice),
      distance: distance,
      typePrice: Math.round(basePrice * (cargoMultiplier - 1)),
      deliveryPrice: Math.round(totalPrice * (deliveryMultiplier - 1)),
      insurancePrice: Math.round(insuranceAmount),
      totalPrice: totalPrice
    });
    
    showNotification('Narx muvaffaqiyatli hisoblandi!', 'success');
  };

  const resetCalculator = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData({ ...initialFormData, pickupDate: tomorrow.toISOString().split('T')[0] });
    setPriceBreakdown(initialPriceBreakdown);
    showNotification('Kalkulyator tozalandi', 'success');
  };

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const renderCityOptions = () => (
    <>
      <option value="">Shahar tanlang</option>
      {priceData.cities.map(city => (
        <option key={city.id} value={city.id}>{city.name}</option>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/10 to-purple-50/10 font-sans text-gray-800">
      <Navbar/>

      <main className="main-content py-12">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="page-header mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Yuk Tashish Narxlari</h1>
            <p className="text-gray-600 text-lg">Yukingiz narxini hisoblang, solishtiring va eng yaxshi taklifni toping</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map(stat => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Price Calculator */}
          <section className="price-calculator bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-12">
            <div className="calculator-header flex items-center justify-between mb-6">
              <div>
                <h2 className="calculator-title text-2xl font-bold text-gray-900">Narx Kalkulyatori</h2>
                <p className="calculator-subtitle text-gray-600 text-sm">Yukingiz parametrlarini kiriting va aniq narxni bilib oling</p>
              </div>
              <button className="btn-outline py-3 px-6 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2" onClick={resetCalculator}>
                <FaRedo /> Tozalash
              </button>
            </div>

            <div className="calculator-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="calculator-form lg:col-span-2 space-y-6">
                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectInput label="Qayerdan" icon={FaMapMarkerAlt} name="fromCity" value={formData.fromCity} onChange={handleInputChange} options={renderCityOptions()} />
                  <SelectInput label="Qayerga" icon={FaFlagCheckered} name="toCity" value={formData.toCity} onChange={handleInputChange} options={renderCityOptions()} />
                </div>

                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Og'irlik (kg)" icon={FaWeightHanging} name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Masalan: 1000" min="1" max="50000" />
                  <InputField label="Hajm (m³)" icon={FaRulerCombined} name="volume" value={formData.volume} onChange={handleInputChange} placeholder="Masalan: 10" min="0.1" max="100" step="0.1" />
                </div>

                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectInput label="Yuk Turi" icon={FaBox} name="cargoType" value={formData.cargoType} onChange={handleInputChange}>
                    {Object.entries(priceData.multipliers.cargoType).map(([key]) => (
                      <option key={key} value={key}>
                        {key === 'general' ? 'Umumiy yuk' : 
                         key === 'refrigerated' ? 'Sovutilgan' :
                         key === 'dangerous' ? 'Xavfli yuk' :
                         key === 'fragile' ? 'Mozor yuk' :
                         key === 'liquid' ? 'Suyuq yuk' : 'Katta hajmdagi'}
                      </option>
                    ))}
                  </SelectInput>
                  
                  <SelectInput label="Transport Turi" icon={FaTruck} name="vehicleType" value={formData.vehicleType} onChange={handleInputChange}>
                    {Object.entries(priceData.multipliers.vehicleType).map(([key]) => (
                      <option key={key} value={key}>
                        {key === 'tent' ? 'Tent' :
                         key === 'refrigerator' ? 'Refrijerator' :
                         key === 'open' ? 'Ochiq' :
                         key === 'closed' ? 'Yopiq' :
                         key === 'tank' ? 'Sisterna' : 'Platforma'}
                      </option>
                    ))}
                  </SelectInput>
                </div>

                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Yuklash Sanasi" icon={FaCalendarAlt} name="pickupDate" value={formData.pickupDate} onChange={handleInputChange} type="date" />
                  
                  <SelectInput label="Yetkazib berish turi" icon={FaBolt} name="deliveryType" value={formData.deliveryType} onChange={handleInputChange}>
                    {Object.entries(priceData.multipliers.deliveryType).map(([key]) => (
                      <option key={key} value={key}>
                        {key === 'standard' ? 'Standart (3-5 kun)' :
                         key === 'express' ? 'Ekspress (1-2 kun)' : 'Bir kunlik'}
                      </option>
                    ))}
                  </SelectInput>
                </div>

                <div className="form-group">
                  <label className="form-label font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaShieldAlt className="text-blue-600" />
                    Sug'urta
                  </label>
                  <div className="insurance-options flex gap-6 items-center">
                    {['no', 'basic', 'full'].map((value) => (
                      <label key={value} className="insurance-option flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="insurance" 
                          value={value}
                          checked={formData.insurance === value}
                          onChange={handleInputChange}
                          className="text-blue-600"
                        />
                        <span className="text-sm">
                          {value === 'no' ? 'Sug\'urtasiz' :
                           value === 'basic' ? 'Asosiy (1%)' : 'To\'liq (2%)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculator Result */}
              <div className="calculator-result bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white flex flex-col justify-between">
                <div>
                  <div className="result-header text-center mb-6">
                    <div className="result-title text-xl font-semibold">Taxminiy Narx</div>
                    <div className="result-subtitle text-sm opacity-90">Barcha xizmatlar narxi bilan</div>
                  </div>

                  <div className="result-price text-center mb-6">
                    <div className="price-label text-sm opacity-90 mb-2">Jami to'lov</div>
                    <div className="price-value text-4xl font-bold">{formatNumber(priceBreakdown.totalPrice)}</div>
                    <div className="price-unit text-sm opacity-90">so'm</div>
                  </div>

                  <div className="price-breakdown bg-white/10 rounded-xl p-4 mb-6">
                    {Object.entries(priceBreakdown).map(([key, value]) => key !== 'totalPrice' && (
                      <div key={key} className="breakdown-item flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                        <span className="breakdown-label text-sm opacity-90 capitalize">
                          {key === 'basePrice' ? 'Asosiy narx' :
                           key === 'distance' ? 'Masofa' :
                           key === 'typePrice' ? 'Yuk turi' :
                           key === 'deliveryPrice' ? 'Yetkazish' : 'Sug\'urta'}
                        </span>
                        <span className="breakdown-value font-semibold">
                          {key === 'distance' ? `${value} km` : `${formatNumber(value)} so'm`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="calculator-actions flex gap-3">
                  <button className="btn-primary flex-1 bg-white text-blue-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-1 transition-all" onClick={calculatePrice}>
                    <FaCalculator /> Hisoblash
                  </button>
                  <button className="btn-outline flex-1 bg-transparent border border-white/30 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all" onClick={() => showNotification('Buyurtma funksiyasi faollashtirilgan', 'success')}>
                    <FaShoppingCart /> Buyurtma
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Price Cards */}
          <section className="price-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div key={plan.id} className={`price-card bg-white rounded-2xl shadow-md border border-gray-100 hover:-translate-y-1 transition-all overflow-hidden relative ${plan.featured ? 'border-2 border-blue-600' : ''}`}>
                {plan.featured && (
                  <div className="featured-badge absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-xs font-semibold py-1 px-3 rounded-xl z-10">Tavsiya etiladi</div>
                )}
                
                <div className="card-header p-6 border-b border-gray-100 text-center">
                  <h3 className="card-title text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="card-subtitle text-gray-600 text-sm">{plan.subtitle}</p>
                </div>
                
                <div className="card-price p-6 bg-gray-50 text-center">
                  <div className="card-amount text-3xl font-bold text-blue-600 mb-1">{plan.price}</div>
                  <div className="card-period text-sm text-gray-500">{plan.period}</div>
                </div>
                
                <div className="card-actions p-6 border-t border-gray-100 text-center">
                  <button 
                    className={`btn ${plan.featured ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'border border-blue-600 text-blue-600'} font-semibold py-3 px-6 rounded-xl w-full hover:shadow-lg hover:-translate-y-0.5 transition-all`}
                    onClick={() => showNotification(`${plan.title} tarif tanlandi`, 'success')}
                  >
                    Tanlash
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="logo flex items-center gap-3 mb-4">
                <div className="logo-icon w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <FaTruckLoading />
                </div>
                <span className="text-xl font-bold">Yuk.uz</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">O'zbekistondagi eng yirik yuk tashish platformasi.</p>
            </div>
            
            {['Bizning xizmatlar', 'Kompaniya', 'Aloqa'].map(section => (
              <div key={section}>
                <h4 className="font-bold text-lg mb-4">{section}</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {section === 'Aloqa' ? (
                    <>
                      <li>+998 90 123 45 67</li>
                      <li>info@yuk.uz</li>
                      <li>Toshkent shahar</li>
                      <li>Ish vaqti: 24/7</li>
                    </>
                  ) : (
                    Array(4).fill().map((_, i) => (
                      <li key={i}><a href="#" className="hover:text-white">{section} {i+1}</a></li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Yuk.uz. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 p-4 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-slide-in ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
          {notification.type === 'success' ? <FaCheckCircle /> : notification.type === 'warning' ? <FaExclamationTriangle /> : <FaTimes />}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default PricingPage;