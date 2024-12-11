export function formatTimestamp(date: Date | string): string {
  try {
    const now = new Date();
    const timestamp = typeof date === 'string' ? new Date(date) : date;

    // Validate the timestamp
    if (isNaN(timestamp.getTime())) {
      console.warn('Invalid date encountered:', date);
      return 'Invalid date';
    }
    
    // If the message is from today, show only time
    if (timestamp.toDateString() === now.toDateString()) {
      return timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
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
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export function formatDate(date: Date | string): string {
  try {
    const timestamp = typeof date === 'string' ? new Date(date) : date;
    
    // Validate the timestamp
    if (isNaN(timestamp.getTime())) {
      console.warn('Invalid date encountered:', date);
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}