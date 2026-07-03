import React from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Article, Categories, Favorites, NewsByCategory, Notifications, Settings } from '../screens';
import HomeTabs from '../screens/HomeTabs/HomeTabs';
import { Header } from '../components';
import { SCREENS } from '../data/Enums';
import { loginModalVisible } from '../store/userStore/userStore.actions';
import { isUserConnectedSelector } from '../store/userStore/userStore.selectors';
import Colors from '../utils/Colors';

const Stack = createNativeStackNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();

const stackScreenOptions = (theme) => ({
  headerShown: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
});

const CreateRootStack = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={({ navigation, route }) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? SCREENS.HOME;

          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerLeft: () => (
              <Header
                side="left"
                navigation={navigation}
                routeName={focusedRouteName}
              />
            ),
            headerRight: () => (
              <Header
                side="right"
                navigation={navigation}
                routeName={focusedRouteName}
              />
            ),
          };
        }}
      />

      <Stack.Screen
        name={SCREENS.CATEGORIES}
        component={Categories}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerLeft: () => (
            <Header
              side="left"
              navigation={navigation}
              routeName={SCREENS.CATEGORIES}
            />
          ),
          headerRight: () => (
            <Header
              side="right"
              navigation={navigation}
              routeName={SCREENS.CATEGORIES}
            />
          ),
        })}
      />

      <Stack.Screen
        name={SCREENS.NEWS_BY_CATEGORY}
        component={NewsByCategory}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerLeft: () => (
            <Header
              side="left"
              navigation={navigation}
              routeName={SCREENS.NEWS_BY_CATEGORY}
              title={route.params?.category || 'Category feed'}
            />
          ),
          headerRight: () => (
            <Header
              side="right"
              navigation={navigation}
              routeName={SCREENS.NEWS_BY_CATEGORY}
            />
          ),
        })}
      />

      <Stack.Screen
        name={SCREENS.ARTICLE}
        component={Article}
        options={({ navigation }) => ({
          headerShown: true,
          presentation: 'modal',
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerLeft: () => (
            <Header
              side="left"
              navigation={navigation}
              routeName={SCREENS.ARTICLE}
            />
          ),
          headerRight: () => (
            <Header
              side="right"
              navigation={navigation}
              routeName={SCREENS.ARTICLE}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const BottomTabs = () => {
  const theme = useTheme();
  const isUserConnected = useSelector(isUserConnectedSelector);
  const dispatch = useDispatch();

  return (
    <MaterialBottomTabs.Navigator
      id="BottomTabs"
      initialRouteName={SCREENS.HOME}
      shifting={false}
      labeled
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      barStyle={{
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        borderTopWidth: 0,
        marginHorizontal: 12,
        marginBottom: 10,
        paddingTop: 8,
        height: 72,
        overflow: 'hidden',
        elevation: 12,
        shadowColor: Colors.shadow,
        shadowOpacity: 1,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      }}
      sceneAnimationEnabled
    >
      <MaterialBottomTabs.Screen
        name={SCREENS.HOME}
        component={HomeTabs}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="newspaper-variant-outline" color={color} size={24} />
          ),
        }}
      />

      <MaterialBottomTabs.Screen
        name={SCREENS.FAVORITES}
        component={Favorites}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bookmark-multiple-outline" color={color} size={24} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!isUserConnected) {
              e.preventDefault();
              dispatch(loginModalVisible(true));
            }
          },
        }}
      />

      <MaterialBottomTabs.Screen
        name={SCREENS.NOTIFICATIONS}
        component={Notifications}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color }) => (
            <Feather name="bell" color={color} size={22} />
          ),
        }}
      />

      <MaterialBottomTabs.Screen
        name={SCREENS.SETTINGS}
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Feather name="settings" color={color} size={22} />
          ),
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
};

export default CreateRootStack;
