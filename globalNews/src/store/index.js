import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whiteList: ['cryptoWallet'],
    // blacklist: ['app']

};


let logger = undefined
if (process.env.NODE_ENV === `development`) {
    logger = createLogger({
        level:'info', //: 'log' | 'console' | 'warn' | 'error' | 'info', // console's level 
    });
}


const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, logger]
})


let persistor = persistStore(store);
export { store, persistor };


