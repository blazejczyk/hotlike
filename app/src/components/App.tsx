import 'react-native-gesture-handler'; // this MUST be at the top (required by React Navigation's stack navigator)
import { registerRootComponent } from 'expo';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { IconRegistry, ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableMapSet } from "immer";
import { CustomSchemaType } from '@eva-design/dss';
// import { StatusBar } from 'expo-status-bar';

import StoreProvider from '../store/provider';
import Content from './Content';
import { setForegroundNotifications } from '../services/notifications';

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light} customMapping={customMapping}>
        <SafeAreaProvider>
          <StoreProvider>
            {/*<StatusBar style="auto" translucent={false} backgroundColor="transparent" />*/}
            <NavigationContainer>
              <Content />
            </NavigationContainer>
          </StoreProvider>
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
}

const customMapping: CustomSchemaType = {
  ...eva.mapping,
  components: {
    Card: {
      appearances: {
        outline: {
          mapping: {
            bodyPaddingVertical: 0,
            bodyPaddingHorizontal: 0
          }
        }
      }
    }
  }
};

enableMapSet();
registerRootComponent(App);
setForegroundNotifications()
