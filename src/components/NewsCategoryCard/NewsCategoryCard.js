import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Surface, useTheme } from 'react-native-paper';

import Colors from '../../utils/Colors';
import { SCREENS } from '../../data/Enums';

const CATEGORY_ACCENTS = [
  Colors.primary,
  Colors.accent,
  Colors.orange,
  Colors.dark_pink,
  Colors.grey_green,
];

const CATEGORY_ICONS = [
  'newspaper-variant-outline',
  'earth',
  'flask-outline',
  'laptop',
  'soccer',
];

const NewsCategoryCard = (props) => {
  const theme = useTheme();
  const title = props.title || props.category || props.name || 'Category';
  const subtitle =
    props.description || 'Browse the latest stories for this topic.';
  const accent = CATEGORY_ACCENTS[props.index % CATEGORY_ACCENTS.length];
  const icon = CATEGORY_ICONS[props.index % CATEGORY_ICONS.length];

  const openCategory = React.useCallback(() => {
    props.navigation.navigate(SCREENS.NEWS_BY_CATEGORY, {
      category: title,
    });
  }, [props.navigation, title]);

  return (
    <Pressable
      onPress={openCategory}
      style={({ pressed }) => [styles.wrapper, { opacity: pressed ? 0.92 : 1 }]}
    >
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.outline,
          },
        ]}
      >
        <View style={[styles.accentStrip, { backgroundColor: accent }]} />
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: accent }]}>
            <MaterialCommunityIcons name={icon} color="#fff" size={22} />
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {title}
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            color={theme.colors.onSurfaceVariant}
            size={24}
          />
        </View>
      </Surface>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
  },
  accentStrip: {
    height: 4,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default NewsCategoryCard;
