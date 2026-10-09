// API ส่งอุณหภูมิเป็น Celsius; แปลงเป็นหน่วยที่เลือกและปัดเป็นจำนวนเต็มก่อนแสดงผล
export function convertTemperature(celsius, unit) {
  return unit === 'F'
    ? Math.round((celsius * 9 / 5) + 32)
    : Math.round(celsius);
}
