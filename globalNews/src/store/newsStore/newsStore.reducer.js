import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES, REMOVE_ALL_FAVORITES, POPULATE_ARTICLES, POPULATE_CATEGORIES, PURGE_ARTICLES,
    ADD_TO_NOTIFICATIONS, REMOVE_FROM_NOTIFICATIONS, REMOVE_ALL_NOTIFICATIONS} from './newsStore.types';

const initialState = {
    favorites: [],
    articles: [],
    categories: [],
    notifications: [],
};

const newsReducer = (state = initialState, action) => {
    // console.log("actionpayload: " + JSON.stringify(action.payload))
    switch (action.type) {
        case ADD_TO_FAVORITES:
            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            };
        case REMOVE_FROM_FAVORITES:
            return {
                ...state,
                favorites: [...state.favorites.filter(favorite => favorite.id !== action.payload)]
            };
        case REMOVE_ALL_FAVORITES:
                return {
                ...state,
                favorites: [],
            };
        case POPULATE_ARTICLES:
                return {
                ...state,
                articles: action.payload,
            };
        case POPULATE_CATEGORIES:
                return {
                ...state,
                categories: action.payload,
            };
        case PURGE_ARTICLES:
            return {
                ...state,
                articles: [],
            };
        case ADD_TO_NOTIFICATIONS:
            return {
                ...state,
                notifications: [...state.notifications.filter(notification => notification.id !== action.payload.id), action.payload]
            };
        case REMOVE_FROM_NOTIFICATIONS:
            return {
                ...state,
                notifications: [...state.notifications.filter(notification => notification.id !== action.payload)]
            };
        case REMOVE_ALL_NOTIFICATIONS:
                return {
                ...state,
                notifications: [],
            };
        default: {
            return state;
        }
    }
};

export default newsReducer;
