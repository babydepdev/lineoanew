const THAI_MONTHS = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  export function formatThaiDateTime(date: Date): string {
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day} ${month} ${hours}:${minutes}`;
  }
  
  export function formatTimestamp(date: Date): string {
    const now = new Date();
    const timestamp = new Date(date);
    
    // If the message is from today, show only time
    if (timestamp.toDateString() === now.toDateString()) {
      return formatThaiDateTime(timestamp);
    }
    
    // Show full date and time
    return formatThaiDateTime(timestamp);
  }