import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-paper';

import { removeAllNotifications } from '../../store/newsStore/newsStore.actions';
import { notificationsSelector } from '../../store/newsStore/newsStore.selectors';
import { NewsCardList, NoResults } from '../../components';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { TEXT_STRINGS } from '../../data/Enums';

const Notifications = (props) => {
    const dispatch = useDispatch();
    const notifications = useSelector(notificationsSelector);
    console.log("props: " + JSON.stringify(props))
    console.log("notifications: " + JSON.stringify(notifications))
    const onClickDeleteAll = async () => {
        // console.log("route2: " + JSON.stringify(route))
        // console.log("props.article: " + JSON.stringify(props.article))
        dispatch(removeAllNotifications())
    }

    return (
        <>
            <LinearGradient start={{ x: 1, y: 1 }} end={{ x: 1, y: .7 }} colors={[Colors.off_white, Colors.yellow]} style={styles.toolBarLine}>
                {/* <View style={styles.toolBarTextContainer} >
                    <Text style={styles.toolBarText}>{`You saved ${notifications.length ? notifications.length : 0} articles`}</Text>
                </View> */}
                <TouchableOpacity style={[styles.toolBarButton, !notifications.length && { backgroundColor: Colors.black_opacity }]} onPress={() => onClickDeleteAll()} disabled={!notifications.length}>
                    <Text style={styles.toolBarText}>{`🗑 Remove All Notifications`}</Text>
                </TouchableOpacity>
            </LinearGradient>
            
            {/* Keep as placeholder. Change to if user has not subscribed to notifications
            
            {!isUserConnected ?
                <TouchableWithoutFeedback onPress={onPressSignInButton} style={{flexDirection:'row', marginTop:30, alignItems:'center', alignSelf:'center'}}>
                    <View style={{flexDirection:'row', marginTop:30, alignItems:'center', alignSelf:'center'}}>
                        <Button style={{width:118}} mode="contained" >{TEXT_STRINGS.FAVORITES_TEXT_FIRST}</Button>
                        <Text >{TEXT_STRINGS.FAVORITES_TEXT_SECOND}</Text>
                    </View>
            </TouchableWithoutFeedback> 

            :*/}{ notifications.length > 0  ?

                <NewsCardList notifications={notifications} navigation={props.navigation} />
            :
                <NoResults text={'You have no new notifications'} fontSize={26} color={Colors.yellow}>
                    <TouchableOpacity style={styles.navigateButton} onPress={() => props.navigation.navigate('Home')} >
                        <Text style={styles.navigateButtonText}>{'Go to Home Screen'}</Text>
                    </TouchableOpacity>
                </NoResults>
            }
       
        </>
    )
};

const styles = StyleSheet.create({
    toolBarLine: {
        backgroundColor: Colors.yellow,
        paddingTop: 10,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    toolBarButton: {
        flex: 0.42,
        borderColor: Colors.black_opacity,
        backgroundColor: Colors.off_white,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderRadius: 4,
        paddingVertical: 5,
    },
    toolBarTextContainer: {
        flex: 0.42,
        paddingVertical: 5,
    },
    toolBarText: {
        fontSize: 16,
        fontFamily: Fonts.KBWriterThin,
        textAlign: 'center',
        
    },
    navigateButton: {
        marginTop: 20,
        alignSelf: 'center',
        width: '50%',
        borderColor: Colors.black_opacity,
        backgroundColor: Colors.yellow,
        borderWidth: 1,
        borderBottomWidth: 4,
        borderRightWidth: 3,
        borderRadius: 4,
        padding: 7,
    },
    navigateButtonText: {
        fontSize: 20,
        textAlign: 'center',
        color: Colors.white
    },
});

export default Notifications