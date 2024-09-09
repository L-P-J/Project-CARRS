process.env.TZ = 'Asia/Taipei';// 設置時區
const express = require('express'); // 引入 Express 框架
const fetch = require('node-fetch'); // 引入 node-fetch 模組來進行網絡請求
const app = express(); // 創建 Express 應用程式
const port =  process.env.port || 3000; // 設定應用程式的監聽端口
const cors = require('cors'); // 引入 CORS 中间件，允许跨源请求
require('dotenv').config(); // 加載 .env 檔案中的環境變數到 process.env

app.use(cors()); // 允許所有跨源請求
app.use(express.json());// 解析 JSON 格式的请求体


// 創建與資料庫的連接
const { Pool } = require('pg'); // 引入 pg 的 Pool 類別
// 環境變數應該設定如下：
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 使用環境變數
  ssl: {
    rejectUnauthorized: false // 如果你使用的是自簽名證書，需要這個選項
  }
});

// 嘗試連接到資料庫
pool.connect((err, client, release) => {
  if (err) {
    return console.error('無法連接到資料庫', err.stack);
  }
  console.log('資料庫連接成功');

  // 簡單的查詢來檢查資料庫是否回應
  client.query('SELECT NOW()', (err, result) => {
    release(); // 釋放連接回池中
    if (err) {
      return console.error('查詢失敗', err.stack);
    }
    console.log('資料庫回應:', result.rows);
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack); // 將錯誤記錄到控制台
  res.status(500).send('Something broke!'); // 傳回500錯誤
});

// 連接到資料庫
// connection.connect((err) => {
//   if (err) {
//     console.error('無法連接到資料庫：', err);
//     return;
//   }
//   console.log('成功連接到資料庫');
// });
 
// 獲取當下地址及經緯度
app.get('/map', (req, res) => {
  const { latitude, longitude } = req.query;
// 獲取當前時間
  const currentTime = new Date();
// 將經緯度和當前時間返回給前端
  const responseData = {
    latitude: latitude,
    longitude: longitude,
    currentTime: currentTime
  };
  // 將數據返回給前端
  res.json(responseData);
});

// 將經緯度轉換成縣市級別
app.get('/getCity', async (req, res) => {
  const { latitude, longitude } = req.query;
  const apiKey = 'apikey'; //替換成自己的Google API金鑰
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=zh-TW`;

  try {
    const response = await fetch(url); // 发起请求
    const data = await response.json(); // 解析响应的 JSON 数据

    if (data.status === 'OK') {
      // 嘗試從地址组件中找到縣市級別
      const components = data.results[0].address_components;
      const administrativeArea = components.find(component => component.types.includes('administrative_area_level_1'));

      if (administrativeArea) {
        res.json({ location: administrativeArea.long_name }); // 如果找到，则返回县市名称
      } else {
        // 找不到縣市訊息
        res.json({ location: 'Unknown Location' });
      }
    } else {
      // API失敗或没有返回有效结果
      res.json({ location: 'Unknown Location' });
    }
  } catch (error) {
    console.error('Error fetching location name:', error);
    res.status(500).json({ error: 'Failed to fetch location name' });
  }
});


//第一層過濾(時間地點)餐廳
app.get('/filterRestaurants', async (req, res) => {
  console.log(req.query); // 打印出请求中的所有查询参数
  const { latitude,
    longitude,
    price,
    cuisine,
    foodPriority,
    atmospherePriority,
    valuePriority,
    servicePriority} = req.query;

  let city = ''; // 在 try 块外预先声明 city 变量
  if (!latitude || ! longitude) {
    return res.status(400).json({ error: 'latitude and longitude are required.' });
  }
  // 根据经纬度获取县市信息
  const apiKey = 'apikey';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=zh-TW`;

  try {
    const geoResponse = await fetch(url); // 发起请求
    const geoData = await geoResponse.json(); // 解析响应的 JSON 数据

    if (geoData.status === 'OK') {
      const components = geoData.results[0].address_components;
      const administrativeArea = components.find(component => component.types.includes('administrative_area_level_1'));
      if (administrativeArea) {
          city = administrativeArea.long_name; // 如果找到，更新 city 变量
      } else {
          return res.status(404).json({ error: 'County/City not found' });
      }
    } else {
      return res.status(500).json({ error: 'Geocoding API request failed', details: geoData.status });
    }
} catch (error) {
  return res.status(500).json({ error: 'Error fetching location name', details: error.message });
}
  // 获取当前时间
const now = new Date(); // 取得目前時間
console.log("現在時間: ", now); // 打印完整的 Date 對象

const currentHours = now.getHours(); // 取得目前的小時數
const currentMinutes = now.getMinutes(); // 取得目前的分鐘數

// 將小時和分鐘數格式化為兩位數的字串
const formattedHours = currentHours < 10 ? `0${currentHours}` : `${currentHours}`;
const formattedMinutes = currentMinutes < 10 ? `0${currentMinutes}` : `${currentMinutes}`;

// 最終的時間字串包含時和分，格式為 HH:mm
const currentTime = `${formattedHours}:${formattedMinutes}`;
console.log("格式化後的當前時間: ", currentTime); // 打印格式化後的時間

  // 将用户的优先级转换为权重
  const weights = {
    "第一優先": 0.4,
    "第二優先": 0.3,
    "第三優先": 0.2,
    "第四優先": 0.1,
  };
  const weightedAtmosphere = weights[atmospherePriority] || 0;
  const weightedService = weights[servicePriority] || 0;
  const weightedFood = weights[foodPriority] || 0;
  const weightedValue = weights[valuePriority] || 0;

  // 构建并执行查询，此处SQL语句和变量名需要根据实际数据库结构进行调整
  const query = `
  SELECT 
  restaurant_name AS 餐廳名稱, address AS 地址, city AS 縣市, cuisine AS 菜系, price AS 價錢, 
  CONCAT(opening_hours, ' - ', closing_hours) AS 營業時間,
  (
    food * $1 +
    service * $2 +
    affordability * $3 +
    ambiance * $4
  ) AS weighted_score
FROM 
  restaurant_data
WHERE 
  city = $5
  AND opening_hours::time <= $6::time
  AND closing_hours::time >= $7::time
  AND price LIKE $8
  AND cuisine = $9
ORDER BY 
  weighted_score DESC, RANDOM()
  LIMIT 5;;
  `;

// 这里的参数应该按照查询中的占位符顺序来提供
const queryParams = [
  weightedFood,
  weightedService,
  weightedValue,
  weightedAtmosphere,
  city,
  currentTime, // 確保格式是 HH:mm:ss
  currentTime, // 確保格式是 HH:mm:ss
  price,  // 這裡的價錢應該是實際的價錢值，而不是 `%$$ - $$$%`
  cuisine
];
  
try {
  // 打印查詢語句和參數
  console.log('Executing query:', query);
  console.log('Query parameters:', queryParams);

  // 執行查詢，這會返回一個 Promise
  const result = await pool.query(query, queryParams);
  
  // 如果成功，打印結果並發送響應
  console.log('Query results:', result.rows);
  res.json(result.rows); // result.rows 包含查詢結果
} catch (error) {
  // 如果查詢出現錯誤，打印錯誤並發送錯誤響應
  console.error('查询数据库时出错：', error);
  res.status(500).json({ error: '查询数据库时失败', details: error.message });
}})

// 放在所有路由处理之后的错误处理中间件
app.use(function (err, req, res, next) {
  console.error(err.stack); // 這將打印到您的服務器控制台中
  res.status(500).json({ error: 'Something went wrong!' });
});

app.post('/saveRestaurantSearchResult', async (req, res) => {
  const queryResults = req.body.results; // 假设请求体中有一个名为results的数组
  try {
    await Promise.all(queryResults.map(result => {
      return pool.query(
        `INSERT INTO filter_data ("餐廳名稱", "縣市", "地址", "菜系", "價錢", "營業時間")
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          result['餐廳名稱'],
          result['縣市'],
          result['地址'],
          result['菜系'],
          result['價錢'],
          result['營業時間'].replace(/\n/g, ' ') // 假設您這裡要替換的是從查詢結果中得到的換行符
        ]
      );
    }));
  
    res.status(200).json({ message: '所有數據已經成功儲存' });
  } catch (error) {
    console.error('插入資料時發生錯誤:', error);
    res.status(500).json({ error: '插入資料時發生錯誤', details: error.message });
  }})

// 設定路由處理函式，當訪問 '/test' 時回傳文字 'test' 「測試用」
app.get('/test', (req, res) => {
  res.send('test');
});

// 範例：使用連接池執行一個查詢
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect(); // 從連接池獲取客戶端連接
    const result = await client.query('SELECT NOW()'); // 執行一個查詢
    res.json(result.rows); // 發送查詢結果回客戶端
    client.release(); // 釋放客戶端回連接池
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 監聽端口
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
