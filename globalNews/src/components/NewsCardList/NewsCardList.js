import React, { useState } from 'react'
import { RefreshControl, FlatList, StyleSheet, View, useWindowDimensions, ScrollView, SafeAreaView, ParentView,Animated } from "react-native";
import DeviceInfo from 'react-native-device-info';
// import { useDispatch, useSelector } from 'react-redux';

import {
  TabView,
  TabBar,
  SceneMap,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';

import { NewsCard } from '..';
import Api from '../../utils/Api';
import { NewsByCategory, Settings, Article, Favorites } from "../../screens";

// import { articlesSelector, favoritesSelector } from '../../store/newsStore/newsStore.selectors';

const NewsCardList = (props) => {

    const renderNewsCardItem = ({ item, index }) => (<NewsCard article={item} {...props} />)
    const [state, setState] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    // let articles = useSelector(articlesSelector);
    // let newsArray = Object.keys(articles).map(k => articles[k])

    const onRefresh = React.useCallback(async () => {
        try {
            setRefreshing(true);
            const news = await Api.getArticles({ category: 'general', appName: DeviceInfo.getApplicationName() });
            if (news.error) {
                throw new Error(JSON.stringify(news));
            }
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
                setState({ news: newsArray, isLoading: false, error: false });
            setRefreshing(false)

        } catch (err) {
            console.log('Error', err);
            setRefreshing(false)
        }
    }, []);



    
    const [index, onIndexChange] = React.useState(1);
    const [routes] = React.useState([
      { key: 'article', title: 'Article' },
      { key: 'contacts', title: 'Contacts' },
      { key: 'albums', title: 'Albums' },
      { key: 'chat', title: 'Chat' },
    ]);
  
    
    const renderTabBar = (props) => (
      <TabBar
        {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
      />
    );
  
    const renderScene = SceneMap({
      albums: NewsByCategory,
      contacts: Favorites,
      article: NewsByCategory,
      chat: NewsByCategory,
    });


    // setState({
    //     key: '',
    //     string:'',
    // });
    // const layout = useWindowDimensions();

    // _handleIndexChange = (index) => this.setState({ index });

    // _renderTabBar = (props) => {
    //   const inputRange = props.navigationState.routes.map((x, i) => i);
  
    //   return (
    //     <View style={styles.tabBar}>
    //       {props.navigationState.routes.map((route, i) => {
    //         const opacity = props.position.interpolate({
    //           inputRange,
    //           outputRange: inputRange.map((inputIndex) =>
    //             inputIndex === i ? 1 : 0.5
    //           ),
    //         });
  
    //         return (
    //           <TouchableOpacity
    //             style={styles.tabItem}
    //             onPress={() => this.setState({ index: i })}>
    //             <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
    //           </TouchableOpacity>
    //         );
    //       })}
    //     </View>
    //   );
    // };

    return (

        <View style={{ flex: 1 }}>

            {/* <View style={{ height: 200 }}>
            
            <TabView
              lazy
              navigationState={{
                index,
                routes,
              }}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={onIndexChange}
            />
          
            </View> */}

            <FlatList
                horizontal={false}
                style={{ paddingTop: 0 }}
                data={state.news ?? props.news}
                initialNumToRender={5}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderNewsCardItem}

                removeClippedSubviews={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

        </View>
    )
};


NewsCardList.title = 'Scrollable tab bar';
NewsCardList.backgroundColor = '#3f51b5';
NewsCardList.appbarElevation = 0;

export default NewsCardList


const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#3f51b5',
  },
  tab: {
    width: 120,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  label: {
    fontWeight: '400',
  },
});


