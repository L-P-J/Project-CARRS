import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CARRS from './CARRS.png'

function RecommendationsPage() {
  // 使用 useLocation 獲取當前路徑位置
  const location = useLocation();
  // 存儲過濾後的餐廳列表
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    // 定義一個函數來獲取數據並發送到後端
    const fetchData = async () => {
      if (location.state?.filterRestaurants) {
        setFilteredRestaurants(location.state.filterRestaurants);
        // 發送到後端進行儲存
        try {
          const response = await fetch('https://restaurantcarrs.onrender.com/saveRestaurantSearchResult', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ results: location.state.filterRestaurants }), // 後端是名為results的屬性
          });

          if (response.ok) {
            console.log('餐廳資料已成功保存到資料庫');
          } else {
            console.error('保存餐廳資料失敗', await response.text());
          }
        } catch (error) {
          console.error('保存餐廳資料時出現錯誤:', error);
        }
      }
    };

    // 调用 fetchData 函数
    fetchData();
  }, [location.state?.filterRestaurants]); // 當 location.state.filterRestaurants變化時重新調用


  return (
<div style={{ textAlign: 'center', padding: '50px 0',background: "F5F6F6" // 漸層淡灰色背景
}}>
  {/* 頁面標題 */}
  <div style={{ textAlign: 'center', alignItems: 'center' }}>
    <img src={CARRS} alt="情境感知推薦系統" style={{ width: '200px', height: 'auto' }} />
  </div>
  {/* 餐廳推薦標題 */}
  <h2 style={{ fontSize: '30px', marginBottom: '20px',marginTop: '20px', fontFamily: '華康粗圓體' }}>推薦列表</h2>
  <ul style={{ listStyleType: 'none', padding: 0, margin: '0 auto', maxWidth: '800px' }}>
    {filteredRestaurants.length > 0 ? (
      // 如果有過濾後的餐廳，則遍歷渲染每一個餐廳項目
      filteredRestaurants.map((restaurant, index) => (
        <li key={index} style={{ 
            background: '#fff', // 白色背景
            padding: '20px', // 內邊距
            borderRadius: '8px', // 圓角
            boxShadow: '4px 8px 12px rgba(0, 0, 0, 0.3)', // 更加強烈的陰影效果
            marginBottom: '20px', // 底部邊距
            textAlign: 'left', // 左對齊
            transition: 'transform 0.3s ease', // 添加變換動畫
            cursor: 'pointer', // 添加指示鼠標懸停的指針
            '&:hover': { // 鼠標懸停時的效果
            transform: 'translateY(-5px)',
            maxWidth: '80%' // 向上移動
            },
            // 使用媒體查詢為響應式設計添加適當的樣式
            '@media (maxwidth: 600px)': {
              maxWidth: '80%', // 在較小的螢幕上，最大寬度縮小為90%
            }
        }}>
          {/* 餐廳名稱 */}
          <h3 style={{ marginTop: '0', color: '#333',fontFamily: '華康粗圓體'  }}>{restaurant['餐廳名稱']}</h3>
          {/* 餐廳詳細信息 */}
          <p style={{ marginBottom: '5px',fontFamily: '華康粗圓體'  }}>縣市：{restaurant['縣市']}</p>
          <p style={{ marginBottom: '5px',fontFamily: '華康粗圓體'  }}>地址：{restaurant['地址']}</p>
          <p style={{ marginBottom: '5px',fontFamily: '華康粗圓體'  }}>菜系：{restaurant['菜系']}</p>
          <p style={{ marginBottom: '5px',fontFamily: '華康粗圓體'  }}>價錢：{restaurant['價錢']}</p>
          <p style={{ marginBottom: '5px',fontFamily: '華康粗圓體'  }}>營業時間：{restaurant['營業時間']}</p>
        </li>
      ))
    ) : (
      // 如果沒有過濾後的餐廳，則顯示相應的提示訊息
      <p style={{ color: '#666', fontSize: '18px',fontFamily: '華康粗圓體' }}>沒有推薦餐廳</p>
    )}
  </ul>
  {/* 按鈕 */}
  <button onClick={() => window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdDRhIlfuRlwBop_XaLg0pYxdHJFG56F01E1QtQExmhhFKSYQ/viewform'} className="btn btn-primary" style={{ marginTop: '10px', width: '70%', fontSize: '15pt', display: 'block', marginLeft: 'auto', marginRight: 'auto', fontFamily: '華康粗圓體', backgroundColor: '#03A9F4', border: 'none', outline: 'none',borderRadius: '20px' }}>
  感謝您完成本次系統，請點擊此按鈕，前往問卷進行填寫
</button>
</div>


  );
}

export default RecommendationsPage;
