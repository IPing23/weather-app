import { useState, useEffect } from 'react';
import './Header.css';

// แสดงชื่อแอป ปุ่มเปลี่ยนหน่วย และเวลาท้องถิ่นของเครื่องผู้ใช้
function Header({ tempUnit, onToggleUnit }) {
  // State สำหรับเก็บเวลาปัจจุบัน
  const [currentTime, setCurrentTime] = useState(new Date());

  // อัปเดตนาฬิกาทุกวินาทีและหยุด timer เมื่อ Header ถูกถอดออกจากหน้า
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    // คืนค่าฟังก์ชันเพื่อเคลียร์การจับเวลาเมื่อ Component ถูกทำลาย (ป้องกัน Memory Leak)
    return () => clearInterval(timer);
  }, []);

  // กำหนดรูปแบบวันที่ภาษาไทยสำหรับแถบหัวเว็บ
  const formatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };

  return (
    <header className="app-header">
      {/* โลโก้แอปฝั่งซ้าย */}
      <div className="header-logo">
        <span className="logo-icon">🌤️</span>
        <h1 className="header-title">Weather API</h1>
      </div>
      
      {/* ฝั่งขวา: ปุ่มสลับหน่วยอุณหภูมิ และ นาฬิกา */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          className="unit-toggle-btn" 
          onClick={onToggleUnit}
          title="สลับหน่วยอุณหภูมิ"
        >
          หน่วย: {tempUnit === 'C' ? '°C (Celsius)' : '°F (Fahrenheit)'}
        </button>

        <div className="header-time">
          {/* แสดงเวลาแบบ ชั่วโมง:นาที */}
          <p className="time-text">
            {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
          </p>

          {/* แสดงวันที่ */}
          <p className="date-text">
            {currentTime.toLocaleDateString('th-TH', formatOptions)}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;