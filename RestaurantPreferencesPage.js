import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CARRS from './CARRS.png'

function RestaurantPreferencesPage() {
  // 定義狀態
  const [price, setPrice] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [foodPriority, setFoodPriority] = useState('');
  const [atmospherePriority, setAtmospherePriority] = useState('');
  const [valuePriority, setValuePriority] = useState('');
  const [servicePriority, setServicePriority] = useState('');

  // 使用 useNavigate 獲取導航功能
  const navigate = useNavigate();

  // 處理表單提交
  const handlePreferenceSubmit = async (event) => {
    event.preventDefault();
  
  // 定義 preferences 對象，包含用戶的選擇
  const preferences = {
    price,
    cuisine,
    priorities: {
      food: foodPriority,
      atmosphere: atmospherePriority,
      value: valuePriority,
      service: servicePriority,
      },
  };

  // 使用瀏覽器的地理位置 API 獲取用戶位置
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        // 構建查詢參數
        const queryParams = new URLSearchParams({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ...preferences // 將 preferences 對象展開到查詢參數中
        }).toString();

          // 檢查經緯度值是否正確獲取
          console.log("latitude is:", position.coords.latitude);
          console.log("longitude is:", position.coords.longitude);
          console.log('Query parameters:', queryParams); // 打印查询参数

          // 發送 GET 請求
          const response = await fetch(`https://restaurantcarrs.onrender.com/filterRestaurants?${queryParams}`);
          if (!response.ok) {
            // 如內容不適JSON則不嘗試解析
            if (!response.headers.get("content-type")?.includes("application/json")) {
              const errorText = await response.text();
              console.error('Non-JSON response received:', errorText);
              // 處理非JSON格式
              return;
            }
            
            const errorData = await response.json(); // 如果是JSON進行解析
            console.error('Error from server:', errorData.error);
            // 處理錯誤
          } else {
            const filterRestaurants = await response.json();
            navigate('/recommendations', { state: { filterRestaurants } });
          }
        } catch (error) {
          console.error('Failed to fetch preferences:', error);
          // 處理錯誤
        }
      },
      (error) => {
        console.error('Failed to get current position:', error);
        // 處理位置獲取失敗的情況
      }
    );
  };
  
  // 表單元素
  return (
    <div style={{ padding: '20px',background: "F5F6F6" }}>
    {/* 頁面標題 */}
    <div style={{ textAlign: 'center', alignItems: 'center' }}>
    <img src={CARRS} alt="情境感知推薦系統" style={{ width: '200px', height: 'auto' }} />
  </div>
    <div style={{ margin: '10px 0', textAlign: 'center' }}>
    {/* 提示訊息 */}
      <div className="container-fluid" style={{ backgroundColor: 'white', width: '100%', padding: '20px', borderRadius: '8px', boxShadow: '4px 8px 12px rgba(0, 0, 0, 0.3)', textAlign: 'left' }}>
        <p style={{ fontFamily: '華康粗圓體' }}>價格: 以$符號來區分餐廳價位</p>
        <p style={{ fontFamily: '華康粗圓體' }}>菜系: 可以選擇亞洲料理、中式料理、日式料理、印度料理、泰式料理、美式料理等....菜系</p>
        <p style={{ fontFamily: '華康粗圓體' }}>用戶偏好選擇: 食物、服務、氣氛、實惠，請分別選擇用戶最在意的點，並請以最看中為第一優先，最不看重為第四優先，並且選項都只能選一次</p>
      </div>
    </div>

    {/* 表單 */}
    <form onSubmit={handlePreferenceSubmit}>
      {/* 價格選擇 */}
      <div className="form-group">
        <label style={{ fontFamily: '華康粗圓體',marginBottom:'5px'}}>價錢：</label>
        <select className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>
          <option value="">請選擇價錢</option>
          <option value="$">$</option>
          <option value="$$ - $$$">$$ - $$$</option>
          <option value="$$$$">$$$$</option>
        </select>
      </div>

      {/* 菜系選擇 */}
      <div className="form-group">
        <label style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>菜系：</label>
        <select className="form-control" value={cuisine} onChange={(e) => setCuisine(e.target.value)} style={{ fontFamily: '華康粗圓體',marginBottom:'5px'}}>
          <option value="">請選擇菜系</option>
          <option value="亞洲料理">亞洲料理</option>
          <option value="中式料理">中式料理</option>
          <option value="日式料理">日式料理</option>
          <option value="印度料理">印度料理</option>
          <option value="美式料理">美式料理</option>
          <option value="法式料理">法式料理</option>
          {/* 添加更多菜系 */}
        </select>
      </div>

      {/* 食物偏好 */}
      <div className="form-group">
        <label style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>食物：</label>
        <select className="form-control" value={foodPriority} onChange={(e) => setFoodPriority(e.target.value)} style={{ fontFamily: '華康粗圓體',marginBottom:'5px'}}>
          <option value="">請選擇優先順序</option>
          <option value="第一優先">第一優先</option>
          <option value="第二優先">第二優先</option>
          <option value="第三優先">第三優先</option>
          <option value="第四優先">第四優先</option>
        </select>
      </div>

      {/* 服務偏好 */}
      <div className="form-group">
        <label style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>服務：</label>
        <select className="form-control" value={servicePriority} onChange={(e) => setServicePriority(e.target.value)} style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>
          <option value="">請選擇優先順序</option>
          <option value="第一優先">第一優先</option>
          <option value="第二優先">第二優先</option>
          <option value="第三優先">第三優先</option>
          <option value="第四優先">第四優先</option>
        </select>
      </div>

      {/* 實惠偏好 */}
      <div className="form-group">
        <label style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>實惠：</label>
        <select className="form-control" value={valuePriority} onChange={(e) => setValuePriority(e.target.value)} style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>
          <option value="">請選擇優先順序</option>
          <option value="第一優先">第一優先</option>
          <option value="第二優先">第二優先</option>
          <option value="第三優先">第三優先</option>
          <option value="第四優先">第四優先</option>
        </select>
      </div>

      {/* 氛圍偏好 */}
      <div className="form-group">
        <label style={{ fontFamily: '華康粗圓體' }}>氛圍：</label>
        <select className="form-control" value={atmospherePriority} onChange={(e) => setAtmospherePriority(e.target.value)} style={{ fontFamily: '華康粗圓體',marginBottom:'5px' }}>
          <option value="">請選擇優先順序</option>
          <option value="第一優先">第一優先</option>
          <option value="第二優先">第二優先</option>
          <option value="第三優先">第三優先</option>
          <option value="第四優先">第四優先</option>
        </select>
      </div>
      {/* 按鈕 */}
      <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', width: '70%', fontSize: '15pt', display: 'block', marginLeft: 'auto', marginRight: 'auto', fontFamily: '華康粗圓體', backgroundColor: '#03A9F4', border: 'none', outline: 'none', borderRadius: '20px' }}>
      提交
      </button>
      </form>
    </div>
);
}

export default RestaurantPreferencesPage;

    // const preferences = {
    //   price,
    //   cuisine,
    //   priorities: {
    //     food: foodPriority,
    //     atmosphere: atmospherePriority,
    //     value: valuePriority,
    //     service: servicePriority,
    //   },
    // };