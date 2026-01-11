import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';
import ToastContainer from '../ui/ToastContainer';
import AddUserModal from '../modals/AddUserModal';
import ConfirmModal from '../modals/ConfirmModal';
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfo } from 'react-icons/fa';

const MainLayout = ({ children, currentPage, setCurrentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modals, setModals] = useState({
    addUser: false,
    editLoad: false,
    confirm: false
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    document.body.style.overflow = 'auto';
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      icon: type === 'success' ? <FaCheck /> :
        type === 'error' ? <FaTimes /> :
          type === 'warning' ? <FaExclamationTriangle /> :
            <FaInfo />
    };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    closeModal('addUser');
    showToast('Yangi foydalanuvchi muvaffaqiyatli qo\'shildi', 'success');
  };

  const handleDeleteConfirm = () => {
    closeModal('confirm');
    showToast('Muvaffaqiyatli o\'chirildi', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
          navigateTo={navigateTo}
        />

        <div className="flex-1 min-w-0">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>

      <AddUserModal
        isOpen={modals.addUser}
        onClose={() => closeModal('addUser')}
        onSubmit={handleAddUser}
      />

      <ConfirmModal
        isOpen={modals.confirm}
        onClose={() => closeModal('confirm')}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default MainLayout;
