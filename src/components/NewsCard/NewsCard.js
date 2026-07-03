import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Card, TouchableRipple, useTheme } from 'react-native-paper';

import Colors from '../../utils/Colors';
import { OverflowMenu } from '..';
import { initializeShare } from '../../utils/Share';
import { removeNewsFromNotifications } from '../../store/newsStore/newsStore.actions';
import { favoritesSelector } from '../../store/newsStore/newsStore.selectors';
import {
  isUserConnectedSelector,
  getUserDataSelector,
} from '../../store/userStore/userStore.selectors';
import { onClickFavoriteOverflowMenuOption } from '../../screens/Favorites/FavoriteOverflowHelper';
import { SCREENS } from '../../data/Enums';

const NewsCard = (props) => {
  const { article, navigation } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const isUserConnected = useSelector(isUserConnectedSelector);
  const favorites = useSelector(favoritesSelector);
  const userData = useSelector(getUserDataSelector);

  const {
    title,
    image_url,
    source,
    created_utc,
    id,
  } = article;

  const isInFavorites = isUserConnected && favorites.findIndex((favorite) => favorite.id === id) !== -1;

  const options = React.useMemo(() => {
    const baseOptions = [isInFavorites ? 'Remove Favorite' : 'Add Favorite', 'Share Article', 'Report Article'];

    if (props.notifications) {
      return ['Remove Notification', ...baseOptions];
    }

    return baseOptions;
  }, [isInFavorites, props.notifications]);

  const removeNotificationArticle = React.useCallback(() => {
    dispatch(removeNewsFromNotifications(id));
  }, [dispatch, id]);

  const metaDate = created_utc
    ? moment.unix(created_utc).format('MMM D, YYYY')
    : 'Recently';

  const imageSource = image_url
    ? { uri: image_url, cache: 'force-cache' }
    : require('../../images/newspaper.png');

  const onPressCard = React.useCallback(() => {
    navigation.navigate(SCREENS.ARTICLE, {
      ...article,
    });
  }, [article, navigation]);

  const overflowActions = React.useMemo(() => {
    const favoriteAction = () =>
      onClickFavoriteOverflowMenuOption(
        props,
        isUserConnected,
        userData,
        dispatch,
        isInFavorites
      );
    const shareAction = () => initializeShare(title, source);
    const reportAction = () => {};

    if (props.notifications) {
      return [removeNotificationArticle, favoriteAction, shareAction, reportAction];
    }

    return [favoriteAction, shareAction, reportAction];
  }, [
    dispatch,
    isInFavorites,
    isUserConnected,
    props,
    removeNotificationArticle,
    source,
    title,
    userData,
  ]);

  return (
    <Card
      mode="elevated"
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <TouchableRipple onPress={onPressCard} rippleColor={Colors.black_opacity}>
        <View>
          <View style={styles.mediaWrap}>
            <Image source={imageSource} resizeMode="cover" style={styles.image} />

            <View style={styles.mediaOverlay}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <MaterialCommunityIcons name="source-branch" color="#fff" size={12} />
                  <Text style={styles.badgeText} numberOfLines={1}>
                    {source}
                  </Text>
                </View>

                <View style={styles.badge}>
                  <MaterialCommunityIcons name="calendar-blank-outline" color="#fff" size={12} />
                  <Text style={styles.badgeText}>{metaDate}</Text>
                </View>
              </View>
            </View>
          </View>

          <Card.Content style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={3}>
                {title}
              </Text>

              <OverflowMenu
                customButton={(
                  <View style={[styles.menuButton, { backgroundColor: theme.colors.card }]}>
                    <MaterialCommunityIcons
                      name="dots-vertical"
                      size={22}
                      color={theme.colors.text}
                    />
                  </View>
                )}
                destructiveIndex={props.notifications ? 0 : isInFavorites ? 0 : -1}
                options={options}
                actions={overflowActions}
              />
            </View>
          </Card.Content>
        </View>
      </TouchableRipple>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  mediaWrap: {
    position: 'relative',
  },
  image: {
    height: 204,
    width: '100%',
    backgroundColor: Colors.surface_alt,
  },
  mediaOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 30,
    backgroundColor: 'rgba(2, 6, 23, 0.16)',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    maxWidth: '100%',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  content: {
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewsCard;
