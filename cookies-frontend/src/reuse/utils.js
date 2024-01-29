export function formatExpirationDate(timestamp) {
  console.log("Original Timestamp:", timestamp);  // Check the original timestamp

  if (!timestamp) return 'N/A';

  const date = new Date(timestamp);
  console.log("Parsed Date:", date);  // Check the parsed date

  return date.toLocaleDateString();
}
