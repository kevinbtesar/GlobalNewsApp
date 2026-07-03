import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PreferencesContext } from './src/utils/PreferencesContext';
import { store, persistor } from './src/store';
import { buildAppThemes } from './src/theme/appTheme';
import NewsStackNavigator from './src/routes/NewsStackNavigator';
import Splash from './src/components/Splash/Splash';

const DARK_MODE_KEY = '@darkModeSetting';

const App = () => {
  const systemColorScheme = useColorScheme();
  const [isThemeDark, setIsThemeDark] = React.useState(systemColorScheme === 'dark');
  const [preferencesReady, setPreferencesReady] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const hydratePreferences = async () => {
      try {
        const storedDarkMode = await AsyncStorage.getItem(DARK_MODE_KEY);

        if (!isMounted) {
          return;
        }

        if (storedDarkMode === null) {
          setIsThemeDark(systemColorScheme === 'dark');
        } else {
          setIsThemeDark(storedDarkMode === 'true');
        }
      } catch (error) {
        if (isMounted) {
          setIsThemeDark(systemColorScheme === 'dark');
        }
      } finally {
        if (isMounted) {
          setPreferencesReady(true);
        }
      }
    };

    hydratePreferences();

    return () => {
      isMounted = false;
    };
  }, [systemColorScheme]);

  const setThemeDark = React.useCallback(async (nextValue) => {
    const normalizedValue = Boolean(nextValue);
    setIsThemeDark(normalizedValue);

    try {
      await AsyncStorage.setItem(DARK_MODE_KEY, normalizedValue ? 'true' : 'false');
    } catch (error) {
      console.warn('Unable to persist theme preference', error);
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeDark(!isThemeDark);
  }, [isThemeDark, setThemeDark]);

  const preferences = React.useMemo(
    () => ({
      isThemeDark,
      setThemeDark,
      toggleTheme,
      isPreferencesReady: preferencesReady,
    }),
    [isThemeDark, setThemeDark, toggleTheme, preferencesReady]
  );

  const { paperTheme, navigationTheme } = React.useMemo(
    () => buildAppThemes(isThemeDark),
    [isThemeDark]
  );

  if (!preferencesReady) {
    return <Splash />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<Splash />} persistor={persistor}>
          <PreferencesContext.Provider value={preferences}>
            <SafeAreaProvider>
              <PaperProvider theme={paperTheme}>
                <NavigationContainer theme={navigationTheme}>
                  <StatusBar
                    barStyle={isThemeDark ? 'light-content' : 'dark-content'}
                    backgroundColor={navigationTheme.colors.card}
                  />
                  <NewsStackNavigator />
                </NavigationContainer>
              </PaperProvider>
            </SafeAreaProvider>
          </PreferencesContext.Provider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
