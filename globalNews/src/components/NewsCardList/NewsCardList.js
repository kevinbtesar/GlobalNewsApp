import React, { useState, useCallback } from 'react'
import { RefreshControl, FlatList, View } from "react-native";
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { NewsCard } from '..';
import { getArticlesHelper } from '../../utils/Api';
import { favoritesSelector, articlesSelector } from '../../store/newsStore/newsStore.selectors';

const NewsCardList = (props) => {
    // console.log('NewsCardList props: ' + JSON.stringify(props))
    // const { navigation } = props;
    // console.log('navigation: ' + JSON.stringify(navigation.getState()))
    const renderNewsCardItem = ({ item, index }) => (<NewsCard article={item} {...props} />)
    const [refreshing, setRefreshing] = useState(false);
    let favorites = useSelector(favoritesSelector);
    let articles = useSelector(articlesSelector);
    articles = filterArticles(articles, props.route.name)
    const [articlesState, setArticlesState] = useState(articlesState);
    const onRefresh = useCallback(async () => {

        try {
            setRefreshing(true);
            const news = await getArticlesHelper();

            if (news && news.error) {
                throw new Error(news.error);
            } else if (!news) {
                throw new Error("There was an issue getting article data");
            }

            articlesArray = Object.keys(news['articles']).map(k => news['articles'][k])
            
            let returnArray = filterArticles(articlesArray)
            setArticlesState(returnArray)
            setRefreshing(false)

        } catch (e) {
            console.error('NewsCardList onRefresh Error', JSON.stringify(e));
            setRefreshing(false)
        }

    }, []);


    useFocusEffect(
        React.useCallback(() => 
        {
            let articlesArray = Object.keys(articles).map(k => articles[k]) ?? []
            let returnArray = filterArticles(articlesArray)
            setArticlesState(returnArray)
        }, [])
    );

    // console.log("HERE fav: " + JSON.stringify(store.getState().news.favorites))
    // console.log("HERE fav: " + JSON.stringify(favorites))
    // console.log("HERE props.news: " + JSON.stringify(props.news))

    return (

        <View style={{ flex: 1 }}>

            <FlatList
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

    function filterArticles(articlesArray)
    {
        let returnArray = []
    
        // console.log('newscarelist articlesArray: ' + JSON.stringify(articlesArray))
        // console.log("newscarelist appCategory: " + props.route.name)
    
        for (let i = 0; i <= articlesArray.length; i++) {
    
            // console.log(' props.route.name: ' +  props.route.name)
            if (articlesArray[i] && articlesArray[i].app_category && articlesArray[i].app_category == props.route.name) {
    
                // console.log('newscarelist val: ' + articlesArray[i].app_category)
                returnArray.push(articlesArray[i])
                // console.log('returnArray : ' + JSON.stringify(returnArray))
            }
        }
    
        return returnArray
        
    }
};

export default NewsCardList


