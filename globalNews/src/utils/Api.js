import { getRest, postRest } from "./Rest"
import {  
    GET_ARTICLES,
    RTD_SERVER,
    USER_AUTH,
    FAVORITES,
} from './Enums';


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