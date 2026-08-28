export async function getNationalities() {
  try {
    const res = await fetch(`https://countries.dev/countries`);

    if (!res.ok) {
      throw new Error(`HTTP error! ${res.status}`);
    }

    const data = await res.json();

    if (data && data.length > 0) {
      const list = new Set(data.map((item) => item.demonym));
      const arr = [...list];
      return arr.sort((a, b) => a.localeCompare(b));
    }
  } catch (error) {
    console.error('Error fetching nationalities:', error);
  }
}
