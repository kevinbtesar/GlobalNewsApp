import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NewsByCategory, Categories, Article, Favorites } from '../screens';
import Colors from '../utils/Colors';
import Fonts from '../utils/Fonts';
import { Header } from '../components';
import { SCREENS } from '../utils/Enums';
import { useTheme } from 'react-native-paper';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const stackScreenOptions = (props) => ({
  // title: 'Global News',
  headerStyle: {
    backgroundColor: Colors.yellow,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontFamily: Fonts.Walk,
    alignSelf: 'center'
  },
  headerRight: () => <Header side='right' navigation={props.navigation} />,
  headerLeft: () => <Header side='left' navigation={props.navigation} />
})

function NewsStackNavigator() {
  const theme = useTheme();
  
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }} >
        {/* <Stack.Screen name={SCREENS.CATEGORIES} component={Categories}
          options={(props) => ({ ...stackScreenOptions(), headerLeft: () => <Header side='left' /> })} />
        <Stack.Screen name={SCREENS.NEWS_BY_CATEGORY} component={NewsByCategory}
          options={(props) => stackScreenOptions()} /> */}
        
        <Stack.Screen name="RootDrawer" component={RootDrawer} options={{headerShown:false}} />

        <Stack.Screen name={SCREENS.HOME} component={NewsByCategory}
          options={(props) => stackScreenOptions(props)} />
          
        <Stack.Screen name={SCREENS.ARTICLE} component={Article}
          options={(props) => stackScreenOptions(props)} />

        <Stack.Screen name={SCREENS.FAVORITES} component={Favorites}
          options={(props) => stackScreenOptions(props)} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

function RootDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name={SCREENS.HOME} component={NewsByCategory}
        options={(props) => stackScreenOptions(props)} />
      <Drawer.Screen name={SCREENS.FAVORITES} component={NewsByCategory}
        options={(props) => stackScreenOptions(props)} />
      <Drawer.Screen name={SCREENS.SETTINGS} component={NewsByCategory}
        options={(props) => stackScreenOptions(props)} />
      <Drawer.Screen name={SCREENS.NOTIFICATIONS} component={NewsByCategory}
        options={(props) => stackScreenOptions(props)} />
            
      <Drawer.Screen name={SCREENS.ARTICLE} component={Article}
        options={(props) => ({ ...stackScreenOptions(props), drawerItemStyle:{display: 'none' }})} />
        
    </Drawer.Navigator>
  );
}

export default NewsStackNavigator