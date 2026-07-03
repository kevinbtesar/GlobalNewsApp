import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { Button, useTheme } from 'react-native-paper';

import { Loader, LoginModal, NewsCardList } from '../../components';
import { categoriesSelector } from '../../store/newsStore/newsStore.selectors';
import { SCREENS, TEXT_STRINGS } from '../../data/Enums';
import Colors from '../../utils/Colors';
import { getArticlesHelper } from '../../utils/Api';

const EMPTY_ARRAY = [];

const HomeTabs = ({ navigation, route }) => {
  const theme = useTheme();
  const categories = useSelector(categoriesSelector) ?? EMPTY_ARRAY;
  const [loading, setLoading] = React.useState(categories.length === 0);
  const categoryNames = React.useMemo(
    () => categories.map((category) => category?.title).filter(Boolean),
    [categories]
  );
  const effectiveTabs = React.useMemo(
    () => (categoryNames.length ? ['All', ...categoryNames] : ['All']),
    [categoryNames]
  );
  const [activeCategory, setActiveCategory] = React.useState(
    route?.params?.category && effectiveTabs.includes(route.params.category)
      ? route.params.category
      : effectiveTabs[0]
  );

  React.useEffect(() => {
    if (route?.params?.category && effectiveTabs.includes(route.params.category)) {
      setActiveCategory(route.params.category);
    }
  }, [effectiveTabs, route?.params?.category]);

  React.useEffect(() => {
    if (!effectiveTabs.includes(activeCategory)) {
      setActiveCategory(effectiveTabs[0]);
    }
  }, [effectiveTabs, activeCategory]);

  React.useEffect(() => {
    let mounted = true;

    const loadArticles = async () => {
      if (categories.length === 0) {
        try {
          await getArticlesHelper();
        } catch (error) {
          console.error('Unable to load articles', error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      } else if (mounted) {
        setLoading(false);
      }
    };

    loadArticles();

    return () => {
      mounted = false;
    };
  }, [categories.length]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.heroTopRow}>
          <View style={[styles.heroIcon, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="newspaper-variant" color="#fff" size={22} />
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
              Fresh headlines
            </Text>
            <Text style={[styles.heroSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Browse the latest stories by topic, save what matters, and jump back into
              articles with one tap.
            </Text>
          </View>
        </View>

        <Button
          mode="outlined"
          icon="shape-outline"
          style={styles.heroButton}
          onPress={() => navigation.getParent()?.navigate(SCREENS.CATEGORIES)}
        >
          Browse categories
        </Button>
      </View>

      <View style={styles.chipSection}>
        <FlatList
          data={effectiveTabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => {
            const active = item === activeCategory;
            return (
              <Pressable
                onPress={() => setActiveCategory(item)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: active ? theme.colors.primary : theme.colors.card,
                    borderColor: active ? theme.colors.primary : theme.colors.outline,
                    opacity: pressed ? 0.86 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#0f172a' : theme.colors.text },
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <View style={styles.feedShell}>
        <NewsCardList
          route={activeCategory === 'All' ? undefined : { name: activeCategory }}
          navigation={navigation}
        />
      </View>

      <LoginModal message={TEXT_STRINGS.LOGIN_FOR_FAVORITES} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 28,
    padding: 16,
    gap: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    gap: 14,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBlock: {
    flex: 1,
    gap: 6,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  heroButton: {
    alignSelf: 'flex-start',
    borderRadius: 16,
  },
  chipSection: {
    paddingBottom: 4,
  },
  chipRow: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 4,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  feedShell: {
    flex: 1,
    paddingTop: 8,
  },
});

export default HomeTabs;
