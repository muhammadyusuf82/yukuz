import React, { useState, useEffect, useRef } from 'react';
import { FaBox, FaTruck, FaUpload, FaUserCheck, FaTruckLoading, FaShieldAlt, FaMapMarkerAlt, FaWeightHanging, FaRegSnowflake, FaMoneyBillWave, FaStar } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import { FaPercent, FaHeadset, FaMapLocationDot, FaFileContract, FaFlagCheckered, FaRulerCombined, FaClock, FaList, FaPlus } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";

import Navbar from '../../components/User/Navbar/Navbar';
import Footer from '../../components/User/Footer/Footer';

import TruckVideo from "../../../videos/TrucksVideo.mp4"
import { Link } from 'react-router-dom';

// 1. BARCHA TARJIMALAR OBYEKTI
const translations = {
  uz: {
    heroTitle: "Yuk Tashish",
    heroSubtitle: "Endi Oddiy va Tezkor",
    heroDesc: "Yuk.uz - O'zbekistonning birinchi raqamli yuk tashish platformasi. Haydovchi va yuk beruvchilarni birlashtiramiz. Tez, ishonchli va xavfsiz.",
    btnSend: "Yuk Jo'natish",
    btnTransport: "Yuk Tashish",
    stats: ["Muvaffaqiyatli yuk", "Ishonchli haydovchi", "Mijozlar mamnuniyati"],
    workflowTitle: "Ish Tartibi",
    workflowDesc: "Yuk.uz platformasida ishlash juda oson. Faqat 3 ta oddiy qadam",
    steps: [
      { title: "Yukni Joylashtiring", desc: "Yuk ma'lumotlarini kiriting: qayerdan, qayerga, og'irlik, hajm va narx. Yuklaringiz darhol ko'rinadi." },
      { title: "Haydovchi Tanlang", desc: "Haydovchilarning takliflarini ko'rib chiqing. Reyting, sharhlar va narxlarni solishtiring." },
      { title: "Yukni Yetkazib Bering", desc: "Yuk jo'nab ketadi. Har qadamda kuzatib boring. Yuk yetkazilgach to'lovni qiling." }
    ],
    advTitle: "Bizning Afzalliklarimiz",
    advDesc: "Nega aynan Yuk.uz platformasini tanlashingiz kerak",
    advantages: [
      { title: "100% Xavfsizlik", desc: "Barcha to'lovlar xavfsiz tizim orqali amalga oshiriladi. Yuklar sug'urtalangan." },
      { title: "Tezkor Yetkazish", desc: "O'rtacha 30 daqiqa ichida haydovchi topiladi. Tezkor xizmat." },
      { title: "Eng Yaxshi Narxlar", desc: "Bir necha haydovchilardan narxlarni solishtiring. Maqbulini tanlang." },
      { title: "24/7 Qo'llab-quvvatlash", desc: "Kuning istalgan vaqtida bizning operatorlarimiz yordamga tayyor." },
      { title: "Real Vaqtda Kuzatish", desc: "Yukning har bir harakatini xaritada real vaqtda kuzatib boring." },
      { title: "Rasmiy Shartnoma", desc: "Har bir yuk uchun rasmiy shartnoma tuziladi. Huquqlaringiz himoyalangan." }
    ],
    cargoTitle: "Faol Yuklar",
    cargoDesc: "Hozir tashilishi kerak bo'lgan yuklar",
    cargoItems: {
      status: "Faol",
      product: ["Meva", "Sovutilgan", "Xavfli yuk"],
      unit: "tonna",
      btnOffer: "Taklif berish",
      btnAll: "Barcha Yuklarni Ko'rish"
    },
    driversTitle: "Haydovchilar uchun",
    driversDesc: "Nega aynan Yuk.uz platformasida ishlashingiz kerak",
    driversFeatures: [
      { title: "Yuqori Daromad", desc: "O'rtacha oylik daromad 15-20 million so'm. Doimiy yuklar oqimi." },
      { title: "Ixtiyoriy Jadval", desc: "O'zingiz qulay vaqtda ishlang. Kunlik yoki haftalik reja tuzing." },
      { title: "Xavfsiz To'lov", desc: "Barcha to'lovlar platforma orqali xavfsiz amalga oshiriladi." },
      { title: "Reyting Tizimi", desc: "Yaxshi ishlaganingiz uchun yuqori reyting va ko'proq yuklar oling." }
    ],
    driverBtn: "Haydovchi Bo'lish",
    testimonialsTitle: "Mijozlarimiz Fikrlari",
    testimonialsDesc: "Bizning mijozlarimiz nima deyishadi",
    testimonialText: '"Yuk.uz platformasi orqali bir necha oydan beri yuklarimni tashiyman. Juda qulay va ishonchli. Haydovchilar sifatli, narxlar ham maqbul."',
    faqTitle: "Tez-tez So'raladigan Savollar",
    faqDesc: "Ko'p so'raladigan savollarga javoblar",
    faqQuestions: [
      { q: "Yuk qanday joylashtiriladi?", a: "Saytga ro'yxatdan o'ting, 'Yuk qo'shish' tugmasini bosing va ma'lumotlarni to'ldiring." },
      { q: "To'lov qanday amalga oshiriladi?", a: "To'lovlar Click, Payme yoki naqd pul orqali xavfsiz tizimda amalga oshiriladi." },
      { q: "Haydovchi qanday tanlanadi?", a: "Haydovchilar taklif berishadi, siz reyting va narxga qarab tanlaysiz." },
      { q: "Komissiya qancha?", a: "Platforma komissiyasi yuk narxining 5% ni tashkil qiladi. Bu komissiya xavfsiz to'lov, mijozlar bilan ishlash va texnik qo'llab-quvvatlash xizmatlari uchun." },
      { q: "Yukni qanday kuzatish mumkin?", a: "Har bir yuk uchun maxsus kuzatish bo'limi mavjud. Yukning real vaqtda qayerda ekanligini xaritada ko'rishingiz, haydovchi bilan chat orqali bog'lanishingiz mumkin." },
    ]
  },
  ru: {
    heroTitle: "Грузоперевозки",
    heroSubtitle: "Теперь Просто и Быстро",
    heroDesc: "Yuk.uz - первая цифровая логистическая платформа в Узбекистане. Соединяем водителей и грузовладельцев. Быстро, надежно и безопасно.",
    btnSend: "Отправить груз",
    btnTransport: "Перевезти груз",
    stats: ["Успешных доставок", "Надежных водителей", "Довольных клиентов"],
    workflowTitle: "Как это работает",
    workflowDesc: "Работать с Yuk.uz очень просто. Всего 3 простых шага",
    steps: [
      { title: "Разместите груз", desc: "Введите данные: откуда, куда, вес, объем и цену. Ваш груз сразу увидят водители." },
      { title: "Выберите водителя", desc: "Просмотрите предложения водителей. Сравните рейтинги, отзывы и цены." },
      { title: "Доставьте груз", desc: "Груз отправляется. Отслеживайте каждый этап и платите безопасно после доставки." }
    ],
    advTitle: "Наши преимущества",
    advDesc: "Почему стоит выбрать платформу Yuk.uz",
    advantages: [
      { title: "100% Безопасность", desc: "Все платежи проходят через безопасную систему. Грузы застрахованы." },
      { title: "Быстрая доставка", desc: "Водитель находится в среднем за 30 минут. Скорость наш приоритет." },
      { title: "Лучшие цены", desc: "Сравните цены от нескольких водителей. Выберите самое выгодное предложение." },
      { title: "24/7 Поддержка", desc: "Наши операторы готовы помочь вам в любое время суток." },
      { title: "Трекинг в реальном времени", desc: "Следите за каждым движением груза на карте в реальном времени." },
      { title: "Официальный договор", desc: "На каждый груз оформляется договор. Ваши права защищены законом." }
    ],
    cargoTitle: "Активные грузы",
    cargoDesc: "Грузы, которые необходимо перевезти сейчас",
    cargoItems: {
      status: "Активен",
      product: ["Фрукты", "Охлажденный", "Опасный груз"],
      unit: "тонн",
      btnOffer: "Предложить",
      btnAll: "Посмотреть все грузы"
    },
    driversTitle: "Для водителей",
    driversDesc: "Почему вам стоит работать именно с платформой Yuk.uz",
    driversFeatures: [
      { title: "Высокий доход", desc: "Средний доход 15-20 млн сум. Постоянный поток заказов." },
      { title: "Гибкий график", desc: "Работайте в удобное время. Сами планируйте свой день." },
      { title: "Безопасная оплата", desc: "Все выплаты гарантированы и проходят через платформу." },
      { title: "Система рейтинга", desc: "Зарабатывайте репутацию и получайте больше выгодных заказов." }
    ],
    driverBtn: "Стать водителем",
    testimonialsTitle: "Отзывы клиентов",
    testimonialsDesc: "Что говорят наши клиенты",
    testimonialText: '"Пользуюсь платформой Yuk.uz уже несколько месяцев. Очень удобно и надежно. Качественные водители и разумные цены."',
    faqTitle: "Часто задаваемые вопросы",
    faqDesc: "Ответы на часто задаваемые вопросы",
    faqQuestions: [
      { q: "Как разместить груз?", a: "Зарегистрируйтесь, нажмите 'Добавить груз' и заполните все данные." },
      { q: "Как производится оплата?", a: "Оплата производится через Click, Payme или наличными через безопасную систему." },
      { q: "Как выбрать водителя?", a: "Водители предлагают свою цену, вы выбираете по рейтингу и отзывам." },
      { q: "Каков размер комиссии?", a: "Комиссия платформы составляет 5% от стоимости доставки. Эта комиссия покрывает расходы на безопасную оплату, обслуживание клиентов и техническую поддержку." },
      { q: "Как отследить отправление?", a: "Для каждой посылки предусмотрен специальный раздел отслеживания. Вы можете видеть местоположение посылки на карте в режиме реального времени и общаться с водителем через чат." },
    ]
  },
  en: {
    heroTitle: "Logistics",
    heroSubtitle: "Simple and Fast Now",
    heroDesc: "Yuk.uz - the first digital freight platform in Uzbekistan. We connect drivers and shippers. Fast, reliable, and secure.",
    btnSend: "Send Cargo",
    btnTransport: "Transport Cargo",
    stats: ["Successful deliveries", "Reliable drivers", "Customer satisfaction"],
    workflowTitle: "How It Works",
    workflowDesc: "Working with Yuk.uz is easy. Just 3 simple steps",
    steps: [
      { title: "Post Cargo", desc: "Enter details: origin, destination, weight, volume, and price. Visible immediately." },
      { title: "Choose Driver", desc: "Review offers. Compare driver ratings, reviews, and prices." },
      { title: "Deliver Cargo", desc: "Cargo moves. Track it every step of the way. Pay securely after delivery." }
    ],
    advTitle: "Our Advantages",
    advDesc: "Why you should choose the Yuk.uz platform",
    advantages: [
      { title: "100% Security", desc: "All payments are made through a secure system. Cargo is insured." },
      { title: "Fast Delivery", desc: "A driver is found within 30 minutes on average. Rapid service." },
      { title: "Best Prices", desc: "Compare prices from several drivers. Choose the most optimal offer." },
      { title: "24/7 Support", desc: "Our operators are ready to help you at any time of the day." },
      { title: "Real-time Tracking", desc: "Track every movement of your cargo on the map in real-time." },
      { title: "Official Contract", desc: "An official contract is drawn up for each load. Rights protected." }
    ],
    cargoTitle: "Active Cargo",
    cargoDesc: "Loads that need to be transported right now",
    cargoItems: {
      status: "Active",
      product: ["Fruits", "Refrigerated", "Hazardous"],
      unit: "tons",
      btnOffer: "Make Offer",
      btnAll: "View All Cargo"
    },
    driversTitle: "For Drivers",
    driversDesc: "Why you should work with the Yuk.uz platform",
    driversFeatures: [
      { title: "High Income", desc: "Average monthly income 15-20 million UZS. Constant flow of loads." },
      { title: "Flexible Schedule", desc: "Work at your convenience. Set your own daily or weekly plan." },
      { title: "Secure Payment", desc: "All payments are handled securely through the platform. Zero risk." },
      { title: "Rating System", desc: "Get high ratings for good work and receive more premium loads." }
    ],
    driverBtn: "Become a Driver",
    testimonialsTitle: "Testimonials",
    testimonialsDesc: "What our customers say",
    testimonialText: '"I have been shipping my goods through Yuk.uz for several months. Very convenient and reliable. Quality drivers."',
    faqTitle: "Frequently Asked Questions",
    faqDesc: "Answers to frequently asked questions",
    faqQuestions: [
      { q: "How to post a load?", a: "Register on the site, click 'Add Cargo' and fill in all the details." },
      { q: "How is payment made?", a: "Payments are made via Click, Payme, or cash through a secure system." },
      { q: "How to choose a driver?", a: "Drivers will bid, and you can choose based on rating and price." },
      { q: "How much is the commission?", a: "The platform commission is 5% of the shipping cost. This commission is for secure payment, customer service, and technical support services." },
      { q: "How to track the shipment?", a: "There is a special tracking section for each shipment. You can see the location of the shipment on the map in real time and communicate with the driver via chat." },
    ]
  }
};

