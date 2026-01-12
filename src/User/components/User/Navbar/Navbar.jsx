import React, { useState, useEffect, useRef } from 'react';
import { FaTruckLoading, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link } from 'react-router-dom';

import uz from '../../../../images/uz.png'
import ru from '../../../../images/ru.png'
import en from '../../../../images/en.png'

const translations = {
  uz: {
    nav: ['Asosiy', 'Ish tartibi', 'Xususiyatlar', 'Yuklar', 'Haydovchilar', 'FAQ'],
    register: "Ro'yxatdan o'tish"
  },
  ru: {
    nav: ['Главная', 'Как это работает', 'Преимущества', 'Грузы', 'Водителям', 'FAQ'],
    register: "Регистрация"
  },
  en: {
    nav: ['Home', 'Workflow', 'Features', 'Cargo', 'Drivers', 'FAQ'],
    register: "Register"
  }
};

const Navbar = ({ currentLang, onLangChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const langRef = useRef(null);
  const t = translations[currentLang];

  const navLinks = [
    { name: t.nav[0], id: 'home' },
    { name: t.nav[1], id: 'workflow' },
    { name: t.nav[2], id: 'features' },
    { name: t.nav[3], id: 'cargo' },
    { name: t.nav[4], id: 'drivers' },
    { name: t.nav[5], id: 'faq' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      navLinks.forEach(link => {
        const element = document.getElementById(link.id);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(link.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentLang]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 50, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const languages = [
    { code: 'uz', label: 'UZ', flag: uz },
    { code: 'ru', label: 'RU', flag: ru },
    { code: 'en', label: 'EN', flag: en }
  ];

  return (
    <nav className='h-20 flex items-center bg-white shadow-md sticky top-0 z-50'>
      <div className="w-full mx-auto px-4 sm:px-8 flex items-center justify-between">
        <div className="flex gap-3 items-center cursor-pointer transform hover:scale-105 duration-300" onClick={() => scrollToSection('home')}>
          <div className="w-10 h-10 rounded-lg flex items-center bg-linear-to-br from-[#4361ee] to-[#7209b7]">
            <FaTruckLoading className='text-xl text-white m-auto' />
          </div>
          <h2 className='text-2xl text-[#4361ee] font-bold'>Yuk.uz</h2>
        </div>

        <ul className='hidden lg:flex list-none gap-8'>
          {navLinks.map((link) => (
            <li key={link.id} onClick={() => scrollToSection(link.id)} className={`text-lg font-semibold cursor-pointer relative pb-1 duration-300 ${activeSection === link.id ? 'text-[#4361ee]' : 'text-gray-600 hover:text-[#4361ee]'}`}>
              {link.name}
              {activeSection === link.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4361ee]"></span>}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          {/* Custom Language Dropdown */}
          <div className="relative" ref={langRef}>
            <div onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-2 border-2 border-gray-100 rounded-lg cursor-pointer hover:border-[#4361ee] duration-300 bg-gray-50">
              <span className="font-bold text-gray-700">{currentLang.toUpperCase()}</span>
              <FaChevronDown className={`text-xs transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </div>
            {langOpen && (
              <div className="absolute top-full mt-2 right-0 w-24 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden">
                {languages.map((l) => (
                  <div key={l.code} onClick={() => { onLangChange(l.code); setLangOpen(false); }} className={`px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold flex gap-2 ${currentLang === l.code ? 'text-[#4361ee] bg-blue-50' : 'text-gray-600'}`}>
                    <img src={l.flag} alt='...' className='w-6' /> {l.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to={'/login'}>
            <button className='bg-[#4361ee] text-white text-base font-semibold border-2 border-[#4361ee] rounded-lg py-2 px-5 hover:bg-white hover:text-[#4361ee] duration-300 cursor-pointer'>
              {t.register}
            </button>
          </Link>
        </div>

        <div className="lg:hidden text-2xl text-[#4361ee] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-20 left-0 w-full bg-white shadow-xl transition-all duration-300 lg:hidden overflow-hidden ${isOpen ? 'max-h-125' : 'max-h-0'}`}>
        <ul className='flex flex-col items-center p-5 gap-4'>
          {navLinks.map((link) => (
            <li key={link.id} onClick={() => scrollToSection(link.id)} className={`text-lg font-semibold ${activeSection === link.id ? 'text-[#4361ee]' : 'text-gray-600'}`}>
              {link.name}
            </li>
          ))}
          <div className="flex gap-4 p-4 w-full justify-center">
            {languages.map(l => (
              <button key={l.code} onClick={() => onLangChange(l.code)} className={`px-3 py-1 rounded ${currentLang === l.code ? 'bg-[#4361ee] text-white' : 'bg-gray-100'}`}>{l.label}</button>
            ))}
          </div>
          <Link to={'/login'} className='w-full bg-[#4361ee] text-white text-center rounded-lg py-2 font-semibold'>{t.register}</Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
