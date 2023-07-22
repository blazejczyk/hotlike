import useLoader, { TLoader } from '../useLoader';
import { getSuggestions, TSuggestion } from '../../repos/suggestions';

export default function useSuggestionsLoader(): TLoader<TSuggestion[]> {
  return useLoader<TSuggestion[]>(
    'suggestions',
    getSuggestions,
    ({ suggestions }) => suggestions,
    ({ setSuggestions }) => setSuggestions,
  );
}
