import React from 'react';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  setThemeDark: () => {},
  isThemeDark: true,
  isPreferencesReady: false,
});