const Home = () => {
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);
  const [openId, setOpenId] = useState(null);

  const token = localStorage.getItem('token')
  const [lastFreights, setLastFreights] = useState([])


  const [lang, setLang] = useState('en')
  const t = translations[lang]

  const [counts, setCounts] = useState({
    successful: 0,
    drivers: 0,
    satisfaction: 0
  });

  const targetCounts = {
    successful: 10,
    drivers: 5,
    satisfaction: 98
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const counterInterval = setInterval(() => {
      currentStep++;

      const progress = currentStep / steps;
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);

      setCounts({
        successful: Math.min(Math.floor(easeOutQuad * targetCounts.successful), targetCounts.successful),
        drivers: Math.min(Math.floor(easeOutQuad * targetCounts.drivers), targetCounts.drivers),
        satisfaction: Math.min(Math.floor(easeOutQuad * targetCounts.satisfaction), targetCounts.satisfaction)
      });

      if (currentStep >= steps) {
        clearInterval(counterInterval);
        setCounts(targetCounts);
      }
    }, stepDuration);

    return () => clearInterval(counterInterval);
  }, [isVisible]);

  const steps = [
    {
      number: "1",
      icon: <FaUpload className="text-3xl sm:text-4xl" />,
      ...t.steps[0],
      color: "from-blue-500 to-purple-600"
    },
    {
      number: "2",
      icon: <FaUserCheck className="text-3xl sm:text-4xl" />,
      ...t.steps[1],
      color: "from-purple-500 to-pink-600"
    },
    {
      number: "3",
      icon: <FaTruckLoading className="text-3xl sm:text-4xl" />,
      ...t.steps[2],
      color: "from-pink-500 to-red-600"
    }
  ];

  const adventages = [
    {
      id: 1,
      icon: FaShieldAlt,
      ...t.advantages[0]
    },
    {
      id: 2,
      icon: HiLightningBolt,
      ...t.advantages[1]
    },
    {
      id: 3,
      icon: FaPercent,
      ...t.advantages[2]
    },
    {
      id: 4,
      icon: FaHeadset,
      ...t.advantages[3]
    },
    {
      id: 5,
      icon: FaMapLocationDot,
      ...t.advantages[4]
    },
    {
      id: 6,
      icon: FaFileContract,
      ...t.advantages[5]
    },
  ]

  const loads = [
    {
      id: 1,
      l_num: "#YUK-2451",
      situation: t.cargoItems.status,
      from_province: "Toshkent",
      from_loc: "Chorsu bozori",
      to_province: "Samarqand",
      to_loc: "Registon maydoni",
      ton: 2.5,
      m: 12,
      product: t.cargoItems.product[0],
      product_icon: FaBox,
      date: `${lang === 'uz' ? 'Bugun' : '' || lang === 'ru' ? 'Сегодня' : '' || lang === 'en' ? 'Today' : ''} 18:00`,
      price: "850,000 so'm"
    },
    {
      id: 2,
      l_num: "#YUK-2450",
      situation: t.cargoItems.status,
      from_province: "Farg'ona",
      from_loc: "Markaziy bozor",
      to_province: "Toshkent",
      to_loc: "Yangiobod",
      ton: 5,
      m: 25,
      product: t.cargoItems.product[1],
      product_icon: FaRegSnowflake,
      date: `${lang === 'uz' ? 'Ertaga' : '' || lang === 'ru' ? 'Завтра' : '' || lang === 'en' ? 'Tomorrow' : ''} 9:00`,
      price: "1,200,000 so'm"
    },
    {
      id: 3,
      l_num: "#YUK-2449",
      situation: t.cargoItems.status,
      from_province: "Buxoro",
      from_loc: "Ko'kaldosh",
      to_province: "Navoiy",
      to_loc: "Zarafshon",
      ton: 8,
      m: 40,
      product: t.cargoItems.product[2],
      product_icon: IoWarning,
      date: `${lang === 'uz' ? 'Hozir' : '' || lang === 'ru' ? 'Сейчас' : '' || lang === 'en' ? 'Now' : ''}`,
      price: "2,500,000 so'm"
    },
  ]

  const drivers = [
    {
      id: 1,
      icon: FaMoneyBillWave,
      ...t.driversFeatures[0]
    },
    {
      id: 2,
      icon: FaClock,
      ...t.driversFeatures[1]
    },
    {
      id: 3,
      icon: FaWeightHanging,
      ...t.driversFeatures[2]
    },
    {
      id: 4,
      icon: FaStar,
      ...t.driversFeatures[3]
    },
  ]

  const questions = [
    {
      id: 1,
      question: t.faqQuestions[0].q,
      answer: t.faqQuestions[0].a
    },
    {
      id: 2,
      question: t.faqQuestions[1].q,
      answer: t.faqQuestions[1].a
    },
    {
      id: 3,
      question: t.faqQuestions[2].q,
      answer: t.faqQuestions[2].a
    },
    {
      id: 4,
      question: t.faqQuestions[3].q,
      answer: t.faqQuestions[3].a
    },
    {
      id: 5,
      question: t.faqQuestions[4].q,
      answer: t.faqQuestions[4].a
    },
  ]

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const url = 'https://tokennoty.pythonanywhere.com/api/freight/'
        const promise = await fetch(url, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const response = await promise.json()
        // console.log(response.slice().sort((a,b)=>b.id-a.id).slice(0, 3));
        setLastFreights(response.slice().sort((a, b) => b.id - a.id).slice(0, 3))
      } catch (error) {
        console.log(error);
      }
    }
    loadData()
  }, [])

  const getProductIcon = (freightType) => {
    switch (freightType) {
      case "Don mahsulotlari":
        return FaBox;
      default:
        return FaBox;
    }
  };

  const formatter = new Intl.NumberFormat('de-DE');

  return (
    <div ref={sectionRef}>
      <Navbar currentLang={lang} onLangChange={setLang} />
      <section id="home" className="relative min-h-screen py-8 sm:py-12 overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={TruckVideo} type="video/mp4" />
            Sizning brauzeringiz videoni qo'llab-quvvatlamaydi.
          </video>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="absolute w-full h-full backdrop-blur-sm"></div>

        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
          <div className="w-full lg:w-2/3 flex flex-col gap-6 md:gap-8 lg:gap-10">

            <div className="text-center lg:text-left">
              <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight md:leading-tight lg:leading-tight'>
                {t.heroTitle} <br className="hidden sm:block" />
                <span className="bg-linear-to-br from-[#4cc9f0] to-[#4361ee] bg-clip-text text-transparent">
                  {t.heroSubtitle}
                </span>
              </h1>
            </div>

            <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed md:leading-relaxed text-center lg:text-left max-w-2xl'>
              {t.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={'/login'} className='bg-[#4361ee] text-center text-white text-sm sm:text-base font-semibold border-2 border-[#4361ee] rounded-lg py-3 sm:py-4 px-6 sm:px-9 hover:bg-transparent hover:text-white duration-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95'>
                <FaBox className="text-lg" />
                {t.btnSend}
              </Link>
              <Link to={'/login'} className='text-white text-sm sm:text-base font-semibold border-2 border-white/50 rounded-lg py-3 sm:py-4 px-6 sm:px-9 hover:bg-white hover:text-[#4361ee] duration-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 backdrop-blur-sm'>
                <FaTruck className="text-lg" />
                {t.btnTransport}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mt-4 sm:mt-6">
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-2">
                  {counts.successful}+
                </div>
                <span className='text-xs sm:text-sm md:text-base text-gray-300 uppercase tracking-wide block'>
                  {t.stats[0]}
                </span>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-2">
                  {counts.drivers}+
                </div>
                <span className='text-xs sm:text-sm md:text-base text-gray-300 uppercase tracking-wide block'>
                  {t.stats[1]}
                </span>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-2">
                  {counts.satisfaction}+
                </div>
                <span className='text-xs sm:text-sm md:text-base text-gray-300 uppercase tracking-wide block'>
                  {t.stats[2]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.workflowTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t.workflowDesc}
            </p>
          </div>

          <div className="relative">

            <div className="hidden lg:flex absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-0">
              <div className="w-full flex justify-between items-center px-16">
                <div className="w-full h-0.5 bg-linear-to-r from-blue-400 to-purple-400"></div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-2xl p-6 py-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">

                      <div className="w-12 h-12 m-auto sm:w-14 sm:h-14 md:w-14 md:h-14 bg-linear-to-br from-blue-600 to-purple-500 rounded-full flex items-center justify-center mb-5">
                        <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">{step.number}</span>
                      </div>

                      <div className="text-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section >

      <section id="features" className='py-12 sm:py-16 md:py-20 lg:py-24 bg-[#f8f9fa]'>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.advTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t.advDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {adventages.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-5 flex-col p-8 py-10 bg-white border border-white rounded-3xl shadow-lg duration-300 hover:border-blue-600 transform hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-linear-to-br from-[#4361ee] to-blue-400">
                    <item.icon className='text-3xl text-white' />
                  </div>
                  <h2 className='text-xl md:text-2xl font-bold'>{item.title}</h2>
                  <p className='text-sm sm:text-base md:text-lg text-center'>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="cargo" className='py-12 sm:py-16 md:py-20 lg:py-24 bg-white'>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.cargoTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t.cargoDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {lastFreights.map((item, index) => {
              const ProductIcon = getProductIcon(item.freight_type);
              return (
                <div key={index} className="flex gap-5 flex-col bg-white border border-white rounded-3xl shadow-lg duration-300 hover:border-blue-600 transform hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="flex items-center justify-between px-6 py-4 pt-8">
                    <span className='text-sm text-gray-700 font-semibold'>#YUK-{item.id}</span>
                    <span className='text-xs text-[#4cc9f0] bg-[#4cc9f0]/15 rounded-xl py-0.5 px-2 font-semibold'>{item.status}</span>
                  </div>
                  <div className="border-t border-b border-gray-300 px-6 py-5">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-full bg-[#e9ecef] flex items-center justify-center">
                        <FaMapMarkerAlt className='text-base text-[#4361ee]' />
                      </div>
                      <div>
                        <h4 className='text-lg font-bold'>{item.route_starts_where_data.city}</h4>
                        <p className='text-base text-gray-500 mt-0.5'>{item.route_starts_where_data.region}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center mt-4">
                      <div className="w-9 h-9 rounded-full bg-[#e9ecef] flex items-center justify-center">
                        <FaFlagCheckered className='text-base text-[#4361ee]' />
                      </div>
                      <div>
                        <h4 className='text-lg font-bold'>{item.route_ends_where_data.city}</h4>
                        <p className='text-base text-gray-500 mt-0.5'>{item.route_ends_where_data.region}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-gray-300 px-6 py-5 pb-8">
                    <p className='flex gap-2 items-center'>
                      <FaWeightHanging className='text-[#4361ee]' />
                      <span>{item.weight} kg</span>
                    </p>
                    <p className='flex gap-2 items-center'>
                      <FaRulerCombined className='text-[#4361ee]' />
                      <span>{(item.volume ?? '').split('.')[0]} m<sup>3</sup></span>
                    </p>
                    <p className='flex gap-2 items-center'>
                      <ProductIcon className='text-[#4361ee]' />
                      <span>{item.freight_type}</span>
                    </p>
                    <p className='flex gap-2 items-center'>
                      <FaClock className='text-[#4361ee]' />
                      <span>{(item.route_end_time_to ?? '').split('T')[0]}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-6 pb-5">
                    <h2 className='text-xl md:text-2xl text-[#4361ee] font-bold'>{formatter.format((item.freight_rate_amount ?? '').split('.')[0])} {item.freight_rate_currency}</h2>
                    <Link to={'/login'} className='bg-[#4361ee] text-white text-center text-base font-semibold border-2 border-[#4361ee] rounded-xl py-3 px-6 transform hover:-translate-y-1.5 hover:shadow-lg duration-300 cursor-pointer'>{lang === 'uz' ? 'Taklif berish' : '' || lang === 'en' ? 'Make an offer' : '' || lang === 'ru' ? 'Сделайте предложение' : ''}</Link>
                  </div>
                </div>

              )
            })}
          </div>

          <div className="flex justify-center pt-10">
            <Link to={'/login'} className='flex gap-3 items-center bg-[#4361ee] text-white text-base font-semibold border-2 border-[#4361ee] rounded-xl py-4 px-8 transform hover:-translate-y-1.5 hover:shadow-lg duration-300 cursor-pointer'>
              <FaList />
              {t.cargoItems.btnAll}
            </Link>

          </div>
        </div>
      </section>

      <section id="drivers" className='py-12 sm:py-16 md:py-20 lg:py-24 bg-[#f8f7fd]'>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.driversTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t.driversDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {drivers.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-5 flex-col p-8 bg-white border border-white rounded-3xl shadow-lg duration-300 hover:border-blue-600 transform hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-linear-to-br from-[#4361ee] to-blue-400">
                    <item.icon className='text-3xl text-white' />
                  </div>
                  <h2 className='text-xl md:text-2xl font-bold'>{item.title}</h2>
                  <p className='text-sm sm:text-base md:text-lg text-center'>{item.desc}</p>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center pt-10">
            <Link to={'/login'} className='flex gap-3 items-center bg-[#4361ee] text-white text-base font-semibold border-2 border-[#4361ee] rounded-xl py-4 px-8 transform hover:-translate-y-1.5 hover:shadow-lg duration-300 cursor-pointer'>
              <FaTruck />
              {t.driverBtn}
            </Link>

          </div>
        </div>
      </section>

      <section className='py-12 sm:py-16 md:py-20 lg:py-24 bg-white'>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.testimonialsTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t.testimonialsDesc}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-3xl p-8 sm:p-10 md:p-12 lg:p-14 bg-white border border-gray-200 rounded-3xl shadow-xl">
              <h3 className='text-sm sm:text-base md:text-lg lg:text-xl text-[#343a40] text-center italic'>{t.testimonialText}</h3>
              <div className="flex items-center gap-5 justify-center mt-10">
                <div className="w-13 h-13 rounded-full flex items-center justify-center bg-linear-to-r from-blue-600 to-purple-600">
                  <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold'>AK</h2>
                </div>
                <div>
                  <h4 className='text-lg font-bold'>Akmal Karimov</h4>
                  <p className='text-base text-gray-500 mt-0.5'>Savdogar, Toshkent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className='py-12 sm:py-16 md:py-20 lg:py-24 bg-[#f8f9fa]'>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t.faqTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {t.faqDesc}
            </p>
          </div>

          <div className="flex gap-5 items-center flex-col">
            {questions.map((item, index) => {
              const isOpen = openId === item.id;
              return (
                <div key={index} className="w-full max-w-3xl bg-white border border-gray-200 rounded-3xl duration-300 overflow-hidden cursor-pointer" onClick={() => { toggleAccordion(item.id) }}>
                  <div className="flex items-center justify-between bg-white duration-300 hover:bg-gray-50 p-8">
                    <h2 className='text-lg md:text-xl font-semibold'>{item.question}</h2>
                    <FaPlus className={`text-[#4361ee] transform transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
                  </div>
                  <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className='px-8 pb-8'>
                        <p className='text-base md:text-lg text-gray-500 border-t border-gray-100 pt-4'>
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer currentLang={lang} />
    </div >
  );
};

export default Home;
