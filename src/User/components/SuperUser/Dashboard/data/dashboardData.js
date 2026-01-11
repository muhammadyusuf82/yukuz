import React from 'react';
import { FaBox, FaCheckDouble, FaClock, FaTimesCircle, FaUsers, FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export const stats = [
  {
    title: 'Umumiy Yuklar',
    value: 1247,
    icon: FaBox,
    trend: 'up',
    trendValue: 12.5,
    color: 'text-blue-500 bg-blue-50'
  },
  {
    title: 'Yakunlangan',
    value: 942,
    icon: FaCheckDouble,
    trend: 'up',
    trendValue: 8.3,
    color: 'text-green-500 bg-green-50'
  },
  {
    title: 'Jarayonda',
    value: 183,
    icon: FaClock,
    trend: 'down',
    trendValue: 3.1,
    color: 'text-yellow-500 bg-yellow-50'
  },
  {
    title: 'Bekor qilingan',
    value: 45,
    icon: FaTimesCircle,
    trend: 'down',
    trendValue: 5.7,
    color: 'text-red-500 bg-red-50'
  },
  {
    title: 'Foydalanuvchilar',
    value: 2841,
    icon: FaUsers,
    trend: 'up',
    trendValue: 15.2,
    color: 'text-indigo-500 bg-indigo-50'
  },
  {
    title: 'Umumiy Daromad',
    value: 124500000,
    icon: FaWallet,
    trend: 'up',
    trendValue: 24.8,
    color: 'text-purple-500 bg-purple-50'
  },
];

export const recentLoads = [
  {
    id: '#YUK-2451',
    route: 'Toshkent → Samarqand',
    sender: { name: 'Akmal Karimov', avatar: 'AK' },
    driver: { name: 'John Doe', avatar: 'JH' },
    price: '850,000 so\'m',
    status: 'active'
  },
  {
    id: '#YUK-2450',
    route: 'Farg\'ona → Toshkent',
    sender: { name: 'Nodir Sobirov', avatar: 'NS' },
    driver: { name: 'Ali Valiyev', avatar: 'AV' },
    price: '1,200,000 so\'m',
    status: 'pending'
  },
  {
    id: '#YUK-2449',
    route: 'Buxoro → Navoiy',
    sender: { name: 'Sherzod Qodirov', avatar: 'SH' },
    driver: null,
    price: '2,500,000 so\'m',
    status: 'pending'
  }
];

export const recentTransactions = [
  { id: '#TXN-7841', amount: '850,000 so\'m', type: 'Yuk to\'lovi', status: 'completed', time: '10:30 AM' },
  { id: '#TXN-7840', amount: '1,200,000 so\'m', type: 'Yuk to\'lovi', status: 'pending', time: '09:15 AM' },
  { id: '#TXN-7839', amount: '500,000 so\'m', type: 'Yechib olish', status: 'cancelled', time: 'Yesterday' },
];
