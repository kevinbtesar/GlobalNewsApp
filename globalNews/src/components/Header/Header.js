import React, { useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';;
import { useDispatch, useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';

import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { getArticlesHelper } from '../../utils/Api';
import { ActivityIndicator } from 'react-native-paper';
import GLOBAL from '../../store/globalStore';
import { KEYS } from '../../data/Enums';
import { addNewsToNotifications } from '../../store/newsStore/newsStore.actions';

const Header = (props) => {

    // console.log("HERE props:  " +JSON.stringify(props))

    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);
    const { navigation, navigationRef } = props;
    const [refreshing, setRefreshing] = useState('none');


    const initialOnesignal = async () => {


        // OneSignal Initialization
        OneSignal.setRequiresUserPrivacyConsent(false);
        OneSignal.setAppId(KEYS.ONESIGNAL_APP_ID);
        //   OneSignal.setLogLevel(6, 0);

        //Method for handling notifications opened
        OneSignal.setNotificationOpenedHandler(notification => {
            // console.log('OneSignal: notification opened: ', JSON.stringify(notification.notification?.additionalData));
            // console.log('OneSignal: notification opened: ', JSON.stringify(notification.notification?.additionalData.title));

            if(notification.notification.additionalData){
                const article = {
                    title: notification.notification?.additionalData.title,
                    image_url: notification.notification?.additionalData.image_url,
                    source: notification.notification?.additionalData.source,
                    app_category: notification.notification?.additionalData.app_category,
                    created_utc: notification.notification?.additionalData.created_utc,
                    url: notification.notification?.additionalData.url,
                    reddit_article_id: notification.notification?.additionalData.reddit_article_id,
                    id: notification.notification?.additionalData.id,
                };

                // console.log("header article: " + JSON.stringify(article))

                dispatch(addNewsToNotifications(article))

                navigation.navigate('Notifications')
            } else {
                // TODO: Show error message
            }
    
            
        });

        // let state = await OneSignal.getDeviceState();
        // console.log("state: " + JSON.stringify(state))
    };

    const onRefresh = async () => {
        setRefreshing('flex')

        if (navigation.getState().routeNames[navigation.getState().index] == 'Article') {
            GLOBAL.webviewRef.current.reload()
            setRefreshing('none')

        } else {
            try {
                const news = await getArticlesHelper()
                setRefreshing('none')

                if (news && news.error) {
                    throw new Error(news.error);
                } else if (!news) {
                    throw new Error("There was an issue getting article data");
                }

                /**
                 * Following section is used to filter in new articles and filter out old articles from feed
                 */

                const rootStackNavContainerRefState = navigationRef.getRootState()
                const topTabNavigationRefState = rootStackNavContainerRefState.routes[0].state.routes[0].state
                let currentTobTabName = topTabNavigationRefState.routeNames[topTabNavigationRefState.index]
                // console.log("Header onRefresh topTabNavigationRefState:  " + JSON.stringify(topTabNavigationRefState))
                // console.log("Header onRefresh currentTobTabName:  " +JSON.stringify(rootStackNavContainerRefState?.routes[0].state.routes[0]))    
                navigation.navigate('BottomTabs', { screen: 'Home', params: { screen: currentTobTabName } })

            } catch (e) {
                console.error('Error', JSON.stringify(e));
                setRefreshing('none')
            }
        }

    }

    if (navigationRef.isReady()) {
        // console.log("HERE topTabNavigationRefState:  " +JSON.stringify(navigationRef.current))
        const topTabNavigationRefState = navigationRef.getRootState().routes[0].state.routes[0].state
        // const routeName = topTabNavigationRefState?.routeNames[topTabNavigationRefState.index] ?? 'Home'
        const routeName = getFocusedRouteNameFromRoute(navigation.getState().routes[0]) ?? 'Home'
        // console.log("HERE topTabNavigationRefState: " + JSON.stringify(topTabNavigationRefState))
        // console.log("HERE routeName:  " +routeName)

        // console.log("HERE navigation.getState():  " +JSON.stringify(navigation.getState()))
        // console.log("HERE navigation.getState().routNames[index]:  " +JSON.stringify(navigation.getState().routeNames[navigation.getState().index]))
        // console.log("refreshing0 : " + refreshing)

        initialOnesignal();

        if (props.side == 'right') {
            return (
                isUserConnected ?

                    <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>

                        <Image
                            style={{ width: 40, height: 40, borderRadius: 35, marginEnd: 10 }}
                            source={{ uri: userData.image, cache: "force-cache" }}
                        />

                        <TouchableOpacity style={styles.rightSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
                            <MaterialCommunityIcons name="logout" color={Colors.white} size={20} />
                            <Text style={styles.rightSideText}>{'Logout'}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    (
                        <View style={styles.rightSideContainer}>
                            <TouchableOpacity style={styles.rightSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
                                <MaterialCommunityIcons name="login" color={Colors.white} size={25} />
                                <Text style={styles.rightSideText}>{'Login'}</Text>
                            </TouchableOpacity>
                        </View>
                    )
            )
        } else {

            return (
                <>

                    <View style={styles.leftSideContainer} >
                        <Text style={styles.headerText}>
                            {navigation?.getState().index == 1 ?
                                topTabNavigationRefState?.routeNames[topTabNavigationRefState.index] : routeName ?? 'Home'
                            }
                        </Text>

                        {(routeName != 'Favorites' && routeName != 'Settings' && routeName != 'Notifications') ? (
                            <>
                                <ActivityIndicator display={refreshing} style={styles.activityIndicator} />

                                <TouchableOpacity onPress={() => onRefresh()}>
                                    <MaterialCommunityIcons
                                        style={{ ...styles.activityIndicator, display: (refreshing == 'none' ? 'flex' : 'none') }}
                                        name={'refresh'}
                                        color={Colors.white}
                                        size={25}
                                    />
                                </TouchableOpacity>

                            </>
                        ) : <></>}
                    </View>

                </>

            )
        }
    }



}




const styles = StyleSheet.create({
    // rightSideProfileContainer: {
    //     alignItems: 'flex-end',
    //     paddingRight: 1,
    //     flex: 1,
    //     fontSize: 12,
    //     width:'50%',
    // },
    activityIndicator: {
        // paddingTop:2
    },
    rightSideContainer: {
        alignItems: 'center',
        paddingRight: 5,
    },

    leftSideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 12,
    },
    rightSideText: {
        color: Colors.white,
        height: 20,
    },
    headerText: {
        tintColor: '#fff',
        fontSize: 20,
        color: 'white',
        fontWeight: '900',
        marginRight: 7,
    }
});

export default Header