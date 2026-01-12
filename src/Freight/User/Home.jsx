import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar/Navbar'
import Footer from '../../User/components/User/Footer/Footer'

// Sahifalar
import Dashboard from './Dashboard/Dashboard'
import AddCargo from './Dashboard/AddCargo'
import MyCargos from './Dashboard/MyCargos'
import Drivers from './Dashboard/Drivers'
import Payments from './Dashboard/Payments'
import Statistics from './Dashboard/Statistics'
import Settings from './Dashboard/Settings'
import Help from './Dashboard/Help'
import FreightDetail from './Dashboard/FreightDetail'

const Home = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [selectedFreightId, setSelectedFreightId] = useState(null);
  const [selectedFreightData, setSelectedFreightData] = useState(null);
  const [lang, setLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check authorization on component mount
  useEffect(() => {
    const checkAuthorization = async () => {
      // Get token from localStorage (your code shows both 'token' and 'access_token')
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      if (!token) {
        // No token found, redirect to login
        window.location.href = '/login';
        return;
      }

      try {
        // Verify token with backend by making a simple API call
        const response = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthorized(true);
        } else {
          // Token is invalid, clear storage and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Authorization check failed:', error);
        // Network error or server down, clear storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  // Sahifani tanlash funksiyasi
  const handlePageChange = (page, freightId = null, freightData = null) => {
    setActivePage(page);
    if (freightId) {
      setSelectedFreightId(freightId);
      setSelectedFreightData(freightData);
    }
  };

  // Sahifani ko'rsatish funksiyasi
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard': 
        return <Dashboard key="dash" onFreightDetail={handlePageChange} />;
      case 'Yuk qo\'shish': return <AddCargo key="add" />;
      case 'Mening yuklarim': 
        return <MyCargos key="my" onFreightDetail={handlePageChange} />; // Add onFreightDetail prop here
      case 'Haydovchilar': return <Drivers key="drivers" />;
      case 'To\'lovlar': return <Payments key="payments" />;
      case 'Statistika': return <Statistics key="statistics" />;
      case 'Sozlamalar': return <Settings key="settings" />;
      case 'Yordam': return <Help key="help" />;
      case 'Batafsil': 
        return <FreightDetail 
          key="details" 
          freightId={selectedFreightId} 
          freightData={selectedFreightData}
          onBack={() => handlePageChange('Dashboard')} 
        />;
      default: return <Dashboard key="dash" onFreightDetail={handlePageChange} />;
    }
  };

  // Show loading while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fe] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#4361ee] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render the main content (should have redirected already)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f8f9fe] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-red-500 border-r-red-300 border-b-red-300 border-l-red-300 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Kirish huquqi tekshirilmoqda...</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-6 py-2 bg-[#4361ee] text-white rounded-lg hover:bg-[#3a56d4] transition"
          >
            Login sahifasiga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#f8f9fe] min-h-screen'>
      <Navbar />
      <div className="mx-auto px-3 sm:px-6 py-4 lg:py-10 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 shrink-0">
          <Sidebar onPageChange={(page) => handlePageChange(page)} activePage={activePage} />
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Footer currentLang={lang}/>
    </div>
  )
}

export default Home