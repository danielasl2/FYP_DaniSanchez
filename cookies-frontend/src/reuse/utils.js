export function formatExpirationDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  }