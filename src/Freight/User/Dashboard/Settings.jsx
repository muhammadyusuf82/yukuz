import React, { useEffect } from 'react';
import { FaUser, FaLock, FaBell } from "react-icons/fa";

const Settings = () => {

    
    return(
    <div className="bg-white rounded-4xl p-8 border border-slate-100">
        <h2 className="text-2xl font-bold mb-8">Sozlamalar</h2>
        <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-slate-100 rounded-full border-4 border-blue-50 flex items-center justify-center text-slate-300 text-4xl">
                    <FaUser />
                </div>
                <button className="text-blue-600 font-bold text-sm">Rasmni o'zgartirish</button>
            </div>
            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">F.I.SH</label>
                        <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Ism Familiya" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">Telefon</label>
                        <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none" defaultValue="+998 99 396 73 36" />
                    </div>
                </div>
                <button className="bg-[#4361ee] text-white px-8 py-4 rounded-2xl font-bold">Saqlash</button>
            </div>
        </div>
    </div>
    )
};
export default Settings;