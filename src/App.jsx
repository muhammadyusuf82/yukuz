import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './User/pages/Login/Login'
import Home from './User/pages/Home/Home'
import Yuk from './Freight/User/Yuk'
import ProfileSetup from './User/pages/Login/ProfileSetup'
import FreightHome from './Freight/User/Home'
import Haydovchilar from './Freight/User/Haydovchilar'
import Yordam from './Freight/User/Yordam'
import Map from './Freight/User/Map'
import Narxlar from './Freight/User/Narxlar'
import Admin from './User/components/SuperUser/Admin'
import UzbMap from './map/UzbMap'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/freight/asosiy' element={<FreightHome/>}/>
      <Route path='/freight/yuk' element={<Yuk/>}/>
      <Route path='/freight/haydovchilar' element={<Haydovchilar/>}/>
      <Route path='/freight/xarita' element={<Map/>}/>
      <Route path='/freight/yordam' element={<Yordam/>}/>
      <Route path='/freight/narxlar' element={<Narxlar/>}/>
      <Route path='/profile-setup' element={<ProfileSetup/>}/>
      <Route path='/admin' element={<Admin/>}/>
      <Route path='/uzb-map' element={<UzbMap/>}/>
    </Routes>
      {/* <Home/> */}
      {/* <Login/> */}
      {/* <Map/> */}
    </>
  )
}

export default App
