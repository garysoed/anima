export function loadGoogleFont(fontFamily: string): void {
  if (typeof document === 'undefined' || !document.head) {
    return;
  }
  const existingLink = document.head.querySelector(
    `link[data-font="${fontFamily}"]`,
  );
  if (existingLink) {
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  const encodedFamily = encodeURIComponent(fontFamily).replace(/%20/g, '+');
  const baseUrl = 'https://fonts.googleapis.com/css2';
  link.href = `${baseUrl}?family=${encodedFamily}:wght@300..900&display=swap`;
  link.setAttribute('data-font', fontFamily);
  document.head.appendChild(link);
}
