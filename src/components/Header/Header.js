import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, useTheme } from 'react-native-paper';

import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { getArticlesHelper } from '../../utils/Api';
import Colors from '../../utils/Colors';
import GLOBAL from '../../store/globalStore';
import { SCREENS } from '../../data/Enums';

const HIDE_REFRESH_ON = new Set([
  SCREENS.FAVORITES,
  SCREENS.SETTINGS,
  SCREENS.NOTIFICATIONS,
]);

const Header = (props) => {
  const { navigation, routeName = SCREENS.HOME, side } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const isUserConnected = useSelector(isUserConnectedSelector);
  const userData = useSelector(getUserDataSelector);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      if (routeName === SCREENS.ARTICLE && GLOBAL.webviewRef?.current) {
        GLOBAL.webviewRef.current.reload();
        return;
      }

      const news = await getArticlesHelper();

      if (news && news.error) {
        throw new Error(news.error);
      }

      if (
        routeName !== SCREENS.CATEGORIES &&
        routeName !== SCREENS.NEWS_BY_CATEGORY
      ) {
        navigation.navigate('BottomTabs', { screen: SCREENS.HOME });
      }
    } catch (error) {
      console.error('Refresh failed', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, navigation, routeName]);

  const shouldShowRefresh = !HIDE_REFRESH_ON.has(routeName) || routeName === SCREENS.ARTICLE;
  const title =
    props.title ||
    (routeName === SCREENS.ARTICLE ? 'Article' : routeName);
  const shouldShowBackButton =
    navigation.canGoBack?.() &&
    ![
      SCREENS.HOME,
      SCREENS.FAVORITES,
      SCREENS.NOTIFICATIONS,
      SCREENS.SETTINGS,
    ].includes(routeName);

  if (side === 'right') {
    return (
      <View style={styles.rightSideContainer}>
        {isUserConnected && userData.image ? (
          <Image
            style={styles.avatar}
            source={{ uri: userData.image, cache: 'force-cache' }}
          />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons
              name={isUserConnected ? 'account' : 'account-outline'}
              color={theme.colors.onPrimaryContainer}
              size={18}
            />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.authButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.outline || Colors.border,
            },
          ]}
          onPress={() => dispatch(loginModalVisible(true))}
          accessibilityRole="button"
          accessibilityLabel={isUserConnected ? 'Logout' : 'Login'}
        >
          <MaterialCommunityIcons
            name={isUserConnected ? 'logout' : 'login'}
            color={theme.colors.primary}
            size={18}
          />
          <Text style={[styles.authButtonText, { color: theme.colors.text }]}>
            {isUserConnected ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.leftSideContainer}>
      <View style={styles.titleBlock}>
        {shouldShowBackButton ? (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              color={theme.colors.text}
              size={22}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.brandMark, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="newspaper-variant" color="#fff" size={18} />
          </View>
        )}

        <View style={styles.titleTextBlock}>
          <Text style={[styles.appLabel, { color: theme.colors.textSecondary || Colors.text_subtle }]}>
            Global News
          </Text>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>
            {title}
          </Text>
        </View>
      </View>

      {shouldShowRefresh ? (
        <TouchableOpacity
          style={[
            styles.refreshButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.outline || Colors.border,
            },
          ]}
          onPress={onRefresh}
          accessibilityRole="button"
          accessibilityLabel="Refresh articles"
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <MaterialCommunityIcons
              name="refresh"
              color={theme.colors.primary}
              size={20}
            />
          )}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  leftSideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightSideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 4,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleTextBlock: {
    justifyContent: 'center',
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  authButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  appLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});

export default Header;
