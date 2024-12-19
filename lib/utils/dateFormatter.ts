const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export function formatThaiDateTime(date: Date): string {
  const now = new Date();
  const timestamp = new Date(date);
  
  // If the message is from today, show only time
  if (timestamp.toDateString() === now.toDateString()) {
    return `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')} น.`;
  }
  
  // If the message is from this year, show date and month
  if (timestamp.getFullYear() === now.getFullYear()) {
    return `${timestamp.getDate()} ${THAI_MONTHS[timestamp.getMonth()]} ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')} น.`;
  }
  
  // For older messages, show full date including year
  return `${timestamp.getDate()} ${THAI_MONTHS[timestamp.getMonth()]} ${timestamp.getFullYear() + 543} ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')} น.`;
}

export function formatTimestamp(date: Date): string {
  return formatThaiDateTime(date);
}