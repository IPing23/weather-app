import './DailyForecast.css';
import { convertTemperature } from '../utils/temperature';

// จัดพยากรณ์ทุก 3 ชั่วโมงเป็นรายวัน เพื่อแสดงอุณหภูมิและโอกาสฝนในภาพรวม
function DailyForecast({ data, tempUnit }) {
  const timezoneOffset = data.city?.timezone ?? 0;
  const dailyMap = {};

  data.list.forEach(item => {
    const cityDate = new Date((item.dt + timezoneOffset) * 1000);
    const dateKey = cityDate.toISOString().slice(0, 10);
    (dailyMap[dateKey] ??= []).push(item);
  });

  const dailyList = Object.entries(dailyMap).map(([dateKey, items]) => {
    const representativeItem = items.reduce((closest, item) => {
      const localSeconds = (item.dt + timezoneOffset) % 86400;
      const closestLocalSeconds = (closest.dt + timezoneOffset) % 86400;
      return Math.abs(localSeconds - 43200) < Math.abs(closestLocalSeconds - 43200)
        ? item
        : closest;
    });

    return {
      ...representativeItem,
      date: new Date(`${dateKey}T00:00:00Z`),
      minTemp: Math.min(...items.map(item => item.main.temp_min)),
      maxTemp: Math.max(...items.map(item => item.main.temp_max)),
      // ค่าสูงสุดแสดงช่วงที่ฝนมีโอกาสตกมากที่สุดของวัน ไม่ใช่ค่าเฉลี่ยทั้งวัน
      rainPop: Math.max(...items.map(item => item.pop ?? 0)),
    };
  });

  // แสดงชื่อวันโดยยึดวันที่ท้องถิ่นของเมืองจากเขตเวลาที่ API ส่งมา
  const weekday = (date) => date.toLocaleDateString('th-TH', {
    weekday: 'long',
    timeZone: 'UTC',
  });
  const displayList = dailyList.slice(0, 5);

  return (
    <div className="daily-container">
      <h3 className="widget-title">พยากรณ์อากาศรายวัน</h3>

      <div className="daily-list">
        {displayList.map((item, index) => {
          const dayName = index === 0 ? 'วันนี้' : weekday(item.date);
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

          return (
            <div className="daily-item" key={item.date.toISOString()}>
              <span className="daily-day">{dayName}</span>
              <div className="daily-info">
                <img src={iconUrl} alt="" className="daily-icon" />
                <span className="daily-desc">{item.weather[0].description}</span>
              </div>
              <span
                className="daily-temp"
                aria-label={`ต่ำสุด ${convertTemperature(item.minTemp, tempUnit)} สูงสุด ${convertTemperature(item.maxTemp, tempUnit)} องศา ${tempUnit}`}
              >
                <span className="daily-temp-low">{convertTemperature(item.minTemp, tempUnit)}°</span>
                <span>{convertTemperature(item.maxTemp, tempUnit)}°{tempUnit}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="rain-chance-container">
        <h4 className="rain-chance-title">โอกาสฝนตก</h4>
        <div className="rain-chance-grid">
          {displayList.map((item, index) => {
            const dayName = index === 0 ? 'วันนี้' : weekday(item.date);
            const rainPop = Math.round(item.rainPop * 100);

            return (
              <div className="rain-chance-item" key={item.date.toISOString()}>
                <div className="rain-chance-info">
                  <span className="rain-day">{dayName}</span>
                  <span className="rain-percent">{rainPop}%</span>
                </div>
                <div className="rain-bar-track">
                  <div
                    className="rain-bar-fill"
                    style={{ width: `${rainPop}%` }}
                    role="progressbar"
                    aria-label={`โอกาสฝนตก ${dayName}`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={rainPop}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DailyForecast;
