
    import { addNewsToFavorites, removeNewsFromFavorites } from '../../store/newsStore/newsStore.actions';
    import { loginModalVisible } from '../../store/userStore/userStore.actions';
    import { favorites } from '../../utils/Api';
  
    export const onClickFavoriteOverflowMenuOption = async (props, isUserConnected, userData, dispatch, isInFavorites) => {
        // console.log("route2: " + JSON.stringify(route))
        // console.log("props: " + JSON.stringify(props))
        // console.log("props.article: " + JSON.stringify(props.article))

        const { article, style, route } = props
        const { id, reddit_article_id, title, image_url, created_utc, source, author, url, } = article


        if (isUserConnected && userData.accessToken) {
            try {
                if (isInFavorites) {

                    const favorite = await favorites({
                        accessToken: userData.accessToken,
                        action: 'delete',
                        id: id,
                    });
                    // console.log("favorite: " + JSON.stringify(favorite))
                    if (favorite.success) {
                        dispatch(removeNewsFromFavorites(id))
                    } else {
                        throw new Error(favorite);
                    }

                } else {
                    console.log("article: " + JSON.stringify(article))
                    
                    const favorite = await favorites({
                        accessToken: userData.accessToken,
                        action: 'create',
                        id: id,
                    });

                    if (favorite.success) {
                        dispatch(addNewsToFavorites(article))
                    } else {
                        throw new Error(favorite);
                    }
                }

            } catch (err) {
                throw new Error(JSON.stringify(err));
                // console.error("FavoritesHelper ERROR err: " + JSON.stringify(err))
            }


        } else {
            dispatch(loginModalVisible(true))
        }
    };
