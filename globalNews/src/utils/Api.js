import DeviceInfo from 'react-native-device-info';
import { getRest, postRest } from "./Rest"
import {
    GET_ARTICLES,
    ZEN_SERVER,
    USER_AUTH,
    FAVORITES,
} from '../data/Enums';
import { populateArticles, populateCategories, purgeArticles } from './../store/newsStore/newsStore.actions';
import { store } from './../store';
// import GLOBAL from './../store/globalStore'


// this.newsUrl = `${ZEN_SERVER.LOCAL}${GET_ARTICLES}`
// this.userAuthUrl = `${ZEN_SERVER.LOCAL}${USER_AUTH}`
// this.favoriteUrl = `${ZEN_SERVER.LOCAL}${FAVORITES}`
let newsUrl = `${ZEN_SERVER.LOCAL}${GET_ARTICLES}`
let userAuthUrl = `${ZEN_SERVER.LOCAL}${USER_AUTH}`
let favoriteUrl = `${ZEN_SERVER.LOCAL}${FAVORITES}`

function getArticles(params) {
    return getRest(newsUrl, params)
}
export function userAuth(params) {
    return postRest(userAuthUrl, params)
}
export function favorites(params) {
    return postRest(favoriteUrl, params)
}
// async rtdServerLoginWithGrant(email) {
//     return await postRest(this.loginGrantedAuth, email)
// }

export async function getArticlesHelper() {
    try {

        console.log("HERE");
        const news = await getArticles({ appName: DeviceInfo.getApplicationName() });
        // const news = await api.getArticles({ category: category ?? 'Home', appName: DeviceInfo.getApplicationName() });

       console.log(JSON.stringify(news));
        if (news && news.error) {
            
            throw new Error(news.error);
        } else if (!news) {
            throw new Error("API.js Error")
        } else {
            console.log("HERE1");

            console.log("news: " + JSON.stringify(news))
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k])
            store.dispatch(purgeArticles()),
            store.dispatch(populateArticles(newsArray))

        categoriesArray = Object.keys(news['categories']).map(k => news['categories'][k]),
            store.dispatch(populateCategories(categoriesArray))
        // GLOBAL.categories = categoriesArray;

        }

  
        return news;
    } catch (e) {
        let er = 'API.js Error: ' + JSON.stringify(e)
        console.error(er);
        return er
    }
}


