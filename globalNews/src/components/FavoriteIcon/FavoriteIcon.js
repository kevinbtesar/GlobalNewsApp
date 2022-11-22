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
    const { article, style } = props
    const { title, id } = props.article
    const dispatch = useDispatch();
    const isUserConnected = useSelector(isUserConnectedSelector);
    const favorites = useSelector(favoritesSelector);
    const isInFavorites = isUserConnected && favorites.findIndex(f => f.title === title) !== -1
    const userData = useSelector(getUserDataSelector);
    this.state = {
        error: false,
    };
    const onClickFavoriteIcon = async () => 
    {
        if (isUserConnected && userData.accessToken) 
        {
            try {
                if (isInFavorites) 
                {
                    const favorite = await Api.favorites({ accessToken: userData.accessToken, action: 'delete', articleId: id });

                    if(favorite.success){
                        dispatch(removeNewsFromFavorites(title))
                    }else {
                        
                        throw new Error("onClickFavoriteIcon() -> isInFavorites ERROR: " + JSON.stringify(favorite));
                    }
                    
                } else {
                    
                    const favorite = await Api.favorites({ accessToken: userData.accessToken, action: 'create', articleId: id });

                    if(favorite.success){
                        dispatch(addNewsToFavorites(article))
                    } else {
 
                        throw new Error("onClickFavoriteIcon() -> !isInFavorites ERROR: " + JSON.stringify(favorite));
                    }
                }

            } catch (err){
                console.error("ERROR err: " + JSON.stringify(err))
            }

            
        } else {
            dispatch(loginModalVisible(true))
        }
    }
    return (
        <>
            <TouchableOpacity
                onPress={onClickFavoriteIcon}>
                <AntDesign name="hearto" color={isInFavorites ? Colors.dark_pink : Colors.dark_grey} size={28} />
            </TouchableOpacity>
        </>
    )
};

const styles = StyleSheet.create({
    favoriteIcon: {
        position: 'absolute',
        alignItems: 'center',
        borderRadius: 50,
        zIndex: 9,
        paddingTop: 0,
    }
});

export default FavoriteIcon