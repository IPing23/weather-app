import { useState, useRef, useEffect } from 'react';
import regionsData from '../data/thailandLocations.json';
import './SearchBar.css';

// รับข้อความค้นหาเมือง, ตำแหน่ง GPS หรือจังหวัดที่เลือก แล้วส่งกลับให้ App
function SearchBar({ onSelectLocation, onLocation, onSearchCity }) {
  // สถานะเปิด-ปิดของเมนู 77 จังหวัด
  const [isOpen, setIsOpen] = useState(false);
  // เก็บข้อมูลภาคที่กำลังกดเลือกอยู่
  const [selectedRegion, setSelectedRegion] = useState(regionsData[0]);
  // เก็บข้อความที่ผู้ใช้พิมพ์ค้นหา
  const [searchInput, setSearchInput] = useState('');
  // ใช้คืนโฟกัสหลังเลือกจังหวัด และตรวจจับการคลิกนอกเมนู
  const triggerRef = useRef(null);
  const containerRef = useRef(null);

  // ปิดเมนูจังหวัดเมื่อคลิกบริเวณอื่น และถอด listener เมื่อ component หายไป
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // แยกชื่ออังกฤษที่ API ใช้ค้นหา แล้วส่งชื่อพร้อมพิกัดจังหวัด
  const handleSelectProvince = (province) => {
    setIsOpen(false);
    triggerRef.current?.focus();
    const cityNameEnglish = province.name.split(' (')[0];
    onSelectLocation(province.lat, province.lon, cityNameEnglish);
  };

  // รองรับทั้งปุ่มค้นหาและ Enter; ไม่ส่งคำค้นหาว่าง
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchCity(searchInput.trim());
      setSearchInput(''); // ล้างช่องพิมพ์หลังค้นหาเสร็จ
      setIsOpen(false);
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <form className="search-bar-wrapper" onSubmit={handleFormSubmit}>
        {/* ช่องพิมพ์ค้นหาเมือง */}
        <input
          type="text" 
          className="search-input" 
          placeholder="พิมพ์ชื่อจังหวัด"
          aria-label="ค้นหาสภาพอากาศตามชื่อเมืองหรือจังหวัด"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        
        {/* ปุ่มเปิดเมนู 77 จังหวัด */}
        <button
          type="button"
          ref={triggerRef}
          className="search-trigger"
          aria-expanded={isOpen}
          aria-controls="province-picker"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>77 จังหวัด</span>
          <span className="arrow-icon">▼</span>
        </button>

        {/* ปุ่มดึงพิกัด GPS ปัจจุบัน */}
        <button type="button" className="gps-button" onClick={onLocation} title="ใช้พิกัดปัจจุบัน" aria-label="ใช้ตำแหน่งปัจจุบัน">
          📍
        </button>
        <button type="submit" className="search-submit-btn">ค้นหา</button>
      </form>

      {/* เมนู Dropdown 77 จังหวัด (จะแสดงเมื่อ isOpen = true) */}
      {isOpen && (
        <div className="region-province-dropdown" id="province-picker">

          {/* คอลัมน์ซ้าย: แสดงรายชื่อภาค */}
          <div className="regions-column">
            <div className="column-header">เลือก 6 ภาค</div>
            {regionsData.map((reg) => (
              <button
                type="button"
                key={reg.region}
                className={`region-item ${selectedRegion.region === reg.region ? 'active' : ''}`}
                onClick={() => setSelectedRegion(reg)}
                aria-pressed={selectedRegion.region === reg.region}
              >
                {reg.region} 
              </button>
            ))}
          </div>

          {/* คอลัมน์ขวา: แสดงรายชื่อจังหวัดของภาคที่ถูกเลือก */}
          <div className="provinces-column">
            <div className="column-header">{selectedRegion.region} ({selectedRegion.provinces.length} จังหวัด)</div>
            <div className="provinces-grid">
              {selectedRegion.provinces.map((prov) => (
                <button
                  type="button"
                  key={`${prov.lat}-${prov.lon}`}
                  className="province-chip"
                  onClick={() => handleSelectProvince(prov)}
                >
                  {prov.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;