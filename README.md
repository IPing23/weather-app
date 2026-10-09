# คู่มือโปรเจกต์ Weather App

เว็บ React สำหรับดูสภาพอากาศจาก OpenWeatherMap มีการค้นหาเมือง เลือกจังหวัด
ใช้ตำแหน่ง GPS ดูพยากรณ์รายชั่วโมง/รายวัน และแสดงแผนที่ Leaflet

## เริ่มใช้งาน

1. ติดตั้ง Node.js และ dependencies ด้วย `npm install`
2. คัดลอก `.env.example` เป็น `.env` แล้วใส่ API key จริงในตัวแปร `VITE_WEATHER_API_KEY`
3. เปิดเว็บระหว่างพัฒนาด้วย `npm run dev`
4. ตรวจรูปแบบโค้ดด้วย `npm run lint` และสร้างไฟล์ production ด้วย `npm run build`

อย่า commit หรือเผยแพร่ค่า API key ใน `.env` ไฟล์นี้ถูกละเว้นโดย `.gitignore`

## แผนผังไฟล์

### โค้ดของเว็บ (`src`)

| ไฟล์ | หน้าที่ |
| --- | --- |
| `src/main.jsx` | จุดเริ่มของ React โหลด global CSS แล้ว render `App` เข้า `#root` |
| `src/App.jsx` | ประกอบหน้า dashboard เชื่อม hook, ช่องค้นหา และ widgets พร้อมจัดการหน่วยอุณหภูมิ |
| `src/App.css` | layout หลักของ dashboard, สถานะ error, ปุ่มหน่วย และ breakpoint ของหน้าจอ |
| `src/index.css` | reset CSS, สีและตัวแปรร่วม, font, พื้นหลัง และขนาด root |
| `src/hooks/useWeather.js` | เรียก OpenWeatherMap, จัดการ loading/error, GPS และจำตำแหน่งล่าสุด |
| `src/utils/temperature.js` | แปลง Celsius ที่ได้จาก API เป็น Celsius/Fahrenheit สำหรับแสดงผล |
| `src/components/Header.jsx` / `.css` | โลโก้ นาฬิกา วันที่ และปุ่มสลับหน่วย |
| `src/components/SearchBar.jsx` / `.css` | ช่องค้นหาเมือง, ปุ่ม GPS และเมนูเลือกภาค/จังหวัด |
| `src/components/WeatherCard.jsx` / `.css` | อากาศปัจจุบัน อุณหภูมิ ความชื้น ลม และความกดอากาศ |
| `src/components/HourlyForecast.jsx` / `.css` | พยากรณ์ 8 ช่วงเวลา (ข้อมูล API ห่างกันประมาณ 3 ชั่วโมง) |
| `src/components/DailyForecast.jsx` / `.css` | รวมรายการพยากรณ์ 3 ชั่วโมงเป็นวัน แสดงอุณหภูมิต่ำสุด/สูงสุดและโอกาสฝน |
| `src/components/WeatherMap.jsx` / `.css` | วาดแผนที่ OpenStreetMap, layer ฝนจาก OpenWeatherMap และหมุดเมือง |
| `src/components/SkeletonLoader.jsx` / `.css` | แสดง placeholder ระหว่างรอ API |
| `src/data/thailandLocations.json` | ข้อมูลชื่อภาค จังหวัด และพิกัดที่เมนูเลือกจังหวัดใช้ |

ไฟล์ JSON เป็นข้อมูลล้วน จึงใส่ comment ในไฟล์ไม่ได้โดยไม่ทำให้รูปแบบ JSON เสีย
คำอธิบายของฟิลด์อยู่ที่นี่: `region` คือชื่อภาค, `provinces` คือรายการจังหวัด,
และแต่ละจังหวัดมี `name`, `lat`, `lon` สำหรับค้นหาและวางหมุดบนแผนที่

### ไฟล์ประกอบโปรเจกต์

| ไฟล์/โฟลเดอร์ | หน้าที่ |
| --- | --- |
| `index.html` | HTML shell, ภาษาเว็บ, favicon และจุด mount ของ React |
| `package.json` | คำสั่ง npm และรายการ dependencies |
| `package-lock.json` | ล็อกเวอร์ชัน dependencies ที่ติดตั้งซ้ำได้; สร้าง/ปรับโดย npm |
| `vite.config.js` | ตั้งค่า Vite และ React plugin |
| `eslint.config.js` | กฎ lint สำหรับ JavaScript, React Hooks และ React Refresh |
| `.gitignore` | กัน dependencies, build output, log และไฟล์เฉพาะเครื่องจาก version control |
| `.env` | API key เฉพาะเครื่อง; ห้ามเผยแพร่ |
| `public/favicon.svg` | favicon ที่ `index.html` อ้างถึง |
| `dist/` | ไฟล์ build ที่ Vite สร้าง ไม่แก้ด้วยมือ |
| `node_modules/` | dependencies ที่ npm ติดตั้ง ไม่แก้ด้วยมือ |

## โค้ดซ้ำและส่วนที่ไม่กระทบหน้าเว็บ

- การแปลง Celsius/Fahrenheit เคยคัดลอกอยู่ในสาม widget ตอนนี้รวมไว้ใน
  `src/utils/temperature.js` เพื่อให้สูตรเดียวกันทุกจุด
- CSS responsive ของช่องค้นหาและแถบรายชั่วโมงเคยประกาศซ้ำใน media query
  รวมถึง declaration ของ WeatherCard บางบรรทัดที่ถูก media query ถัดไปเขียนทับ
  จึงตัดเฉพาะ declaration ที่ไม่มีผลต่อ style สุดท้ายออก
- `.app-title`, `.loading-text` และ `--detail-bg` ไม่ได้ถูกใช้งาน จึงเอาออก
  (หน้าโหลดใช้ SkeletonLoader อยู่แล้ว) เช่นเดียวกับ `grid-template-columns`
  ที่เคยกำหนดให้ `.provinces-grid` ซึ่งเป็น flex container ไม่ใช่ grid
- `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg` และ
  `public/icons.svg` ยังไม่มีการอ้างอิงจากแอป จึงไม่ถูกโหลดขึ้นหน้าเว็บ
  แต่ยังเก็บไฟล์เหล่านี้ไว้ เผื่อเป็น asset ที่ต้องการใช้ภายหลัง
- สีพื้นหลังแบบ gradient บางส่วนถูกใช้ซ้ำระหว่าง widget ต่าง ๆ เป็นการซ้ำด้าน
  presentation ไม่ใช่โค้ดที่ทำงานซ้ำหรือทำให้ผลลัพธ์ผิด จึงยังไม่รวมเป็น token กลาง

### หมายเหตุเรื่องโอกาสฝน

`DailyForecast.jsx` ใช้ `Math.max()` กับค่า `pop` ของทุกช่วง 3 ชั่วโมงในวันเดียวกัน
ดังนั้นเปอร์เซ็นต์ที่แสดงคือโอกาสฝนสูงสุดของช่วงใดช่วงหนึ่ง ไม่ใช่ค่าเฉลี่ย
หรือโอกาสฝนตลอดทั้งวัน หากต้องการเปลี่ยนความหมายของตัวเลข ควรเปลี่ยนวิธีสรุปข้อมูล
พร้อมระบุให้ชัดใน UI แทนการลบโค้ดนี้ว่าเป็นส่วนซ้ำ
