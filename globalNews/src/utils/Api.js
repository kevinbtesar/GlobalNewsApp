import DeviceInfo from 'react-native-device-info';
import { getRest, postRest } from "./Rest"
import {
    GET_ARTICLES,
    API_BASE_URL,
    USER_AUTH,
    FAVORITES,
} from '../data/Enums';
import { populateArticles, populateCategories, purgeArticles } from './../store/newsStore/newsStore.actions';
import { store } from './../store';
// import GLOBAL from './../store/globalStore'


const userAuthUrl = `${API_BASE_URL}${USER_AUTH}`;
const favoriteUrl = `${API_BASE_URL}${FAVORITES}`;

function getArticles(params) {
    return getRest(`${API_BASE_URL}${GET_ARTICLES}`, params)
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
        const news = await getArticles({ appName: DeviceInfo.getApplicationName() });
        // const news = await api.getArticles({ category: category ?? 'Home', appName: DeviceInfo.getApplicationName() });
        // console.log("HERE getArticlesHelper news: " + JSON.stringify(news));
        if (news && news.error) {
            
            throw new Error(news.error);
        } else if (!news) {
            throw new Error("API.js Error")
        } else {
            // console.log("news: " + JSON.stringify(news))
            const newsArticles = news?.articles ?? [];
            const newsCategories = news?.categories ?? [];
            const newsArray = Array.isArray(newsArticles)
                ? newsArticles
                : Object.keys(newsArticles).map(k => newsArticles[k]);
            const categoriesArray = Array.isArray(newsCategories)
                ? newsCategories
                : Object.keys(newsCategories).map(k => newsCategories[k]);

            store.dispatch(purgeArticles());
            store.dispatch(populateArticles(newsArray));
            store.dispatch(populateCategories(categoriesArray));

        }

  
        return news;
    } catch (e) {
        let er = 'API.js Error: ' + e
        console.log(er);
        return e
    }
}


