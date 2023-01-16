import React from 'react';
import { View, StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3LightTheme,
  MD3DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import merge from 'deepmerge';
import OneSignal from 'react-native-onesignal';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DeviceInfo from 'react-native-device-info';

import { PreferencesContext } from './src/utils/PreferencesContext';
import { store, persistor } from './src/store';
import Colors from './src/utils/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NewsStackNavigator from './src/routes/NewsStackNavigator';
import Splash from './src/components/Splash/Splash';
import { KEYS } from './src/data/Enums';

const App = () => {
  const [ready, setReady, isThemeDark, setIsThemeDark] = React.useState(false)
  const isDarkMode = useColorScheme() === 'dark';
  const CombinedDefaultTheme = merge(MD3LightTheme, NavigationDefaultTheme);
  const CombinedDarkTheme = merge(MD3DarkTheme, NavigationDarkTheme);
  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;


  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  React.useEffect(() => {

    
    callOneSignal()
    setTimeout(() => setReady(true), 3000) // for splash screen


    async function callOneSignal() {
      await initialOnesignal();

      setReady(true)

    }
  }, [])


  return (

    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={Colors.yellow} />

      <Provider store={store}>
        <PersistGate loading={<View />} persistor={persistor}>
          {ready ?
            <PreferencesContext.Provider value={preferences}>
              <SafeAreaProvider>
                <ApplicationProvider {...eva} theme={eva.light}>
                  <PaperProvider theme={theme}>
                    <NewsStackNavigator />
                  </PaperProvider>
                </ApplicationProvider>
              </SafeAreaProvider>
            </PreferencesContext.Provider>
            :
            <Splash />}
        </PersistGate>
      </Provider>

    </>
  );
};


const initialOnesignal = async () => {
  // OneSignal Initialization
  OneSignal.setRequiresUserPrivacyConsent(false);
  OneSignal.setAppId(KEYS.ONESIGNAL_APP_ID);
  OneSignal.setLogLevel(6, 0);
  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    async notificationReceivedEvent => {
      console.log(
        'OneSignal: notification will show in foreground:',
        f,
      );
      let notification = notificationReceivedEvent.getNotification();
      console.log('notification: ', notification);
      const data = notification.additionalData;
      console.log('additionalData: ', data);

      try {
        const value = await AsyncStorage.getItem('@notificationsSetting')
        console.log("App value: " + value)
        if (value && value == "true") {
          // Complete with null means don't show a notification.
          notificationReceivedEvent.complete(notification);
        } else {
          notificationReceivedEvent.complete(null);
        }



      } catch (e) {
        console.error('setNotificationWillShowInForegroundHandler error: ', JSON.stringify(e));

      }

    },
  );

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification);
  });

  // let state = await OneSignal.getDeviceState();
  // console.log("state: " + JSON.stringify(state))


};


export default App;
