import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import useConstantsLoader from '../../../../hooks/loaders/useConstantsLoader';
import Loading from '../../../../components/Loading';
import LoadingError from '../../../../components/LoadingError';
import { TAuthedUser, TAuthedUserUpdatableFields, updateAuthedUser } from '../../../../repos/auth';
import useSaver from '../../../../hooks/useSaver';
import useDispatchContext from '../../../../hooks/contexts/useDispatchContext';
import AppearanceCard from '../../../../components/settings/cards/AppearanceCard';
import AboutCard from '../../../../components/settings/cards/AboutCard';
import StatusCard from '../../../../components/settings/cards/StatusCard';
import PreferencesCard from '../../../../components/settings/cards/PreferencesCard';
import AccountCard from '../../../../components/settings/cards/AccountCard';
import useSuggestionsLoader from '../../../../hooks/loaders/useSuggestionsLoader';
import usePredictionsLoader from '../../../../hooks/loaders/usePredictionsLoader';

type TSettingsTabProps = {
  user: TAuthedUser;
};

export default function SettingsTab({ user }: TSettingsTabProps): JSX.Element | null {
  const [localUser, setLocalUser] = useState<TAuthedUser>(user);
  const { result: constants, loading: loadingConstants, error: constantsLoadingError, load: reloadConstants } = useConstantsLoader();
  const { load: reloadSuggestions } = useSuggestionsLoader();
  const { load: reloadPredictions } = usePredictionsLoader();
  const { setAuthedUser } = useDispatchContext();

  const { save: saveUpdateAuthedUser, error: updatingError } = useSaver(async (data: Partial<Pick<TAuthedUser, TAuthedUserUpdatableFields>>) => {
    // optimistic update (if the request fails, the local state value will be reverted in the error effect)
    setLocalUser({ ...user, ...data });
    const updatedUser = await updateAuthedUser(data);
    setAuthedUser(updatedUser);
    reloadSuggestions();
    reloadPredictions();
  });

  useEffect(() => {
    if (updatingError) {
      setLocalUser(user);
    }
  }, [updatingError, user]);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  if (loadingConstants && !constants) {
    return <Loading />;
  }

  if (constantsLoadingError && !constants) {
    return <LoadingError onReload={reloadConstants} />;
  }

  return constants && (
    <ScrollView contentContainerStyle={styles.settingsTab}>
      <AppearanceCard
        user={localUser}
        minHeight={constants.users.minHeight}
        maxHeight={constants.users.maxHeight}
        onChange={saveUpdateAuthedUser}
      />
      <AboutCard
        user={localUser}
        minActivitiesNumber={constants.users.minActivitiesNumber}
        maxActivitiesNumber={constants.users.maxActivitiesNumber}
        onChange={saveUpdateAuthedUser}
      />
      <StatusCard
        user={localUser}
        onChange={saveUpdateAuthedUser}
      />
      <PreferencesCard
        user={localUser}
        onChange={saveUpdateAuthedUser}
      />
      <AccountCard
        user={localUser}
        onChange={saveUpdateAuthedUser}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  settingsTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
