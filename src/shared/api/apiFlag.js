export async function getCountryFlag(nationality) {
  if (!nationality) return null;

  try {
    const res = await fetch(`https://countries.dev/demonym/${nationality}`);

    if (!res.ok) {
      throw new Error(`HTTP error! ${res.status}`);
    }

    const data = await res.json();
    if (data && data.length > 0) {
      const country = data[0];
      return country.flags.svg;
    }
  } catch (error) {
    console.error('Error fetching country flag:', error);
  }
}
