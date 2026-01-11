import React from 'react';
import { FaTruck, FaPhone, FaStar } from "react-icons/fa";

const Drivers = () => {
    const drivers = [
        { id: 1, name: "Ali Valiyev", car: "Volvo FH16", rating: 4.9, status: "Yo'lda", phone: "+998 90 123 45 67" },
        { id: 2, name: "Sardor Rahimov", car: "MAN TGX", rating: 4.8, status: "Bo'sh", phone: "+998 93 765 43 21" },
    ];

    return (
        <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Haydovchilar jamoasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drivers.map(driver => (
                    <div key={driver.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {driver.name[0]}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg">{driver.name}</h4>
                            <p className="text-sm text-slate-500">{driver.car}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="flex items-center text-yellow-500 text-xs"><FaStar /> {driver.rating}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${driver.status === 'Yo\'lda' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                    {driver.status}
                                </span>
                            </div>
                        </div>
                        <button className="p-3 bg-white rounded-xl text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                            <FaPhone />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Drivers;
