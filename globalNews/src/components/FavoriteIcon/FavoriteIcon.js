import React from 'react'
import { TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { addNewsToFavorites, removeNewsFromFavorites } from '../../store/newsStore/newsStore.actions';
import { favoritesSelector } from '../../store/newsStore/newsStore.selectors';
import Colors from '../../utils/Colors';
import { loginModalVisible } from '../../store/userStore/userStore.actions';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import Api from '../../utils/Api';

const FavoriteIcon = (props) => {
    const { article, style, route } = props
    const { article_id, title, image_url, created_utc, source, author, } = props.article
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const favorites = useSelector(favoritesSelector);
    // const isInFavorites = isUserConnected && favorites.findIndex(f => f.title === title) !== -1
    const isInFavorites = isUserConnected && favorites.findIndex(f => f.article_id === article_id) !== -1
    const userData = useSelector(getUserDataSelector);

    const onClickFavoriteIcon = async () => {
        // console.log("route2: " + JSON.stringify(route))
        // console.log("props.article: " + JSON.stringify(props.article))

        if (isUserConnected && userData.accessToken) {
            try {
                if (isInFavorites) {

                    const favorite = await Api.favorites({
                        accessToken: userData.accessToken,
                        action: 'delete',
                        articleId: article_id,
                    });
                    // console.log("favorite: " + JSON.stringify(favorite))
                    if (favorite.success) {
                        dispatch(removeNewsFromFavorites(article_id))
                    } else {
                        throw new Error(favorite);
                    }

                } else {

                    const favorite = await Api.favorites({
                        accessToken: userData.accessToken,
                        action: 'create',
                        articleId: article_id,
                        title: title,
                        imageUrl: image_url,
                        source: source,
                        category: route.name,
                        publishedAt: created_utc,
                        author: author,
                    });

                    if (favorite.success) 
                    {
                        dispatch(addNewsToFavorites(article))
                    } else {
                        throw new Error(favorite);
                    }
                }

            } catch (err) {
                console.error("Favorites ERROR err: " + JSON.stringify(err))
            }


        } else {
            dispatch(loginModalVisible(true))
        }
    }
    return (
        <>
            <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={onClickFavoriteIcon}>
                <AntDesign name="hearto" color={isInFavorites ? Colors.dark_pink : Colors.dark_grey} size={28} />
            </TouchableOpacity>
        </>
    )
};

const styles = StyleSheet.create({
    favoriteIcon: {
        // position: 'absolute',
        // alignItems: 'center',
        // borderRadius: 50,
        // zIndex: 9,
        // paddingTop: 0,
        paddingRight: 5,
    }
});

export default FavoriteIcon