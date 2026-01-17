import React, { useState, useRef, useEffect, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    FaCloudUploadAlt,
    FaBox,
    FaMoneyBillWave,
    FaArrowLeft,
    FaMapMarkerAlt,
    FaMap,
    FaLocationArrow,
    FaSyncAlt,
    FaPlus,
    FaMinus,
    FaExclamationTriangle,
    FaChevronDown,
    FaCheck
} from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";

const baseUrl = 'https://tokennoty.pythonanywhere.com/api/freight/';

// Custom Dropdown Component
const CustomDropdown = ({ 
  label, 
  value, 
  options, 
  onChange, 
  name,
  placeholder = "Tanlang...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || { value: '', label: placeholder };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-1.5 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left flex justify-between items-center focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isOpen ? 'ring-2 ring-blue-500 bg-white' : ''}`}
        >
          <span className={value ? 'text-slate-800' : 'text-slate-400'}>
            {selectedOption.label}
          </span>
          <FaChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange({ target: { name, value: option.value } });
                  setIsOpen(false);
                }}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center ${value === option.value ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <span>{option.label}</span>
                {value === option.value && <FaCheck className="text-blue-600" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Define options from Django models with Uzbek translations
const shippingModeOptions = [
  { value: 'FTL', label: "To'liq yuk (FTL)" },
  { value: 'LTL', label: "Qismiy yuk (LTL)" }
];

const vehicleCategoryOptions = [
  { value: 'van', label: 'Van' },
  { value: 'semitruck', label: 'Yarim tirkama' },
  { value: 'truck', label: 'Yuk mashinasi' },
  { value: 'doubletrailer', label: 'Ikki tirkamali' },
  { value: 'pickup', label: 'Pikap' },
  { value: 'container', label: 'Konteyner' },
  { value: 'refrigerator', label: 'Sovutgichli' },
  { value: 'tanktruck', label: 'Silonli' }
];

const bodyTypeOptions = [
  { value: 'open', label: 'Ochiq' },
  { value: 'closed', label: 'Yopiq' }
];

const loadingMethodOptions = [
  { value: 'back', label: 'Orqadan' },
  { value: 'top', label: 'Ustidan' }
];

const dangerOptions = [
  { value: '1', label: '1-daraja: Portlovchi moddalar va buyumlar' },
  { value: '21', label: '2.1-daraja: Yonuvchi gazlar' },
  { value: '22', label: '2.2-daraja: Yonmas gazlar' },
  { value: '23', label: '2.3-daraja: Zaharli gazlar' },
  { value: '3', label: '3-daraja: Yonuvchi suyuqliklar' },
  { value: '41', label: '4.1-daraja: Yonuvchi qattiq moddalar' },
  { value: '42', label: '4.2-daraja: Oʻz-oʻzidan yonuvchi moddalar' },
  { value: '43', label: '4.3-daraja: Suv bilan aloqa qilganda yonuvchi gazlar chiqaradigan moddalar' },
  { value: '51', label: '5.1-daraja: Oksidlovchi moddalar' },
  { value: '52', label: '5.2-daraja: Organik peroksidlar' },
  { value: '61', label: '6.1-daraja: Zaharli moddalar' },
  { value: '62', label: '6.2-daraja: Yuqumli moddalar' },
  { value: '7', label: '7-daraja: Radioaktiv moddalar' },
  { value: '8', label: '8-daraja: Korroziv moddalar' },
  { value: '9', label: '9-daraja: Boshqa xavfli moddalar' }
];

const paymentMethodOptions = [
  { value: 'cash', label: 'Naqd pul' },
  { value: 'card', label: 'Karta' },
  { value: 'bank_transfer', label: 'Bank o\'tkazmasi' },
  { value: 'btc', label: 'Bitcoin' },
  { value: 'eth', label: 'Ethereum' },
  { value: 'click', label: 'Click' },
  { value: 'payme', label: 'Payme' }
];

const paymentConditionOptions = [
  { value: 'copied_documents', label: 'Nusxa hujjatlar' },
  { value: 'original_document', label: 'Asl hujjatlar' },
  { value: 'digital_document', label: 'Raqamli hujjatlar' }
];

const AddCargo = ({ onNavigate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        freight_type: '',
        description_uz: '',
        weight: '',
        volume: '',
        freight_rate_amount: '',
        route_starts_where_region: '',
        route_starts_where_city: '',
        route_ends_where_region: '',
        route_ends_where_city: '',
        danger: '1',
        shipping_mode: 'FTL',
        vehicle_category: 'van',
        body_type: 'open',
        loading_method: 'back',
        unloading_method: 'back',
        payment_method: 'cash',
        payment_condition: 'copied_documents',
        payment_period: 0,
        route_starts_where_lat: '',
        route_starts_where_lon: '',
        route_ends_where_lat: '',
        route_ends_where_lon: '',
    });

    // Map references
    const mapContainer = useRef(null);
    const map = useRef(null);
    const startMarker = useRef(null);
    const endMarker = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(14);
    const [lng, setLng] = useState(69.2401);
    const [lat, setLat] = useState(41.2995);
    const [userPosition, setUserPosition] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [coordinateWarning, setCoordinateWarning] = useState('');
    const [activeMarker, setActiveMarker] = useState('start');
    const [markerInstructions, setMarkerInstructions] = useState('Xaritadan boshlanish manzilini tanlang (ko\'k marker)');

    const activeMarkerRef = useRef(activeMarker);
    
    useEffect(() => {
        activeMarkerRef.current = activeMarker;
        setMarkerInstructions(activeMarker === 'start' 
            ? 'Xaritadan boshlanish manzilini tanlang (ko\'k marker)' 
            : 'Xaritadan tugash manzilini tanlang (qizil marker)');
    }, [activeMarker]);

    const formatCoordinate = (coord) => {
        if (!coord && coord !== 0) return '';
        
        const str = coord.toString();
        const trimmed = str.trim();
        
        if (trimmed.length <= 9) {
            return trimmed;
        }
        
        if (trimmed.includes('.')) {
            const [integerPart, decimalPart] = trimmed.split('.');
            const integerLength = integerPart.length;
            const availableDecimalDigits = 9 - integerLength - 1;
            
            if (availableDecimalDigits > 0) {
                return `${integerPart}.${decimalPart.substring(0, availableDecimalDigits)}`;
            } else {
                return integerPart;
            }
        }
        
        return trimmed.substring(0, 9);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        const isStartCoord = name.includes('route_starts_where');
        const isEndCoord = name.includes('route_ends_where');
        
        if (isStartCoord || isEndCoord) {
            const formattedValue = formatCoordinate(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
            
            if (value.length > 9) {
                setCoordinateWarning('Koordinatalar 9 raqamga qisqartirildi');
            } else {
                setCoordinateWarning('');
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const getUserLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Brauzeringiz geolokatsiyani qo\'llab-quvvatlamaydi'));
                return;
            }

            setLocationLoading(true);
            setLocationError(null);
            setCoordinateWarning('');
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = {
                        lat: formatCoordinate(latitude),
                        lon: formatCoordinate(longitude)
                    };
                    
                    localStorage.setItem('userLocation', JSON.stringify(location));
                    
                    setUserPosition([parseFloat(location.lon), parseFloat(location.lat)]);
                    setLocationLoading(false);
                    
                    if (map.current) {
                        map.current.flyTo({
                            center: [parseFloat(location.lon), parseFloat(location.lat)],
                            zoom: 17,
                            duration: 2000
                        });
                    }
                    
                    updateMarker(parseFloat(location.lon), parseFloat(location.lat), activeMarkerRef.current);
                    
                    resolve(location);
                },
                (error) => {
                    let errorMessage = 'Joylashuvni aniqlab bo\'lmadi';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Joylashuv ruxsati berilmagan. Iltimos, joylashuv xizmatlarini yoqing.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Joylashuv ma\'lumoti mavjud emas.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Joylashuv so\'rovi vaqt tugadi.';
                            break;
                        default:
                            errorMessage = '';
                    }
                    setLocationError(errorMessage);
                    setLocationLoading(false);
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });
    }, []);

    const updateMarker = useCallback((lng, lat, markerType) => {
        if (!map.current) return;
        
        const formattedLng = formatCoordinate(lng);
        const formattedLat = formatCoordinate(lat);
        
        const originalLngStr = lng.toString();
        const originalLatStr = lat.toString();
        
        if (originalLngStr.length > 9 || originalLatStr.length > 9) {
            setCoordinateWarning('Koordinatalar 9 raqamga qisqartirildi');
        } else {
            setCoordinateWarning('');
        }
        
        if (markerType === 'start' && startMarker.current) {
            startMarker.current.remove();
        } else if (markerType === 'end' && endMarker.current) {
            endMarker.current.remove();
        }

        const markerLng = parseFloat(formattedLng);
        const markerLat = parseFloat(formattedLat);

        const el = document.createElement('div');
        el.className = `${markerType}-location-marker`;
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.background = markerType === 'start' ? '#4361ee' : '#e63946';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid #FFFFFF';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
        el.style.cursor = 'pointer';
        el.style.zIndex = '1000';

        const icon = document.createElement('div');
        icon.innerHTML = markerType === 'start' ? '🚚' : '📍';
        icon.style.fontSize = '16px';
        icon.style.position = 'absolute';
        icon.style.top = '50%';
        icon.style.left = '50%';
        icon.style.transform = 'translate(-50%, -50%)';
        el.appendChild(icon);

        const newMarker = new maplibregl.Marker({
            element: el,
            draggable: true
        })
            .setLngLat([markerLng, markerLat])
            .addTo(map.current);

        if (markerType === 'start') {
            startMarker.current = newMarker;
        } else {
            endMarker.current = newMarker;
        }

        const popup = new maplibregl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false
        }).setHTML(`
            <div style="padding: 8px;">
                <h3 style="margin: 0; font-weight: bold; font-size: 14px; color: ${markerType === 'start' ? '#4361ee' : '#e63946'};">
                    ${markerType === 'start' ? '🚚 Yuklash Manzili' : '📍 Yetkazib Berish Manzili'}
                </h3>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
                    Kenglik: ${formattedLat}<br/>
                    Uzunlik: ${formattedLng}
                </p>
            </div>
        `);
        
        newMarker.setPopup(popup);

        el.addEventListener('mouseenter', () => {
            newMarker.togglePopup();
        });
        
        el.addEventListener('mouseleave', () => {
            newMarker.togglePopup();
        });

        newMarker.on('dragend', () => {
            const lngLat = newMarker.getLngLat();
            
            const draggedFormattedLng = formatCoordinate(lngLat.lng);
            const draggedFormattedLat = formatCoordinate(lngLat.lat);
            
            const draggedOriginalLngStr = lngLat.lng.toString();
            const draggedOriginalLatStr = lngLat.lat.toString();
            
            if (draggedOriginalLngStr.length > 9 || draggedOriginalLatStr.length > 9) {
                setCoordinateWarning('Koordinatalar 9 raqamga qisqartirildi');
            } else {
                setCoordinateWarning('');
            }
            
            setFormData(prev => ({
                ...prev,
                [`route_${markerType}s_where_lon`]: draggedFormattedLng,
                [`route_${markerType}s_where_lat`]: draggedFormattedLat
            }));
        });

        setFormData(prev => ({
            ...prev,
            [`route_${markerType}s_where_lon`]: formattedLng,
            [`route_${markerType}s_where_lat`]: formattedLat
        }));
    }, []);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        console.log('Batafsil xarita ishga tushmoqda...');
        
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© OpenStreetMap contributors',
                        maxzoom: 19
                    }
                },
                layers: [{
                    id: 'osm-layer',
                    type: 'raster',
                    source: 'osm'
                }]
            },
            center: [lng, lat],
            zoom: zoomLevel,
            minZoom: 4,
            maxZoom: 19,
            pitch: 0,
            bearing: 0,
            interactive: true,
        });

        map.current.on('zoom', () => {
            const currentZoom = map.current.getZoom();
            setZoomLevel(currentZoom);
        });

        map.current.on('move', () => {
            const center = map.current.getCenter();
            setLng(center.lng);
            setLat(center.lat);
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.addControl(new maplibregl.ScaleControl({
            maxWidth: 200,
            unit: 'metric'
        }), 'bottom-left');

        map.current.on('load', () => {
            console.log('Batafsil xarita yuklandi');
            setMapLoaded(true);
            
            const savedLocation = localStorage.getItem('userLocation');
            if (savedLocation) {
                try {
                    const location = JSON.parse(savedLocation);
                    if (location.lat && location.lon) {
                        setUserPosition([parseFloat(location.lon), parseFloat(location.lat)]);
                    }
                } catch (error) {
                    console.error('Saqlangan joylashuvni o\'qishda xatolik:', error);
                }
            }
        });

        map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            updateMarker(lng, lat, activeMarkerRef.current);
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
                setMapLoaded(false);
            }
        };
    }, [updateMarker]);

    const handleUseCurrentLocation = async () => {
        try {
            await getUserLocation();
        } catch (error) {
            console.error('Joylashuvni olishda xatolik:', error.message);
        }
    };

    const handleClearLocation = (markerType) => {
        if (markerType === 'start' && startMarker.current) {
            startMarker.current.remove();
            startMarker.current = null;
        } else if (markerType === 'end' && endMarker.current) {
            endMarker.current.remove();
            endMarker.current = null;
        }
        
        setFormData(prev => ({
            ...prev,
            [`route_${markerType}s_where_lon`]: '',
            [`route_${markerType}s_where_lat`]: ''
        }));
        setCoordinateWarning('');
    };

    const centerOnTashkent = () => {
        if (map.current) {
            map.current.flyTo({
                center: [69.2401, 41.2995],
                zoom: 15,
                duration: 1500
            });
        }
    };

    const resetView = () => {
        if (map.current) {
            map.current.flyTo({
                center: [64.4556, 41.0000],
                zoom: 6,
                duration: 1500
            });
        }
    };

    const toggleMapStyle = () => {
        const newShowSatellite = !showSatellite;
        setShowSatellite(newShowSatellite);
        
        if (map.current) {
            const newStyle = newShowSatellite
                ? {
                    version: 8,
                    sources: {
                        'satellite': {
                            type: 'raster',
                            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                            tileSize: 256,
                            attribution: '© Esri',
                            maxzoom: 19
                        }
                    },
                    layers: [{
                        id: 'satellite-layer',
                        type: 'raster',
                        source: 'satellite'
                    }]
                }
                : {
                    version: 8,
                    sources: {
                        'osm': {
                            type: 'raster',
                            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                            tileSize: 256,
                            attribution: '© OpenStreetMap contributors',
                            maxzoom: 19
                        }
                    },
                    layers: [{
                        id: 'osm-layer',
                        type: 'raster',
                        source: 'osm'
                    }]
                };

            map.current.setStyle(newStyle);

            map.current.once('styledata', () => {
                if (startMarker.current && formData.route_starts_where_lat && formData.route_starts_where_lon) {
                    const lng = parseFloat(formData.route_starts_where_lon);
                    const lat = parseFloat(formData.route_starts_where_lat);
                    if (!isNaN(lng) && !isNaN(lat)) {
                        updateMarker(lng, lat, 'start');
                    }
                }
                
                if (endMarker.current && formData.route_ends_where_lat && formData.route_ends_where_lon) {
                    const lng = parseFloat(formData.route_ends_where_lon);
                    const lat = parseFloat(formData.route_ends_where_lat);
                    if (!isNaN(lng) && !isNaN(lat)) {
                        updateMarker(lng, lat, 'end');
                    }
                }
            });
        }
    };

    const token = localStorage.getItem('token');
    
    const getAuthToken = async () => {
        try {
            const get_user = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
                method: 'GET',
                headers: { 'Authorization': `Token ${token}` }
            });
            const res = await get_user.json();
        } catch(error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token') || await getAuthToken();

        if (!token) {
            setLoading(false);
            return;
        }

        const form = e.target;
        const formDataObj = new FormData();

        const startLat = formData.route_starts_where_lat;
        const startLon = formData.route_starts_where_lon;
        const endLat = formData.route_ends_where_lat;
        const endLon = formData.route_ends_where_lon;
        
        if (startLat && startLat.length > 9) {
            alert('Xatolik: Boshlanish kengligi 9 raqamdan oshib ketdi');
            setLoading(false);
            return;
        }
        
        if (startLon && startLon.length > 9) {
            alert('Xatolik: Boshlanish uzunligi 9 raqamdan oshib ketdi');
            setLoading(false);
            return;
        }
        
        if (endLat && endLat.length > 9) {
            alert('Xatolik: Tugash kengligi 9 raqamdan oshib ketdi');
            setLoading(false);
            return;
        }
        
        if (endLon && endLon.length > 9) {
            alert('Xatolik: Tugash uzunligi 9 raqamdan oshib ketdi');
            setLoading(false);
            return;
        }

        formDataObj.append('public', 'true');
        formDataObj.append('danger', formData.danger || '1');
        formDataObj.append('weight', formData.weight || 0);
        formDataObj.append('volume', formData.volume || "0");
        formDataObj.append('freight_type', formData.freight_type || '');
        formDataObj.append('description_uz', formData.description_uz || '');
        formDataObj.append('shipping_mode', formData.shipping_mode || 'FTL');
        formDataObj.append('vehicle_category', formData.vehicle_category || 'van');
        formDataObj.append('body_type', formData.body_type || 'open');

        formDataObj.append('route_starts_where_region', formData.route_starts_where_region || '');
        formDataObj.append('route_starts_where_city', formData.route_starts_where_city || '');
        
        formDataObj.append('route_starts_where_lat', startLat || '41.2995');
        formDataObj.append('route_starts_where_lon', startLon || '69.2401');

        formDataObj.append('route_ends_where_region', formData.route_ends_where_region || '');
        formDataObj.append('route_ends_where_city', formData.route_ends_where_city || '');
        
        formDataObj.append('route_ends_where_lat', endLat || '41.2995');
        formDataObj.append('route_ends_where_lon', endLon || '69.2401');

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => date.toISOString().split('.')[0] + "Z";

        formDataObj.append('route_start_time_from', formatDate(now));
        formDataObj.append('route_start_time_to', formatDate(now));
        formDataObj.append('route_end_time_from', formatDate(tomorrow));
        formDataObj.append('route_end_time_to', formatDate(tomorrow));

        formDataObj.append('loading_method', formData.loading_method || 'back');
        formDataObj.append('unloading_method', formData.unloading_method || 'back');

        formDataObj.append('freight_rate_currency', 'UZS');
        formDataObj.append('freight_rate_amount', formData.freight_rate_amount || "0");
        formDataObj.append('payment_method', formData.payment_method || 'cash');
        formDataObj.append('payment_condition', formData.payment_condition || 'copied_documents');
        formDataObj.append('payment_period', formData.payment_period || 0);

        if (form.photo && form.photo.files[0]) {
            formDataObj.append('photo', form.photo.files[0]);
        }

        console.log('Yuborilayotgan koordinatalar:', {
            boshlanish: { kenglik: startLat || '41.2995', uzunlik: startLon || '69.2401' },
            tugash: { kenglik: endLat || '41.2995', uzunlik: endLon || '69.2401' }
        });

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formDataObj
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Muvaffaqiyatli:', data);
                alert("Yuk muvaffaqiyatli qo'shildi!");
                onNavigate();
            } else {
                const errorText = await response.text();
                console.error("API Xatosi:", errorText);
                // alert(`Xatolik: ${response.status} - ${errorText.substring(0, 100)}`);
            }
        } catch (err) {
            console.error("Tarmoq xatosi:", err);
            // alert("Serverga ulanishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const setMarkerType = (type) => {
        setActiveMarker(type);
    };

    return (
        <div className="bg-white rounded-4xl shadow-sm p-6 sm:p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                        <FaBox size={20} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Yangi yuk e'lon qilish</h2>
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                    <FaArrowLeft /> <span className="hidden sm:inline">Orqaga</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Mahsulot nomi */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Mahsulot nomi *</label>
                        <input
                            name="freight_type"
                            value={formData.freight_type}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            placeholder="Meva, qurilish mollari..."
                        />
                    </div>

                    {/* Narxi */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Narxi (UZS) *</label>
                        <div className="relative">
                            <input
                                name="freight_rate_amount"
                                type="number"
                                value={formData.freight_rate_amount}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0"
                            />
                            <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    {/* Og'irligi */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Og'irligi (kg) *</label>
                        <input
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="1000"
                        />
                    </div>

                    {/* Hajmi */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Hajmi (m³) *</label>
                        <input
                            name="volume"
                            type="number"
                            value={formData.volume}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="20"
                        />
                    </div>

                    {/* Yukning xavflilik darajasi */}
                    <CustomDropdown
                        label="Yukning xavflilik darajasi"
                        name="danger"
                        value={formData.danger}
                        options={dangerOptions}
                        onChange={handleChange}
                    />

                    {/* Transport turi */}
                    <CustomDropdown
                        label="Transport turi"
                        name="vehicle_category"
                        value={formData.vehicle_category}
                        options={vehicleCategoryOptions}
                        onChange={handleChange}
                    />

                    {/* Kuzov turi */}
                    <CustomDropdown
                        label="Kuzov turi"
                        name="body_type"
                        value={formData.body_type}
                        options={bodyTypeOptions}
                        onChange={handleChange}
                    />

                    {/* Yetkazib berish rejimi */}
                    <CustomDropdown
                        label="Yetkazib berish rejimi"
                        name="shipping_mode"
                        value={formData.shipping_mode}
                        options={shippingModeOptions}
                        onChange={handleChange}
                    />

                    {/* Yuklash usuli */}
                    <CustomDropdown
                        label="Yuklash usuli"
                        name="loading_method"
                        value={formData.loading_method}
                        options={loadingMethodOptions}
                        onChange={handleChange}
                    />

                    {/* Yuk tushirish usuli */}
                    <CustomDropdown
                        label="Yuk tushirish usuli"
                        name="unloading_method"
                        value={formData.unloading_method}
                        options={loadingMethodOptions}
                        onChange={handleChange}
                    />

                    {/* To'lov usuli */}
                    <CustomDropdown
                        label="To'lov usuli"
                        name="payment_method"
                        value={formData.payment_method}
                        options={paymentMethodOptions}
                        onChange={handleChange}
                    />

                    {/* To'lov sharti */}
                    <CustomDropdown
                        label="To'lov sharti"
                        name="payment_condition"
                        value={formData.payment_condition}
                        options={paymentConditionOptions}
                        onChange={handleChange}
                    />

                    {/* To'lov muddati */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">To'lov muddati (kun) *</label>
                        <input
                            name="payment_period"
                            type="number"
                            value={formData.payment_period}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0"
                        />
                    </div>

                    {/* Qo'shimcha ma'lumot */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Yuk haqida qo'shimcha ma'lumot</label>
                        <textarea
                            name="description_uz"
                            value={formData.description_uz}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none h-32"
                            placeholder="Yuk haqida qo'shimcha ma'lumotlar..."
                        />
                    </div>
                </div>

                {/* XARITA BO'LIMI */}
                <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                <FaMap size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Manzillarni xaritadan belgilang</h3>
                                <p className="text-sm text-slate-500">{markerInstructions}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                Zoom: {zoomLevel.toFixed(1)}x
                            </span>
                            {formData.route_starts_where_lat && (
                                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                    Boshlanish
                                </span>
                            )}
                            {formData.route_ends_where_lat && (
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                    Tugash
                                </span>
                            )}
                        </div>
                    </div>

                    {coordinateWarning && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                            <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">{coordinateWarning}</p>
                                <p className="text-xs text-yellow-600 mt-1">Orqa qism 9 raqam limitiga ega</p>
                            </div>
                        </div>
                    )}

                    {/* Marker turi tanlovi */}
                    <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMarkerType('start')}
                                    className={`px-4 py-2 rounded-lg font-medium ${activeMarker === 'start' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                        Yuklash manzili
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMarkerType('end')}
                                    className={`px-4 py-2 rounded-lg font-medium ${activeMarker === 'end' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                        Yetkazib berish manzili
                                    </div>
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                {activeMarker === 'start' ? (
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                        <span>Ko'k marker - yuklash joyi</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                        <span>Qizil marker - yetkazib berish joyi</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {showSatellite ? "Sun'iy yo'ldosh ko\'rinishi" : 'Batafsil ko\'cha xaritasi'}
                                        </h2>
                                        <p className="text-blue-200 text-sm mt-1">
                                            {activeMarker === 'start' ? 'Yuklash' : 'Yetkazib berish'} manzilini belgilash uchun xaritaga bosing
                                        </p>
                                    </div>
                                    <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                                        <button 
                                            type="button"
                                            onClick={toggleMapStyle}
                                            className="px-3 py-1 bg-white text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50"
                                        >
                                            {showSatellite ? 'Ko\'cha ko\'rinishi' : "Sun'iy yo'ldosh"}
                                        </button>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${zoomLevel >= 12 ? 'bg-green-500' : 'bg-gray-600'}`}>
                                            Yozuvlar: {zoomLevel >= 12 ? 'YOQIQ' : "O'CHIQ"}
                                        </div>
                                        <div className="px-3 py-1 bg-blue-500 rounded-full text-sm font-medium">
                                            Zoom: {zoomLevel.toFixed(1)}x
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div 
                                    ref={mapContainer} 
                                    className="w-full h-96 md:h-[500px]"
                                />
                                
                                {/* Xarita boshqaruv tugmalari */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <button 
                                        onClick={() => map.current?.zoomIn()}
                                        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                                        title="Zoom in"
                                    >
                                        <FaPlus />
                                    </button>
                                    <button 
                                        onClick={() => map.current?.zoomOut()}
                                        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
                                        title="Zoom out"
                                    >
                                        <FaMinus />
                                    </button>
                                </div>
                                
                                {/* Koordinata limiti xabari */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
                                    <p className="text-xs font-medium text-slate-700 mb-1">Koordinata limiti:</p>
                                    <p className="text-xs text-slate-600">Maksimum 9 raqam</p>
                                    <div className="mt-2 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span>9 yoki kam: ✅</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                            <span>9 dan koʻp: qisqartiriladi</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Joylashuv holati */}
                                {(formData.route_starts_where_lat || formData.route_ends_where_lat) && (
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
                                        <div className="space-y-2">
                                            {formData.route_starts_where_lat && (
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                                                        <span className="text-sm font-medium text-blue-700">Yuklash manzili</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Kenglik: {formData.route_starts_where_lat}<br/>
                                                        Uzunlik: {formData.route_starts_where_lon}
                                                    </p>
                                                </div>
                                            )}
                                            {formData.route_ends_where_lat && (
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                                        <span className="text-sm font-medium text-red-700">Yetkazib berish manzili</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Kenglik: {formData.route_ends_where_lat}<br/>
                                                        Uzunlik: {formData.route_ends_where_lon}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            
                            <div className="p-4 border-t border-slate-200 bg-slate-50">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        disabled={locationLoading}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                                    >
                                        {locationLoading ? (
                                            <>
                                                <FaSyncAlt className="animate-spin" />
                                                Kutilmoqda...
                                            </>
                                        ) : (
                                            <>
                                                <FaLocationCrosshairs />
                                                Joriy joylashuv ({activeMarker === 'start' ? 'yuklash' : 'yetkazish'})
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={centerOnTashkent}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <FaMapMarkerAlt />
                                        Toshkent markazi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetView}
                                        className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <FaSyncAlt />
                                        Oʻzbekiston
                                    </button>
                                </div>
                                
                                {locationError && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-sm text-red-600">{locationError}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaExclamationTriangle className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-800 mb-1">Ko'rsatmalar:</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• <strong>Yuklash manzili</strong> (ko'k marker) - yuk qayerdan olinishini belgilang</li>
                                        <li>• <strong>Yetkazib berish manzili</strong> (qizil marker) - yuk qayerga yetkazilishini belgilang</li>
                                        <li>• Avval yukarni boshlanish manzilini, keyin tugash manzilini belgilang</li>
                                        <li>• Manzillarni xaritada bosing yoki "Joriy joylashuv" tugmasi bilan belgilang</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rasm yuklash bo'limi */}
                <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <input
                        type="file"
                        name="photo"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        accept="image/*"
                    />
                    <FaCloudUploadAlt size={32} className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-slate-600 font-medium text-sm sm:text-base">Yuk rasmini tanlang</p>
                    <p className="text-slate-400 text-xs mt-1">PNG, JPG formatlar (Maks. 5MB)</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4361ee] hover:bg-[#3750d0] text-white py-4 sm:py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                    {loading ? "Jo'natilmoqda..." : "Yukni e'lon qilish"}
                </button>
            </form>
        </div>
    );
};

export default AddCargo;