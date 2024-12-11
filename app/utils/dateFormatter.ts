export function formatTimestamp(date: Date): string {
  const now = new Date();
  const timestamp = new Date(date);
  
  // If the message is from today, show only time
  if (timestamp.toDateString() === now.toDateString()) {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Use 24-hour format
    });
  }
  
  // If the message is from this year, show date without year
  if (timestamp.getFullYear() === now.getFullYear()) {
    return timestamp.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
  
  // Otherwise show full date
  return timestamp.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}