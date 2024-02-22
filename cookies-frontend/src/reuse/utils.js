export function formatExpirationDate(timestamp) {

  if (!timestamp) return 'N/A';

  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString();
}
