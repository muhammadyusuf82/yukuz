import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaFlagCheckered } from "react-icons/fa";

const MyCargos = ({ onFreightDetail }) => {
    const baseUrl = 'https://tokennoty.pythonanywhere.com/api/freight/?owner__username='
    const token = localStorage.getItem('token')
    const [user, setUser] = useState()
    const [data, setData] = useState([])
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const promise = await fetch('https://tokennoty.pythonanywhere.com/api/users/', {
                    method: 'GET',
                    headers: { 'Authorization': `Token ${token}` }
                })
                const res = await promise.json()
                setUser(res)
                const url = baseUrl + res.username;

                const get_freight = await fetch(url, {
                  method: 'GET',
                  headers: { 'Authorization': `Token ${token}` }
                })
                const response = await get_freight.json()
                setData(response)
            } catch (error) {
                console.log(error);
            }
        }
        loadData()
    }, [])

    // console.log(data);
    console.log(user);
    
    
    const handleFreightDetailClick = (freightData) => {
        // Call the parent function to navigate to freight detail page
        onFreightDetail('Batafsil', freightData.id, freightData);
    }

    return (<>
        <div className="bg-white rounded-3xl p-8 shadow-sm">
            {user?.role === 'shipper' ? (
  <h2 className="text-2xl font-bold mb-4">Mening e'lon qilgan yuklarim</h2>
) : (
  <h2 className="text-2xl font-bold mb-4">Mening yetkazgan yuklarim</h2>
)}

        </div>
        <div className="grid grid-cols-3 my-5 gap-3">
            {data.map((item, index) => {
                return (
                <div key={index} className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 max-w-sm">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-blue-800 font-bold">#YUK-{item.id}</span>
                      <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                        {item.state}
                      </span>
                    </div>
              
                    {/* Route */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <FaMapMarkerAlt className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-blue-900 font-semibold">{item.route_starts_where_region}</p>
                          <p className="text-blue-700 text-sm">{item.route_starts_where_city}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                          <FaFlagCheckered className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-blue-900 font-semibold">{item.route_ends_where_region}</p>
                          <p className="text-blue-700 text-sm">{item.route_ends_where_city}</p>
                        </div>
                      </div>
                    </div>
              
                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 font-bold">{item.weight} kg</p>
                        <p className="text-blue-600 text-xs">Og'irlik</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 font-bold">{item.volume} m³</p>
                        <p className="text-blue-600 text-xs">Hajm</p>
                      </div>
                    </div>
              
                    {/* Price & Button */}
                    <div className="text-center">
                      <p className="text-blue-600 text-2xl font-black mb-3">
                        {item.freight_rate_amount ? item.freight_rate_amount.split('.')[0] : '0'} soʻm
                      </p>
                      <button 
                        onClick={() => handleFreightDetailClick(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-lg transition-colors cursor-pointer"
                      >
                        Batafsil ko'rish
                      </button>
                    </div>
                </div>
                )
            })}
        </div>
    </>)
};

export default MyCargos;