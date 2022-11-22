import React from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native";

import { NewsByCategory, Categories, Article, Favorites } from "../screens";
import Colors from "../utils/Colors";
import Fonts from "../utils/Fonts";
import { Header } from "../components";
import { SCREENS } from "../utils/Enums";
import { useTheme } from "react-native-paper";

const Stack = createNativeStackNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();
const screenOptions = { headerShown: false, headerBackTitleVisible: false };

const stackScreenOptions = props => ({
  // title: 'Global News',
  headerStyle: {
    backgroundColor: Colors.yellow
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontFamily: Fonts.Walk,
    alignSelf: "center"
  },
  headerRight: () => <Header side="right" navigation={props.navigation} />,
  headerLeft: () => <Header side="left" navigation={props.navigation} />
});

CreateRootStack = () => {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer
        screenOptions={screenOptions}
        theme={theme}
        initialRouteName={SCREENS.HOME}
        backBehavior="history">
        <Stack.Navigator>
          
          {/* <Stack.Screen name={SCREENS.CATEGORIES} component={Categories}
          options={(props) => ({ ...stackScreenOptions(), headerLeft: () => <Header side='left' /> })} />
        <Stack.Screen name={SCREENS.NEWS_BY_CATEGORY} component={NewsByCategory}
          options={(props) => stackScreenOptions()} /> */}

          {/* <Stack.Screen name="RootDrawer" component={RootDrawer} options={{headerShown:false}} /> */}
          {/* <Stack.Screen name="Top Tabs" children={CreateTopTabs} options={{headerShown:false}} /> */}

          <Stack.Screen
            name={SCREENS.HOME}
            options={props => stackScreenOptions(props)}
            component={CreateBottomTabs}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

CreateBottomTabs = props => {

  return (
    <MaterialBottomTabs.Navigator
      barStyle={{
        height:72,
      }}
      defaultScreenOptions={true}
    >
      <MaterialBottomTabs.Screen
        name="Top"
        component={CreateTopTabs}
        options={props => ({
          ...stackScreenOptions(props),
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          )
        })}
      />

      <MaterialBottomTabs.Screen
        name="Notifications"
        component={NewsByCategory}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          )
        }}
      />
      <MaterialBottomTabs.Screen
        name="Profile"
        component={NewsByCategory}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          )
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
};

CreateTopTabs = props => {

  return (
    <MaterialTopTabs.Navigator>
      <MaterialTopTabs.Screen
        name="Tab1"
        component={NewsByCategory}
      // options={{title: props.route.params.name}}
      />
      <MaterialTopTabs.Screen
        name="Tab2"
        component={NewsByCategory}
        // options={{ title: "Custom" }}
      />
      <MaterialTopTabs.Screen name="Tab3" component={NewsByCategory} />
    </MaterialTopTabs.Navigator>
  );
};

export default CreateRootStack;

// function NewsStackNavigator() {

//   return (
//     <NavigationContainer screenOptions={screenOptions} theme={theme}   backBehavior='history'>
//       <Drawer.Navigator
//         >
//         <Drawer.Screen name={SCREENS.HOME}
//           options={(props) => stackScreenOptions(props)} component={NewsByCategory} />
//         <Drawer.Screen name={SCREENS.FAVORITES} component={Favorites}
//           options={(props) => stackScreenOptions(props)} />
//         <Drawer.Screen name={SCREENS.SETTINGS} component={NewsByCategory}
//           options={(props) => stackScreenOptions(props)} />
//         <Drawer.Screen name={SCREENS.NOTIFICATIONS} component={NewsByCategory}
//           options={(props) => stackScreenOptions(props)} />
//         <Drawer.Screen name={SCREENS.ARTICLE} component={Article}
//           options={(props) => ({ ...stackScreenOptions(props), drawerItemStyle:{display: 'none' }})} />

//         <Drawer.Screen name="Top" component={CreateTopTabs} />
//         <Drawer.Screen name="Bottom" component={CreateBottomTabs} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// }
