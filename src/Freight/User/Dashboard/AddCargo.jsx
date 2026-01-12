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
    FaExclamationTriangle
} from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";

const baseUrl = 'https://tokennoty.pythonanywhere.com/api/freight/';

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
    const [activeMarker, setActiveMarker] = useState('start'); // 'start' or 'end'
    const [markerInstructions, setMarkerInstructions] = useState('Select start location on map (blue marker)');

    // Use ref for activeMarker so we can access current value in event handlers
    const activeMarkerRef = useRef(activeMarker);
    
    // Update the ref whenever activeMarker changes
    useEffect(() => {
        activeMarkerRef.current = activeMarker;
        setMarkerInstructions(activeMarker === 'start' 
            ? 'Select start location on map (blue marker)' 
            : 'Select end location on map (red marker)');
    }, [activeMarker]);

    // Helper function to format coordinates to max 9 digits
    const formatCoordinate = (coord) => {
        if (!coord && coord !== 0) return '';
        
        const str = coord.toString();
        // Remove any leading/trailing whitespace
        const trimmed = str.trim();
        
        // Check if the coordinate is already within 9 digits
        if (trimmed.length <= 9) {
            return trimmed;
        }
        
        // For numbers with decimal point
        if (trimmed.includes('.')) {
            const [integerPart, decimalPart] = trimmed.split('.');
            const integerLength = integerPart.length;
            const availableDecimalDigits = 9 - integerLength - 1; // -1 for decimal point
            
            if (availableDecimalDigits > 0) {
                return `${integerPart}.${decimalPart.substring(0, availableDecimalDigits)}`;
            } else {
                // If no space for decimals, return just integer part
                return integerPart;
            }
        }
        
        // For integers without decimal point
        return trimmed.substring(0, 9);
    };

    // Function to get user location
    const getUserLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
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
                    
                    // Update map center
                    if (map.current) {
                        map.current.flyTo({
                            center: [parseFloat(location.lon), parseFloat(location.lat)],
                            zoom: 17,
                            duration: 2000
                        });
                    }
                    
                    // Update marker with formatted coordinates using current active marker
                    updateMarker(parseFloat(location.lon), parseFloat(location.lat), activeMarkerRef.current);
                    
                    resolve(location);
                },
                (error) => {
                    let errorMessage = 'Unable to retrieve your location';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied. Please enable location services.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out.';
                            break;
                        default:
                            errorMessage = 'An unknown error occurred.';
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

    // Update marker position with coordinate formatting
    const updateMarker = useCallback((lng, lat, markerType) => {
        if (!map.current) return;
        
        // Format coordinates to max 9 digits
        const formattedLng = formatCoordinate(lng);
        const formattedLat = formatCoordinate(lat);
        
        // Check if coordinates were truncated
        const originalLngStr = lng.toString();
        const originalLatStr = lat.toString();
        
        if (originalLngStr.length > 9 || originalLatStr.length > 9) {
            setCoordinateWarning('Coordinates truncated to 9 digits');
        } else {
            setCoordinateWarning('');
        }
        
        // Remove existing marker of this type
        if (markerType === 'start' && startMarker.current) {
            startMarker.current.remove();
        } else if (markerType === 'end' && endMarker.current) {
            endMarker.current.remove();
        }

        // Parse formatted coordinates for the marker position
        const markerLng = parseFloat(formattedLng);
        const markerLat = parseFloat(formattedLat);

        // Create custom marker element with different colors for start and end
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

        // Add marker icon
        const icon = document.createElement('div');
        icon.innerHTML = markerType === 'start' ? '🚚' : '📍';
        icon.style.fontSize = '16px';
        icon.style.position = 'absolute';
        icon.style.top = '50%';
        icon.style.left = '50%';
        icon.style.transform = 'translate(-50%, -50%)';
        el.appendChild(icon);

        // Create and add marker to map
        const newMarker = new maplibregl.Marker({
            element: el,
            draggable: true
        })
            .setLngLat([markerLng, markerLat])
            .addTo(map.current);

        // Store marker reference
        if (markerType === 'start') {
            startMarker.current = newMarker;
        } else {
            endMarker.current = newMarker;
        }

        // Add popup to marker
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

        // Show popup on hover
        el.addEventListener('mouseenter', () => {
            newMarker.togglePopup();
        });
        
        el.addEventListener('mouseleave', () => {
            newMarker.togglePopup();
        });

        // Update form data when marker is dragged
        newMarker.on('dragend', () => {
            const lngLat = newMarker.getLngLat();
            
            // Format the dragged coordinates
            const draggedFormattedLng = formatCoordinate(lngLat.lng);
            const draggedFormattedLat = formatCoordinate(lngLat.lat);
            
            // Check if dragged coordinates were truncated
            const draggedOriginalLngStr = lngLat.lng.toString();
            const draggedOriginalLatStr = lngLat.lat.toString();
            
            if (draggedOriginalLngStr.length > 9 || draggedOriginalLatStr.length > 9) {
                setCoordinateWarning('Coordinates truncated to 9 digits');
            } else {
                setCoordinateWarning('');
            }
            
            setFormData(prev => ({
                ...prev,
                [`route_${markerType}s_where_lon`]: draggedFormattedLng,
                [`route_${markerType}s_where_lat`]: draggedFormattedLat
            }));
        });

        // Update form data with formatted coordinates
        setFormData(prev => ({
            ...prev,
            [`route_${markerType}s_where_lon`]: formattedLng,
            [`route_${markerType}s_where_lat`]: formattedLat
        }));
    }, []);

    // Initialize Map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        console.log('Initializing detailed map...');
        
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

        // Track zoom level
        map.current.on('zoom', () => {
            const currentZoom = map.current.getZoom();
            setZoomLevel(currentZoom);
        });

        // Track center changes
        map.current.on('move', () => {
            const center = map.current.getCenter();
            setLng(center.lng);
            setLat(center.lat);
        });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Add scale control
        map.current.addControl(new maplibregl.ScaleControl({
            maxWidth: 200,
            unit: 'metric'
        }), 'bottom-left');

        // When map loads
        map.current.on('load', () => {
            console.log('Detailed map loaded');
            setMapLoaded(true);
            
            // Load user location from localStorage
            const savedLocation = localStorage.getItem('userLocation');
            if (savedLocation) {
                try {
                    const location = JSON.parse(savedLocation);
                    if (location.lat && location.lon) {
                        setUserPosition([parseFloat(location.lon), parseFloat(location.lat)]);
                    }
                } catch (error) {
                    console.error('Error parsing saved location:', error);
                }
            }
        });

        // Add click event to place marker with formatted coordinates
        // Use the current activeMarkerRef value
        map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            updateMarker(lng, lat, activeMarkerRef.current);
        });

        // Cleanup on unmount
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
                setMapLoaded(false);
            }
        };
    }, [updateMarker]);

    // Function to handle "Use Current Location" button
    const handleUseCurrentLocation = async () => {
        try {
            await getUserLocation();
        } catch (error) {
            console.error('Failed to get location:', error.message);
        }
    };

    // Function to clear the selected location
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

    // Function to center on Tashkent
    const centerOnTashkent = () => {
        if (map.current) {
            map.current.flyTo({
                center: [69.2401, 41.2995],
                zoom: 15,
                duration: 1500
            });
        }
    };

    // Function to reset view to Uzbekistan
    const resetView = () => {
        if (map.current) {
            map.current.flyTo({
                center: [64.4556, 41.0000],
                zoom: 6,
                duration: 1500
            });
        }
    };

    // Toggle satellite view
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

            // Re-add markers after style change
            map.current.once('styledata', () => {
                // Re-add start marker if exists
                if (startMarker.current && formData.route_starts_where_lat && formData.route_starts_where_lon) {
                    const lng = parseFloat(formData.route_starts_where_lon);
                    const lat = parseFloat(formData.route_starts_where_lat);
                    if (!isNaN(lng) && !isNaN(lat)) {
                        updateMarker(lng, lat, 'start');
                    }
                }
                
                // Re-add end marker if exists
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Check if it's a coordinate field
        const isStartCoord = name.includes('route_starts_where');
        const isEndCoord = name.includes('route_ends_where');
        
        if (isStartCoord || isEndCoord) {
            const formattedValue = formatCoordinate(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
            
            // Check for warning
            if (value.length > 9) {
                setCoordinateWarning('Coordinates truncated to 9 digits');
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

        // Validate coordinates before submission
        const startLat = formData.route_starts_where_lat;
        const startLon = formData.route_starts_where_lon;
        const endLat = formData.route_ends_where_lat;
        const endLon = formData.route_ends_where_lon;
        
        if (startLat && startLat.length > 9) {
            alert('Error: Start latitude exceeds 9 digits');
            setLoading(false);
            return;
        }
        
        if (startLon && startLon.length > 9) {
            alert('Error: Start longitude exceeds 9 digits');
            setLoading(false);
            return;
        }
        
        if (endLat && endLat.length > 9) {
            alert('Error: End latitude exceeds 9 digits');
            setLoading(false);
            return;
        }
        
        if (endLon && endLon.length > 9) {
            alert('Error: End longitude exceeds 9 digits');
            setLoading(false);
            return;
        }

        // Append all form fields
        formDataObj.append('public', 'true');
        formDataObj.append('danger', '1');
        formDataObj.append('weight', formData.weight || 0);
        formDataObj.append('volume', formData.volume || "0");
        formDataObj.append('freight_type', formData.freight_type || '');
        formDataObj.append('description_uz', formData.description_uz || '');
        formDataObj.append('shipping_mode', formData.shipping_mode || 'FTL');
        formDataObj.append('vehicle_category', formData.vehicle_category || 'van');
        formDataObj.append('body_type', formData.body_type || 'open');

        // Start location
        formDataObj.append('route_starts_where_region', formData.route_starts_where_region || '');
        formDataObj.append('route_starts_where_city', formData.route_starts_where_city || '');
        
        // Use formatted coordinates or default to Tashkent
        formDataObj.append('route_starts_where_lat', startLat || '41.2995');
        formDataObj.append('route_starts_where_lon', startLon || '69.2401');

        // End location
        formDataObj.append('route_ends_where_region', formData.route_ends_where_region || '');
        formDataObj.append('route_ends_where_city', formData.route_ends_where_city || '');
        
        // Use formatted coordinates or default to Tashkent
        formDataObj.append('route_ends_where_lat', endLat || '41.2995');
        formDataObj.append('route_ends_where_lon', endLon || '69.2401');

        // Time fields
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => date.toISOString().split('.')[0] + "Z";

        formDataObj.append('route_start_time_from', formatDate(now));
        formDataObj.append('route_start_time_to', formatDate(now));
        formDataObj.append('route_end_time_from', formatDate(tomorrow));
        formDataObj.append('route_end_time_to', formatDate(tomorrow));

        // Loading/unloading methods
        formDataObj.append('loading_method', formData.loading_method || 'back');
        formDataObj.append('unloading_method', formData.unloading_method || 'back');

        // Payment info
        formDataObj.append('freight_rate_currency', 'UZS');
        formDataObj.append('freight_rate_amount', formData.freight_rate_amount || "0");
        formDataObj.append('payment_method', formData.payment_method || 'cash');
        formDataObj.append('payment_condition', formData.payment_condition || 'copied_documents');
        formDataObj.append('payment_period', formData.payment_period || 0);

        // Photo
        if (form.photo && form.photo.files[0]) {
            formDataObj.append('photo', form.photo.files[0]);
        }

        // Display coordinates for debugging
        console.log('Coordinates being sent:', {
            start: { lat: startLat || '41.2995', lon: startLon || '69.2401' },
            end: { lat: endLat || '41.2995', lon: endLon || '69.2401' }
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
                console.log('Success:', data);
                alert("Yuk muvaffaqiyatli qo'shildi!");
                onNavigate();
            } else {
                const errorText = await response.text();
                console.error("API Error:", errorText);
                alert(`Xatolik: ${response.status} - ${errorText.substring(0, 100)}`);
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Serverga ulanishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    // Function to set active marker type
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
                    {/* Product Name */}
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

                    {/* Price */}
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


                    {/* Weight */}
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

                    {/* Volume */}
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

                    {/* Danger Level */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Yukning xavflilik darajasi</label>
                        <select
                            name="danger"
                            value={formData.danger}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="1">Xavfli yuk</option>
                            <option value="2">Oddiy yuk</option>
                        </select>
                    </div>

                    {/* Vehicle Type */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Transport turi</label>
                        <select
                            name="vehicle_category"
                            value={formData.vehicle_category}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="van">Van</option>
                            <option value="semitruck">Yarim tirkama</option>
                            <option value="truck">Yuk mashinasi</option>
                            <option value="trailer">Tirkama</option>
                        </select>
                    </div>

                    {/* Body Type */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Kuzov turi</label>
                        <select
                            name="body_type"
                            value={formData.body_type}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="open">Ochiq</option>
                            <option value="closed">Yopiq</option>
                        </select>
                    </div>

                    {/* Shipping Mode */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Yetkazib berish rejimi</label>
                        <select
                            name="shipping_mode"
                            value={formData.shipping_mode}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="FTL">To'liq yuk (FTL)</option>
                            <option value="LTL">Qismiy yuk (LTL)</option>
                        </select>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">To'lov usuli</label>
                        <select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="cash">Naqd pul</option>
                            <option value="bank_transfer">Bank o'tkazmasi</option>
                            <option value="card">Karta</option>
                        </select>
                    </div>

                    {/* Payment Condition */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">To'lov sharti</label>
                        <select
                            name="payment_condition"
                            value={formData.payment_condition}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="copied_documents">Nusxa hujjatlar</option>
                            <option value="original_document">Asl hujjatlar</option>
                            <option value="on_delivery">Yetkazib berishda</option>
                        </select>
                    </div>

                    {/* Description */}
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

                {/* MAP SECTION */}
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

                    {/* Marker Type Selector */}
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
                                        <span>Blue marker - yuklash joyi</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                        <span>Red marker - yetkazib berish joyi</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {showSatellite ? 'Satellite View' : 'Detailed Street Map'}
                                        </h2>
                                        <p className="text-blue-200 text-sm mt-1">
                                            Click on map to set {activeMarker === 'start' ? 'loading' : 'delivery'} location
                                        </p>
                                    </div>
                                    <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                                        <button 
                                            type="button"
                                            onClick={toggleMapStyle}
                                            className="px-3 py-1 bg-white text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50"
                                        >
                                            {showSatellite ? 'Street View' : 'Satellite View'}
                                        </button>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${zoomLevel >= 12 ? 'bg-green-500' : 'bg-gray-600'}`}>
                                            Labels: {zoomLevel >= 12 ? 'ON' : 'OFF'}
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
                                
                                {/* Map Controls */}
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
                                
                                {/* Coordinate Limit Notice */}
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
                                
                                {/* Location Status */}
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

                {/* Photo upload section */}
                <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <input
                        type="file"
                        name="photo"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        accept="image/*"
                    />
                    <FaCloudUploadAlt size={32} className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-slate-600 font-medium text-sm sm:text-base">Yuk rasmini tanlang</p>
                    <p className="text-slate-400 text-xs mt-1">PNG, JPG formatlar (Max 5MB)</p>
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