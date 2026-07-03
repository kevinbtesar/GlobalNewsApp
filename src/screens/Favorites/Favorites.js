import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Surface, useTheme } from 'react-native-paper';

import { removeAllFavorites } from '../../store/newsStore/newsStore.actions';
import { favoritesSelector } from '../../store/newsStore/newsStore.selectors';
import { NewsCardList, NoResults } from '../../components';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import {
  isUserConnectedSelector,
  getUserDataSelector,
} from '../../store/userStore/userStore.selectors';
import { favorites } from '../../utils/Api';
import { TEXT_STRINGS } from '../../data/Enums';

const Favorites = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const reducerFavorites = useSelector(favoritesSelector);
  const isUserConnected = useSelector(isUserConnectedSelector);
  const userData = useSelector(getUserDataSelector);

  const onClickDeleteAll = React.useCallback(async () => {
    if (isUserConnected && userData.accessToken) {
      try {
        const favorite = await favorites({
          accessToken: userData.accessToken,
          action: 'deleteAll',
        });

        if (favorite?.success) {
          dispatch(removeAllFavorites());
        } else {
          throw new Error(favorite?.error || 'Unable to clear favorites');
        }
      } catch (error) {
        console.error('Favorites clear all failed', error);
      }
    } else {
      dispatch(loginModalVisible(true));
    }
  }, [dispatch, isUserConnected, userData.accessToken]);

  const onPressSignInButton = React.useCallback(() => {
    dispatch(loginModalVisible(true));
  }, [dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.heroAccent, { backgroundColor: theme.colors.primary }]} />
        <View style={styles.heroCopy}>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
            Your saved stories
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {isUserConnected
              ? `${reducerFavorites.length} articles are saved for later.`
              : 'Sign in to save articles across devices.'}
          </Text>
        </View>

        <Button
          mode="outlined"
          icon={isUserConnected ? 'delete-sweep' : 'login'}
          style={styles.heroAction}
          onPress={onClickDeleteAll}
          disabled={isUserConnected && !reducerFavorites.length}
        >
          {isUserConnected ? 'Clear all' : 'Sign in'}
        </Button>
      </Surface>

      {!isUserConnected ? (
        <Surface style={[styles.ctaCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.ctaTitle, { color: theme.colors.text }]}>
            {TEXT_STRINGS.FAVORITES_TEXT_FIRST}
            {TEXT_STRINGS.FAVORITES_TEXT_SECOND}
          </Text>
          <Text style={[styles.ctaSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to start building a reading list you can come back to later.
          </Text>
          <Button mode="contained" onPress={onPressSignInButton}>
            Sign in
          </Button>
        </Surface>
      ) : reducerFavorites.length > 0 ? (
        <View style={styles.feedShell}>
          <NewsCardList favorites={reducerFavorites} navigation={props.navigation} />
        </View>
      ) : (
        <View style={styles.emptyWrap}>
          <NoResults text="You have no favorite news" fontSize={24} color={theme.colors.text} />
          <Button mode="contained" icon="home" onPress={() => props.navigation.navigate('Home')}>
            Go to Home
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  heroCard: {
    borderRadius: 28,
    padding: 18,
    overflow: 'hidden',
    gap: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    right: -20,
    width: 92,
    height: 92,
    borderRadius: 999,
    opacity: 0.18,
  },
  heroCopy: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  heroAction: {
    alignSelf: 'flex-start',
    borderRadius: 16,
  },
  ctaCard: {
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  ctaSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  feedShell: {
    flex: 1,
  },
  emptyWrap: {
    flex: 1,
    gap: 12,
  },
});

export default Favorites;
