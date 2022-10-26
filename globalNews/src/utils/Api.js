import { Rest } from "./Rest"
import { URLS, KEYS, RTD_API, LOCAL_RTD_API } from './Enums';


class Api {
    constructor() {
        // this.newsUrl = `${URLS.NEWS}?access_key=${KEYS.NEWS_URL_ACCESS_KEYS}`
        this.newsUrl = `${LOCAL_RTD_API.GET_GLOBALNEWS_ARTICLES}`
    }
    GetNews(params) {
        return Rest(this.newsUrl, params)
    }
}

const api = new Api()
export default api