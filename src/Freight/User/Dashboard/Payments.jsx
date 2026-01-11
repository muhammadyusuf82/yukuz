import React from 'react';
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";

const Payments = () => (
    <div className="space-y-6">
        <div className="bg-linear-to-r from-[#4361ee] to-[#7209b7] rounded-4xl p-8 text-white">
            <p className="opacity-80">Umumiy balans</p>
            <h2 className="text-4xl font-bold mt-2">12,500,000 UZS</h2>
            <div className="flex gap-4 mt-6">
                <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-xl text-sm font-medium">To'ldirish</button>
                <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-xl text-sm font-medium">Yechib olish</button>
            </div>
        </div>
        <div className="bg-white rounded-4xl p-8 border border-slate-100">
            <h3 className="font-bold mb-4">Oxirgi amallar</h3>
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><FaArrowDown /></div>
                            <div>
                                <p className="font-bold">Yuk tashuv to'lovi</p>
                                <p className="text-xs text-slate-500">24-May, 2024</p>
                            </div>
                        </div>
                        <span className="font-bold text-green-600">+2,400,000</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
export default Payments;
