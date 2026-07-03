import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';

import { NewsCard, NoResults } from '..';
import { getArticlesHelper } from '../../utils/Api';
import { favoritesSelector, articlesSelector } from '../../store/newsStore/newsStore.selectors';

const EMPTY_ARRAY = [];

const NewsCardList = (props) => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const favoritesData = props.favorites;
  const notificationsData = props.notifications;
  const routeData = props.route;
  const favorites = useSelector(favoritesSelector);
  const storeArticles = useSelector(articlesSelector) ?? EMPTY_ARRAY;
  const articles = React.useMemo(
    () =>
      filterArticles(storeArticles, {
        favorites: favoritesData,
        notifications: notificationsData,
        route: routeData,
      }),
    [storeArticles, favoritesData, notificationsData, routeData]
  );

  const onRefresh = React.useCallback(async () => {
    if (refreshing) {
      return;
    }

    try {
      setRefreshing(true);
      const news = await getArticlesHelper();

      if (news && news.error) {
        throw new Error(news.error);
      }
    } catch (error) {
      console.error('NewsCardList refresh failed', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  const renderNewsCardItem = React.useCallback(
    ({ item }) => {
      if (!item) {
        return null;
      }

      return (
        <NewsCard
          {...props}
          article={item}
          notifications={Boolean(props.notifications)}
        />
      );
    },
    [props]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={articles}
        renderItem={renderNewsCardItem}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        initialNumToRender={6}
        contentContainerStyle={styles.contentContainer}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={(
          <NoResults
            text={getEmptyStateText(props)}
            fontSize={24}
            color={theme.colors.text}
          />
        )}
        showsVerticalScrollIndicator={false}
        extraData={favorites}
      />
    </View>
  );
};

function getEmptyStateText(props) {
  if (props.favorites) {
    return 'No saved stories yet';
  }

  if (props.notifications) {
    return 'No notifications right now';
  }

  if (props.route?.name) {
    return `No stories in ${props.route.name}`;
  }

  return 'No stories available';
}

function filterArticles(articlesArray, props) {
  const sourceArticles = Array.isArray(articlesArray) ? articlesArray : [];

  if (props.favorites) {
    return props.favorites;
  }

  if (props.notifications) {
    return props.notifications;
  }

  if (props.route?.name) {
    return sourceArticles.filter(
      (article) => article?.app_category && article.app_category === props.route.name
    );
  }

  return sourceArticles;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  separator: {
    height: 14,
  },
});

export default NewsCardList;
