import React, {useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView} from "react-native";
import { useTheme } from "react-native-paper";
import DeviceInfo from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';

import { NewsByCategory, Settings, Article, Favorites } from "../screens";
import Colors from "../utils/Colors";
import Fonts from "../utils/Fonts";
import { Header } from "../components";
import { SCREENS } from "../utils/Enums";
import Api from "../utils/Api";
import { categoriesSelector } from '../store/newsStore/newsStore.selectors';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
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
          <Stack.Screen name={SCREENS.ARTICLE} component={Article} options={{headerShown:false}} />
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
            <Feather name="home" color={color} size={26} />
          )
        })}
      />
      <MaterialBottomTabs.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarLabel: "Favorites",
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

  return (

    <Tab.Navigator
      removeClippedSubviews={true}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100 },
        tabBarStyle: { backgroundColor: 'powderblue' },
        lazy:true
      }}
    >

    {categories.length > 0 ?
    
    categories.map(index => (
            <Tab.Screen
                component={NewsByCategory}
                key={index.component}

                name={index.title}
                // options={{
                //     title: route
                // }}
            />
        ))
      :

      <Tab.Screen
        name="Loading"
        component={NewsByCategory}
        style={{height:0}}
        options={{
          height:0
        }}
      // options={{title: props.route.params.name}}
      />
      
      }

    </Tab.Navigator>
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
