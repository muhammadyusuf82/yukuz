import React, { useState, useRef, useEffect } from 'react';
import {
  FaTruckLoading, FaBolt, FaHome, FaQuestionCircle, FaPlayCircle,
  FaHeadset, FaComments, FaBook, FaExclamationTriangle, FaStar,
  FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaSearch, FaBox,
  FaTruck, FaMoneyBillWave, FaMapMarkedAlt, FaUserShield, FaCog,
  FaArrowRight, FaChevronDown, FaThumbsUp, FaThumbsDown, FaEye,
  FaCalendar, FaUser, FaTag, FaComment, FaPaperclip,
  FaCloudUploadAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle,
  FaTimesCircle, FaPlay
} from 'react-icons/fa';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
const Yordam = () => {
  // FAQ state
  const [openFaqs, setOpenFaqs] = useState([1]);
  const [helpfulVotes, setHelpfulVotes] = useState({
    1: { helpful: 124, notHelpful: 12 },
    2: { helpful: 89, notHelpful: 8 },
    3: { helpful: 156, notHelpful: 15 },
    4: { helpful: 67, notHelpful: 23 },
    5: { helpful: 94, notHelpful: 11 }
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '', file: null
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'support', text: 'Salom! Yuk.uz qo\'llab-quvvatlash xizmatiga xush kelibsiz. Sizga qanday yordam bera olaman?', time: '15:30' },
    { id: 2, sender: 'support', text: 'Har qanday savolingiz bo\'lsa, menga yozing. Men sizga tezda javob berishga harakat qilaman.', time: '15:31' },
    { id: 3, sender: 'user', text: 'Salom, yuk qo\'shishda muammo bor. Tizim "Xatolik" deyapti.', time: '15:32' },
    { id: 4, sender: 'support', text: 'Kechirasiz, muammo uchun. Iltimos, qanday xatolik chiqayotganini aytib bera olasizmi? Yoki ekran rasmini yuborishingiz mumkin.', time: '15:32' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('help-center');
  const fileInputRef = useRef(null);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const sections = ['help-center', 'search', 'categories', 'faq', 'tutorials', 'contact', 'chat'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Data
  const categories = [
    { id: 1, title: 'Yuk Qo\'shish', count: '12 ta maqola', icon: FaBox },
    { id: 2, title: 'Haydovchilar', count: '8 ta maqola', icon: FaTruck },
    { id: 3, title: 'To\'lov va Narxlar', count: '15 ta maqola', icon: FaMoneyBillWave },
    { id: 4, title: 'Kuzatish va Xarita', count: '6 ta maqola', icon: FaMapMarkedAlt },
    { id: 5, title: 'Xavfsizlik va Maxfiylik', count: '10 ta maqola', icon: FaUserShield },
    { id: 6, title: 'Sozlamalar va Hisob', count: '7 ta maqola', icon: FaCog }
  ];

  const quickLinks = [
    { id: 'help-center', title: 'Yordam markazi', icon: FaHome },
    { id: 'search', title: 'Qidiruv', icon: FaSearch },
    { id: 'categories', title: 'Kategoriyalar', icon: FaCog },
    { id: 'faq', title: 'Savol-javoblar', icon: FaQuestionCircle },
    { id: 'tutorials', title: 'Video qo\'llanmalar', icon: FaPlayCircle },
    { id: 'contact', title: 'Aloqa markazi', icon: FaHeadset },
    { id: 'chat', title: 'Onlayn chat', icon: FaComments }
  ];

  const searchTips = ['Yuk qo\'shish', 'To\'lov usullari', 'Haydovchi tanlash', 'Yukni kuzatish', 'Shartnoma', 'Bekor qilish'];
  const tutorials = [
    { id: 1, title: 'Yuk qo\'shish - To\'liq qo\'llanma', duration: '5:24', views: '1.2k', date: '2 hafta oldin' },
    { id: 2, title: 'Yukni real-vaqtda kuzatish', duration: '7:15', views: '890', date: '1 oy oldin' },
    { id: 3, title: 'Narx kalkulyatori - Qanday ishlatiladi?', duration: '4:38', views: '1.5k', date: '3 kun oldin' }
  ];

  // FAQ Data
  const faqData = [
    {
      id: 1,
      question: 'Yukni qanday qo\'shaman va narxini qanday hisoblayman?',
      answer: `Yuk qo'shish uchun quyidagi qadamlarni bajaring:\n\n1. "Yuk qo'shish" tugmasini bosing\n2. Yuk ma'lumotlarini kiriting (qayerdan, qayerga, og'irlik, hajm)\n3. Yuk turi va transport turini tanlang\n4. Narx kalkulyatori avtomatik hisoblab beradi\n5. Taklifni tasdiqlang va haydovchi kuting\n\nNarx masofa, og'irlik, yuk turi, transport turi va yetkazish muddatiga qarab hisoblanadi.`
    },
    {
      id: 2,
      question: 'Yukni qanday kuzataman va holatini qanday bilib olaman?',
      answer: `Yukni kuzatishning bir necha usuli bor:\n\n1. Xarita orqali kuzatish:\n   • Xarita paneliga o'ting\n   • Yuk ID ni kiriting\n   • Real-vaqtda harakatni ko'ring\n\n2. Bildirishnomalar orqali:\n   • Har bir holat o'zgarishida push-bildirishnoma olasiz\n   • SMS orqali yangilanishlar\n   • Email orqali status xabarlari\n\n3. Telefon orqali:\n   • Haydovchi bilan bevosita aloqa\n   • Qo'llab-quvvatlash xizmati: +998 90 123 45 67`
    },
    {
      id: 3,
      question: 'To\'lovni qanday amalga oshiraman va qaysi usullar mavjud?',
      answer: `Biz quyidagi to'lov usullarini qabul qilamiz:\n\n1. Onlayn to'lovlar:\n   • Visa, MasterCard, Humo, UzCard\n   • Click (5% chegirma)\n   • Payme (3% chegirma)\n   • Apelsin (2% chegirma)\n\n2. Naqd to'lov:\n   • Yuk yetkazilganda haydovchiga\n   • Platforma ofisida\n\n3. Bank o'tkazmasi:\n   • Korporativ mijozlar uchun\n   • Oylik hisob-kitob\n\nBarcha to'lovlar xavfsiz va sertifikatlangan. Har bir tranzaksiya sug'urtalangan.`
    },
    {
      id: 4,
      question: 'Yukni bekor qilish mumkinmi va pul qaytariladimi?',
      answer: `Yukni bekor qilish siyosati:\n\n1. Yuk yuklanmagan:\n   • 100% pul qaytariladi\n   • 24 soat ichida hisobingizga\n\n2. Yuk yuklangan, lekin jo'natilmagan:\n   • 70% pul qaytariladi\n   • 30% haydovchiga kompensatsiya\n\n3. Yuk yo'lda:\n   • Pul qaytarilmaydi\n   • Boshqa manzilga o'zgartirish mumkin\n   • Qo'shimcha to'lov talab qilinadi\n\nBekor qilish uchun "Yuklar" panelidan yukni tanlang va "Bekor qilish" tugmasini bosing.`
    },
    {
      id: 5,
      question: 'Haydovchini qanday tanlayman va reytingi qanday?',
      answer: `Haydovchi tanlash tartibi:\n\n1. Avtomatik tanlash:\n   • Platforma eng yaxshi taklifni avtomatik tanlaydi\n   • Reyting, narx, masofa asosida\n\n2. Qo'lda tanlash:\n   • "Haydovchilar" paneliga o'ting\n   • Filtrlardan foydalaning (reyting, transport, narx)\n   • Haydovchini tanlang va taklif bering\n\nReyting tizimi:\n   • 5 yulduzli baholash\n   • Har bir yukdan keyin baholang\n   • Reyting quyidagilarga asoslanadi:\n     ✓ Vaqtiga rioya qilish\n     ✓ Yukni saqlash holati\n     ✓ Xizmat ko'rsatish sifat\n     ✓ Aloqa vaqti\n\nMinimal ishonchli reyting: 4.0 ★`
    }
  ];

  // Helper functions
  const toggleFaq = (id) => {
    setOpenFaqs(prev => prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]);
  };

  const markHelpful = (faqId, type) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: { ...prev[faqId], [type]: prev[faqId][type] + 1 }
    }));
    showNotification(`Bahoyingiz qabul qilindi! ${type === 'helpful' ? 'Rahmat!' : 'Sizning fikringiz biz uchun muhim.'}`, 'success');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, subject, message } = formData;

    if (!name || !email || !phone || !subject || !message) {
      showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
      return;
    }

    showNotification('Murojaatingiz yuborilmoqda...', 'success');

    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', file: null });
      showNotification('Murojaatingiz muvaffaqiyatli yuborildi! Tez orada operator siz bilan bog\'lanadi.', 'success');
    }, 1500);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      showNotification(`Fayl yuklandi: ${file.name}`, 'success');
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    setTimeout(() => {
      const responses = [
        "Tushunarli. Bu muammoni tekshirib ko'ramiz.",
        "Iltimos, biroz kuting, muammoni hal qilishga harakat qilaman.",
        "Bunday holatlar uchun kechirasiz. Texnik guruhga xabar beraman.",
        "Muammo haqida qo'shimcha ma'lumot bera olasizmi?",
        "Yordamingizga rahmat. Tez orada hal qilamiz."
      ];

      const supportMessage = {
        id: chatMessages.length + 2,
        sender: 'support',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      showNotification('Iltimos, qidiruv so\'zini kiriting!', 'warning');
      return;
    }
    showNotification('Qidiruv amalga oshirilmoqda...', 'success');
  };

  const callSupport = () => {
    showNotification('Qo\'ng\'iroq qilish: +998 90 123 45 67', 'success');
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/998901234567?text=Salom! Yuk.uz yordam markazidan yozmoqdaman.', '_blank');
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };
  return (<>
    <Navbar />
    <div className="min-h-screen bg-linear-to-br container mx-auto">
      {/* Main Content */}
      <main className="py-8 from-blue-50 to-purple-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with ID */}
          <div id="help-center" className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Yordam Markazi</h1>
            <p className="text-gray-600">Har qanday savolingizga javob toping yoki biz bilan bog'laning</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3"><FaBolt className="text-blue-600" />Tezkor O'tish</h3>
                <div className="space-y-1">
                  {quickLinks.map((link) => (
                    <button key={link.id} onClick={() => scrollToSection(link.id)} className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all ${activeSection === link.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-600 hover:text-white'}`}> <link.icon className="w-5" /> {link.title}</button>
                  ))}
                </div>
              </div>
              {/* Contact Card */}
              <div className="bg-linear-to-br from-blue-600 to-purple-700 text-white rounded-2xl p-6 text-center">
                <div className="w-15 h-15 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><FaHeadset /></div>
                <h3 className="text-xl font-bold mb-2">24/7 Qo'llab-quvvatlash</h3>
                <p className="opacity-90 text-sm mb-6">Har qanday vaqtda yordam oling</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FaPhone className="opacity-90" />
                    <span>+998 90 123 45 67</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FaEnvelope className="opacity-90" />
                    <span>support@yuk.uz</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FaClock className="opacity-90" />
                    <span>Dushanba-Juma: 09:00-18:00</span>
                  </div>
                </div>
                <button onClick={callSupport} className="w-full py-3 rounded-xl font-semibold text-sm bg-white text-blue-600 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all"><FaPhone /> Qo'ng'iroq qilish</button>
                <button onClick={openWhatsApp} className="w-full py-3 rounded-xl font-semibold text-sm bg-transparent border border-white/30 text-white flex items-center justify-center gap-2 mt-3 hover:bg-white/10 transition-all"><FaWhatsapp /> WhatsApp orqali</button>
              </div>
            </div>
            {/* Main Content */}
            <div className="space-y-8">
              {/* Search Section with ID */}
              <section id="search" className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Nima yordam kerak?</h2>
                  <p className="text-gray-600 text-sm">Savolingizni kiriting yoki mavzu bo'yicha qidiring</p>
                </div>
                <div className="relative mb-4">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Masalan: 'Yuk qanday qo'shaman?', 'Narxni qanday hisoblayman?', 'Yukni kuzatish'..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {searchTips.map((tip) => (
                    <button key={tip} onClick={() => {setSearchQuery(tip); handleSearch();}} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-blue-600 hover:text-white transition-all">{tip}</button>
                  ))}
                </div>
              </section>
              {/* Categories Section with ID */}
              <section id="categories" className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Yordam Kategoriyalari</h2>
                  <button onClick={() => scrollToSection('categories')} className="text-blue-600 font-semibold text-sm flex items-center gap-2">Barchasini ko'rish <FaArrowRight /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category, index) => (
                    <button key={category.id} onClick={() => showNotification(`${category.title} kategoriyasi yuklanmoqda...`, 'success')} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg hover:border-blue-500 transition-all">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-4 ${index % 6 === 0 ? 'bg-linear-to-br from-blue-600 to-blue-500' : index % 6 === 1 ? 'bg-linear-to-br from-purple-700 to-purple-500' : index % 6 === 2 ? 'bg-linear-to-br from-cyan-500 to-cyan-400' : index % 6 === 3 ? 'bg-linear-to-br from-yellow-500 to-yellow-400' : index % 6 === 4 ? 'bg-linear-to-br from-pink-600 to-pink-400' : 'bg-linear-to-br from-teal-500 to-cyan-400'}`}><category.icon /></div>
                      <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </button>
                  ))}
                </div>
              </section>
              {/* FAQ Section with ID */}
              <section id="faq" className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Tez-tez So'raladigan Savollar</h2>
                  <button onClick={() => scrollToSection('faq')} className="text-blue-600 font-semibold text-sm flex items-center gap-2">Barcha savollarni ko'rish<FaArrowRight /></button>
                </div>
                <div className="space-y-3">
                  {faqData.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className={`py-4 px-6 flex items-center justify-between cursor-pointer transition-all ${openFaqs.includes(faq.id) ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={() => toggleFaq(faq.id)}>
                        <span className="font-semibold text-sm">{faq.question}</span><FaChevronDown className={`transition-all ${openFaqs.includes(faq.id) ? 'rotate-180 text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className={`overflow-hidden transition-all ${openFaqs.includes(faq.id) ? 'max-h-125 py-6 px-6' : 'max-h-0'}`}>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => markHelpful(faq.id, 'helpful')} className="py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 flex items-center gap-2"><FaThumbsUp /> Foydali ({helpfulVotes[faq.id]?.helpful})</button>
                          <button onClick={() => markHelpful(faq.id, 'notHelpful')} className="py-2 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 flex items-center gap-2"><FaThumbsDown /> Foydali emas ({helpfulVotes[faq.id]?.notHelpful})</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* Video Tutorials Section with ID */}
              <section id="tutorials" className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Video Qo'llanmalar</h2>
                  <button onClick={() => scrollToSection('tutorials')} className="text-blue-600 font-semibold text-sm flex items-center gap-2">Barcha videolarni ko'rish<FaArrowRight /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
                      <div className="relative h-40 bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <button onClick={() => showNotification(`"${tutorial.title}" video oynada ochilmoqda...`, 'success')} className="absolute w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-600 text-xl cursor-pointer hover:scale-110 transition-all"><FaPlay /></button>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">{tutorial.duration}</div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2">{tutorial.title}</h3>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaEye /> {tutorial.views} ko'rish</span>
                          <span className="flex items-center gap-1"><FaCalendar /> {tutorial.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* Contact Form Section with ID */}
              <section id="contact" className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Murojaat Qilish</h2>
                  <div className="text-sm text-gray-600">Javob vaqti: <strong>1-2 ish kuni</strong></div>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2"><FaUser className="text-blue-600" /> Ismingiz *</label>
                      <input name="name" value={formData.name} onChange={handleFormChange} required className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2"><FaEnvelope className="text-blue-600" /> Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2"><FaPhone className="text-blue-600" /> Telefon *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2"><FaTag className="text-blue-600" /> Mavzu *</label>
                      <select name="subject" value={formData.subject} onChange={handleFormChange} required className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Mavzuni tanlang</option>
                        <option value="technical">Texnik muammo</option>
                        <option value="billing">To'lov muammosi</option>
                        <option value="delivery">Yetkazish muammosi</option>
                        <option value="driver">Haydovchi muammosi</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2"><FaComment className="text-blue-600" /> Xabaringiz *</label>
                    <textarea name="message" value={formData.message} onChange={handleFormChange} required rows={4} className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2"><FaPaperclip className="text-blue-600" /> Fayl biriktirish</label>
                    <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                      <FaCloudUploadAlt className="text-gray-400 text-2xl mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">Faylni shu yerga torting yoki</p>
                      <button type="button" className="mt-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Fayl tanlash</button>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF, DOC (max 5MB)</p>
                    </div>
                    <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setFormData({ name: '', email: '', phone: '', subject: '', message: '', file: null })} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Tozalash</button>
                    <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><FaPaperPlane /> Yuborish</button>
                  </div>
                </form>
              </section>
              {/* Chat Support Section with ID */}
              <section id="chat" className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Onlayn Chat</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Onlayn</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden h-96 flex flex-col">
                  <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <div className="font-semibold">Yuk.uz Qo'llab-quvvatlash</div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Javob vaqti: 2 daqiqa</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Xabaringizni yozing..." />
                    <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaPaperPlane /></button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white flex items-center gap-3 animate-slide-in-right ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}>
          {notification.type === 'success' ? <FaCheckCircle /> : notification.type === 'error' ? <FaTimesCircle /> : <FaExclamationCircle />}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
    <Footer/>
    </>);
};

export default Yordam;