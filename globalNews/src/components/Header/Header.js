import React, {useState} from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Image, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';;
import { useDispatch, useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { getArticlesHelper } from '../../utils/Api';
import Loader from '../Loader';
import { ActivityIndicator } from 'react-native-paper';

const Header = (props) => {

    // console.log("HERE props:  " +JSON.stringify(props))

    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);
    const { navigation, navigationRef } = props;
    const [refreshing, setRefreshing ] = useState('none');
    
    const onRefresh = async () => {
    
        try {
            setRefreshing('flex');
            const mRootStackNavContainerRefState = navigationRef.getRootState()
            const mTopTabNavigationRefState = mRootStackNavContainerRefState.routes[0].state.routes[0].state
            const mRouteName = mTopTabNavigationRefState?.routeNames[mTopTabNavigationRefState.index] ?? 'Home'
            const news = await getArticlesHelper()

            setRefreshing('none')
            
            if (news && news.error) {
                throw new Error(news.error);
            } else if(!news) {
                throw new Error("There was an issue getting article data");
            }
            
        } catch (e) {
            console.error('Error', JSON.stringify(e));
            setRefreshing('none')
        }
        setRefreshing('none')
    }

    if (navigationRef.isReady()) {

        // console.log("HERE topTabNavigationRefState:  " +JSON.stringify(navigationRef))
        const rootStackNavContainerRefState = navigationRef.getRootState()
        const topTabNavigationRefState = rootStackNavContainerRefState.routes[0].state.routes[0].state
        // const routeName = topTabNavigationRefState?.routeNames[topTabNavigationRefState.index] ?? 'Home'
        const routeName = getFocusedRouteNameFromRoute(navigation.getState().routes[0]) ?? 'Home'
        // console.log("HERE rootStackNavContainerRefState: " + JSON.stringify(topTabNavigationRefState))
        // console.log("HERE routeName:  " +routeName)
        // console.log("HERE rootStackNavContainerRefState?.routes[0]:  " +JSON.stringify(rootStackNavContainerRefState?.routes[0].state.routes[0]))
        // console.log("HERE navigation.getState():  " +JSON.stringify(navigation.getState().index))
        // console.log("refreshing0 : " + refreshing)

        if (props.side == 'right') {
            return (
                isUserConnected ?

                    <View style={{flexDirection: "row",  justifyContent:  'flex-end'}}>
                        
                        <Image
                            style={{ width: 40, height: 40, borderRadius: 35, marginEnd:10}}
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
                            { navigation?.getState().index == 1 ? 
                                topTabNavigationRefState?.routeNames[topTabNavigationRefState.index] : routeName ?? 'Home'
                            }
                        </Text>
                        
                        {(routeName != 'Favorites' && routeName != 'Settings') ? (
                            <>
                                <ActivityIndicator display={refreshing} style={styles.activityIndicator} />
                     
                                <TouchableOpacity onPress={() => onRefresh()}>
                                    <MaterialCommunityIcons
                                        style={{...styles.activityIndicator, display: (refreshing=='none' ? 'flex' : 'none')}}
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
        alignItems:'center',
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
        fontWeight:'900',
        marginRight:7,
    }
});

export default Header