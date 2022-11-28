import React, { useState } from 'react'
import DeviceInfo from 'react-native-device-info';

import { getRest, postRest } from "./Rest"
import {  
    GET_ARTICLES,
    RTD_SERVER,
    USER_AUTH,
    FAVORITES,
} from './Enums';
import { populateArticles, populateCategories } from './../store/newsStore/newsStore.actions';
import { store } from './../store';

class Api {
    constructor() {
        this.newsUrl = `${RTD_SERVER.LOCAL}${GET_ARTICLES}`
        this.userAuthUrl = `${RTD_SERVER.LOCAL}${USER_AUTH}`
        this.favoriteUrl = `${RTD_SERVER.LOCAL}${FAVORITES}`
    }
    getArticles(params) {
        return getRest(this.newsUrl, params)
    }
    userAuth(params) {
        return postRest(this.userAuthUrl, params)
    }
    favorites(params) {
        return postRest(this.favoriteUrl, params)
    }
    // async rtdServerLoginWithGrant(email) {
    //     return await postRest(this.loginGrantedAuth, email)
    // }

}

const api = new Api()
export default api


export async function getArticlesHelper(){
    // const [state, setState] = useState(false);
    try {
        const news = await api.getArticles({ category: 'general', appName: DeviceInfo.getApplicationName() });
        console.log(JSON.stringify(news));
        if (news.error) {
            throw new Error(JSON.stringify(news));
        }
        newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
            // setState({ news: newsArray, isLoading: false, error: false });
            store.dispatch(populateArticles(newsArray))

        categoriesArray = Object.keys(news['categories']).map(k => news['categories'][k]),
            // setState({ news: newsArray, isLoading: false, error: false });
            store.dispatch(populateCategories(categoriesArray))
            // console.log("na: " + JSON.stringify(newsArray))
            // return newsArray

    } catch (err) {
        console.log('Error', err);
        // setRefreshing(false)
    }
}