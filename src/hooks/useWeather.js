import { useState, useEffect } from 'react';

// รวมสถานะและการดึงข้อมูลอากาศ เพื่อให้ App ไม่ต้องจัดการรายละเอียด API เอง
export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ค้นหาด้วยชื่อเมืองหรือพิกัด แล้วขอข้อมูลปัจจุบันและพยากรณ์ตามพิกัดจริง
  const fetchWeather = async (lat, lon, cityName = null) => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      // รองรับทั้งการค้นหาด้วยพิกัด และค้นหาด้วยชื่อเมือง
      const urlQuery = cityName 
        ? `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=th`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th`;

      const currentRes = await fetch(urlQuery);
      if (!currentRes.ok) throw new Error('ไม่พบข้อมูลสภาพอากาศของเมืองนี้');
      const current = await currentRes.json();

      const realLat = current.coord.lat;
      const realLon = current.coord.lon;
      const realCityName = current.name;

      // เติม &lang=th ให้กับพยากรณ์ล่วงหน้าด้วย
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${realLat}&lon=${realLon}&appid=${apiKey}&units=metric&lang=th`);
      if (!forecastRes.ok) throw new Error('ไม่สามารถดึงข้อมูลพยากรณ์ล่วงหน้าได้');
      const forecast = await forecastRes.json();

      setWeatherData(current);
      setForecastData(forecast);

      // บันทึกตำแหน่งล่าสุดลง LocalStorage
      localStorage.setItem('weather_last_location', JSON.stringify({
        lat: realLat,
        lon: realLon,
        cityName: realCityName
      }));

    } catch (error) {
      setError(error.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  // ขอพิกัดจากเบราว์เซอร์และแสดงข้อความแยกตามสาเหตุเมื่อขอไม่สำเร็จ
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        (locationError) => {
          setLoading(false);
          const messages = {
            1: 'อนุญาตการเข้าถึงตำแหน่งเพื่อใช้ GPS หรือค้นหาเมืองแทน',
            2: 'ไม่สามารถระบุตำแหน่งได้ในขณะนี้ ลองค้นหาเมืองแทน',
            3: 'การค้นหาตำแหน่งใช้เวลานานเกินไป ลองอีกครั้งหรือค้นหาเมืองแทน',
          };
          setError(messages[locationError.code] ?? 'ไม่สามารถเข้าถึงตำแหน่ง GPS ได้ ลองค้นหาเมืองแทน');
        }
      );
    } else {
      setLoading(false);
      setError("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
    }
  };

  // เปิดเว็บด้วยตำแหน่งล่าสุดที่บันทึกไว้ หรือใช้กรุงเทพฯ เป็นค่าเริ่มต้น
  useEffect(() => {
    let location = { lat: 13.7563, lon: 100.5018, cityName: 'Bangkok' };
    const savedLocation = localStorage.getItem('weather_last_location');
    if (savedLocation) {
      try {
        location = JSON.parse(savedLocation);
      } catch {
        localStorage.removeItem('weather_last_location');
      }
    }

    const timeoutId = window.setTimeout(() => {
      fetchWeather(location.lat, location.lon, location.cityName);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return { weatherData, forecastData, loading, error, fetchWeather, handleGetLocation };
}