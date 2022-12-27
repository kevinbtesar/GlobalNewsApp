import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "react-native-paper";
import {  useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { NewsByCategory, Settings, Article, Favorites } from "../screens";
import Colors from "../utils/Colors";
import Fonts from "../utils/Fonts";
import { Header } from "../components";
import { SCREENS } from "../utils/Enums";
import { categoriesSelector } from '../store/newsStore/newsStore.selectors';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();
const screenOptions = { headerShown: false, headerBackTitleVisible: false };

const stackScreenOptions = props => ({
  // title: props.route.name,
  headerStyle: {
    backgroundColor: Colors.black_opacity,
    height:4,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontFamily: Fonts.Walk,
    alignSelf: "center",
    fontSize:20,
  },
  headerRight: () => <Header side="right" navigation={props.navigation} />,
  headerLeft: () => <Header side="left" navigation={props.navigation} />
});

CreateRootStack = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    
      <NavigationContainer
        theme={theme}
        initialRouteName={SCREENS.HOME}
        backBehavior="history">
        <Stack.Navigator screenOptions={{screenOptions,presentation: 'modal'}}>

          {/* <Stack.Screen name={SCREENS.CATEGORIES} component={Categories}
          options={(props) => ({ ...stackScreenOptions(), headerLeft: () => <Header side='left' /> })} />
        <Stack.Screen name={SCREENS.NEWS_BY_CATEGORY} component={NewsByCategory}
          options={(props) => stackScreenOptions()} /> */}

          {/* <Stack.Screen name="RootDrawer" component={RootDrawer} options={{headerShown:false}} /> */}
          {/* <Stack.Screen name="Top Tabs" children={CreateTopTabs} options={{headerShown:false}} /> */}

          <Stack.Screen
            name={'Home'}
            options={(props) => ({ 
              ...stackScreenOptions(props), headerShown: true, headerTitle: getHeaderTitle(props.route)  
            })}
            component={CreateBottomTabs}
          />

          <Stack.Screen 
            name={SCREENS.ARTICLE} 
            component={Article} 
            options={props => ({ 
              ...stackScreenOptions(props), headerShown: true, headerTitle: getHeaderTitle(props.route), headerStyle: { height:100 + insets.top} 
            })} 
          />

        </Stack.Navigator>
      </NavigationContainer>

    // </SafeAreaView>
  );
};


CreateBottomTabs = props => {

  return (
    <MaterialBottomTabs.Navigator
      barStyle={{
        height: 72,
      }}
    >
      <MaterialBottomTabs.Screen
        name="Refresh"
        component={CreateTopTabs}
        options={props => ({
          ...stackScreenOptions(props),
          title: 'test',
          headerShown: true,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" color={color} size={26} />
          )
        })}
      />
      <MaterialBottomTabs.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarLabel: "Favorites",
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <AntDesign name="book" color={color} size={26} />
          )
        }}
      />
      <MaterialBottomTabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Feather name="settings" color={color} size={26} />
          )
        }}
      />
    </MaterialBottomTabs.Navigator>
  );
};




CreateTopTabs = props => {

  let categories = useSelector(categoriesSelector);
  // console.log("categories: " + JSON.stringify(categories))
  return (

    <Tab.Navigator
      removeClippedSubviews={true}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100,height:50 },
        tabBarStyle: { backgroundColor: 'powderblue' },
        lazy: true
      }}
    >

      {(categories && categories.length > 0) ?

        categories.map(index => (
          <Tab.Screen
            name={index.title}
            component={NewsByCategory}
            key={index.title}
          />
        ))
        :

        <Tab.Screen
          name="Loading"
          component={NewsByCategory}
          style={{ height: 0 }}
          options={{
            height: 0
          }}
        />

      }

    </Tab.Navigator>
  );
};


export default CreateRootStack;



function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Favorites':
      return 'Favorites';
    case 'Settings':
      return 'Settings';
  }
}

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


