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
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import { PreferencesContext } from './src/utils/PreferencesContext';
import { store, persistor } from './src/store';
import Colors from './src/utils/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NewsStackNavigator from './src/routes/NewsStackNavigator';
import Splash from './src/components/Splash/Splash';

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

    setTimeout(() => setReady(true), 3000) // for splash screen

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


export default App;
