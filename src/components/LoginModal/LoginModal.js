import React from 'react';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Settings,
} from 'react-native-fbsdk-next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import DeviceInfo from 'react-native-device-info';
import { Button, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Loader } from '..';
import Colors from '../../utils/Colors';
import {
  loginModalVisible,
  loginUser,
  logoutUser,
} from '../../store/userStore/userStore.actions';
import {
  addNewsToFavorites,
  removeAllFavorites,
} from '../../store/newsStore/newsStore.actions';
import {
  isLoginModalVisibleSelector,
  isUserConnectedSelector,
} from '../../store/userStore/userStore.selectors';
import { userAuth } from '../../utils/Api';
import { KEYS } from '../../data/Enums';

const LoginModal = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isModalVisible = useSelector(isLoginModalVisibleSelector);
  const isUserConnected = useSelector(isUserConnectedSelector);
  const [loginState, setLoginState] = React.useState(null);

  const syncFavorites = React.useCallback((favoritesList) => {
    dispatch(removeAllFavorites());

    favoritesList.forEach((favorite) => {
      dispatch(addNewsToFavorites(favorite.article_data ?? favorite));
    });
  }, [dispatch]);

  const onCloseModal = React.useCallback(() => {
    dispatch(loginModalVisible(false));
    setTimeout(() => {
      setLoginState(null);
    }, 250);
  }, [dispatch]);

  const onLogout = React.useCallback(() => {
    dispatch(logoutUser());
    dispatch(loginModalVisible(false));
    setLoginState(null);
  }, [dispatch]);

  const facebookButton = React.useCallback(async () => {
    setLoginState('loading');
    Settings.setAppID(KEYS.FACEBOOK_APP_ID);

    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        setLoginState(null);
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data?.accessToken) {
        throw new Error('Facebook access token missing');
      }

      const responseInfo = await new Promise((resolve, reject) => {
        const request = new GraphRequest(
          '/me',
          {
            accessToken: data.accessToken,
            parameters: {
              fields: {
                string: 'email,name,picture',
              },
            },
          },
          (error, response) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(response);
          }
        );

        new GraphRequestManager().addRequest(request).start();
      });

      const login = await userAuth({
        email: responseInfo.email,
        userAuth: 'true',
        name: responseInfo.name,
        deviceId: DeviceInfo.getDeviceId(),
        appId: DeviceInfo.getBundleId(),
      });

      if (!login?.accessToken) {
        throw new Error(login?.error || 'Facebook login failed');
      }

      dispatch(
        loginUser({
          accessToken: login.accessToken,
          name: responseInfo.name,
          image: responseInfo.picture?.data?.url || '',
        })
      );

      if (Array.isArray(login.favorites) && login.favorites.length > 0) {
        syncFavorites(login.favorites);
      }

      setLoginState("You've logged in successfully!");
    } catch (error) {
      console.error('Facebook login failed', error);
      setLoginState('An error occurred. Please try again.');
    }
  }, [dispatch, syncFavorites]);

  const googleButton = React.useCallback(async () => {
    setLoginState('loading');

    try {
      GoogleSignin.configure({
        androidClientId: KEYS.GOOGLE_SIGN_IN_ANDROID_CLIENT_ID,
        iosClientId: KEYS.GOOGLE_SIGN_IN_IOS_CLIENT_ID,
      });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const login = await userAuth({
        email: userInfo.user.email,
        userAuth: 'true',
        name: userInfo.user.name,
        deviceId: DeviceInfo.getDeviceId(),
        appId: DeviceInfo.getBundleId(),
      });

      if (!login?.success && !login?.accessToken) {
        throw new Error(login?.error || 'Google login failed');
      }

      dispatch(
        loginUser({
          accessToken: login.accessToken,
          name: userInfo.user.name,
          image: userInfo.user.photo || '',
        })
      );

      if (Array.isArray(login.favorites) && login.favorites.length > 0) {
        syncFavorites(login.favorites);
      }

      setLoginState("You've logged in successfully!");
    } catch (error) {
      console.error('Google login failed', error);
      setLoginState('An error occurred. Please try again.');
    }
  }, [dispatch, syncFavorites]);

  const ModalContent = () => {
    if (isUserConnected && !loginState) {
      return (
        <>
          <View style={styles.modalHolderHeader}>
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="logout" size={22} color="#fff" />
            </View>
            <Text style={[styles.modalHeaderTitle, { color: theme.colors.text }]}>
              Do you want to log out?
            </Text>
            <Text style={[styles.modalBodyText, { color: theme.colors.onSurfaceVariant }]}>
              You will stay signed in on this device until you confirm.
            </Text>
          </View>

          <View style={styles.logoutContainer}>
            <Button mode="outlined" onPress={onCloseModal} style={styles.logoutAction}>
              Cancel
            </Button>
            <Button mode="contained" onPress={onLogout} style={styles.logoutAction}>
              Log out
            </Button>
          </View>
        </>
      );
    }

    if (loginState === 'loading') {
      return (
        <View style={styles.loadingState}>
          <Loader label="Connecting your account" />
        </View>
      );
    }

    if (loginState) {
      return (
        <View style={styles.loginStateWrap}>
          <Text style={[styles.loginStateText, { color: theme.colors.text }]}>
            {loginState}
          </Text>
          <Button mode="contained" onPress={onCloseModal} style={styles.continueButton}>
            Continue
          </Button>
        </View>
      );
    }

    return (
      <>
        <View style={styles.modalHolderHeader}>
          <View style={[styles.iconBadge, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="account-circle-outline" size={22} color="#fff" />
          </View>
          <Text style={[styles.modalHeaderTitle, { color: theme.colors.text }]}>
            {props.message}
          </Text>
          <Text style={[styles.modalBodyText, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to save favorites, keep notifications in sync, and restore your account.
          </Text>
        </View>

        <View style={styles.loginActions}>
          <Button
            mode="contained"
            icon="facebook"
            onPress={facebookButton}
            style={[styles.providerButton, { backgroundColor: '#4267B2' }]}
            labelStyle={styles.providerButtonLabel}
          >
            Facebook
          </Button>

          <GoogleSigninButton
            style={styles.googleSigninButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            title="Sign in with Google"
            onPress={googleButton}
          />
        </View>
      </>
    );
  };

  return (
    <Modal
      transparent
      visible={isModalVisible}
      animationType="fade"
      onRequestClose={onCloseModal}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCloseModal} />
        <View
          style={[
            styles.modalHolder,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.outline || Colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.modalCloseButton,
              { backgroundColor: theme.colors.card },
            ]}
            onPress={onCloseModal}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          >
            <MaterialCommunityIcons
              name="close"
              color={theme.colors.text}
              size={20}
            />
          </TouchableOpacity>
          <ModalContent />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(12, 16, 24, 0.58)',
  },
  modalRoot: {
    margin: 0,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalHolder: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    paddingTop: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalHolderHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 20,
    gap: 12,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  modalBodyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalCloseButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  loginActions: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  providerButton: {
    borderRadius: 16,
    paddingVertical: 4,
  },
  providerButtonLabel: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  googleSigninButton: {
    alignSelf: 'stretch',
    borderRadius: 16,
    height: 52,
    width: '100%',
  },
  loadingState: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  loginStateWrap: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  loginStateText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  continueButton: {
    alignSelf: 'stretch',
    borderRadius: 16,
  },
  logoutContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  logoutAction: {
    flex: 1,
    borderRadius: 16,
  },
});

export default LoginModal;
