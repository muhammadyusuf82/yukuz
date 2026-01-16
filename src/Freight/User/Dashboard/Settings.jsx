import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaCamera, FaEdit, FaSave, FaTimes, FaTruck, 
  FaUserTie, FaBuilding, FaMapMarkerAlt, FaIdCard, FaWeight, 
  FaPhone, FaFacebook, FaWhatsapp, FaEnvelope, FaCar, FaSnowflake,
  FaTruckPickup, FaBox, FaCheckCircle, FaExclamationCircle
} from "react-icons/fa";
import { BsFillFuelPumpFill } from "react-icons/bs";

// Transport type options with icons
const transportOptions = [
  { type: 'Tent', icon: <FaTruck className="text-blue-600" /> },
  { type: 'Refrijerator', icon: <FaSnowflake className="text-blue-600" /> },
  { type: 'Platforma', icon: <FaTruckPickup className="text-blue-600" /> },
  { type: 'Konteyner', icon: <FaBox className="text-blue-600" /> },
  { type: 'Sisterna', icon: <BsFillFuelPumpFill className="text-blue-600" /> },
];

// Regions data (same as in ProfileSetup)
const regions = {
  "Andijon viloyati": ["Andijon tumani", "Asaka tumani", "Baliqchi tumani", "Boʻz tumani", "Buloqboshi tumani", "Izboskan tumani", "Jalaquduq tumani", "Xoʻjaobod tumani", "Qoʻrgʻontepa tumani", "Marhamat tumani", "Paxtaobod tumani", "Ulugʻnor tumani", "Shahrixon tumani", "Oltinkoʻl tumani"],
  "Buxoro viloyati": ["Olot tumani", "Buxoro tumani", "Vobkent tumani", "Gʻijduvon tumani", "Jondor tumani", "Kogon tumani", "Qorakoʻl tumani", "Qorovulbozor tumani", "Peshku tumani", "Romitan tumani", "Shofirkon tumani"],
  "Jizzax viloyati": ["Arnasoy tumani", "Baxmal tumani", "Gʻallaorol tumani", "Doʻstlik tumani", "Zomin tumani", "Zarbdor tumani", "Zafarobod tumani", "Mirzachoʻl tumani", "Paxtakor tumani", "Forish tumani", "Sharof Rashidov tumani", "Yangiobod tumani"],
  "Qashqadaryo viloyati": ["Gʻuzor tumani", "Dehqonobod tumani", "Qamashi tumani", "Qarshi tumani", "Koson tumani", "Kasbi tumani", "Kitob tumani", "Mirishkor tumani", "Muborak tumani", "Nishon tumani", "Chiroqchi tumani", "Shahrisabz tumani", "Yakkabogʻ tumani"],
  "Navoiy viloyati": ["Konimex tumani", "Karmana tumani", "Qiziltepa tumani", "Navbahor tumani", "Nurota tumani", "Tomdi tumani", "Uchquduq tumani", "Xatirchi tumani"],
  "Namangan viloyati": ["Kosonsoy tumani", "Mingbuloq tumani", "Namangan tumani", "Norin tumani", "Pop tumani", "Toʻraqoʻrgʻon tumani", "Uychi tumani", "Uchqoʻrgʻon tumani", "Chortoq tumani", "Chust tumani", "Yangiqoʻrgʻon tumani"],
  "Samarqand viloyati": ["Oqdaryo tumani", "Bulungʻur tumani", "Jomboy tumani", "Ishtixon tumani", "Kattaqoʻrgʻon tumani", "Qoʻshrabot tumani", "Narpay tumani", "Nurobod tumani", "Payariq tumani", "Pastdargʻom tumani", "Paxtachi tumani", "Samarqand tumani", "Toyloq tumani", "Urgut tumani"],
  "Surxondaryo viloyati": ["Oltinsoy tumani", "Angor tumani", "Boysun tumani", "Bandixon tumani", "Denov tumani", "Jarqoʻrgʻon tumani", "Qiziriq tumani", "Qumqoʻrgʻon tumani", "Muzrabot tumani", "Sariosiyo tumani", "Termiz tumani", "Uzun tumani", "Sherobod tumani", "Shoʻrchi tumani"],
  "Sirdaryo viloyati": ["Oqoltin tumani", "Boyovut tumani", "Guliston tumani", "Mirzaobod tumani", "Xovos tumani", "Sardoba tumani", "Sayxunobod tumani", "Sirdaryo tumani"],
  "Toshkent viloyati": ["Oqqoʻrgʻon tumani", "Ohangaron tumani", "Bekobod tumani", "Boʻstonliq tumani", "Boʻka tumani", "Zangiota tumani", "Qibray tumani", "Quyi Chirchiq tumani", "Parkent tumani", "Piskent tumani", "Toshkent tumani", "Oʻrta Chirchiq tumani", "Chinoz tumani", "Yuqori Chirchiq tumani", "Yangiyoʻl tumani"],
  "Fargʻona viloyati": ["Oltiariq tumani", "Bagʻdod tumani", "Beshariq tumani", "Buvayda tumani", "Dangʻara tumani", "Quva tumani", "Qoʻshtepa tumani", "Rishton tumani", "Soʻx tumani", "Toshloq tumani", "Uchkoʻprik tumani", "Fargʻona tumani", "Furqat tumani", "Yozyovon tumani"],
  "Xorazm viloyati": ["Bogʻot tumani", "Gurlan tumani", "Xonqa tumani", "Hazorasp tumani", "Xiva tumani", "Qoʻshkoʻpir tumani", "Urganch tumani", "Shovot tumani", "Yangiariq tumani", "Yangibozor tumani"],
  "Qoraqalpogʻiston Respublikasi": ["Amudaryo tumani", "Beruniy tumani", "Qoraoʻzak tumani", "Kegeyli tumani", "Qoʻngʻirot tumani", "Qanlikoʻl tumani", "Moʻynoq tumani", "Nukus tumani", "Taxiatosh tumani", "Taxtakoʻpir tumani", "Toʻrtkoʻl tumani", "Xoʻjayli tumani", "Chimboy tumani", "Shumanay tumani", "Ellikqalʼa tumani"],
  "Toshkent shahri": ["Olmazor tumani", "Bektemir tumani", "Mirobod tumani", "Mirzo Ulugʻbek tumani", "Sergeli tumani", "Uchtepa tumani", "Yashnobod tumani", "Chilonzor tumani", "Shayxontohur tumani", "Yunusobod tumani", "Yakkasaroy tumani"]
};

// Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 border-l-4 ${bgColor} p-4 rounded-lg shadow-lg max-w-sm`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <FaCheckCircle className="text-green-500 mr-3" />
        ) : (
          <FaExclamationCircle className="text-red-500 mr-3" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder = "Tanlang", label }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 bg-slate-50 rounded-xl border border-gray-300 flex justify-between items-center hover:border-blue-500 transition-colors"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || placeholder}
          </span>
          <span className="text-gray-400">▼</span>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                  value === option ? "bg-blue-100 text-blue-700" : "text-gray-900"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Editable Field Component - FIXED VERSION
const EditableField = ({ 
  label, 
  value, 
  field, 
  editingField, 
  tempValue, // Added tempValue prop
  onTempChange, // Added temp change handler
  onStartEdit, 
  onSave, 
  onCancel, 
  type = "text", 
  placeholder = "", 
  icon: Icon = null,
  textarea = false
}) => {
  // Handle input change for the field being edited
  const handleChange = (e) => {
    onTempChange(field, e.target.value);
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1">
        {Icon && <Icon className="text-slate-400 text-sm" />}
        {label}
      </label>
      
      {editingField === field ? (
        <div className="flex gap-2">
          {textarea ? (
            <textarea
              value={tempValue || ''}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[80px] resize-y"
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <input
              type={type}
              value={tempValue || ''}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder={placeholder}
              autoFocus
            />
          )}
          <div className="flex gap-1">
            <button
              onClick={() => onSave(field)}
              className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <FaSave className="text-sm" />
            </button>
            <button
              onClick={onCancel}
              className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
          <span className="text-sm truncate">
            {value || <span className="text-slate-400 italic">{placeholder}</span>}
          </span>
          <button
            onClick={() => onStartEdit(field, value)}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <FaEdit className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

// Transport Type Selector
const TransportTypeSelector = ({ value, onChange }) => {
  const handleSelect = (type) => {
    onChange(type);
  };
  
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 ml-1">Transport turi</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {transportOptions.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => handleSelect(item.type)}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer ${
              value === item.type
                ? 'border-blue-700 bg-blue-700/10 shadow-md'
                : 'border-gray-300 hover:border-blue-500 hover:shadow-sm'
            }`}
          >
            <div className="text-xl mb-1">{item.icon}</div>
            <span className="text-xs text-center">{item.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, icon: Icon, children, color = "blue" }) => {
  const colors = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
    amber: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
    indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200"
  };

  return (
    <div className={`${colors[color]} rounded-2xl p-5 border shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          color === 'blue' ? 'bg-blue-100' : 
          color === 'purple' ? 'bg-purple-100' : 
          color === 'green' ? 'bg-green-100' : 
          color === 'amber' ? 'bg-amber-100' : 'bg-indigo-100'
        }`}>
          <Icon className={`text-lg ${
            color === 'blue' ? 'text-blue-600' : 
            color === 'purple' ? 'text-purple-600' : 
            color === 'green' ? 'text-green-600' : 
            color === 'amber' ? 'text-amber-600' : 'text-indigo-600'
          }`} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const Settings = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    state: '',
    district: '',
    role: '',
    companyName: '',
    driverLicense: '',
    transportType: '',
    transportCapacity: '',
    phone: '+998 99 396 73 36',
    facebook: '',
    whatsapp: '',
    photo: null,
    carNumber: '',
    averageShipmentVolume: '',
    notes: ''
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({}); // Changed to object to store multiple temp values
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [user, setUser] = useState(null);

  // Fetch user data from API using GET
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setNotification({ type: 'error', message: 'Avtorizatsiya talab qilinadi' });
          return;
        }

        const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
          method: 'GET',
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          
          // Parse address
          let state = '';
          let district = '';
          let address = '';
          
          if (data.address) {
            const addressParts = data.address.split(', ');
            if (addressParts.length >= 2) {
              state = addressParts[0];
              district = addressParts[1];
              address = addressParts.slice(2).join(', ');
            } else {
              state = data.address;
            }
          }

          setUserData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            address: address || '',
            state: state || '',
            district: district || '',
            role: data.role || localStorage.getItem('job') || '',
            companyName: data.company_name || '',
            driverLicense: data.driver_license || '',
            transportType: data.transport_type || '',
            transportCapacity: data.transport_capacity || '',
            phone: data.phone || '+998 99 396 73 36',
            facebook: data.facebook || '',
            whatsapp: data.whatsapp || '',
            photo: data.photo || null,
            carNumber: data.car_number || '',
            averageShipmentVolume: data.average_shipment_volume || '',
            notes: data.notes || ''
          });
        } else {
          setNotification({ type: 'error', message: 'Foydalanuvchi ma\'lumotlarini yuklashda xatolik' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setNotification({ type: 'error', message: 'Serverga ulanishda xatolik' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (userData.state && regions[userData.state]) {
      setDistricts(regions[userData.state]);
    } else {
      setDistricts([]);
    }
  }, [userData.state]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, photo: imageUrl }));
      setImageFile(file);
      setNotification({ type: 'success', message: 'Rasm yuklandi. Saqlash tugmasini bosing.' });
    }
  };

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValues(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleTempChange = (field, value) => {
    setTempValues(prev => ({ ...prev, [field]: value }));
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValues({});
  };

  const saveField = async (field) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      // Get the value to save
      const valueToSave = tempValues[field] || '';
      
      // Prepare data for PATCH
      const patchData = {};
      const fieldMapping = {
        'firstName': 'first_name',
        'lastName': 'last_name',
        'companyName': 'company_name',
        'driverLicense': 'driver_license',
        'transportType': 'transport_type',
        'transportCapacity': 'transport_capacity',
        'phone': 'phone',
        'facebook': 'facebook',
        'whatsapp': 'whatsapp',
        'carNumber': 'car_number',
        'averageShipmentVolume': 'average_shipment_volume',
        'notes': 'notes'
      };

      const apiField = fieldMapping[field] || field;
      
      // Handle address fields
      if (field === 'state' || field === 'district' || field === 'address') {
        const newState = field === 'state' ? valueToSave : userData.state;
        const newDistrict = field === 'district' ? valueToSave : userData.district;
        const newAddress = field === 'address' ? valueToSave : userData.address;
        patchData['address'] = `${newState}${newDistrict ? `, ${newDistrict}` : ''}${newAddress ? `, ${newAddress}` : ''}`;
        
        // Update local state after successful save
        const updatedData = { ...userData };
        if (field === 'state') updatedData.state = valueToSave;
        if (field === 'district') updatedData.district = valueToSave;
        if (field === 'address') updatedData.address = valueToSave;
        
        patchData['role'] = updatedData.role; // Include role

        const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patchData)
        });

        if (response.ok) {
          setUserData(updatedData);
          setEditingField(null);
          setTempValues({});
          setNotification({ type: 'success', message: 'Ma\'lumot yangilandi!' });
          
          // Save to localStorage for persistence
          localStorage.setItem('profileData', JSON.stringify(updatedData));
        } else {
          const errorData = await response.json();
          setNotification({ 
            type: 'error', 
            message: 'Yangilashda xatolik: ' + (errorData.message || errorData.detail || 'Noma\'lum xato')
          });
        }
      } else {
        patchData[apiField] = valueToSave;
        patchData['role'] = userData.role; // Include role

        const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patchData)
        });

        if (response.ok) {
          // Update local state
          setUserData(prev => ({ ...prev, [field]: valueToSave }));
          setEditingField(null);
          setTempValues({});
          setNotification({ type: 'success', message: 'Ma\'lumot yangilandi!' });
          
          // Save to localStorage for persistence
          localStorage.setItem('profileData', JSON.stringify({ ...userData, [field]: valueToSave }));
        } else {
          const errorData = await response.json();
          setNotification({ 
            type: 'error', 
            message: 'Yangilashda xatolik: ' + (errorData.message || errorData.detail || 'Noma\'lum xato')
          });
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setNotification({ type: 'error', message: 'Saqlashda xatolik yuz berdi' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      // Prepare FormData for PATCH
      const formData = new FormData();
      
      // Append all text fields
      formData.append('first_name', userData.firstName);
      formData.append('last_name', userData.lastName);
      formData.append('address', `${userData.state}${userData.district ? `, ${userData.district}` : ''}${userData.address ? `, ${userData.address}` : ''}`);
      formData.append('role', userData.role);
      
      if (userData.companyName) formData.append('company_name', userData.companyName);
      if (userData.driverLicense) formData.append('driver_license', userData.driverLicense);
      if (userData.transportType) formData.append('transport_type', userData.transportType);
      if (userData.transportCapacity) formData.append('transport_capacity', userData.transportCapacity);
      if (userData.phone) formData.append('phone', userData.phone);
      if (userData.facebook) formData.append('facebook', userData.facebook);
      if (userData.whatsapp) formData.append('whatsapp', userData.whatsapp);
      if (userData.carNumber) formData.append('car_number', userData.carNumber);
      if (userData.averageShipmentVolume) formData.append('average_shipment_volume', userData.averageShipmentVolume);
      if (userData.notes) formData.append('notes', userData.notes);
      
      // Append photo if exists
      if (imageFile) {
        formData.append('photo', imageFile);
      }

      const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setNotification({ type: 'success', message: 'Barcha ma\'lumotlar muvaffaqiyatli saqlandi!' });
        
        // Save to localStorage
        localStorage.setItem('profileData', JSON.stringify(userData));
        
        // Update photo if returned
        if (result.photo) {
          setUserData(prev => ({ ...prev, photo: result.photo }));
        }
      } else {
        const errorData = await response.json();
        setNotification({ 
          type: 'error', 
          message: 'Saqlashda xatolik: ' + (errorData.message || errorData.detail || 'Noma\'lum xato')
        });
      }
    } catch (error) {
      console.error('Save all error:', error);
      setNotification({ type: 'error', message: 'Saqlashda xatolik yuz berdi' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStateChange = (state) => {
    setUserData(prev => ({ ...prev, state, district: '' }));
  };

  const handleTransportTypeChange = (type) => {
    setUserData(prev => ({ ...prev, transportType: type }));
  };

  const handleDistrictChange = (district) => {
    setUserData(prev => ({ ...prev, district }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-4xl p-8 border border-slate-100">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border border-slate-100 shadow-sm">
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: '', message: '' })} 
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Profile Picture & Basic Info */}
        <div className="lg:w-1/3 space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {userData.photo ? (
                  <img 
                    src={userData.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-slate-400 text-5xl" />
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <FaCamera />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">{userData.firstName} {userData.lastName}</h1>
              <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  userData.role === 'driver' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}>
                  {userData.role === 'driver' ? '🚚 Haydovchi' : '📦 Yuk Jo\'natuvchi'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Info Card */}
          <InfoCard title="Shaxsiy ma'lumotlar" icon={FaUser} color="blue">
            <EditableField
              label="Ism"
              value={userData.firstName}
              field="firstName"
              editingField={editingField}
              tempValue={tempValues.firstName}
              onTempChange={handleTempChange}
              onStartEdit={startEditing}
              onSave={saveField}
              onCancel={cancelEdit}
              placeholder="Ismingiz"
            />
            
            <EditableField
              label="Familiya"
              value={userData.lastName}
              field="lastName"
              editingField={editingField}
              tempValue={tempValues.lastName}
              onTempChange={handleTempChange}
              onStartEdit={startEditing}
              onSave={saveField}
              onCancel={cancelEdit}
              placeholder="Familiyangiz"
            />
            
            <EditableField
              label="Telefon"
              value={userData.phone}
              field="phone"
              editingField={editingField}
              tempValue={tempValues.phone}
              onTempChange={handleTempChange}
              onStartEdit={startEditing}
              onSave={saveField}
              onCancel={cancelEdit}
              type="tel"
              placeholder="+998 99 123 45 67"
              icon={FaPhone}
            />
          </InfoCard>

          {/* Social Media Card */}
          <InfoCard title="Ijtimoiy tarmoqlar" icon={FaFacebook} color="green">
            <EditableField
              label="Facebook"
              value={userData.facebook}
              field="facebook"
              editingField={editingField}
              tempValue={tempValues.facebook}
              onTempChange={handleTempChange}
              onStartEdit={startEditing}
              onSave={saveField}
              onCancel={cancelEdit}
              placeholder="Facebook profil linki"
              icon={FaFacebook}
            />
            
            <EditableField
              label="WhatsApp"
              value={userData.whatsapp}
              field="whatsapp"
              editingField={editingField}
              tempValue={tempValues.whatsapp}
              onTempChange={handleTempChange}
              onStartEdit={startEditing}
              onSave={saveField}
              onCancel={cancelEdit}
              type="tel"
              placeholder="WhatsApp raqami"
              icon={FaWhatsapp}
            />
          </InfoCard>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:w-2/3 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Sozlamalar</h2>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-[#4361ee] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#3a56d4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-md"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saqlanmoqda...
                </>
              ) : (
                'Barcha o\'zgarishlarni saqlash'
              )}
            </button>
          </div>

          {/* Location Info Card */}
          <InfoCard title="Manzil ma'lumotlari" icon={FaMapMarkerAlt} color="purple">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Viloyat</label>
                <CustomDropdown
                  options={Object.keys(regions)}
                  value={userData.state}
                  onChange={handleStateChange}
                  placeholder="Viloyatni tanlang"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Tuman</label>
                <CustomDropdown
                  options={districts}
                  value={userData.district}
                  onChange={handleDistrictChange}
                  placeholder={userData.state ? "Tuman tanlang" : "Avval viloyatni tanlang"}
                />
              </div>
              
              <div className="md:col-span-2">
                <EditableField
                  label="Aniq manzil"
                  value={userData.address}
                  field="address"
                  editingField={editingField}
                  tempValue={tempValues.address}
                  onTempChange={handleTempChange}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEdit}
                  placeholder="Ko'cha, uy raqami"
                  textarea={true}
                />
              </div>
            </div>
          </InfoCard>

          {/* Role-specific Info */}
          {userData.role === 'driver' ? (
            <InfoCard title="Transport ma'lumotlari" icon={FaTruck} color="indigo">
              <div className="space-y-4">
                <EditableField
                  label="Haydovchilik guvohnomasi"
                  value={userData.driverLicense}
                  field="driverLicense"
                  editingField={editingField}
                  tempValue={tempValues.driverLicense}
                  onTempChange={handleTempChange}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEdit}
                  placeholder="AA 1234567"
                  icon={FaIdCard}
                />
                
                <TransportTypeSelector 
                  value={userData.transportType}
                  onChange={handleTransportTypeChange}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="Yuk sig'imi (kg)"
                    value={userData.transportCapacity}
                    field="transportCapacity"
                    editingField={editingField}
                    tempValue={tempValues.transportCapacity}
                    onTempChange={handleTempChange}
                    onStartEdit={startEditing}
                    onSave={saveField}
                    onCancel={cancelEdit}
                    type="number"
                    placeholder="5000"
                    icon={FaWeight}
                  />
                  
                  <EditableField
                    label="Mashina raqami"
                    value={userData.carNumber}
                    field="carNumber"
                    editingField={editingField}
                    tempValue={tempValues.carNumber}
                    onTempChange={handleTempChange}
                    onStartEdit={startEditing}
                    onSave={saveField}
                    onCancel={cancelEdit}
                    placeholder="01 A 123 AA"
                    icon={FaCar}
                  />
                </div>
              </div>
            </InfoCard>
          ) : (
            <InfoCard title="Yuk jo'natuvchi ma'lumotlari" icon={FaBuilding} color="amber">
              <div className="space-y-4">
                <EditableField
                  label="Kompaniya nomi"
                  value={userData.companyName}
                  field="companyName"
                  editingField={editingField}
                  tempValue={tempValues.companyName}
                  onTempChange={handleTempChange}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEdit}
                  placeholder="Kompaniya nomi"
                />
                
                <EditableField
                  label="O'rtacha yuk hajmi (kg)"
                  value={userData.averageShipmentVolume}
                  field="averageShipmentVolume"
                  editingField={editingField}
                  tempValue={tempValues.averageShipmentVolume}
                  onTempChange={handleTempChange}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEdit}
                  type="number"
                  placeholder="O'rtacha jo'natadigan yuk hajmi"
                  icon={FaWeight}
                />
                
                <EditableField
                  label="Qo'shimcha izohlar"
                  value={userData.notes}
                  field="notes"
                  editingField={editingField}
                  tempValue={tempValues.notes}
                  onTempChange={handleTempChange}
                  onStartEdit={startEditing}
                  onSave={saveField}
                  onCancel={cancelEdit}
                  placeholder="Yuk jo'natishga oid qo'shimcha ma'lumotlar..."
                  textarea={true}
                />
              </div>
            </InfoCard>
          )}

          {/* Account Info Card */}
          <InfoCard title="Hisob ma'lumotlari" icon={FaUserTie} color="green">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1">
                  <FaEnvelope className="text-slate-400 text-sm" />
                  Email
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-200">
                  <span className="text-sm">{userData.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email o'zgartirish uchun admin bilan bog'laning</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Hisob turi</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="text-sm">
                    {userData.role === 'driver' ? 'Haydovchi' : 'Yuk Jo\'natuvchi'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    userData.role === 'driver' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {userData.role === 'driver' ? '🚚' : '📦'}
                  </span>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;