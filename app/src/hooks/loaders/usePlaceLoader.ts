import useLoader, { TLoader } from '../useLoader';
import { getPlace, TPlace } from '../../repos/places';

export default function usePlaceLoader(placeId: string): TLoader<TPlace> {
  return useLoader<TPlace>(
    `place_${placeId}`,
    () => getPlace(placeId),
    ({ placesById }) => placesById.get(placeId) || null,
    ({ setPlace }) => setPlace,
  );
}
