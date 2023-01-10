import React, {useState} from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';;
import { useDispatch, useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import api from '../../utils/Api';
import Loader from '../Loader';

const Header = (props) => {

    // console.log("HERE props:  " +JSON.stringify(props))

    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);
    const { navigation, navigationRef } = props;
    const [refreshing, setRefreshing ] = useState('none');

    const onRefresh = async () => {
    
        try {
            const mRootStackNavContainerRefState = navigationRef.getRootState()
            const mTopTabNavigationRefState = mRootStackNavContainerRefState.routes[0].state.routes[0].state
            const mRouteName = mTopTabNavigationRefState?.routeNames[mTopTabNavigationRefState.index] ?? 'Home'
            
            // console.log("mRouteName : " + mRouteName)
            
            setRefreshing('flex');
            // console.log("refreshing : " + refreshing)
    
            const news = await api.getArticlesHelper(mRouteName);

            // console.log("news : " + JSON.stringify(news))

            if (news && news['articles']) {
                setRefreshing('none')
            } else if (news && news.error) {
                throw new Error(news.error);
            } else {
                throw new Error("There was an issue getting article data");
            }

            setRefreshing('none')

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
                            style={{ width: 40, height: 40, borderRadius: 35 }}
                            source={{ uri: userData.image, cache: "force-cache" }}
                        />

                        <TouchableOpacity style={styles.leftSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
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
            // <View style={{ flexDirection: "row", flexWrap: "wrap" }} >
            
            return (
                <>
                
                    <View style={{flexDirection: 'row', alignItems:'center', }} >
                        <Text style={styles.headerText}>
                            { navigation?.getState().index == 1 ? 
                                topTabNavigationRefState?.routeNames[topTabNavigationRefState.index] : routeName ?? 'Home'
                            }
                        </Text>
                        
                        {(routeName != 'Favorites' && routeName != 'Settings') ? (

                            ( refreshing === 'flex' ) ? ( 
                                <Loader display={refreshing} align={'flex-start'} />
                        
                            ):(
                                <TouchableOpacity onPress={() => onRefresh(refreshing)}>
                                    <MaterialCommunityIcons
                                        style={{display: (refreshing=='none' ? 'flex' : 'none')}}
                                        name={'refresh'}
                                        color={Colors.white}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            )

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
    rightSideContainer: {
        alignItems: 'center',
        paddingRight: 13,
    },
    
    leftSideContainer: {
        alignItems: 'center',
        paddingLeft: 10,
        fontSize: 12,
        alignSelf: "flex-start"
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