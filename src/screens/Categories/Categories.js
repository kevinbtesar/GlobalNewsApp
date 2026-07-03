import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Surface, useTheme } from 'react-native-paper';

import { NewsCategoryCard, LoginModal, Loader, NoResults } from '../../components';
import Colors from '../../utils/Colors';
import { categoriesSelector } from '../../store/newsStore/newsStore.selectors';
import { isUserConnectedSelector } from '../../store/userStore/userStore.selectors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { SCREENS } from '../../data/Enums';
import { getArticlesHelper } from '../../utils/Api';

const Categories = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isUserConnected = useSelector(isUserConnectedSelector);
  const categories = useSelector(categoriesSelector) || [];
  const [loading, setLoading] = React.useState(categories.length === 0);

  React.useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      if (categories.length === 0) {
        try {
          await getArticlesHelper();
        } catch (error) {
          console.error('Unable to load categories', error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      } else if (mounted) {
        setLoading(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [categories.length]);

  const onNavigateToFavorites = React.useCallback(() => {
    if (isUserConnected) {
      props.navigation.navigate('BottomTabs', { screen: SCREENS.FAVORITES });
    } else {
      dispatch(loginModalVisible(true));
    }
  }, [dispatch, isUserConnected, props.navigation]);

  const onBackToFeed = React.useCallback(() => {
    if (props.navigation.canGoBack?.()) {
      props.navigation.goBack();
      return;
    }

    props.navigation.navigate('BottomTabs', { screen: SCREENS.HOME });
  }, [props.navigation]);

  if (loading) {
    return <Loader label="Loading categories" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.heroAccent, { backgroundColor: theme.colors.primary }]} />
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
          Browse categories
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Open a topic to jump straight into a focused feed, or head to your saved
          stories.
        </Text>

        <View style={styles.heroActions}>
          <Button mode="contained" onPress={onNavigateToFavorites} style={styles.heroButton}>
            Your favorites
          </Button>
          <Button
            mode="outlined"
            onPress={onBackToFeed}
            style={styles.heroButton}
          >
            Back to feed
          </Button>
        </View>
      </Surface>

      <FlatList
        data={categories}
        keyExtractor={(item, index) => String(item?.category ?? item?.title ?? index)}
        renderItem={({ item, index }) => (
          <NewsCategoryCard {...item} index={index} navigation={props.navigation} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <NoResults text="No categories are available yet" fontSize={24} color={theme.colors.text} />
        )}
      />

      <LoginModal message="To save an article to favorites you need to log in" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heroCard: {
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
    overflow: 'hidden',
    gap: 12,
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
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroButton: {
    borderRadius: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default Categories;
