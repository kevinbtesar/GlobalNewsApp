
    import { addNewsToFavorites, removeNewsFromFavorites } from '../../store/newsStore/newsStore.actions';
    import { loginModalVisible } from '../../store/userStore/userStore.actions';
    import Api from '../../utils/Api';
  
    export const onClickFavoriteIcon = async (props, isUserConnected, userData, dispatch, isInFavorites) => {
        // console.log("route2: " + JSON.stringify(route))
        // console.log("props: " + JSON.stringify(props))
        // console.log("props.article: " + JSON.stringify(props.article))

        const { article, style, route } = props
        const { article_id, title, image_url, created_utc, source, author, url, } = props.article


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
                        createdUtc: created_utc,
                        author: author,
                        url: url,
                    });
                    // console.log("favorite: " + JSON.stringify(favorite))
                    if (favorite.success) {
                        dispatch(addNewsToFavorites(article))
                    } else {
                        throw new Error(favorite);
                    }
                }

            } catch (err) {
                throw new Error(err);
                // console.error("FavoritesHelper ERROR err: " + JSON.stringify(err))
            }


        } else {
            dispatch(loginModalVisible(true))
        }
    };
