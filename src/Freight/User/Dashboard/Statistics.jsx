import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { FaChartLine, FaArrowUp, FaArrowDown, FaCalendarAlt } from "react-icons/fa";

const data = [
    { name: 'Dush', yuklar: 12, daromad: 4000 },
    { name: 'Sesh', yuklar: 18, daromad: 3000 },
    { name: 'Chor', yuklar: 15, daromad: 5000 },
    { name: 'Pay', yuklar: 22, daromad: 2780 },
    { name: 'Jum', yuklar: 30, daromad: 6890 },
    { name: 'Shan', yuklar: 25, daromad: 2390 },
    { name: 'Yak', yuklar: 10, daromad: 3490 },
];

const pieData = [
    { name: 'Yetkazilgan', value: 400 },
    { name: 'Yo\'lda', value: 300 },
    { name: 'Kutilmoqda', value: 100 },
];

const COLORS = ['#4361ee', '#7209b7', '#f72585'];

const Statistics = () => {
    return (
        <div className="space-y-6 pb-10">
            {/* Sarlavha qismi */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-4xl border border-slate-100 shadow-sm gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Analitika va Statistika</h2>
                    <p className="text-slate-500 text-sm">Haftalik yuk tashuv ko'rsatkichlari</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <FaCalendarAlt className="text-blue-600" />
                    <span className="text-sm font-semibold">Oxirgi 7 kun</span>
                </div>
            </div>

            {/* Asosiy grafiklar */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Yuklar o'sishi grafigi */}
                <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700">Yuklar hajmi (Haftalik)</h3>
                        <span className="text-green-500 flex items-center gap-1 text-sm font-bold">
                            <FaArrowUp /> +14.5%
                        </span>
                    </div>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorYuk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4361ee" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="yuklar" stroke="#4361ee" strokeWidth={3} fillOpacity={1} fill="url(#colorYuk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daromad ustunli grafigi */}
                <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-700 mb-6">Moliyaviy ko'rsatkichlar (Mln so'm)</h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Bar dataKey="daromad" fill="#7209b7" radius={[10, 10, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pastki kichik grafik va ko'rsatkichlar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <h3 className="font-bold text-slate-700 mb-4 w-full">Holat taqsimoti</h3>
                    <div className="h-50 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-2">
                        {pieData.map((item, i) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-linear-to-br from-[#4361ee] to-[#7209b7] p-8 rounded-4xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Yillik samadorlik</h3>
                        <p className="opacity-80 text-sm mb-6">Sizning biznesingiz o'tgan yilga nisbatan 28% ko'proq yuk tashidi.</p>
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-opacity-90 transition-all">
                            To'liq hisobotni yuklash
                        </button>
                    </div>
                    <FaChartLine className="absolute -right-10 -bottom-10 text-white opacity-10 text-[200px]" />
                </div>
            </div>
        </div>
    );
};

export default Statistics;
