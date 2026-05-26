import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';;
import { useDispatch, useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { getArticlesHelper } from '../../utils/Api';
import { ActivityIndicator } from 'react-native-paper';
import GLOBAL from '../../store/globalStore';

const Header = (props) => {

    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);
    const { navigation } = props;
    const [refreshing, setRefreshing] = useState('none');

    useEffect(() => {
        // OneSignal integration is temporarily disabled for RN 0.85 compatibility.
    }, []);

    const onRefresh = async () => {
        setRefreshing('flex')

        if (navigation.getState().routeNames[navigation.getState().index] == 'Article' && GLOBAL.webviewRef?.current) {
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

                navigation.navigate('BottomTabs', { screen: 'Home' })
            } catch (e) {
                console.error('Error', JSON.stringify(e));
                setRefreshing('none')
            }
        }
    }

    const routeName = getFocusedRouteNameFromRoute(navigation.getState().routes[0]) ?? 'Home'

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
                <View style={styles.rightSideContainer}>
                    <TouchableOpacity style={styles.rightSideContainer} onPress={() => dispatch(loginModalVisible(true))}>
                        <MaterialCommunityIcons name="login" color={Colors.white} size={25} />
                        <Text style={styles.rightSideText}>{'Login'}</Text>
                    </TouchableOpacity>
                </View>
        )
    }

    return (
        <View style={styles.leftSideContainer} >
            <Text style={styles.headerText}>{routeName ?? 'Home'}</Text>

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
    )
}

const styles = StyleSheet.create({
    activityIndicator: {},
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