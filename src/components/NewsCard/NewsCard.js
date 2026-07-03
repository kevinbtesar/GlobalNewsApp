/**
 * @format
 * @flow
 */
import React from 'react';
import { StyleSheet, View, Image } from "react-native";
import { Card, Headline, Caption, TouchableRipple } from 'react-native-paper';
import moment from 'moment';
// import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Fonts from '../../utils/Fonts';
import Colors from '../../utils/Colors';
// import { FavoriteIcon } from '..';
import { OverflowMenu } from '..';
import { initializeShare } from '../../utils/Share';
// import { onClickFavoriteIcon } from '../FavoriteIcon/FavoriteIcon';

import { removeNewsFromNotifications } from '../../store/newsStore/newsStore.actions';
import { favoritesSelector } from '../../store/newsStore/newsStore.selectors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import Api from '../../utils/Api';
import { onClickFavoriteOverflowMenuOption } from '../../screens/Favorites/FavoriteOverflowHelper';


const NewsCard = (props) => {

    const { article, navigation } = props
    const { title, image_url, source, created_utc, id } = article
    // console.log("props: " + JSON.stringify(props))
    // const navigationState = navigation.getState()
    // console.log("name1: " + (props.route ? JSON.stringify(props.route.name) : ''))
    // console.log("name2: " + JSON.stringify(navigationState.routes[navigationState.index].name))

    const overflowDotsIcon = (<MaterialCommunityIcons name="dots-vertical" size={28} />)
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const favorites = useSelector(favoritesSelector);
    const isInFavorites = isUserConnected && favorites.findIndex(f => f.id === id) !== -1
    const userData = useSelector(getUserDataSelector);
    // const noImageAvailable = 'https://www.bengi.nl/wp-content/uploads/2014/10/no-image-available1.png'

    let options = ["Add Favorite", "Share Article", "Report Article"]
    if (isInFavorites) {
        options = ["Remove Favorite", "Share Article", "Report Article"]
    }
    if(props.notifications){
        options = [ 'Remove Notification', ...options,]
    }

    const removeNotificationArticle = () => {
        dispatch(removeNewsFromNotifications(id))
        console.log("props.article: " + JSON.stringify(id))
    };
    

    /**
     * Custom protection to never let an article card appear without an accompanying image
     */
    if (image_url) {

        
        return (
            <Card style={styles.cardContainer}>
                <TouchableRipple
                    onPress={() => navigation.navigate('Article', {
                        url: props.article.url,
                    })}
                    rippleColor={Colors.black_opacity}
                >
                    <>
                        <Image source={{ uri: image_url /*|| noImageAvailable*/, cache: "force-cache" }} opacity={1.0} style={styles.image} />

                        <Card.Content>
                            <Headline style={styles.title} numberOfLines={3}>{title}</Headline>


                            <View style={styles.userActionRow}>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }} >


                                    <View style={{ ...styles.sourceAndDate, flexDirection: "column" }}>
                                        <Caption >{moment(moment.unix(created_utc)).format("MM.DD.YYYY")}</Caption>
                                        <Caption numberOfLines={1} style={styles.sourceText}>{source}</Caption>
                                    </View>


                                    {/* <FavoriteIcon style={{ paddingRight: 5 }} article={article} color={Colors.dark_grey} route={route} />
 
                                     <TouchableOpacity
 
                                         onPress={() => initializeShare(props.article.title, props.article.source)}>
                                         <AntDesign name="sharealt" size={28} />
 
                                     </TouchableOpacity> */}


                                    <View style={{ justifyContent: "space-evenly" }} >
                                        <OverflowMenu
                                            customButton={overflowDotsIcon}
                                            destructiveIndex={1}
                                            options={options}
                                            //  actions={[blockSource, reportArticle]}
                                            // actions={[() => onClickFavoriteIcon(props), () => initializeShare(props.article.title, props.article.source)]}
                                            actions={[
                                                ()=> removeNotificationArticle(),
                                                () => onClickFavoriteOverflowMenuOption(props, isUserConnected, userData, dispatch, isInFavorites), 
                                                () => initializeShare(props.article.title, props.article.source), 
                                                ()=>{}, // TODO: make report feature work
                                            ]}
                                        />
                                    </View>

                                </View>
                            </View>

                        </Card.Content>
                    </>
                </TouchableRipple>
            </Card>
        )
    }
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.light_green,
        alignSelf: 'center',
        borderRadius: 8,
        marginBottom: 16,
        width: '90%'
    },
    title: {
        fontSize: 18,
        lineHeight: 22,
        paddingTop: 8,
        fontWeight: '500',
        paddingBottom: 3,
        width: '90%',
        fontFamily: Fonts.OptimusBold
    },
    userActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        flexWrap: "wrap"
    },
    sourceAndDate: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingVertical: 4,
        width: '90%'
    },
    sourceText: {
        width: '50%'
    },
    image: {
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
});

export default NewsCard