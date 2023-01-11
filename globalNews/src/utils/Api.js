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
// import GLOBAL from './../store/globalStore'

// class Api {
    // constructor() {
        // this.newsUrl = `${RTD_SERVER.LOCAL}${GET_ARTICLES}`
        // this.userAuthUrl = `${RTD_SERVER.LOCAL}${USER_AUTH}`
        // this.favoriteUrl = `${RTD_SERVER.LOCAL}${FAVORITES}`
        let newsUrl = `${RTD_SERVER.LOCAL}${GET_ARTICLES}`
        let userAuthUrl = `${RTD_SERVER.LOCAL}${USER_AUTH}`
        let favoriteUrl = `${RTD_SERVER.LOCAL}${FAVORITES}`
    // }
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

    async function getArticlesHelper(category){
        // console.log("category: " + category);
        try {
    
            const news = await getArticles({ category: category ?? 'Home', appName: DeviceInfo.getApplicationName() });
            // const news = await api.getArticles({ category: category ?? 'Home', appName: DeviceInfo.getApplicationName() });
            
            // console.log(JSON.stringify(news));
            if (news && news.error) {
                // console.log("news: " + JSON.stringify(news))
                throw new Error(news);
            } else if(!news){
                throw new Error("API.js Error")
            }
    
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
                store.dispatch(populateArticles(newsArray))
    
            categoriesArray = Object.keys(news['categories']).map(k => news['categories'][k]),
                store.dispatch(populateCategories(categoriesArray))
            // GLOBAL.categories = categoriesArray;
    
            return news;
        } catch (e) {
            let er = 'API.js Error: ' + JSON.stringify(e)
            console.error(er);
            return er
        }
    }
    

// }
export default getArticlesHelper


// const api = new Api()
// export default api