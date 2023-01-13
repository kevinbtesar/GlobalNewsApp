import React, { useState, useEffect, useCallback } from 'react'
import { RefreshControl, FlatList, View } from "react-native";
import { useSelector } from 'react-redux';
import { NewsCard } from '..';
import { useFocusEffect } from '@react-navigation/native';

import getArticlesHelper from '../../utils/Api';
import { favoritesSelector, articlesSelector } from '../../store/newsStore/newsStore.selectors';
import GLOBAL from '../../store/globalStore';

const NewsCardList = (props) => {
    console.log('NewsCardList props: ' + JSON.stringify(props))
    const { navigation } = props;
    // console.log('navigation: ' + JSON.stringify(navigation.getState()))
    const renderNewsCardItem = ({ item, index }) => (<NewsCard article={item} {...props} />)
    const [refreshing, setRefreshing] = useState(false);
    let favorites = useSelector(favoritesSelector);
    let articles = useSelector(articlesSelector);
    var articlesArray = [], returnArray = []
    const [articlesState, setArticlesState] = useState([]);

    const onRefresh = useCallback(async () => {

        try {
            setRefreshing(true);
            // console.log("NewsCardList name: " + props.route.name)
            // console.log("articles: " + articles)
            const news = await getArticlesHelper(props.route.name);
            setRefreshing(false)

            if (news && news.error) {
                throw new Error(news.error);
            } else if (!news) {
                throw new Error("There was an issue getting article data");
            }

        } catch (e) {
            console.error('Error', JSON.stringify(e));
            setRefreshing(false)
        }

    }, []);


    useFocusEffect(
        React.useCallback(() => {
            articlesArray = Object.keys(articles).map(k => articles[k])

            console.log(articlesArray.length)
            // console.log('newscarelist articles: ' + JSON.stringify(articles))
            // console.log('newscarelist articlesArray: ' + JSON.stringify(articlesArray))
            for (let i = 0; i <= articlesArray.length; i++) {

                console.log(' props.route.name: ' +  props.route.name)
                if (articlesArray[i] && articlesArray[i].app_category&& articlesArray[i].app_category == props.route.name) {

                    console.log('newscarelist val: ' + articlesArray[i].app_category)
                    returnArray.push(articlesArray[i])
                    // console.log('returnArray : ' + JSON.stringify(returnArray))

                }




            }
            articlesArray = returnArray

            setArticlesState(articlesArray)
        }, [])
    );


    // console.log("HERE fav: " + JSON.stringify(store.getState().news.favorites))
    // console.log("HERE fav: " + JSON.stringify(favorites))
    // console.log("HERE props.news: " + JSON.stringify(props.news))
    console.log('NewsCardList articlesArray' + JSON.stringify(articlesArray))

    return (

        <View style={{ flex: 1 }}>

            <FlatList
                ref={(list) => GLOBAL.flatlist = list}
                horizontal={false}
                style={{ paddingTop: 0 }}
                data={articlesState}
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



