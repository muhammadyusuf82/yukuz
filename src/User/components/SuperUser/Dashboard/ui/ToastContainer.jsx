import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-6 right-6 z-50 space-y-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`bg-white rounded-lg shadow-lg p-4 min-w-75 max-w-100 border-l-4 ${toast.type === 'success' ? 'border-green-500' :
                        toast.type === 'error' ? 'border-red-500' :
                            toast.type === 'info' ? 'border-blue-500' :
                                'border-yellow-500'
                        } flex items-start space-x-3 animate-fade-in`}
                >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${toast.type === 'success' ? 'bg-green-500' :
                        toast.type === 'error' ? 'bg-red-500' :
                            toast.type === 'info' ? 'bg-blue-500' :
                                'bg-yellow-500'
                        }`}>
                        {toast.icon}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">
                            {toast.type === 'success' ? 'Muvaffaqiyat!' :
                                toast.type === 'error' ? 'Xatolik!' :
                                    toast.type === 'info' ? 'Ma\'lumot!' : 'Ogohlantirish!'}
                        </div>
                        <div className="text-xs text-gray-600">{toast.message}</div>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
