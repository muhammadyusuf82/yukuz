import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tasdiqlash</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-700">Haqiqatan ham o'chirmoqchimisiz?</p>
                </div>
                <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                    >
                        O'chirish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
