

export const ZEN_SERVER = {
    LOCAL: 'http://local.zendigital.tech/index.php/api/',
    REMOTE: 'https://rtddigitalmedia.com/api/',
}
export const API_ENV = 'LOCAL'
export const API_BASE_URL = ZEN_SERVER[API_ENV] ?? ZEN_SERVER.LOCAL
export const GET_ARTICLES = 'getArticles'
export const USER_AUTH = 'userAuth'
export const FAVORITES = 'favorites'



export const SCREENS = {
    HOME: 'Home',
    CATEGORIES: 'Categories',
    NEWS_BY_CATEGORY: 'NewsByCategory',
    SETTINGS: 'Settings',
    FAVORITES: 'Favorites',
    NOTIFICATIONS: 'Notifications',
    LOGIN: 'Login',
    ARTICLE: 'Article',
}


export const NEWS_PICKER_TYPE = {
    COUNTRIES: 'countries',
    SORT: 'sort',
}

export const SORT_NEWS = {
    POPULARITY: 'popularity',
    DATE: 'published_desc',
}

export const TEXT_STRINGS = {
    LOGIN_FOR_FAVORITES: 'Sign in to use Favorites',
    LOGIN_MANUALLY: 'Or login/register manually',
    FAVORITES_TEXT_FIRST: 'Sign in',
    FAVORITES_TEXT_SECOND: ' to use Favorites'
}

export const KEYS = {
    ONESIGNAL_APP_ID: '164548bb-bc7c-4b8a-ae09-91afb5865e5f',
    GOOGLE_SIGN_IN_WEB_CLIENT_ID: '260894939219-50hka60ui27cm8ktrerhs0k7l0mkmvl5.apps.googleusercontent.com',
    GOOGLE_SIGN_IN_IOS_CLIENT_ID: '',
    FACEBOOK_APP_ID: '1128068298081313',
}

