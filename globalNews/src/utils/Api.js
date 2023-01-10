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

    async getArticlesHelper(category){
        // console.log("category: " + category);
        try {
    
            const news = await api.getArticles({ category: category ?? 'Home', appName: DeviceInfo.getApplicationName() });
            // const news = await api.getArticles({ category: category ?? 'Home', appName: DeviceInfo.getApplicationName() });
            
            // console.log(JSON.stringify(news));
            if (news && news.error) {
                // console.log("news: " + JSON.stringify(news))
                throw new Error(news);
            }
    
            newsArray = Object.keys(news['articles']).map(k => news['articles'][k]),
                store.dispatch(populateArticles(newsArray))
    
            categoriesArray = Object.keys(news['categories']).map(k => news['categories'][k]),
                store.dispatch(populateCategories(categoriesArray))
            // GLOBAL.categories = categoriesArray;
    
            return news;
        } catch (e) {
            console.error('API.js Error: ' + JSON.stringify(e));
        }
    }
    

}



const api = new Api()
export default api