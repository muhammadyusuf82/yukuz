import React from 'react';
import { FaTruckLoading, FaTimes, FaChevronRight } from 'react-icons/fa';
import { navItems } from './data/navigation';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, navigateTo }) => {
    return (
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="h-full flex flex-col">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                            <FaTruckLoading />
                        </div>
                        <span className="text-lg font-bold text-blue-600">Yuk.uz Admin</span>
                    </div>
                    <button
                        className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                    {navItems.map((item, index) => {
                        const showSection = item.section && (!index || navItems[index - 1]?.section !== item.section);
                        return (
                            <React.Fragment key={item.id}>
                                {showSection && (
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                                        {item.section}
                                    </div>
                                )}
                                <button
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ${currentPage === item.id
                                        ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => navigateTo(item.id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        {/* <span className="w-5">{item.icon}</span> */}
                                        <item.icon className='w-5' />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    {/* {item.badge && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                                            {item.badge}
                                        </span>
                                    )} */}
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => navigateTo('profile')}
                    >
                        <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            AS
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-900">Admin Super</div>
                            <div className="text-xs text-gray-500">Super Admin</div>
                        </div>
                        <FaChevronRight className="text-gray-400" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
