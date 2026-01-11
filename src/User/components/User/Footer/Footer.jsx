import React from 'react';
import { FaTelegramPlane, FaInstagram, FaFacebookF, FaYoutube, FaTruckLoading } from "react-icons/fa";

const translations = {
  uz: {
    desc: "O'zbekistonning birinchi raqamli yuk tashish platformasi. Biz haydovchi va yuk beruvchilarni birlashtiramiz.",
    col1: { title: "Foydalanuvchi", links: ['Yuk beruvchi', 'Haydovchi', 'Kompaniya', 'Hamkorlik', 'Karera'] },
    col2: { title: "Xizmatlar", links: ['Yuk tashish', 'Ekspress yetkazish', 'Sovutilgan yuk', 'Xavfli yuk', 'Sug\'urta'] },
    col3: { title: "Aloqa", support: "Qo'llab-quvvatlash" },
    bottom: ["© 2024 Yuk.uz. Barcha huquqlar himoyalangan.", 'Maxfiylik siyosati', 'Foydalanish shartlari', 'Cookie siyosati']
  },
  ru: {
    desc: "Первая цифровая логистическая платформа Узбекистана. Мы соединяем водителей и грузоотправителей.",
    col1: { title: "Пользователь", links: ['Грузоотправитель', 'Водитель', 'Компания', 'Сотрудничество', 'Карьера'] },
    col2: { title: "Услуги", links: ['Перевозка', 'Экспресс доставка', 'Рефрижератор', 'Опасный груз', 'Страхование'] },
    col3: { title: "Контакты", support: "Поддержка" },
    bottom: ["© 2024 Yuk.uz. Все права защищены.", 'Политика конфиденциальности', 'Условия использования', 'Политика Cookie']
  },
  en: {
    desc: "Uzbekistan's first digital freight platform. We connect drivers and shippers.",
    col1: { title: "User", links: ['Shipper', 'Driver', 'Company', 'Partnership', 'Career'] },
    col2: { title: "Services", links: ['Transportation', 'Express delivery', 'Refrigerated cargo', 'Hazardous cargo', 'Insurance'] },
    col3: { title: "Contact", support: "Support" },
    bottom: ["© 2024 Yuk.uz. All rights reserved.", 'Privacy Policy', 'Terms of Use', 'Cookie Policy']
  }
};

const Footer = ({ currentLang }) => {
  const t = translations[currentLang];
  return (
    <footer className="bg-[#121416] text-gray-400">
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start">
            <div className="flex gap-3 items-center mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-linear-to-br from-[#4361ee] to-[#7209b7]"><FaTruckLoading className='text-white' /></div>
              <h2 className='text-2xl text-[#4361ee] font-bold'>Yuk.uz</h2>
            </div>
            {/* <p className="text-sm text-gray-300 leading-relaxed">{t.desc}</p> */}
            <div className="flex gap-3 mt-6">
              {[FaTelegramPlane, FaInstagram, FaFacebookF, FaYoutube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#4361ee] text-white transition-all duration-300"><Icon /></button>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-white text-lg font-bold mb-6">{t.col1.title}</h3>
            <ul className="space-y-2">
              {t.col1.links.map((item, i) => <li key={i}><a href="#" className="text-sm hover:text-white transition-colors">{item}</a></li>)}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-white text-lg font-bold mb-6">{t.col2.title}</h3>
            <ul className="space-y-2">
              {t.col2.links.map((item, i) => <li key={i}><a href="#" className="text-sm hover:text-white transition-colors">{item}</a></li>)}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-white text-lg font-bold mb-6">{t.col3.title}</h3>
            <ul className="space-y-2">
              <li className="text-lg text-gray-300 font-medium">+998 90 123 45 67</li>
              <li><a href="mailto:info@yuk.uz" className="text-sm hover:text-white">info@yuk.uz</a></li>
              <li className="text-sm">Toshkent shahri</li>
              <li><a href="#" className="text-sm hover:text-white">{t.col3.support}</a></li>
              <li><a href="#" className="text-sm hover:text-white">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm mb-4">{t.bottom[0]}</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium">
            {t.bottom.slice(1).map((item, i) => <a key={i} href="#" className="hover:text-white">{item}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
