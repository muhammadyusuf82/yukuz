import React, { useState } from 'react'
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
  const [lang, setLang] = useState('en')

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