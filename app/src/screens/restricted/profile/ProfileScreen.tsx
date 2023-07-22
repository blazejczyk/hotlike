import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TabView, Tab } from '@ui-kitten/components';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import ScreenContainer from '../../../components/ScreenContainer';
import useAuthedUserLoader from '../../../hooks/loaders/useAuthedUserLoader';
import Loading from '../../../components/Loading';
import LoadingError from '../../../components/LoadingError';
import PhotosTab from './photos/PhotosTab';
import SettingsTab from './settings/SettingsTab';
import { TRestrictedScopeNavigator } from '../../../services/navs';
import UserHeader from '../../../components/UserHeader';
import { getAge } from '../../../services/utils';

type TProfileScreenProps = BottomTabScreenProps<TRestrictedScopeNavigator, 'profileScreen'>;

export default function ProfileScreen(props: TProfileScreenProps): JSX.Element {
  const { loading, result: authedUser, error, load: reloadAuthedUser } = useAuthedUserLoader();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <ScreenContainer>
      {loading && !authedUser && <Loading />}
      {error && !authedUser && <LoadingError onReload={reloadAuthedUser} />}
      {authedUser && (
        <>
          <UserHeader
            name={authedUser.name}
            gender={authedUser.gender}
            age={getAge(authedUser.dateOfBirth)}
          />
          <TabView
            selectedIndex={selectedTabIndex}
            onSelect={setSelectedTabIndex}
            swipeEnabled={false}
            style={styles.tabView}
          >
            <Tab title="Photos">
              <PhotosTab user={authedUser} />
            </Tab>
            <Tab title="Settings">
              <SettingsTab user={authedUser} />
            </Tab>
          </TabView>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
});
