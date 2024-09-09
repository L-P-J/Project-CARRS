import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import cImage from './copyright.png';
import warn from './warning.png';
import CARRS from './CARRS.png';

function WelcomePage() {
  return (
    <>
      {/* Styling */}
      <style>
        {`
          /* WelcomePage 元件的 CSS */

          /* 全局字體設定為微軟正黑體 */
          body {
            font-family: 'Microsoft JhengHei', sans-serif,backgroundColor: '#f9f9f9';
          }

          // /* 增加頂部邊框 */
          // .welcome-container {
          //   backgroundColor: '#f9f9f9';
          //   min-height: 100vh;
          //   display: flex;
          //   flex-direction: column;
          //   align-items: center;
          //   border-top: 40px solid #434343; /* Increased border size */
          //   border-bottom: 20px solid #434343; /* Increased border size */
          //   padding-top: 5px; /* 增加頂部內邊距 */
          // }

          /* 頁首樣式 */
          .header {
            text-align: right;
            margin-bottom: 20px;
            padding: 10px;
            padding-top: 5px; /* 增加頂部內邊距 */
          }

          /* 主要內容樣式 */
          .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* 標題樣式 */
          .title {
            text-align: center;
            font-weight: bold;
            color: #000000;
          }

          /* 描述樣式 */
          .description {
            text-align: center;
            font-weight: bold;
            margin: 10px 50px;
            line-height: 2;
            fontFamily: '華康粗圓體'
          }

          /* 自訂「開始」按鈕樣式 */
          .btn-info {
            background-color: #0958d9;
            border: none;
            padding: 10px 10px; /* 增加按鈕的padding讓它變大 */
            font-size: 1.5em; /* 調整字體大小 */
            color: white; /* 設置文字顏色為白色 */
            font-family: 'Microsoft JhengHei', sans-serif
          }

          /* 資訊框樣式 */
          .info-box {
            text-align: center;
            margin: 50px auto;
            padding: 10px;
            max-width: 90%;
            border: 5px solid #e6f4ff;
            border-radius: 15px;
            background-color: ;
            fontFamily: '華康粗圓體'
          }

          /* 頁尾樣式 */
          .footer {
            text-align: center;
            padding: 10px;
            font-family: 'Microsoft JhengHei', sans-serif
          }
        `}
      </style>

       {/* 歡迎頁面內容 */}
      {/* <div className="welcome-container"> */}
        {/* 頁首 */}
        <div className="header">
          {/* Header content if any */}
        </div>
        {/* 主要內容 */}
        <div className="content">
          {/* 標題 */}
         <img src={CARRS} alt="情境感知推薦系統" style={{ width: '200px', height: 'auto', marginBottom: '20px', }} />
         <h4 style={{ fontFamily: '華康粗圓體', textAlign: 'center', lineHeight: '2',width: '80%' }}>歡迎大家使用「CARRS」推薦系統！此系統加入了情境感知功能的餐廳推薦，能夠根據您當下的時間和地點來為您推薦最合適的餐廳，本研究目的為了解情境感知推薦系統的使用意圖，因此使用完系統後，我們將提供一份問卷給您填寫，非常感謝您的配合！</h4>

          {/* 資訊框 */}
          <div className="info-box">
            <img src={warn} alt="warning" style={{ width: '40px', height: 'auto',marginBottom:'10px' }} />
            <h6 style={{ fontFamily: '華康粗圓體' }}>本研究不會留下任何使用者的個資，請大家安心填寫</h6>
          </div>
        </div>
          {/*開始按鈕 */}
          <div style={{ display: 'flex', marginTop: '20px',marginBottom: '20px', width: '70%', fontSize: '20pt', marginLeft: 'auto', marginRight: 'auto', fontFamily: '華康粗圓體', backgroundColor: '#03A9F4', border: 'none', outline: 'none', borderRadius: '20px' }}>
           <Link to="/map" style={{ textDecoration: 'none', color: 'white', width: '100%', textAlign: 'center' }}>
             開始
           </Link>
          </div>

        {/* 頁尾 */}
        <div className="footer">
          <img src={cImage} alt="cc" style={{ width: '20px', height: 'auto' }} />
          <span>L-P-C</span> {/* Assuming this is your caption */}
        </div>
      {/* </div> */}
    </>
  );
}

export default WelcomePage;
