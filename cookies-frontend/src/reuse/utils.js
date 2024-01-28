export function formatExpirationDate(timestamp) {
 // console.log("Original Timestamp:", timestamp);  

  if (!timestamp) return 'N/A';

  const date = new Date(timestamp);
//  console.log("Parsed Date:", date);  

  return date.toLocaleDateString();
}
