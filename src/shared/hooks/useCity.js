import { getLocationData } from '../api/apiLocation';
import { useQuery } from '@tanstack/react-query';

export default function useCity(language = 'en-US') {
  const { data: city } = useQuery({
    queryKey: ['city'],
    queryFn: async () => {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );

      const { latitude, longitude } = position.coords;
      return getLocationData(latitude, longitude, language);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return city?.city;
}
