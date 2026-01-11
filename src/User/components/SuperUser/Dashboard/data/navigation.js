import React from 'react';
import {
  FaTachometerAlt,
  FaBox,
  FaClock,
  FaTruckMoving,
  FaUsers,
  FaTruck,
  FaUserTie,
  FaUserCheck,
  FaCreditCard,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaHeadset,
  FaHistory,
} from 'react-icons/fa';

export const navItems = [
  { id: 'dashboard', icon: FaTachometerAlt, label: 'Dashboard', section: 'Asosiy' },
  { id: 'loads', icon: FaBox, label: 'Barcha Yuklar', badge: 12, section: 'Yuk Boshqaruvi' },
  { id: 'pending-loads', icon: FaClock, label: 'Kutilayotgan Yuklar', badge: 3 },
  { id: 'active-loads', icon: FaTruckMoving, label: 'Faol Yuklar' },
  { id: 'users', icon: FaUsers, label: 'Barcha Foydalanuvchilar', section: 'Foydalanuvchilar' },
  { id: 'drivers', icon: FaTruck, label: 'Haydovchilar' },
  { id: 'senders', icon: FaUserTie, label: 'Yuk Beruvchilar' },
  { id: 'verification', icon: FaUserCheck, label: 'Tasdiqlash', badge: 5 },
  { id: 'transactions', icon: FaCreditCard, label: 'Tranzaksiyalar', section: 'Moliya' },
  { id: 'withdrawals', icon: FaMoneyBillWave, label: 'Yechib olishlar', badge: 7 },
  { id: 'reports', icon: FaChartBar, label: 'Hisobotlar' },
  { id: 'settings', icon: FaCog, label: 'Sozlamalar', section: 'Platforma' },
  { id: 'support', icon: FaHeadset, label: 'Qo\'llab-quvvatlash', badge: 8 },
  { id: 'logs', icon: FaHistory, label: 'Audit Loglari' },
];

export const pageTitles = {
  dashboard: 'Dashboard',
  users: 'Foydalanuvchilar',
  settings: 'Sozlamalar',
  profile: 'Profil',
  loads: 'Barcha Yuklar',
  'pending-loads': 'Kutilayotgan Yuklar',
  'active-loads': 'Faol Yuklar',
  drivers: 'Haydovchilar',
  senders: 'Yuk Beruvchilar',
  verification: 'Tasdiqlash',
  transactions: 'Tranzaksiyalar',
  withdrawals: 'Yechib olishlar',
  reports: 'Hisobotlar',
  support: 'Qo\'llab-quvvatlash',
  logs: 'Audit Loglari'
};
