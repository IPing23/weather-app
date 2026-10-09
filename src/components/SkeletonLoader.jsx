import './SkeletonLoader.css';

// แสดงโครงร่างระหว่างรอ API เพื่อให้ผู้ใช้เห็นว่าหน้ากำลังโหลดข้อมูล
function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      {/* พื้นที่แทนการ์ดอากาศปัจจุบัน */}
      <div className="skeleton-card skeleton-main"></div>
      {/* พื้นที่แทนพยากรณ์รายชั่วโมง */}
      <div className="skeleton-card skeleton-sub"></div>
    </div>
  );
}

export default SkeletonLoader;