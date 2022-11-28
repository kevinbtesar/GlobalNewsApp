import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES, REMOVE_ALL_FAVORITES,POPULATE_ARTICLES, POPULATE_CATEGORIES } from './newsStore.types';

const initialState = {
    favorites: [],
    articles: [],
    categories: [],
};

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_FAVORITES:
            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            };
        case REMOVE_FROM_FAVORITES:
            return {
                ...state,
                favorites: [...state.favorites.filter(favorite => favorite.title !== action.payload)]
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
        default: {
            return state;
        }
    }
};

export default newsReducer;
