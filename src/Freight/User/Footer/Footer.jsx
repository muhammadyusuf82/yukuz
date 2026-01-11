import React from 'react';
import { FaTelegramPlane, FaInstagram, FaFacebookF, FaYoutube, FaTruckLoading } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#121416] text-gray-400">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile-first container */}
        <div className="max-w-7xl mx-auto">

          {/* Logo va tashrif buyuruvchi qismi - mobil uchun markazlashtirilgan */}

          {/* Linklar - mobil uchun grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-start">
              <div className="flex gap-3 items-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-linear-to-br from-[#4361ee] to-[#7209b7]">
                  <FaTruckLoading className='text-xl sm:text-lg text-white' />
                </div>
                <h2 className='text-2xl sm:text-2xl md:text-3xl text-[#4361ee] font-bold tracking-tight'>Yuk.uz</h2>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                O'zbekistonning birinchi raqamli yuk tashish platformasi. Biz haydovchi va yuk beruvchilarni birlashtiramiz.
              </p>

              {/* Ijtimoiy tarmoqlar - mobil uchun markazda */}
              <div className="flex gap-3 sm:gap-4 mt-6">
                {[FaTelegramPlane, FaInstagram, FaFacebookF, FaYoutube].map((Icon, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#4361ee] hover:text-white transition-all duration-300 cursor-pointer text-white focus:outline-none focus:ring-2 focus:ring-[#4361ee] focus:ring-opacity-50"
                    aria-label={`Ijtimoiy tarmoq ${index + 1}`}
                  >
                    <Icon className="text-base sm:text-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* Foydalanuvchi */}
            <div className="text-center sm:text-left">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6">Foydalanuvchi</h3>
              <ul className="space-y-1 sm:space-y-2">
                {['Yuk beruvchi', 'Haydovchi', 'Kompaniya', 'Hamkorlik', 'Karera'].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 block py-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Xizmatlar */}
            <div className="text-center sm:text-left">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6">Xizmatlar</h3>
              <ul className="space-y-1 sm:space-y-2">
                {['Yuk tashish', 'Ekspress yetkazish', 'Sovutilgan yuk', 'Xavfli yuk', 'Sug\'urta'].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm sm:text-base text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 block py-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aloqa */}
            <div className="text-center sm:text-left">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-6">Aloqa</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li className="text-base sm:text-lg text-gray-300 font-medium">+998 90 123 45 67</li>
                <li>
                  <a
                    href="mailto:info@yuk.uz"
                    className="text-sm sm:text-base text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 block py-1"
                  >
                    info@yuk.uz
                  </a>
                </li>
                <li className="text-sm sm:text-base text-gray-400">Toshkent shahri</li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 block py-1"
                  >
                    Qo'llab-quvvatlash
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm sm:text-base text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 block py-1"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Pastki qism - mobil uchun to'liq responsive */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-800">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <p className="text-sm sm:text-base text-gray-400 text-center">
                © 2024 Yuk.uz. Barcha huquqlar himoyalangan.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm font-medium">
                {['Maxfiylik siyosati', 'Foydalanish shartlari', 'Cookie siyosati'].map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 text-sm sm:text-base"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
