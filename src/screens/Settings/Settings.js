import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  List,
  Surface,
  Switch,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import Colors from '../../utils/Colors';
import { initializeShare } from '../../utils/Share';
import { PreferencesContext } from '../../utils/PreferencesContext';

const NOTIFICATIONS_KEY = '@notificationsSetting';

const Settings = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isThemeDark, setThemeDark } = React.useContext(PreferencesContext);
  const isUserConnected = useSelector(isUserConnectedSelector);
  const userData = useSelector(getUserDataSelector);
  const [isNotificationSwitchOn, setNotificationSwitch] = React.useState(true);
  const [settingsLoaded, setSettingsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem(NOTIFICATIONS_KEY);

        if (!mounted) {
          return;
        }

        setNotificationSwitch(storedNotifications === null ? true : storedNotifications === 'true');
      } catch (error) {
        if (mounted) {
          setNotificationSwitch(true);
        }
      } finally {
        if (mounted) {
          setSettingsLoaded(true);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const onToggleNotificationSwitch = React.useCallback(async () => {
    const nextValue = !isNotificationSwitchOn;
    setNotificationSwitch(nextValue);

    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, nextValue ? 'true' : 'false');
    } catch (error) {
      setNotificationSwitch(!nextValue);
    }
  }, [isNotificationSwitchOn]);

  const onToggleDarkModeSwitch = React.useCallback(async () => {
    try {
      await setThemeDark(!isThemeDark);
    } catch (error) {
      console.error('Unable to update theme setting', error);
    }
  }, [isThemeDark, setThemeDark]);

  const onPressLogin = React.useCallback(() => {
    dispatch(loginModalVisible(true));
  }, [dispatch]);

  const reportBug = React.useCallback(() => {
    console.log('TODO: report bug flow');
  }, []);

  const appName = DeviceInfo.getApplicationName();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.heroAccent, { backgroundColor: theme.colors.primary }]} />
        <View style={styles.heroTopRow}>
          <View style={styles.heroAvatarWrap}>
            {isUserConnected && userData.image ? (
              <Image
                style={styles.heroAvatar}
                source={{ uri: userData.image, cache: 'force-cache' }}
              />
            ) : (
              <View style={[styles.heroAvatarFallback, { backgroundColor: theme.colors.primaryContainer }]}>
                <MaterialCommunityIcons
                  name={isUserConnected ? 'account' : 'account-outline'}
                  color={theme.colors.onPrimaryContainer}
                  size={28}
                />
              </View>
            )}
          </View>

          <View style={styles.heroCopy}>
            <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
              {isUserConnected ? userData.name || 'Signed in' : 'Welcome back'}
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              {isUserConnected
                ? 'Your account, favorites, and alerts stay in sync.'
                : 'Sign in to save stories and keep your profile in sync.'}
            </Text>
          </View>
        </View>

        {isUserConnected ? (
          <Button
            mode="outlined"
            icon="logout"
            onPress={onPressLogin}
            style={styles.heroAction}
          >
            Sign out
          </Button>
        ) : (
          <Button
            mode="contained"
            icon="login"
            onPress={onPressLogin}
            style={styles.heroAction}
          >
            Sign in
          </Button>
        )}
      </View>

      <Surface style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Notifications"
            description="Allow one notification every other day"
            left={() => <List.Icon color={theme.colors.primary} icon="bell-outline" />}
            right={() => (
              <Switch value={isNotificationSwitchOn} onValueChange={onToggleNotificationSwitch} />
            )}
          />
          <List.Item
            title="Dark mode"
            description={isThemeDark ? 'Using the dark theme' : 'Using the light theme'}
            left={() => <List.Icon color={theme.colors.primary} icon="theme-light-dark" />}
            right={() => <Switch value={isThemeDark} onValueChange={onToggleDarkModeSwitch} />}
          />
        </List.Section>
      </Surface>

      <Surface style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <List.Section>
          <List.Subheader>Reach Out</List.Subheader>
          <List.Item
            title={`Share ${appName}`}
            left={() => <List.Icon color={theme.colors.primary} icon="share-variant" />}
            onPress={() => initializeShare(appName, 'TODO: Google or Apple url')}
          />
          <List.Item
            title={`Rate ${appName}`}
            left={() => <List.Icon color={theme.colors.primary} icon="star-outline" />}
            onPress={() => console.log('TODO: rate app flow')}
          />
          <List.Item
            title="Report Bug"
            left={() => <List.Icon color={theme.colors.primary} icon="bug-outline" />}
            onPress={reportBug}
          />
        </List.Section>
      </Surface>

      <View style={styles.versionRow}>
        <Text style={[styles.versionText, { color: theme.colors.onSurfaceVariant }]}>
          v {DeviceInfo.getVersion()}.{DeviceInfo.getBuildNumber()}
        </Text>
      </View>

      {!settingsLoaded ? null : <View style={{ height: 8 }} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  heroCard: {
    borderRadius: 28,
    padding: 18,
    overflow: 'hidden',
    gap: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    right: -24,
    width: 92,
    height: 92,
    borderRadius: 999,
    opacity: 0.18,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroAvatarWrap: {
    width: 64,
    height: 64,
  },
  heroAvatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
  },
  heroAvatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  heroAction: {
    alignSelf: 'flex-start',
    borderRadius: 16,
  },
  sectionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 2,
  },
  versionRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Settings;
