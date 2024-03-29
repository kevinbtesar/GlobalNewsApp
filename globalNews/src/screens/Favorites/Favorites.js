import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-paper';

import { removeAllFavorites } from '../../store/newsStore/newsStore.actions';
import { favoritesSelector } from '../../store/newsStore/newsStore.selectors';
import { NewsCardList, NoResults } from '../../components';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { favorites } from '../../utils/Api';
import { TEXT_STRINGS } from '../../data/Enums';

const Favorites = (props) => {
    const dispatch = useDispatch();
    const reducerFavorites = useSelector(favoritesSelector);
    const isUserConnected = useSelector(isUserConnectedSelector);
    const userData = useSelector(getUserDataSelector);

    state = {
        isLoading: true,
        error: false,
    };

    const onClickDeleteAll = async () => {
        // console.log("route2: " + JSON.stringify(route))
        console.log("props.article: " + JSON.stringify(props.article))

        if (isUserConnected && userData.accessToken) {
            try {
  
                const favorite = await favorites({
                    accessToken: userData.accessToken,
                    action: 'deleteAll',
                });

                if (favorite.success) 
                {
                    dispatch(removeAllFavorites())
                } else {
                    throw new Error(favorite);
                }

      
            } catch (err) {
                console.error("Favorites ERROR err: " + JSON.stringify(err))
            }
        } else {
            dispatch(loginModalVisible(true))
        }
    }

    const onPressSignInButton = () => {
        dispatch(loginModalVisible(true))
    }

    return (
        <>
            <LinearGradient start={{ x: 1, y: 1 }} end={{ x: 1, y: .7 }} colors={[Colors.off_white, Colors.yellow]} style={styles.toolBarLine}>
                <View style={styles.toolBarTextContainer} >
                    <Text style={styles.toolBarText}>{`You saved ${(reducerFavorites.length && isUserConnected) ? reducerFavorites.length : 0} articles`}</Text>
                </View>
                <TouchableOpacity style={[styles.toolBarButton, !reducerFavorites.length && { backgroundColor: Colors.black_opacity }]} onPress={() => onClickDeleteAll()} disabled={!favorites.length}>
                    <Text style={styles.toolBarText}>{`🗑 Delete All`}</Text>
                </TouchableOpacity>
            </LinearGradient>
            
            {!isUserConnected ?
                <TouchableWithoutFeedback onPress={onPressSignInButton} style={{flexDirection:'row', marginTop:30, alignItems:'center', alignSelf:'center'}}>
                    <View style={{flexDirection:'row', marginTop:30, alignItems:'center', alignSelf:'center'}}>
                        <Button style={{width:118}} mode="contained" >{TEXT_STRINGS.FAVORITES_TEXT_FIRST}</Button>
                        <Text >{TEXT_STRINGS.FAVORITES_TEXT_SECOND}</Text>
                    </View>
                </TouchableWithoutFeedback>

            : reducerFavorites.length > 0  ?

                <NewsCardList favorites={reducerFavorites} navigation={props.navigation} />
            :
                <NoResults text={'You have no favorite news'} fontSize={26} color={Colors.yellow}>
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

export default Favorites