// components/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import {
    FaCog, FaSave, FaUndo, FaBell, FaShieldAlt,
    FaGlobe, FaCreditCard, FaUsers, FaEnvelope,
    FaMobileAlt, FaChartLine, FaDatabase, FaSpinner,
    FaExclamationTriangle, FaCheckCircle
} from 'react-icons/fa';

const SettingsPage = ({ showToast }) => {
    const [settings, setSettings] = useState({
        name: 'Yuk.uz',
        minimum_price_for_freight: 0,
        maximum_price_for_freight: 5000000,
        // Frontend uchun qo'shimcha sozlamalar
        platformCurrency: 'UZS',
        commissionRate: 5,
        notificationEmail: true,
        notificationSMS: true,
        notificationPush: true,
        autoApproveDrivers: false,
        autoApproveLoads: false,
        maintenanceMode: false,
        taxRate: 12,
        minWithdrawal: 100000,
        maxLoadWeight: 5000,
        supportEmail: 'support@yuk.uz',
        supportPhone: '+998 78 123 45 67'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // API dan sozlamalarni olish
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://tokennoty.pythonanywhere.com/api/site-settings/');

            if (!response.ok) {
                throw new Error(`HTTP xatosi! Status: ${response.status}`);
            }

            const data = await response.json();

            // Agar ma'lumot bo'lsa, birinchi elementni olamiz
            if (data && data.length > 0) {
                const apiSettings = data[0];
                setSettings(prev => ({
                    ...prev,
                    name: apiSettings.name || 'Yuk.uz',
                    minimum_price_for_freight: apiSettings.minimum_price_for_freight || 0,
                    maximum_price_for_freight: apiSettings.maximum_price_for_freight || 5000000
                }));
                showToast('Sozlamalar yuklandi', 'success');
            } else {
                // Agar API bo'sh bo'lsa, default sozlamalarni ko'rsatamiz
                showToast('API dan sozlamalar topilmadi. Yangi sozlamalarni yarating.', 'info');
            }

            setError(null);
        } catch (err) {
            console.error('API xatosi:', err);
            setError('Sozlamalarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.');
            showToast('Sozlamalarni yuklashda xatolik', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Sozlamalarni saqlash (POST yoki PUT)
    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            // API ga yuboriladigan ma'lumotlar
            const apiData = {
                name: settings.name,
                minimum_price_for_freight: settings.minimum_price_for_freight,
                maximum_price_for_freight: settings.maximum_price_for_freight
            };

            // Avval sozlamalar mavjudligini tekshirish uchun GET qilamiz
            const checkResponse = await fetch('https://tokennoty.pythonanywhere.com/api/site-settings/');

            let response;
            if (checkResponse.ok) {
                const existingData = await checkResponse.json();

                if (existingData && existingData.length > 0) {
                    // Agar mavjud bo'lsa, PUT bilan yangilaymiz
                    const existingId = existingData[0].id;
                    response = await fetch(`https://tokennoty.pythonanywhere.com/api/site-settings/${existingId}/`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(apiData)
                    });
                } else {
                    // Mavjud emas, POST bilan yaratamiz
                    response = await fetch('https://tokennoty.pythonanywhere.com/api/site-settings/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(apiData)
                    });
                }
            } else {
                // GET xatosi bo'lsa ham, POST qilishga urinamiz
                response = await fetch('https://tokennoty.pythonanywhere.com/api/site-settings/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiData)
                });
            }

            if (!response.ok) {
                throw new Error(`Saqlashda xatolik! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Sozlamalar saqlandi:', result);

            // State ni yangilash
            setSettings(prev => ({
                ...prev,
                name: result.name || settings.name,
                minimum_price_for_freight: result.minimum_price_for_freight || settings.minimum_price_for_freight,
                maximum_price_for_freight: result.maximum_price_for_freight || settings.maximum_price_for_freight
            }));

            showToast('Sozlamalar muvaffaqiyatli saqlandi!', 'success');
            setError(null);

        } catch (err) {
            console.error('Saqlash xatosi:', err);
            setError('Sozlamalarni saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
            showToast('Sozlamalarni saqlashda xatolik', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings({
            name: 'Yuk.uz',
            minimum_price_for_freight: 0,
            maximum_price_for_freight: 5000000,
            platformCurrency: 'UZS',
            commissionRate: 5,
            notificationEmail: true,
            notificationSMS: true,
            notificationPush: true,
            autoApproveDrivers: false,
            autoApproveLoads: false,
            maintenanceMode: false,
            taxRate: 12,
            minWithdrawal: 100000,
            maxLoadWeight: 5000,
            supportEmail: 'support@yuk.uz',
            supportPhone: '+998 78 123 45 67'
        });
        showToast('Sozlamalar asl holatiga qaytarildi', 'info');
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Katta sonlarni qisqartirish
    const formatAmount = (amount) => {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'K';
        }
        return amount.toString();
    };

    // Yuklash holatini ko'rsatish
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Sozlamalar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Sozlamalar</h2>
                <p className="text-gray-600">Platforma sozlamalarini boshqarish</p>

                {/* Xato yoki ma'lumot */}
                {/* {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                            <FaExclamationTriangle />
                            <span>{error}</span>
                        </div>
                    </div>
                )} */}

                {/* Yangilash tugmasi */}
                <button
                    onClick={fetchSettings}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    disabled={loading}
                >
                    <FaSpinner className={loading ? 'animate-spin' : ''} />
                    Sozlamalarni yangilash
                </button>
            </div>

            <form onSubmit={handleSave}>
                {/* API sozlamalari */}
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FaCog className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">API Sozlamalari</h3>
                            <p className="text-gray-600">API orqali saqlanadigan asosiy sozlamalar</p>
                        </div>
                    </div>

                    {/* {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
                                <FaExclamationTriangle />
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )} */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platforma Nomi *
                            </label>
                            <input
                                type="text"
                                value={settings.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Platforma nomini kiriting"
                            />
                            <p className="text-sm text-gray-500 mt-2">Platformaning nomi (API ga saqlanadi)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platforma Valyutasi
                            </label>
                            <select
                                value={settings.platformCurrency}
                                onChange={(e) => handleChange('platformCurrency', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled
                            >
                                <option value="UZS">So'm (UZS)</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="RUB">RUB</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-2">Faqat ko'rsatish uchun</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimal Yuk Narxi (UZS) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={settings.minimum_price_for_freight}
                                    onChange={(e) => handleChange('minimum_price_for_freight', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    required
                                    placeholder="Minimal narxni kiriting"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {formatAmount(settings.minimum_price_for_freight)} UZS
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Platformadagi minimal yuk narxi (API ga saqlanadi)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maksimal Yuk Narxi (UZS) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={settings.maximum_price_for_freight}
                                    onChange={(e) => handleChange('maximum_price_for_freight', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    required
                                    placeholder="Maksimal narxni kiriting"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {formatAmount(settings.maximum_price_for_freight)} UZS
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Platformadagi maksimal yuk narxi (API ga saqlanadi)</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-3">
                            <FaCheckCircle className="text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-blue-800">API sozlamalari</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    Yuqoridagi 3 ta sozlamalar API orqali saqlanadi va boshqa foydalanuvchilar uchun ko'rinadi.
                                    Qolgan sozlamalar faqat shu brauzerda saqlanadi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Moliyaviy sozlamalar (Frontend) */}
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FaCreditCard className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Moliyaviy Sozlamalar</h3>
                            <p className="text-gray-600">To'lovlar va yechib olish sozlamalari</p>
                            <p className="text-xs text-yellow-600 mt-1">(Faqat shu brauzerda saqlanadi)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Qo'shilgan Qiymat Solig'i (%)
                            </label>
                            <input
                                type="number"
                                value={settings.taxRate}
                                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                max="30"
                                step="0.1"
                            />
                            <p className="text-sm text-gray-500 mt-2">Har bir tranzaksiyaga qo'shiladigan soliq</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimal Yechib Olish Miqdori (so'm)
                            </label>
                            <input
                                type="number"
                                value={settings.minWithdrawal}
                                onChange={(e) => handleChange('minWithdrawal', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="10000"
                                max="1000000"
                            />
                            <p className="text-sm text-gray-500 mt-2">Haydovchilar uchun minimal yechib olish miqdori</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platforma Komissiyasi (%)
                            </label>
                            <input
                                type="number"
                                value={settings.commissionRate}
                                onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                max="50"
                                step="0.1"
                            />
                            <p className="text-sm text-gray-500 mt-2">Yuk narxidan olinadigan foiz</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maksimal Yuk Og'irligi (kg)
                            </label>
                            <input
                                type="number"
                                value={settings.maxLoadWeight}
                                onChange={(e) => handleChange('maxLoadWeight', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="100"
                                max="20000"
                            />
                            <p className="text-sm text-gray-500 mt-2">Platforma qabul qiladigan maksimal og'irlik</p>
                        </div>
                    </div>
                </div>

                {/* Xabarnoma sozlamalari (Frontend) */}
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <FaBell className="text-purple-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Xabarnoma Sozlamalari</h3>
                            <p className="text-gray-600">Platforma xabarnomalari sozlamalari</p>
                            <p className="text-xs text-yellow-600 mt-1">(Faqat shu brauzerda saqlanadi)</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-gray-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Email xabarnomalari</div>
                                    <div className="text-sm text-gray-600">Mijozlarga email orqali xabar yuborish</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notificationEmail}
                                    onChange={(e) => handleChange('notificationEmail', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaMobileAlt className="text-gray-600" />
                                <div>
                                    <div className="font-medium text-gray-900">SMS xabarnomalari</div>
                                    <div className="text-sm text-gray-600">Mijozlarga SMS orqali xabar yuborish</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notificationSMS}
                                    onChange={(e) => handleChange('notificationSMS', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaBell className="text-gray-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Push xabarnomalari</div>
                                    <div className="text-sm text-gray-600">Ilova orqali push xabarnomalari</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notificationPush}
                                    onChange={(e) => handleChange('notificationPush', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Avtomatik sozlamalar (Frontend) */}
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <FaShieldAlt className="text-yellow-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Avtomatik Tasdiqlash</h3>
                            <p className="text-gray-600">Avtomatik tasdiqlash sozlamalari</p>
                            <p className="text-xs text-yellow-600 mt-1">(Faqat shu brauzerda saqlanadi)</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaUsers className="text-gray-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Haydovchilarni avtomatik tasdiqlash</div>
                                    <div className="text-sm text-gray-600">Yangilangan haydovchilarni avtomatik tasdiqlash</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.autoApproveDrivers}
                                    onChange={(e) => handleChange('autoApproveDrivers', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaChartLine className="text-gray-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Yuklarni avtomatik tasdiqlash</div>
                                    <div className="text-sm text-gray-600">Yangi yuklarni avtomatik tasdiqlash</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.autoApproveLoads}
                                    onChange={(e) => handleChange('autoApproveLoads', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FaDatabase className="text-gray-600" />
                                <div>
                                    <div className="font-medium text-gray-900">Texnik xizmat rejimi</div>
                                    <div className="text-sm text-gray-600">Platformani texnik xizmat rejimiga o'tkazish</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Qo'llab-quvvatlash sozlamalari (Frontend) */}
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <FaGlobe className="text-red-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Qo'llab-quvvatlash</h3>
                            <p className="text-gray-600">Qo'llab-quvvatlash va aloqa ma'lumotlari</p>
                            <p className="text-xs text-yellow-600 mt-1">(Faqat shu brauzerda saqlanadi)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Qo'llab-quvvatlash Email
                            </label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => handleChange('supportEmail', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Qo'llab-quvvatlash Telefoni
                            </label>
                            <input
                                type="tel"
                                value={settings.supportPhone}
                                onChange={(e) => handleChange('supportPhone', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Harakatlar tugmalari */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={saving}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaUndo /> Asl holatiga qaytarish
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin" /> Saqlanmoqda...
                            </>
                        ) : (
                            <>
                                <FaSave /> Sozlamalarni saqlash
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
