import React from 'react';
import { FaBars, FaSearch, FaBell, FaEnvelope, FaCog } from 'react-icons/fa';
import { pageTitles } from './data/navigation';

const Header = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => {
  const getPageTitle = () => pageTitles[currentPage] || 'Dashboard';

  return (
    <header className="sticky top-0 z-999 bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <FaEnvelope />
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setCurrentPage('settings')}
            >
              <FaCog />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
