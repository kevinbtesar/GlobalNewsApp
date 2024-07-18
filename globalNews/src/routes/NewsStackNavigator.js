import React from "react";
import { NavigationContainer, useNavigationContainerRef, } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from "react-native";

import { NewsByCategory, Settings, Article, Favorites, Notifications } from "../screens";
import Colors from "../utils/Colors";
import Fonts from "../utils/Fonts";
import { Header } from "../components";
import { SCREENS } from "../data/Enums";
import { categoriesSelector } from '../store/newsStore/newsStore.selectors';
import { isUserConnectedSelector } from "../store/userStore/userStore.selectors";
import { loginModalVisible } from "../store/userStore/userStore.actions";
import { Loader } from "../components";
import { getArticlesHelper } from "../utils/Api";

const Stack = createNativeStackNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();
const screenOptions = { headerShown: false, headerBackTitleVisible: false };


const stackScreenOptions = (props, navigationRef, webviewRef) => ({
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

CreateRootStack = () => {
  const theme = useTheme();
  // const insets = useSafeAreaInsets();
  const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`
  return (
    // <SafeAreaView style={{ flex: 1 }}>

    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      key={"RootStack"}
      
    >
      <Stack.Navigator screenOptions={{ screenOptions, presentation: 'modal' }}>

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

    // </SafeAreaView>
  );
};


TopTabs = props => {

  let categories = useSelector(categoriesSelector);

  return (

    <MaterialTopTabs.Navigator
      removeClippedSubviews={true}
      id="TopTabs"
      initialRouteName={"Loading"}
      initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
      backBehavior={'order'}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100, height: 50 },
        tabBarStyle: { backgroundColor: 'powderblue' },
        lazy: true,
        lazyPlaceholder: Loader
      }}
    >

      {(categories && categories.length > 0) ?

        categories.map(index => (
          <MaterialTopTabs.Screen
            name={index.title}
            component={NewsByCategory}
            key={index.title}
            navigationKey={index.title}
          />
        ))

        :

        <MaterialTopTabs.Screen
          name="Loading"
          component={Loader}
          key="Loading"
          listeners={{
            focus: (e) => {
              // e: {"type":"focus","target":"Loading-0FEAQip6omcpNRRs8SLMI"}
              // console.log('state changed e: ' + JSON.stringify(e));
              callGetArticlesHelper()

              async function callGetArticlesHelper() {
                try {
                  const news = await getArticlesHelper();
                  // console.log('callGetArticlesHelper - news: ' + JSON.stringify(news));

                  if (news && news['articles']) 
                  {
                    return true
                  } else if (news && news.error) {
                    throw new Error("callGetArticlesHelper news.error: " + news.error);
                  } else {
                    throw new Error("There was an issue getting article data");
                  }
                }
                catch (e) {
                  console.log(`callGetArticlesHelper error: ${e}`)
                  return false
                }
              }

            },
          }}
        />
      }
    </MaterialTopTabs.Navigator>
  );
};


BottomTabs = (props) => {
  const isUserConnected = useSelector(isUserConnectedSelector);
  const dispatch = useDispatch();
  return (
    <MaterialBottomTabs.Navigator
      barStyle={{
        height: 72,
      }}
      id={'BottomTabs'}
      initialRouteName={"Home"}
      initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
    >
      <MaterialBottomTabs.Screen
        name="Home"
        component={TopTabs}
        options={props => ({
          ...stackScreenOptions(props),
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
          tabBarIcon: ({ color }) => (
            <Feather name="bell" color={color} size={26} />
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


export default CreateRootStack;


