import {
    ADD_TO_FAVORITES,
    REMOVE_FROM_FAVORITES,
    REMOVE_ALL_FAVORITES,
    POPULATE_ARTICLES,
    POPULATE_FAVORITES,
    POPULATE_CATEGORIES,
    PURGE_ARTICLES
} from './newsStore.types';

export function addNewsToFavorites(news) {
    return {
        type: ADD_TO_FAVORITES,
        payload: news
    }
}

export function populateFavorites(news) {
    return {
        type: POPULATE_FAVORITES,
        payload: news
    }
}

export function removeNewsFromFavorites(news) {
    return {
        type: REMOVE_FROM_FAVORITES,
        payload: news,
    }
}

export function removeAllFavorites() {
    return {
        type: REMOVE_ALL_FAVORITES,
    }
}

export function populateArticles(news) {
    return {
        type: POPULATE_ARTICLES,
        payload: news,
    }
}


export function populateCategories(news) {
    return {
        type: POPULATE_CATEGORIES,
        payload: news,
    }
}

export function purgeArticles() {
    return {
        type: PURGE_ARTICLES,
    }
}

