import { createSelector } from 'reselect';
const baseNews = (state) => state.news;

const favoritesSelector = createSelector(
    baseNews,
    (news) => {
        return (news.favorites)
    },
);

const articlesSelector = createSelector(
    baseNews,
    (news) => {
        return (news.articles)
    },
);

const categoriesSelector = createSelector(
    baseNews,
    (news) => {
        return (news.categories)
    },
);

const notificationsSelector = createSelector(
    baseNews,
    (news) => {
        return (news.notifications)
    },
);

export {
    favoritesSelector,
    articlesSelector,
    categoriesSelector,
    notificationsSelector,
};


