import React, {useState} from 'react'
import { SafeAreaView, RefreshControl, FlatList, StyleSheet } from "react-native";
import DeviceInfo from 'react-native-device-info';

import { NewsCard } from '..';
import Api from '../../utils/Api';

const NewsCardList = (props) => {

    const renderNewsCardItem = ({ item, index }) => (<NewsCard article={item} {...props} />)
    const [ state, setState ] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback( async () => {
        try {
            setRefreshing(true);
            const news = await Api.getArticles({category: 'general', appName: DeviceInfo.getApplicationName});
            if (news.error) {
                throw new Error(news.error.message);
            }
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
            setState({ news: newsArray, isLoading: false, error: false });
            setRefreshing(false)

        } catch (err){
            console.log('Error',err);
            setRefreshing(false)
        }
    }, []);

    return (
        // <SafeAreaView style={styles.cardsContainer}>
            <FlatList
             
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
        //  </SafeAreaView> 
    )
};

const styles = StyleSheet.create({
    cardsContainer: {
        flex: 1,
        paddingTop: 16,
    }
});

export default NewsCardList