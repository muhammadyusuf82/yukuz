import React, { useEffect, useState } from 'react';
import { FaStar, FaTachometerAlt, FaBox, FaTruck, FaWallet, FaChartLine, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { FaStarHalfStroke, FaCirclePlus, FaCircleQuestion } from "react-icons/fa6";

const Sidebar = ({ onPageChange, activePage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeId, setActiveId] = useState(1);
    const [user, setUser] = useState('')
    // data load
    const token = localStorage.getItem('token')
    useEffect(() => {
        const loadData = async () => {
            try {
                const promise = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })
                const res = await promise.json()
                setUser(res)
            } catch (error) {
                console.log(error);
            }
        }
        loadData()
    }, [])
    console.log(user);
    console.log(user.role);

    // Sidebar.jsx yoki Home.jsx ichida
    const handleLogout = () => {
        const confirmLogout = window.confirm("Rostdan ham tizimdan chiqmoqchimisiz?");
        if (confirmLogout) {
            localStorage.removeItem('access_token');
            window.location.href = '/login'; // Login sahifasiga yo'naltirish
        }
    };

    const pages = [
        { id: 1, icon: FaTachometerAlt, title: "Dashboard" },
        { id: 2, icon: FaCirclePlus, title: "Yuk qo'shish" },
        { id: 3, icon: FaBox, title: "Mening yuklarim" },
        { id: 4, icon: FaTruck, title: "Haydovchilar" },
        { id: 5, icon: FaWallet, title: "To'lovlar" },
        { id: 6, icon: FaChartLine, title: "Statistika" },
        { id: 7, icon: FaCog, title: "Sozlamalar" },
        { id: 8, icon: FaCircleQuestion, title: "Yordam" },
        { id: 9, icon: FaSignOutAlt, title: "Chiqish" },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#4361ee] text-white p-4 rounded-full shadow-2xl"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <div className={`
        fixed top-20 lg:sticky lg:top-25 inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-lg lg:rounded-3xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
                <div className="sticky flex flex-col h-full py-8 px-5 overflow-y-auto">

                    <div className="flex flex-col items-center mb-6">
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-linear-to-br from-[#4361ee] to-[#7209b7] flex items-center justify-center text-white text-3xl font-bold">
                            {/* {user.first_name.charAt(0)}{user.last_name.charAt(0)} */}
                        </div>
                        <h3 className="text-xl font-bold mt-3 text-slate-800">{user.first_name} {user.last_name}</h3>
                        <span className="text-xs font-bold text-[#4361ee] bg-blue-50 px-3 py-1 rounded-full uppercase mt-2">{user.role}</span>

                        <div className="mt-4 flex flex-col items-center border-b border-gray-100 w-full pb-6">
                            <span className="text-gray-400 text-sm">Reyting</span>
                            <div className="flex items-center gap-1 mt-1 text-[#ffcc02]">
                                <span className="text-xl font-bold text-[#4361ee] mr-2">4.3</span>
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfStroke />
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-2">
                            {pages.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => onPageChange(item.title)}
                                    className={`flex items-center gap-4 p-3 px-5 rounded-xl cursor-pointer transition-all
            ${activePage === item.title ? "bg-linear-to-r from-[#4361ee] to-[#7209b7] text-white" : "text-slate-600"}`}>
                                    <item.icon size={20} />
                                    <span className="text-lg">{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mt-8 p-4 bg-slate-50 rounded-2xl">
                        <h4 className="text-sm font-bold text-slate-800">Premium a'zolik</h4>
                        <p className="text-xs text-slate-500 mt-1">Sizda 15 kun qoldi</p>
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                            <div className="w-3/5 h-full bg-[#4361ee]" />
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                />
            )}
        </>
    );
};

export default Sidebar;
