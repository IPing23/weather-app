import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WeatherMap.css';
import { useEffect } from 'react';

// ปรับจุดกึ่งกลาง Leaflet เมื่อเมืองที่เลือกมีพิกัดใหม่
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
}
// แสดงแผนที่ถนน ชั้นข้อมูลฝนจาก OpenWeatherMap และหมุดเมืองที่เลือก
function WeatherMap({ lat, lon, city }) {
  const position = [lat, lon];
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  
  // Layer ของเมฆจาก OpenWeatherMap
  const cloudLayer = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;

  return (
    <div className="map-container-wrapper">
      <h3 className="widget-title">เรดาร์เมฆ (Cloud Radar)</h3>
      <div className="map-frame">
        {/* สร้างแผนที่ด้วย Leaflet โดยปิดการซูมด้วยลูกกลิ้งเมาส์ และซ่อนปุ่มซูมเพื่อความสะอาดตา */}
        <MapContainer center={position} zoom={10} scrollWheelZoom={false} zoomControl={false} style={{ height: "100%", width: "100%", borderRadius: "16px" }}>
          {/* เรียกใช้ฟังก์ชันอัปเดตจุดศูนย์กลางแผนที่ */}
          <ChangeView center={position} />
          
          {/* เลเยอร์แผนที่พื้นฐาน (ถนน พื้นดิน) จาก OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* เลเยอร์เมฆซ้อนทับแผนที่ ปรับความโปร่งใสที่ 70% */}
          <TileLayer url={cloudLayer} opacity={0.7} />
          
          {/* หมุดปักระบุตำแหน่งของเมืองปัจจุบัน */}
          <Marker position={position}>
            <Popup>{city}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default WeatherMap;