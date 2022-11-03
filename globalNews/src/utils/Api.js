import { fetchArticlesRest } from "./Rest"
import { URLS, KEYS, RTD_API, ARTISAN_RTD_API, XAMPP_RTD_API, LOCAL_LOGIN_URL } from './Enums';


class Api {
    constructor() {
        // this.newsUrl = `${URLS.NEWS}?access_key=${KEYS.NEWS_URL_ACCESS_KEYS}`
        this.newsUrl = `${XAMPP_RTD_API.GET_GLOBALNEWS_ARTICLES}`
        this.loginUrl = `${LOCAL_LOGIN_URL}`
    }
    GetNews(params) {
        return fetchArticlesRest(this.newsUrl, params)
    }
    loginManual(params) {
        return loginManualRest(this.loginUrl, params)
    }
}

const api = new Api()
export default api