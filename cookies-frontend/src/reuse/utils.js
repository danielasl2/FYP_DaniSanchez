export function formatExpirationDate(timestamp) {
  console.log("Original timestamp:", timestamp); 
  if (!timestamp) return 'N/A';

  const date = new Date(timestamp);
  console.log("Date object:", date); 
  const formatted = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
  });
  console.log("Formatted date:", formatted); 
  return formatted;
}
