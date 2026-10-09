import './HourlyForecast.css';
import { convertTemperature } from '../utils/temperature';

// แสดงพยากรณ์ราย 3 ชั่วโมง 8 ช่วงถัดไปในแถบเลื่อนแนวนอน
function HourlyForecast({ data, tempUnit }) {
  const hourlyList = data.list.slice(0, 8);

  return (
    <div className="hourly-container">
      <h3 className="widget-title">พยากรณ์รายชั่วโมง</h3>

      {/* กล่องแนวนอนที่สามารถเลื่อนซ้ายขวาได้ (Scrollable) */}
      <div className="hourly-scroll">
        {hourlyList.map((item, index) => {
          // แปลง Timestamp เป็นเวลาในรูปแบบ 24 ชม.
          const time = new Date(item.dt * 1000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
          const temp = convertTemperature(item.main.temp, tempUnit);
          
          return (
            <div className="hourly-item" key={index}>
              <span className="hourly-time">{time}</span>
              <img src={iconUrl} alt="icon" className="hourly-icon" />
              <span className="hourly-temp">{temp}°{tempUnit}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;