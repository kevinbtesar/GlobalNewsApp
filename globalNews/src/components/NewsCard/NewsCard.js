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

import Fonts from '../../utils/Fonts';
import Colors from '../../utils/Colors';
// import { FavoriteIcon } from '..';
import { OverflowMenu } from '..';
import { initializeShare } from '../../utils/Share';
// import { onClickFavoriteIcon } from '../FavoriteIcon/FavoriteIcon';

import { addNewsToFavorites, removeNewsFromFavorites } from '../../store/newsStore/newsStore.actions';
import { favoritesSelector } from '../../store/newsStore/newsStore.selectors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import Api from '../../utils/Api';
import { onClickFavoriteIcon } from '../../screens/Favorites/FavoritesHelper';


const NewsCard = (props) => {

    const { article, navigation, route } = props
    const { title, /*thumbnail*/image_url, source, created_utc, article_id, author } = article
    // console.log("route: " + JSON.stringify(route))
    // console.log("props: " + JSON.stringify(props))
    // console.log("name: " + props.route ? props.route.name : 'undef')
    const overflowDotsIcon = (<MaterialCommunityIcons name="dots-vertical" size={28} />)
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const favorites = useSelector(favoritesSelector);
    const isInFavorites = isUserConnected && favorites.findIndex(f => f.article_id === article_id) !== -1
    const userData = useSelector(getUserDataSelector);
    // const noImageAvailable = 'https://www.bengi.nl/wp-content/uploads/2014/10/no-image-available1.png'


    let options = ["Add Favorite", "Share Article", "Report Article"]
    if (isInFavorites) {
        options = ["Remove Favorite", "Share Article", "Report Article"]
    }
    

    /**
     * Custom protection to never let an article card appear without an accompanying image
     */
    if (image_url) {

        
        return (
            <Card style={styles.cardContainer}>
                <TouchableRipple
                    onPress={() => navigation.navigate('Article', {
                        title: props.article.title,
                        description: props.article.description,
                        image_url: props.article.image_url,
                        source: props.article.source,
                        category: (props.route) ? props.route.name : '',
                        created_utc: props.article.created_utc,
                        author: props.article.author,
                        article_id: props.article.article_id,
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
                                                () => onClickFavoriteIcon(props, isUserConnected, userData, dispatch, isInFavorites), 
                                                () => initializeShare(props.article.title, props.article.source), 
                                                ()=>{}
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