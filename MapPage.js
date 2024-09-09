import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import CARRS from './CARRS.png'

function MapPage() {
  // 用於存儲經緯度和當前時間
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [city, setCity] = useState(''); // 加入城市
  const [subdivision, setSubdivision] = useState(''); // 加入地區狀態

  // 地圖上顯示用戶當前位置
  const initMap = (latitude, longitude) => {
    // 使用 Google Maps API 創建地圖
    const myLocation = { lat: latitude, lng: longitude };
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 12, // 初始大小
      center: myLocation, // 地圖中心設為用戶位置
    });
    // 添加用戶標記
    new window.google.maps.Marker({
      position: myLocation,
      map: map,
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // 设置經緯度
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
  
        // 從後端獲取當前時間
        const response = await fetch(`https://restaurantcarrs.onrender.com/map?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
        const data = await response.json();
        setCurrentTime(new Date(data.currentTime));
  
        // 顯示地圖和位置標記
        initMap(position.coords.latitude, position.coords.longitude);
  
        // 從後端獲取城市名稱
      const responseCity = await fetch(`https://restaurantcarrs.onrender.com/getCity?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
      const dataLocation = await responseCity.json();
      if(dataLocation.location) {
        setCity(dataLocation.location); // 更新城市
        console.log(`City updated to: ${dataLocation.location}`); // Debugging output
      }
    });
    } else {
      alert('瀏覽器不支援地理功能。');
    }
  }, []);
  
  
  return (
<div style={{padding: '0',background: "F5F6F6",minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  {/* 情境感知推薦系統標題 */}
  <img src={CARRS} alt="情境感知推薦系統" style={{ width: '200px', height: 'auto', marginBottom: '15px' }} />
  
  {/* 當前位置及時間 */}
  <div className="text-center mb-4" style={{ 
    background: '#fff', // 白色背景
    padding: '20px', // 內邊距
    borderRadius: '8px', // 圓角
    boxShadow: '4px 8px 12px rgba(0, 0, 0, 0.3)', // 更加強烈的陰影效果
    marginBottom: '20px', // 底部邊距
    // textAlign: 'left', // 左對齊
    transition: 'transform 0.3s ease', // 添加變換動畫
    cursor: 'pointer', // 添加指示鼠標懸停的指針
    width: '90%',
    maxWidth: '600px', // 最大寬度
    fontSize: '18pt', // 字體大小為15pt
    fontFamily: '華康粗圓體'
  }}>
      當前位置: {city} <br /> 當前時間: {currentTime.toLocaleTimeString()}
  </div>
  
  
  {/* 地圖容器 */}
  <div id="map" style={{ width: '80%', height: '500px', margin: '0 auto', marginBottom: '10px' }}></div>
  
  {/* 下一步按鈕 */}
  {/* 使用 Bootstrap 工具類來水平居中按鈕 */}
  <div style={{ width: '80%', fontSize: '20pt', display: 'flex', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
  <Link to="/preferences" className="btn btn-primary" style={{ marginTop: '10px', width: '70%', fontSize: '15pt', display: 'block', marginLeft: 'auto', marginRight: 'auto', fontFamily: '華康粗圓體', backgroundColor: '#03A9F4', border: 'none', outline: 'none', borderRadius: '20px' }}>
    下一頁
  </Link>
  </div>
</div>

  );
  
}

export default MapPage;
