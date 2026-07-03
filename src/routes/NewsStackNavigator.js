import React from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import { Dimensions } from "react-native";

import { Settings, Article, Favorites, Notifications } from "../screens";
import Colors from "../utils/Colors";
import Fonts from "../utils/Fonts";
import { Header } from "../components";
import { SCREENS } from "../data/Enums";
import { isUserConnectedSelector } from "../store/userStore/userStore.selectors";
import { loginModalVisible } from "../store/userStore/userStore.actions";
import HomeTabs from "../screens/HomeTabs/HomeTabs";

const Stack = createNativeStackNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();
const screenOptions = { headerShown: false, headerBackTitleVisible: false };

const stackScreenOptions = (props, navigationRef) => ({
  headerStyle: {
    backgroundColor: Colors.black_opacity,
    height: 4,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontFamily: Fonts.Walk,
    alignSelf: "center",
    fontSize: 20,
  },
  headerRight: () => <Header side="right" navigation={props.navigation} navigationRef={navigationRef} />,
  headerLeft: () => <Header side="left" navigation={props.navigation} navigationRef={navigationRef} />
});

const CreateRootStack = () => {
  const theme = useTheme();
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer theme={theme} ref={navigationRef} key={"RootStack"}>
      <Stack.Navigator screenOptions={{ ...screenOptions, presentation: 'modal' }}>
        <Stack.Screen
          name={'BottomTabs'}
          options={(props) => ({
            ...stackScreenOptions(props, navigationRef), headerShown: true, headerTitle: ''
          })}
          component={BottomTabs}
        />

        <Stack.Screen
          name={SCREENS.ARTICLE}
          key={SCREENS.ARTICLE}
          component={Article}
          options={props => ({
            ...stackScreenOptions(props, navigationRef), headerShown: true, headerTitle: ''
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const BottomTabs = () => {
  const isUserConnected = useSelector(isUserConnectedSelector);
  const dispatch = useDispatch();

  return (
    <MaterialBottomTabs.Navigator
      barStyle={{ height: 72 }}
      id={'BottomTabs'}
      initialRouteName={"Home"}
      initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
    >
      <MaterialBottomTabs.Screen
        name="Home"
        component={HomeTabs}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (<Feather name="home" color={color} size={26} />)
        }}
      />

      <MaterialBottomTabs.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarLabel: "Favorites",
          title: "Favorites",
          tabBarIcon: ({ color }) => (<AntDesign name="book" color={color} size={26} />)
        }}
        listeners={{
          tabPress: (e) => {
            if (!isUserConnected) {
              e.preventDefault();
              dispatch(loginModalVisible(true))
            }
          },
        }}
      />

      <MaterialBottomTabs.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color }) => (<Feather name="bell" color={color} size={26} />)
        }}
      />

      <MaterialBottomTabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (<Feather name="settings" color={color} size={26} />)
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
};

export default CreateRootStack;
