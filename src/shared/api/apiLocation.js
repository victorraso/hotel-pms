export async function getLocationData(lat, long, languageFormat) {
  const language = languageFormat.split('-')[0];

  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=${language}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Geocoding failed:', error);
  }
}
