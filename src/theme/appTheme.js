import merge from 'deepmerge';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import Colors from '../utils/Colors';

const lightPalette = {
  background: Colors.background,
  surface: Colors.surface,
  card: Colors.surface,
  text: Colors.text,
  border: Colors.border,
  primary: Colors.primary_strong,
  secondary: Colors.accent,
  notification: Colors.primary,
  onSurface: Colors.text,
  onSurfaceVariant: Colors.text_muted,
  outline: Colors.border,
};

const darkPalette = {
  background: Colors.background_dark,
  surface: Colors.surface_dark,
  card: '#121a2a',
  text: '#f8fafc',
  border: Colors.border_dark,
  primary: '#fbbf24',
  secondary: '#2dd4bf',
  notification: '#f59e0b',
  onSurface: '#f8fafc',
  onSurfaceVariant: '#94a3b8',
  outline: Colors.border_dark,
};

const buildNavigationTheme = (isDark) => {
  const palette = isDark ? darkPalette : lightPalette;
  const baseTheme = isDark ? NavigationDarkTheme : NavigationDefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: palette.primary,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.border,
      notification: palette.notification,
    },
  };
};

const buildPaperTheme = (isDark) => {
  const palette = isDark ? darkPalette : lightPalette;
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return merge(baseTheme, {
    dark: isDark,
    roundness: 24,
    colors: {
      ...baseTheme.colors,
      primary: palette.primary,
      secondary: palette.secondary,
      background: palette.background,
      card: palette.card,
      surface: palette.surface,
      surfaceVariant: isDark ? '#1f2a3d' : '#e8eef6',
      text: palette.text,
      textSecondary: palette.onSurfaceVariant,
      onSurface: palette.onSurface,
      onSurfaceVariant: palette.onSurfaceVariant,
      primaryContainer: isDark ? '#3a2c00' : '#fde68a',
      onPrimaryContainer: isDark ? '#fef3c7' : '#78350f',
      outline: palette.outline,
      outlineVariant: palette.outline,
      shadow: isDark ? 'rgba(0, 0, 0, 0.45)' : Colors.shadow,
      scrim: Colors.overlay,
      elevation: {
        ...baseTheme.colors.elevation,
        level0: 'transparent',
        level1: isDark ? '#111827' : '#ffffff',
        level2: isDark ? '#121b2c' : '#f8fafc',
        level3: isDark ? '#172033' : '#f1f5f9',
        level4: isDark ? '#1b2740' : '#eef2f7',
        level5: isDark ? '#202d48' : '#e9eef5',
      },
    },
  });
};

export const buildAppThemes = (isDark) => ({
  paperTheme: buildPaperTheme(isDark),
  navigationTheme: buildNavigationTheme(isDark),
});
