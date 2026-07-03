import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import Colors from '../../utils/Colors';

function NoResults({ text, fontSize, children, color }) {
  const theme = useTheme();

  return (
    <View style={styles.noResultsContainer}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.primaryContainer || Colors.accent_soft }]}>
        <MaterialCommunityIcons
          name="image-off-outline"
          size={28}
          color={theme.colors.primary}
        />
      </View>
      <Text
        style={[
          styles.noResults,
          {
            fontSize: fontSize || 24,
            color: color || theme.colors.text,
          },
        ]}
      >
        {text || 'No results yet'}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 14,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResults: {
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});

export default NoResults;
