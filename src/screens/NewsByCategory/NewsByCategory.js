import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Surface, useTheme } from 'react-native-paper';

import { Loader, LoginModal, NewsCardList } from '../../components';
import { SCREENS, TEXT_STRINGS } from '../../data/Enums';
import Colors from '../../utils/Colors';
import { getArticlesHelper } from '../../utils/Api';

const NewsByCategory = (props) => {
  const theme = useTheme();
  const categoryName = props.route?.params?.category || 'All';
  const [loading, setLoading] = React.useState(true);

  const onBack = React.useCallback(() => {
    if (props.navigation.canGoBack?.()) {
      props.navigation.goBack();
      return;
    }

    props.navigation.navigate('BottomTabs', { screen: SCREENS.HOME });
  }, [props.navigation]);

  React.useEffect(() => {
    let mounted = true;

    const loadArticles = async () => {
      try {
        await getArticlesHelper();
      } catch (error) {
        console.error('Unable to load category feed', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <Loader label={`Loading ${categoryName}`} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.heroAccent, { backgroundColor: theme.colors.primary }]} />
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
          {categoryName}
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.colors.onSurfaceVariant }]}>
          Focused feed for this category.
        </Text>
        <Button mode="outlined" onPress={onBack} style={styles.heroAction}>
          Back
        </Button>
      </Surface>

      <View style={styles.feedShell}>
        <NewsCardList
          navigation={props.navigation}
          route={categoryName === 'All' ? undefined : { name: categoryName }}
        />
      </View>

      <LoginModal message={TEXT_STRINGS.LOGIN_FOR_FAVORITES} />
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
  heroAction: {
    alignSelf: 'flex-start',
    borderRadius: 16,
  },
  feedShell: {
    flex: 1,
  },
});

export default NewsByCategory;
