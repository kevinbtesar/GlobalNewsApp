import React, { useState } from 'react'
import { RefreshControl, FlatList, View } from "react-native";

import { NewsCard } from '..';
import { getArticlesHelper } from '../../utils/Api';


const NewsCardList = (props) => {

    const renderNewsCardItem = ({ item, index }) => (<NewsCard article={item} {...props} />)
    const [refreshing, setRefreshing] = useState(false);
    const [ state, setState] = useState(false);
    const onRefresh = React.useCallback(async () => {

        try {
            // setRefreshing(true);
            const news = await getArticlesHelper(props.route.name);
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
                setState({ news: newsArray });
            setRefreshing(false)

        } catch (e) {
            console.error('Error', JSON.stringify(e));
            setRefreshing(false)
        }

    }, []);

    return (

        <View style={{ flex: 1 }}>

            <FlatList
                horizontal={false}
                style={{ paddingTop: 0 }}
                data={state.news ?? props.news}
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



