import React, { useState } from 'react';
import {
    FaSearch, FaChevronDown, FaHeadset, FaTelegramPlane,
    FaEnvelope, FaQuestionCircle, FaBook
} from "react-icons/fa";

const Help = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: "Qanday qilib yuk e'lon qilish mumkin?",
            answer: "Chap tarafdagi menyudan 'Yuk qo'shish' bo'limiga o'ting, yuk haqidagi ma'lumotlarni to'ldiring va 'Tasdiqlash' tugmasini bosing."
        },
        {
            id: 2,
            question: "To'lovlar qancha vaqtda amalga oshiriladi?",
            answer: "To'lovlar yuk yetkazib berilgani tasdiqlangandan so'ng, 24 soat ichida haydovchining balansiga kelib tushadi."
        },
        {
            id: 3,
            question: "Haydovchi bilan qanday bog'lanish mumkin?",
            answer: "Dashboard orqali o'z yukingizni tanlang va u yerda biriktirilgan haydovchining telefon raqami ko'rinadi."
        },
        {
            id: 4,
            question: "Profil ma'lumotlarini qayerdan o'zgartiraman?",
            answer: "Sozlamalar bo'limiga o'tib, ismingiz, telefon raqamingiz va rasmingizni yangilashingiz mumkin."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Search Header */}
            <div className="bg-linear-to-br from-[#4361ee] to-[#7209b7] p-10 rounded-[40px] text-white text-center shadow-xl shadow-blue-500/20">
                <h2 className="text-3xl font-bold mb-4">Sizga qanday yordam bera olamiz?</h2>
                <div className="max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Savolingizni yozing..."
                        className="w-full p-4 pl-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 outline-none placeholder:text-white/70"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-70" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQ Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 ml-2 mb-4 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-600" /> Ko'p beriladigan savollar
                    </h3>

                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-bold text-slate-700">{faq.question}</span>
                                <FaChevronDown className={`transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-40' : 'max-h-0'}`}>
                                <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Support Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 ml-2 mb-4 flex items-center gap-2">
                        <FaHeadset className="text-blue-600" /> Bog'lanish
                    </h3>

                    <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
                            <div className="p-3 bg-white rounded-xl shadow-sm"><FaTelegramPlane size={20} /></div>
                            <div>
                                <p className="font-bold text-sm">Telegram Bot</p>
                                <p className="text-xs opacity-70">24/7 tezkor javob</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50 text-purple-600 cursor-pointer hover:bg-purple-100 transition-colors">
                            <div className="p-3 bg-white rounded-xl shadow-sm"><FaEnvelope size={20} /></div>
                            <div>
                                <p className="font-bold text-sm">Email Support</p>
                                <p className="text-xs opacity-70">yordam@yuk.uz</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <p className="text-xs opacity-70 mb-1">Qo'ng'iroq qiling</p>
                                    <p className="text-lg font-bold">+998 71 200 00 00</p>
                                </div>
                                <FaHeadset className="absolute -right-4 -bottom-4 text-white/10 text-7xl group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600/5 p-6 rounded-4xl border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-2 font-bold">
                            <FaBook /> Yo'riqnoma
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Tizimdan foydalanish bo'yicha to'liq qo'llanmani PDF formatida yuklab olishingiz mumkin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
