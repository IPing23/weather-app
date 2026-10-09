import './WeatherCard.css';
import { convertTemperature } from '../utils/temperature';

// แสดงสภาพอากาศปัจจุบันและรายละเอียดหลักของเมืองที่เลือก
function WeatherCard({ data, tempUnit }) {
    const { name, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

    return (
        <div className="weather-card">
            {/* ส่วนซ้ายของกล่อง: ชื่อเมือง คำอธิบาย ไอคอน และอุณหภูมิหลัก */}
            <div className="weather-main-info">
                <div className="weather-header">
                    <h2>{name}</h2>
                    <p className="weather-desc">{weather[0].description}</p>
                </div>
                <div className="weather-temp-container">
                    <img src={iconUrl} alt="Weather Icon" className="weather-icon" />
                    <div className="temperature">
                        {convertTemperature(main.temp, tempUnit)}<span>°{tempUnit}</span>
                    </div>
                </div>
            </div>

            {/* ส่วนขวาของกล่อง: รายละเอียดเชิงลึก (Feels like, ความชื้น, ลม, ความกดอากาศ) */}
            <div className="weather-details">
                <div className="detail-item">
                    <span className="detail-label">ความรู้สึก</span>
                    <span className="detail-value">{convertTemperature(main.feels_like, tempUnit)}°{tempUnit}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">ความชื้น</span>
                    <span className="detail-value">{main.humidity}%</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">ความเร็วลม</span>
                    <span className="detail-value">{wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">ความกดอากาศ</span>
                    <span className="detail-value">{main.pressure} hPa</span>
                </div>
            </div>
        </div>
    );
}

export default WeatherCard;