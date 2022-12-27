import React from 'react'
import { TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';

import { favoritesSelector } from '../../store/newsStore/newsStore.selectors';
import Colors from '../../utils/Colors';
import { isUserConnectedSelector, getUserDataSelector } from '../../store/userStore/userStore.selectors';
import { onClickFavoriteIcon } from '../../screens/Favorites/FavoritesHelper';

const FavoriteIcon = (props) => {
    const { article } = props
    const { article_id } = article
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const favorites = useSelector(favoritesSelector);
    const isInFavorites = favorites.findIndex(f => f.article_id === article_id) !== -1
    const userData = useSelector(getUserDataSelector);

    return (
        <>
            <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={() => onClickFavoriteIcon(props, isUserConnected, userData, dispatch, isInFavorites)}>
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

export default FavoriteIcon;
