export function formatExpirationDate(timestamp) {
  console.log('Timestamp received:', timestamp);
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  console.log('Converted Date:', date);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString();
}