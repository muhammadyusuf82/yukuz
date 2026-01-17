import React, { useState, useEffect } from 'react';
import { FaTruckLoading, FaBars, FaTimes } from "react-icons/fa";
import { NavLink, Link } from 'react-router-dom';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [user, setUser] = useState()
  const token = localStorage.getItem('token');
  useEffect(() => {
    const loadData = async () => {
      try {
        const promise = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`
          }
        })
        const res = await promise.json();
        setUser(res);
        // Check if user has a photo and construct the full URL
        if (res.photo) {
          // If the photo URL is relative, prepend the base URL
          let photoPath = res.photo;
          if (photoPath.startsWith('/')) {photoPath = `https://tokennoty.pythonanywhere.com${photoPath}`;}
          setPhotoUrl(photoPath);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadData();
  }, [token])

  console.log(user);
  

  return (
    <nav className='h-20 flex items-center bg-white shadow-md sticky top-0 z-50'>
      <div className="container mx-auto px-4 sm:px-5 flex items-center justify-between">
        <div className="flex gap-3 items-center cursor-pointer duration-300 transform hover:scale-105" onClick={() => scrollToSection('home')}>
          <div className="w-10 h-10 rounded-lg flex items-center bg-linear-to-br from-[#4361ee] to-[#7209b7]">
            <FaTruckLoading className='text-xl text-white m-auto' />
          </div>
          <Link to={'/'}>
            <h2 className='text-2xl text-[#4361ee] font-bold'>Yuk.uz</h2>
          </Link>
        </div>
        <ul className='hidden lg:flex list-none gap-6 items-center'>
          <NavLink to='/freight/asosiy' className={({ isActive }) => `${isActive ? 'text-white bg-[#4361ee]' : 'text-gray-600 hover:text-white hover:bg-[#4361ee]'} font-semibold cursor-pointer duration-300 rounded-xl px-4 py-2 transition-all`}>Asosiy</NavLink>
          <NavLink to='/freight/yuk' className={({ isActive }) => `${isActive ? 'text-white bg-[#4361ee]' : 'text-gray-600 hover:text-white hover:bg-[#4361ee]'} font-semibold cursor-pointer duration-300 rounded-xl px-4 py-2 transition-all`}>Yuklar</NavLink>
          <NavLink to='/freight/haydovchilar' className={({ isActive }) => `${isActive ? 'text-white bg-[#4361ee]' : 'text-gray-600 hover:text-white hover:bg-[#4361ee]'} font-semibold cursor-pointer duration-300 rounded-xl px-4 py-2 transition-all`}>Haydovchilar</NavLink>
          <NavLink to='/freight/xarita' className={({ isActive }) => `${isActive ? 'text-white bg-[#4361ee]' : 'text-gray-600 hover:text-white hover:bg-[#4361ee]'} font-semibold cursor-pointer duration-300 rounded-xl px-4 py-2 transition-all`}>Xarita</NavLink>
          <NavLink to='/freight/narxlar' className={({ isActive }) => `${isActive ? 'text-white bg-[#4361ee]' : 'text-gray-600 hover:text-white hover:bg-[#4361ee]'} font-semibold cursor-pointer duration-300 rounded-xl px-4 py-2 transition-all`}>Narxlar</NavLink>
          <NavLink to='/freight/yordam' className={({ isActive }) => `${isActive ? 'text-white bg-[#4361ee]' : 'text-gray-600 hover:text-white hover:bg-[#4361ee]'} font-semibold cursor-pointer duration-300 rounded-xl px-4 py-2 transition-all`}>Yordam</NavLink>
          <NavLink to='/profile-setup' className="w-15 h-15 rounded-full border-4 border-[#4361ee] shadow-lg overflow-hidden">
                            {photoUrl ? (
                                <img src={photoUrl} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#4361ee] to-[#7209b7] flex items-center justify-center text-white text-3xl font-bold">
                                    {/* {user.first_name ? user.first_name[0] : 'U'} */}
                                </div>
                            )}
                        </NavLink>
        </ul>
        <div className="lg:hidden text-2xl text-[#4361ee] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
      <div className={`fixed top-20 left-0 w-full bg-white shadow-xl transition-all duration-300 lg:hidden overflow-hidden ${isOpen ? 'max-h-125 border-b' : 'max-h-0'}`}>
        <ul className='flex flex-col p-5 gap-4'>
          <hr />
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col text-center gap-y-3 list-none mx-auto">
              <NavLink to='/freight/asosiy' className='tex-lg font-semibold cursor-pointer duration-300 rounded-xl hover:text-white text-gray-600 px-4 py-2 transition-all hover:bg-[#4361ee]'>Asosiy</NavLink>
              <NavLink to='/freight/haydovchilar' className='text-lg font-semibold cursor-pointer duration-300 rounded-xl hover:text-white text-gray-600 px-4 py-2 transition-all hover:bg-[#4361ee]'>Haydovchilar</NavLink>
              <NavLink to='/freight/yuk' className='tex-lg font-semibold cursor-pointer duration-300 rounded-xl hover:text-white text-gray-600 px-4 py-2 transition-all hover:bg-[#4361ee]'>Xarita</NavLink>
              <NavLink to='/freight/narxlar' className='tex-lg font-semibold cursor-pointer duration-300 rounded-xl hover:text-white text-gray-600 px-4 py-2 transition-all hover:bg-[#4361ee]'>Narxlar</NavLink>
              <NavLink to='/freight/yordam' className='tex-lg font-semibold cursor-pointer duration-300 rounded-xl hover:text-white text-gray-600 px-4 py-2 transition-all hover:bg-[#4361ee]'>Yordam</NavLink>
            </ul>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;