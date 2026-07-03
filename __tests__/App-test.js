/**
 * @format
 */

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    GestureHandlerRootView: View,
    State: {},
    Directions: {},
  };
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-webview', () => 'WebView');
jest.mock('react-native-modal', () => {
  const React = require('react');
  const { View } = require('react-native');

  return ({ children }) => <View>{children}</View>;
});
jest.mock('react-native-snackbar', () => ({
  show: jest.fn(),
  dismiss: jest.fn(),
  LENGTH_LONG: 1,
}));
jest.mock('react-native-device-info', () => ({
  getApplicationName: jest.fn(() => 'Global News'),
  getDeviceId: jest.fn(() => 'device-id'),
  getBundleId: jest.fn(() => 'com.globalnewsapp'),
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  isTablet: jest.fn(() => false),
}));
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() =>
      Promise.resolve({
        user: {
          email: 'test@example.com',
          name: 'Test User',
          photo: '',
        },
      })
    ),
  },
  GoogleSigninButton: 'GoogleSigninButton',
}));
jest.mock('react-native-fbsdk-next', () => ({
  LoginManager: {
    logInWithPermissions: jest.fn(() =>
      Promise.resolve({
        isCancelled: true,
      })
    ),
  },
  AccessToken: {
    getCurrentAccessToken: jest.fn(() => Promise.resolve(null)),
  },
  GraphRequest: jest.fn(),
  GraphRequestManager: jest.fn(() => ({
    addRequest: jest.fn(() => ({
      start: jest.fn(),
    })),
  })),
  Settings: {
    setAppID: jest.fn(),
  },
}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');
jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');
jest.mock('../src/store', () => ({
  store: {},
  persistor: {},
}));
jest.mock('../src/routes/NewsStackNavigator', () => 'NewsStackNavigator');
jest.mock('react-redux', () => {
  const React = require('react');

  const mockState = {
    news: {
      favorites: [],
      articles: [],
      categories: [],
      notifications: [],
    },
    user: {
      isConnectedUser: false,
      userData: {},
      isLoginModalVisible: false,
    },
  };

  return {
    Provider: ({ children }) => <>{children}</>,
    useDispatch: () => jest.fn(),
    useSelector: (selector) => selector(mockState),
  };
});
jest.mock('redux-persist/integration/react', () => {
  const React = require('react');

  return {
    PersistGate: ({ children }) => <>{children}</>,
  };
});

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer, { act } from 'react-test-renderer';

it('renders correctly', async () => {
  await act(async () => {
    renderer.create(<App />);
    await Promise.resolve();
  });
});
