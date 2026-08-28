import { useEffect, useMemo, useState } from 'react';
import { getCountryFlag } from '../api/apiFlag';

export default function useFlags(reservations) {
  const [flagsMap, setFlagsMap] = useState({});

  const uniqueNationalities = useMemo(() => {
    if (!reservations) return [];
    return [
      ...new Set(
        reservations.map((r) => r.guests?.nationality).filter(Boolean),
      ),
    ];
  }, [reservations]);

  const nationalitiesKey = uniqueNationalities.slice().sort().join(',');

  useEffect(() => {
    if (uniqueNationalities.length === 0) return;

    let cancelled = false;

    async function fetchFlags() {
      const missing = uniqueNationalities.filter((nat) => !(nat in flagsMap));

      if (missing.length === 0) return;

      const entries = await Promise.all(
        missing.map(async (nat) => [nat, await getCountryFlag(nat)]),
      );
      if (cancelled) return;
      setFlagsMap((prev) => ({
        ...prev,
        ...Object.fromEntries(entries),
      }));
    }
    fetchFlags();
    return () => {
      cancelled = true;
    };
  }, [nationalitiesKey]);

  return flagsMap;
}
