import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Header from './components/Header';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherMap from './components/WeatherMap';
import SkeletonLoader from './components/SkeletonLoader';
import { useWeather } from './hooks/useWeather';
import './App.css';

// ประกอบหน้าหลักและเชื่อม state ข้อมูลอากาศเข้ากับแต่ละ widget
function App() {
  // ดึง State และ Function ที่จำเป็นจาก useWeather
  const { weatherData, forecastData, loading, error, fetchWeather, handleGetLocation } = useWeather();
  
  // จำหน่วยอุณหภูมิที่เลือกไว้ เพื่อคงค่าเดิมเมื่อเปิดเว็บครั้งถัดไป
  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('weather_temp_unit') || 'C';
  });

  // ซิงก์หน่วยที่เลือกกับ LocalStorage
  useEffect(() => {
    localStorage.setItem('weather_temp_unit', tempUnit);
  }, [tempUnit]);

  return (
    <>
    {/* แถบด้านบนสุด แสดงโลโก้ เวลา และปุ่มสลับหน่วยอุณหภูมิ */}
      <Header tempUnit={tempUnit} onToggleUnit={() => setTempUnit(p => (p === 'C' ? 'F' : 'C'))} />
      <main className="main-content">
        <div className="app-container">

          {/* แถบค้นหา 77 จังหวัด และปุ่ม GPS */}
          <SearchBar 
            onSelectLocation={(lat, lon, cityName) => fetchWeather(lat, lon, cityName)} 
            onLocation={handleGetLocation} 
            onSearchCity={(city) => fetchWeather(null, null, city)}
          />
          
          {/* แสดงสถานะโหลด/ผิดพลาด หรือแดชบอร์ดเมื่อข้อมูลทั้งสองชุดพร้อม */}
          <div className="content-area">
            {loading && <SkeletonLoader />}
            {error && !loading && <p className="error-text">{error}</p>}
            
            {weatherData && forecastData && !loading && (
              <div className="dashboard-grid">

                {/* ฝั่งซ้าย: ข้อมูลปัจจุบัน, รายชั่วโมง และ แผนที่เรดาร์ */}
                <div className="dashboard-left">
                  <WeatherCard data={weatherData} tempUnit={tempUnit} />
                  <HourlyForecast data={forecastData} tempUnit={tempUnit} />
                  <WeatherMap lat={weatherData.coord.lat} lon={weatherData.coord.lon} city={weatherData.name} />
                </div>

                {/* ฝั่งขวา: พยากรณ์รายวัน และ กราฟโอกาสฝนตก */}
                <div className="dashboard-right">
                  <DailyForecast data={forecastData} tempUnit={tempUnit} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;