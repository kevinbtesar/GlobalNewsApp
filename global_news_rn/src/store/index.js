import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-community/async-storage';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const persistConfig = {
    key: 'root',
    storage: storage,
    whiteList: ['cryptoWallet'],
    blacklist: ['app']

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);
export { store, persistor };
