import {
    ADD_TO_FAVORITES,
    REMOVE_FROM_FAVORITES,
    REMOVE_ALL_FAVORITES,
    POPULATE_ARTICLES,
    POPULATE_CATEGORIES,
    PURGE_ARTICLES,
    ADD_TO_NOTIFICATIONS,
    REMOVE_ALL_NOTIFICATIONS,
    REMOVE_FROM_NOTIFICATIONS
} from './newsStore.types';

export function addNewsToFavorites(news) {
    return {
        type: ADD_TO_FAVORITES,
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

export function addNewsToNotifications(news) {
    return {
        type: ADD_TO_NOTIFICATIONS,
        payload: news
    }
}


export function removeNewsFromNotifications(news) {
    return {
        type: REMOVE_FROM_NOTIFICATIONS,
        payload: news,
    }
}

export function removeAllNotifications() {
    return {
        type: REMOVE_ALL_NOTIFICATIONS,
    }
}


