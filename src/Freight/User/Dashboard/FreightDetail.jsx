import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FaMapMarkerAlt, 
  FaFlagCheckered, 
  FaWeightHanging, 
  FaRulerCombined,
  FaClock,
  FaMoneyBillWave,
  FaTruck,
  FaBox,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowLeft,
  FaChevronRight,
  FaCheck,
  FaExclamation,
  FaTemperatureHigh,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaMinus,
  FaSyncAlt,
  FaRoute,
  FaGlobe,
  FaCompress,
  FaExpand,
  FaRoad,
  FaCar,
  FaRoute as FaRouteIcon,
  FaLocationArrow
} from "react-icons/fa";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const FreightDetail = ({ freightId, freightData, onBack }) => {
  const [freight, setFreight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Map state
  const mapContainer = useRef(null);
  const map = useRef(null);
  const routeSourceRef = useRef(null);
  const [showSatellite, setShowSatellite] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [routeInstructions, setRouteInstructions] = useState([]);

  // Translation mappings
  const paymentConditionTranslations = {
    "copied_documents": "Nusxa hujjatlar",
    "original_document": "Asl hujjatlar",
    "on_delivery": "Yetkazib berishda"
  };

  const paymentMethodTranslations = {
    "cash": "Naqd pul",
    "bank_transfer": "Bank o'tkazmasi",
    "card": "Karta"
  };

  useEffect(() => {
    const fetchFreightDetail = async () => {
      try {
        setLoading(true);
        
        if (freightData) {
          setFreight(freightData);
          setLoading(false);
          return;
        }
        
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        
        if (!token) {
          setError('Autentifikatsiya talab qilinadi');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://tokennoty.pythonanywhere.com/api/freight/${freightId}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFreight(data);
        } else {
          setError('Yuk ma\'lumotlarini yuklashda xatolik yuz berdi');
          
          const sampleFreight = {
            body_type: "closed",
            created_at: "2026-01-07T09:24:22.733402Z",
            danger: "1",
            description_ru: null,
            description_uz: "Bu test yukidir. Maxsus qadoqlangan don mahsulotlari. Yuk 10 tonnadan iborat bo'lib, maxsus yopiq kuzovli transport vositasida tashilishi kerak.",
            freight_rate_amount: "2000000.000000000",
            freight_rate_currency: "UZS",
            freight_type: "Don mahsulotlari",
            id: freightId,
            is_shipped: false,
            loading_method: "back",
            owner_first_name: "Behruzbek",
            owner_last_name: "Komiljonov",
            owner_username: "902221204",
            owner_phone: "+998902221204",
            payment_condition: "copied_documents",
            payment_method: "card",
            payment_period: 0,
            photo: null,
            public: true,
            route_end_time_from: "2026-01-08T09:24:21Z",
            route_end_time_to: "2026-01-08T09:24:21Z",
            route_ends_where_city: "Toshkent",
            route_ends_where_region: "Chorsu bozori",
            route_ends_where_lat: "41.311081",
            route_ends_where_lon: "69.240537",
            route_start_time_from: "2026-01-07T09:24:21Z",
            route_start_time_to: "2026-01-07T09:24:21Z",
            route_starts_where_city: "Xorazim",
            route_starts_where_lat: "41.299500",
            route_starts_where_lon: "69.240100",
            route_starts_where_region: "Xorazim shahar",
            shipping_mode: "FTL",
            status: "waiting for driver",
            unloading_method: "back",
            updated_at: "2026-01-07T09:24:22.733626Z",
            vehicle_category: "van",
            volume: "2000.00",
            weight: 10000,
            insurance_covered: true,
            temperature_controlled: false,
            special_requirements: "Yukni yomg'irdan himoya qilish kerak. Maxsus qadoqlash talab etiladi."
          };
          setFreight(sampleFreight);
        }
        
      } catch (err) {
        setError('Server bilan aloqa xatosi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (freightId || freightData) {
      fetchFreightDetail();
    }
  }, [freightId, freightData]);

  // Fetch route data from OSRM API
  const fetchRoute = useCallback(async (startLon, startLat, endLon, endLat) => {
    try {
      setRouteLoading(true);
      
      // OSRM API endpoint for driving route
      const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson&steps=true`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distance = (route.distance / 1000).toFixed(1); // Convert meters to km
        const duration = (route.duration / 3600).toFixed(1); // Convert seconds to hours
        
        setRouteDistance(distance);
        setRouteDuration(duration);
        
        // Extract route instructions
        if (route.legs && route.legs[0].steps) {
          const instructions = route.legs[0].steps
            .filter(step => step.maneuver.type !== 'depart' && step.maneuver.type !== 'arrive')
            .slice(0, 5)
            .map(step => ({
              instruction: step.maneuver.instruction,
              distance: (step.distance / 1000).toFixed(1),
              type: step.maneuver.type
            }));
          setRouteInstructions(instructions);
        }
        
        return route.geometry;
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback to straight line
      return {
        type: 'LineString',
        coordinates: [[startLon, startLat], [endLon, endLat]]
      };
    } finally {
      setRouteLoading(false);
    }
  }, []);

  // Add route to map
  const addRouteToMap = useCallback((geometry) => {
    if (!map.current || !geometry) return;

    // Remove existing route layers if they exist
    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
    }
    if (map.current.getLayer('route-outline')) {
      map.current.removeLayer('route-outline');
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }

    // Add route source
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: geometry
      }
    });

    // Store source reference
    routeSourceRef.current = map.current.getSource('route');

    // Add route outline for better visibility
    map.current.addLayer({
      id: 'route-outline',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 6,
        'line-opacity': 0.4
      }
    });

    // Add main route line - solid line without dasharray
    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#2200ff',
        'line-width': 4,
        'line-opacity': 0.9
      }
    }, 'route-outline');
  }, []);

  // Re-add route when map style changes
  const reAddRoute = useCallback(() => {
    if (routeSourceRef.current && routeSourceRef.current._data) {
      // Get the geometry from the source
      const geometry = routeSourceRef.current._data.geometry;
      if (geometry) {
        // Wait a bit for map to be ready
        setTimeout(() => {
          addRouteToMap(geometry);
        }, 100);
      }
    }
  }, [addRouteToMap]);

  // Initialize map when freight data is loaded
  useEffect(() => {
    if (!freight || !mapContainer.current) return;

    const startLat = parseFloat(freight.route_starts_where_lat);
    const startLon = parseFloat(freight.route_starts_where_lon);
    const endLat = parseFloat(freight.route_ends_where_lat || freight.route_starts_where_lat);
    const endLon = parseFloat(freight.route_ends_where_lon || freight.route_starts_where_lon);

    // Calculate center between start and end points
    const centerLat = (startLat + endLat) / 2;
    const centerLon = (startLon + endLon) / 2;

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

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
      center: [centerLon, centerLat],
      zoom: zoomLevel,
      minZoom: 5,
      maxZoom: 18
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new maplibregl.ScaleControl({
      maxWidth: 200,
      unit: 'metric'
    }), 'bottom-left');

    // When map loads
    map.current.on('load', async () => {
      // Add start marker
      const startMarkerEl = document.createElement('div');
      startMarkerEl.className = 'start-marker';
      startMarkerEl.innerHTML = `
        <div style="
          width: 30px;
          height: 30px;
          background: #3B82F6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: pulse-blue 2s infinite;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
        <style>
          @keyframes pulse-blue {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
        </style>
      `;

      const startMarker = new maplibregl.Marker({
        element: startMarkerEl
      })
        .setLngLat([startLon, startLat])
        .setPopup(
          new maplibregl.Popup({ offset: 30 })
            .setHTML(`
              <div style="padding: 12px; min-width: 220px;">
                <h3 style="margin: 0; color: #3B82F6; font-weight: bold; font-size: 16px;">🚚 Yuklash joyi</h3>
                <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.4;">
                  <strong style="font-size: 15px;">${freight.route_starts_where_city}</strong><br/>
                  <span style="color: #555;">${freight.route_starts_where_region}</span><br/>
                  <span style="font-size: 12px; color: #777;">
                    ${formatDate(freight.route_start_time_from)}
                  </span>
                </p>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                  Kenglik: ${freight.route_starts_where_lat}<br/>
                  Uzunlik: ${freight.route_starts_where_lon}
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      // Add end marker
      const endMarkerEl = document.createElement('div');
      endMarkerEl.className = 'end-marker';
      endMarkerEl.innerHTML = `
        <div style="
          width: 30px;
          height: 30px;
          background: #10B981;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          animation: pulse-green 2s infinite;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
        <style>
          @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
        </style>
      `;

      const endMarker = new maplibregl.Marker({
        element: endMarkerEl
      })
        .setLngLat([endLon, endLat])
        .setPopup(
          new maplibregl.Popup({ offset: 30 })
            .setHTML(`
              <div style="padding: 12px; min-width: 220px;">
                <h3 style="margin: 0; color: #10B981; font-weight: bold; font-size: 16px;">🏁 Tushirish joyi</h3>
                <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.4;">
                  <strong style="font-size: 15px;">${freight.route_ends_where_city}</strong><br/>
                  <span style="color: #555;">${freight.route_ends_where_region}</span><br/>
                  <span style="font-size: 12px; color: #777;">
                    ${formatDate(freight.route_end_time_to)}
                  </span>
                </p>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                  Kenglik: ${freight.route_ends_where_lat || 'N/A'}<br/>
                  Uzunlik: ${freight.route_ends_where_lon || 'N/A'}
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      // Fetch and draw vehicle route
      try {
        const routeGeometry = await fetchRoute(startLon, startLat, endLon, endLat);
        
        // Add route to map
        addRouteToMap(routeGeometry);

        // Add animated vehicle marker along the route
        if (routeGeometry.coordinates && routeGeometry.coordinates.length > 1) {
          const midIndex = Math.floor(routeGeometry.coordinates.length / 2);
          const midPoint = routeGeometry.coordinates[midIndex];
          
          const vehicleMarkerEl = document.createElement('div');
          vehicleMarkerEl.innerHTML = `
            <div style="
              width: 32px;
              height: 32px;
              background: #8B5CF6;
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              animation: move-vehicle 2s infinite alternate;
            ">
              <div style="color: white; font-size: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1-4-1-5 1-5 1"/>
                  <path d="M3 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C3.7 10.6 1 10 1 10v8c0 .6.4 1 1 1z"/>
                  <path d="M8 17h8"/>
                  <circle cx="6.5" cy="17.5" r="2.5"/>
                  <circle cx="17.5" cy="17.5" r="2.5"/>
                </svg>
              </div>
            </div>
            <style>
              @keyframes move-vehicle {
                0% { transform: translateY(0); }
                100% { transform: translateY(-5px); }
              }
            </style>
          `;

          new maplibregl.Marker({
            element: vehicleMarkerEl
          })
            .setLngLat([midPoint[0], midPoint[1]])
            .setPopup(
              new maplibregl.Popup({ offset: 25 })
                .setHTML(`
                  <div style="padding: 10px; min-width: 200px;">
                    <h4 style="margin: 0; color: #8B5CF6; font-weight: bold;">🚛 Avtomobil marshruti</h4>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">
                      Transport vositasining taxminiy yo'nalishi
                    </p>
                  </div>
                `)
            )
            .addTo(map.current);
        }

        // Fit bounds to route
        const coordinates = routeGeometry.coordinates || [[startLon, startLat], [endLon, endLat]];
        const bounds = new maplibregl.LngLatBounds();
        coordinates.forEach(coord => {
          bounds.extend(coord);
        });
        
        map.current.fitBounds(bounds, {
          padding: {top: 100, bottom: 100, left: 100, right: 100},
          duration: 2000
        });

      } catch (error) {
        console.error('Error drawing route:', error);
        
        // Fallback to straight line
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [[startLon, startLat], [endLon, endLat]]
          }
        };

        addRouteToMap(geojson.geometry);

        // Fit bounds to markers
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([startLon, startLat]);
        bounds.extend([endLon, endLat]);
        map.current.fitBounds(bounds, {
          padding: 80,
          duration: 1500
        });
      }
    });

    // Track zoom level
    map.current.on('zoom', () => {
      setZoomLevel(map.current.getZoom());
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [freight, fetchRoute, addRouteToMap]);

  const toggleMapStyle = () => {
    if (!map.current) return;
    
    const newShowSatellite = !showSatellite;
    setShowSatellite(newShowSatellite);
    
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

    // Re-add route when style loads
    map.current.once('styledata', () => {
      // Re-add controls after style change
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.ScaleControl({
        maxWidth: 200,
        unit: 'metric'
      }), 'bottom-left');
      
      // Re-add route after a short delay
      setTimeout(() => {
        reAddRoute();
      }, 300);
    });
  };

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
    
    if (!map.current) return;
    
    setTimeout(() => {
      map.current.resize();
    }, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const formatCurrency = (amount, currency) => {
    const formatter = new Intl.NumberFormat('uz-UZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return `${formatter.format(amount)} ${currency}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'waiting for driver':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'waiting for driver':
        return 'Haydovchi kutilmoqda';
      case 'in progress':
        return 'Jarayonda';
      case 'delivered':
        return 'Yetkazilgan';
      case 'cancelled':
        return 'Bekor qilingan';
      default:
        return status;
    }
  };

  // Get translated payment values
  const getPaymentConditionText = (value) => {
    return paymentConditionTranslations[value] || value;
  };

  const getPaymentMethodText = (value) => {
    return paymentMethodTranslations[value] || value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuk ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Xatolik</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={onBack}
            className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (!freight) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Yuk topilmadi</h3>
          <p className="text-gray-600">So'ralgan yuk ma'lumotlari mavjud emas.</p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const startLat = parseFloat(freight.route_starts_where_lat);
  const startLon = parseFloat(freight.route_starts_where_lon);
  const endLat = parseFloat(freight.route_ends_where_lat || freight.route_starts_where_lat);
  const endLon = parseFloat(freight.route_ends_where_lon || freight.route_starts_where_lon);

  return (
    <div className={`min-h-screen bg-linear-to-br from-gray-50 to-blue-50 ${isMapFullscreen ? 'overflow-hidden' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-3 rounded-xl">
        <div className="max-w-7xl mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Yuk #{freight.id} - Batafsil ma'lumot
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(freight.status)}`}>
                    {getStatusText(freight.status)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(freight.created_at)}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 shadow-md">
              Taklif berish
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Cards in 2 Columns */}
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Route Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaRoute className="mr-3 text-blue-600" />
                Marshrut tafsilotlari
              </h2>
              
              <div className="space-y-4">
                {/* Departure */}
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <FaArrowUp className="text-blue-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">QAYERDAN</p>
                    <p className="text-lg font-bold text-gray-800">{freight.route_starts_where_city}</p>
                    <p className="text-gray-600 text-sm">{freight.route_starts_where_region}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        {formatDate(freight.route_start_time_from)}
                      </div>
                      <div className="text-xs text-gray-500">
                        📍 Kenglik: {freight.route_starts_where_lat}<br/>
                        📍 Uzunlik: {freight.route_starts_where_lon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <FaArrowDown className="text-green-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">QAYERGA</p>
                    <p className="text-lg font-bold text-gray-800">{freight.route_ends_where_city}</p>
                    <p className="text-gray-600 text-sm">{freight.route_ends_where_region}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        {formatDate(freight.route_end_time_to)}
                      </div>
                      <div className="text-xs text-gray-500">
                        📍 Kenglik: {freight.route_ends_where_lat || 'N/A'}<br/>
                        📍 Uzunlik: {freight.route_ends_where_lon || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border border-blue-200">
                    <p className="text-xs font-medium text-blue-600 mb-1">MASOFA</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {routeLoading ? '...' : routeDistance ? `${routeDistance} km` : '~480 km'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Yo'l uzunligi</p>
                  </div>
                  <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200">
                    <p className="text-xs font-medium text-green-600 mb-1">VAQT</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {routeLoading ? '...' : routeDuration ? `${routeDuration} soat` : '6-8 soat'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Taxminiy</p>
                  </div>
                  <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center border border-purple-200">
                    <p className="text-xs font-medium text-purple-600 mb-1">HOLAT</p>
                    <p className="text-2xl font-bold text-gray-800">Faol</p>
                    <p className="text-xs text-gray-500 mt-1">Yuk holati</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaBox className="mr-3 text-blue-600" />
                Yuk ma'lumotlari
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">YUK TURI</p>
                  <div className="flex items-center space-x-2">
                    <FaBox className="text-blue-600" />
                    <p className="font-bold text-gray-800">{freight.freight_type}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">OG'IRLIK</p>
                  <div className="flex items-center space-x-2">
                    <FaWeightHanging className="text-blue-600" />
                    <p className="font-bold text-gray-800">{freight.weight} kg</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">HAJM</p>
                  <div className="flex items-center space-x-2">
                    <FaRulerCombined className="text-blue-600" />
                    <p className="font-bold text-gray-800">{freight.volume} m³</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">KUZOV TURI</p>
                  <p className="font-bold text-gray-800">{freight.body_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">YUKLASH</p>
                  <p className="font-bold text-gray-800">{freight.loading_method}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">TUSHIRISH</p>
                  <p className="font-bold text-gray-800">{freight.unloading_method}</p>
                </div>
              </div>
              
              {freight.description_uz && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">QO'SHIMCHA MA'LUMOT</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                    {freight.description_uz}
                  </p>
                </div>
              )}
            </div>

            {/* Status Timeline Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaClock className="mr-3 text-blue-600" />
                Holat vaqtlari
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Yaratilgan:</span>
                  <span className="font-semibold text-gray-800">{formatDate(freight.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Yangilangan:</span>
                  <span className="font-semibold text-gray-800">{formatDate(freight.updated_at)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">Yuklash vaqti:</span>
                  <span className="font-semibold text-gray-800">{formatDate(freight.route_start_time_from)}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Yetkazish vaqti:</span>
                  <span className="font-semibold text-gray-800">{formatDate(freight.route_end_time_to)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Payment Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaMoneyBillWave className="mr-3 text-green-600" />
                To'lov ma'lumotlari
              </h2>
              
              <div className="mb-6 p-5 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <p className="text-sm font-medium text-gray-500 mb-2">JAMI NARX</p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(freight.freight_rate_amount, freight.freight_rate_currency)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Barcha soliqlar bilan</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">TO'LOV USULI</p>
                  <p className="font-bold text-gray-800">{getPaymentMethodText(freight.payment_method)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">TO'LOV SHARTI</p>
                  <p className="font-bold text-gray-800">{getPaymentConditionText(freight.payment_condition)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">TO'LOV MUDDATI</p>
                  <p className="font-bold text-gray-800">
                    {freight.payment_period === 0 ? 'Darhol' : `${freight.payment_period} kun`}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 mb-1">YETKAZISH REJIMI</p>
                  <p className="font-bold text-gray-800">{freight.shipping_mode}</p>
                </div>
              </div>

              {/* Payment Notes */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">TO'LOV IZOHLARI</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>To'lov yuk yetkazilgandan so'ng amalga oshiriladi</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>Barcha hujjatlar to'liq taqdim etilishi kerak</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Transport Requirements Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaTruck className="mr-3 text-orange-600" />
                Transport talablari
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="flex items-center space-x-3">
                    <FaTruck className="text-orange-500 text-xl" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">AVTOMOBIL</p>
                      <p className="font-bold text-gray-800">{freight.vehicle_category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Yuklash/Tushirish</p>
                    <p className="font-bold text-gray-800">{freight.loading_method}/{freight.unloading_method}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${freight.insurance_covered ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500">SUG'URTA</p>
                      {freight.insurance_covered ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaExclamation className="text-yellow-500" />
                      )}
                    </div>
                    <p className={`font-bold ${freight.insurance_covered ? 'text-green-700' : 'text-gray-800'}`}>
                      {freight.insurance_covered ? 'Mavjud' : 'Yo\'q'}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${freight.temperature_controlled ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500">TEMPERATURA</p>
                      {freight.temperature_controlled ? (
                        <FaTemperatureHigh className="text-blue-500" />
                      ) : (
                        <FaExclamation className="text-gray-500" />
                      )}
                    </div>
                    <p className={`font-bold ${freight.temperature_controlled ? 'text-blue-700' : 'text-gray-800'}`}>
                      {freight.temperature_controlled ? 'Kerakli' : 'Kerak emas'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-500">XAVFLILIK DARAJASI</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full mx-0.5 ${level <= freight.danger ? 'bg-red-500' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-800">Level {freight.danger}</p>
                  <p className="text-xs text-gray-500 mt-1">Xavfli moddalar qatnashadi</p>
                </div>
              </div>
            </div>

            {/* Owner & Special Requirements Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUser className="mr-3 text-blue-600" />
                Yuk egasi va maxsus talablar
              </h2>
              
              <div className="space-y-6">
                {/* Owner Info */}
                <div className="flex items-center space-x-4 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-white text-lg font-bold">
                      {freight.owner_first_name?.[0]}{freight.owner_last_name?.[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {freight.owner_first_name} {freight.owner_last_name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1 text-gray-600">
                      <FaPhone className="text-sm" />
                      <span className="text-sm">{freight.owner_phone || freight.owner_username}</span>
                    </div>
                    <div className="mt-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <FaCheckCircle className="inline mr-1" /> Tasdiqlangan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-2">
                    <FaInfoCircle className="text-purple-600 mr-2" />
                    <p className="text-sm font-medium text-purple-700">MAXSUS TALABLAR</p>
                  </div>
                  <p className="text-gray-700">
                    {freight.special_requirements || "Maxsus talablar mavjud emas"}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">STATUS</p>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${freight.public ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <p className="font-bold text-gray-800">
                        {freight.public ? 'Ommaviy' : 'Shaxsiy'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">YETKAZILGAN</p>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${freight.is_shipped ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <p className="font-bold text-gray-800">
                        {freight.is_shipped ? 'Ha' : 'Yo\'q'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Map Container - Full width below cards */}
        <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 mb-8 overflow-hidden ${isMapFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}>
          <div className="bg-linear-to-r from-blue-800 z-10 to-blue-900 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <FaGlobe className="text-xl" />
              <div>
                <h2 className="text-xl font-bold">Marshrut xaritasi</h2>
                <p className="text-blue-200 text-sm">
                  Yukning haqiqiy yo'nalishi va transport marshruti
                  {freight && ` | ${freight.route_starts_where_city} → ${freight.route_ends_where_city}`}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {routeLoading ? (
                <div className="flex items-center bg-blue-700 rounded-full px-3 py-2">
                  <FaSyncAlt className="animate-spin mr-2" />
                  <span className="text-sm">Marshrut olinmoqda...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center bg-blue-700 rounded-full px-3 py-2">
                    <FaRoad className="mr-2" />
                    <span className="text-sm">Masofa: </span>
                    <span className="font-bold ml-1">{routeDistance || '~480'} km</span>
                  </div>
                  
                  <div className="flex items-center bg-green-700 rounded-full px-3 py-2">
                    <FaClock className="mr-2" />
                    <span className="text-sm">Vaqt: </span>
                    <span className="font-bold ml-1">{routeDuration || '6-8'} soat</span>
                  </div>
                </>
              )}
              
              <button
                onClick={toggleMapStyle}
                className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <FaSyncAlt className="text-sm" />
                <span>{showSatellite ? 'Koʻcha koʻrinishi' : 'Sunʼiy yoʻldosh'}</span>
              </button>
              
              <button
                onClick={toggleMapFullscreen}
                className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                {isMapFullscreen ? (
                  <>
                    <FaCompress />
                    <span>Kichraytirish</span>
                  </>
                ) : (
                  <>
                    <FaExpand />
                    <span>Kattalashtirish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              ref={mapContainer}
              className={`w-full ${isMapFullscreen ? 'h-[calc(100vh-140px)]' : 'h-125'}`}
            />
            
            {routeLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col items-center">
                  <FaSyncAlt className="animate-spin text-3xl text-blue-600 mb-3" />
                  <p className="text-gray-700 font-medium">Marshrut xaritasi olinmoqda...</p>
                  <p className="text-gray-500 text-sm mt-1">Transport yo'nalishi aniqlanmoqda</p>
                </div>
              </div>
            )}
            
            {/* Map Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              <button 
                onClick={() => map.current?.zoomIn()}
                className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                title="Kattalashtirish"
              >
                <FaPlus className="text-gray-700" />
              </button>
              <button 
                onClick={() => map.current?.zoomOut()}
                className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                title="Kichiklashtirish"
              >
                <FaMinus className="text-gray-700" />
              </button>
              <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{zoomLevel.toFixed(1)}x</span>
              </div>
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 z-20">
              <h4 className="text-sm font-bold text-gray-800 mb-3">Belgilar</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md animate-pulse"></div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Yuklash joyi</p>
                    <p className="text-xs text-gray-500">{freight.route_starts_where_city}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md animate-pulse"></div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Tushirish joyi</p>
                    <p className="text-xs text-gray-500">{freight.route_ends_where_city}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Transport marshruti</p>
                    <p className="text-xs text-gray-500">Haqiqiy yo'l (Qat'iy chiziq)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-xs font-medium text-gray-700">Transport vositası</p>
                    <p className="text-xs text-gray-500">Yo'nalish bo'yicha</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Route Info Panel */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 max-w-xs z-20">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Marshrut ma'lumotlari</h4>
              <div className="space-y-3 text-xs">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-600">Yuklash:</p>
                  <p className="text-gray-600 truncate">{freight.route_starts_where_city}, {freight.route_starts_where_region}</p>
                  <p className="text-gray-500 text-xs mt-1">{freight.route_starts_where_lat}, {freight.route_starts_where_lon}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-600">Tushirish:</p>
                  <p className="text-gray-600 truncate">{freight.route_ends_where_city}, {freight.route_ends_where_region}</p>
                  <p className="text-gray-500 text-xs mt-1">{freight.route_ends_where_lat || 'N/A'}, {freight.route_ends_where_lon || 'N/A'}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <p className="font-medium text-red-600">Marshrut:</p>
                  <p className="text-gray-600">Qat'iy chiziq (Dotted emas)</p>
                  <p className="text-gray-500 text-xs mt-1">{routeDistance || '~480'} km, {routeDuration || '6-8'} soat</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                Ko'k nuqta - yuklash joyi (pulsatsiya bilan)
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                Yashil nuqta - tushirish joyi
              </div>
              <div className="flex items-center">
                <div className="w-8 h-2 bg-red-500 mr-2"></div>
                Qizil chiziq - transport yo'li (Qat'iy chiziq)
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-500 mr-2 flex items-center justify-center">
                  <FaCar className="text-white text-xs" />
                </div>
                Transport vositası - yo'nalish bo'yicha
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all flex-1 flex items-center justify-center"
              >
                <FaArrowLeft className="mr-2" />
                Orqaga qaytish
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex-1 flex items-center justify-center">
                <FaCheck className="mr-2" />
                Taklif berish
              </button>
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex-1 flex items-center justify-center">
                <FaPhone className="mr-2" />
                Murojaat qilish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightDetail;