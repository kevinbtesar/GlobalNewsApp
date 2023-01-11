import React, { useState } from 'react'
import { RefreshControl, FlatList, View } from "react-native";
import { useSelector } from 'react-redux';
import { NewsCard } from '..';

import getArticlesHelper from '../../utils/Api';
import { favoritesSelector, articlesSelector } from '../../store/newsStore/newsStore.selectors';
import GLOBAL from '../../store/globalStore';

const NewsCardList = (props) => {

    const renderNewsCardItem = ({ item, index }) => (<NewsCard article={item} {...props} />)
    const [refreshing, setRefreshing] = useState(false);
    let favorites = useSelector(favoritesSelector);
    let articles = useSelector(articlesSelector);
    
    const onRefresh = React.useCallback(async () => 
    {

        try {
            setRefreshing(true);
            // console.log("NewsCardList name: " + props.route.name)
            // console.log("articles: " + articles)
            const news = await getArticlesHelper(props.route.name);
            setRefreshing(false)

            if (news && news.error) {
                throw new Error(news.error);
            } else if(!news){
                throw new Error("There was an issue getting article data");
            }

        } catch (e) {
            console.error('Error', JSON.stringify(e));
            setRefreshing(false)
        }

    }, []);

// console.log("HERE fav: " + JSON.stringify(store.getState().news.favorites))
// console.log("HERE fav: " + JSON.stringify(favorites))
// console.log("HERE props.news: " + JSON.stringify(props.news))


    return (

        <View style={{ flex: 1 }}>

            <FlatList
                ref={(list) => GLOBAL.flatlist = list}
                horizontal={false}
                style={{ paddingTop: 0 }}
                data={articles}
                extraData={favorites}
                initialNumToRender={5}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderNewsCardItem}
                removeClippedSubviews={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

        </View>
    )
};

export default NewsCardList



