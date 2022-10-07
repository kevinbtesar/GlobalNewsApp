import React from 'react';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';
import {StyleSheet,View} from "react-native" ;


import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';


const App = () => (

    <Provider store={store}>
        <PersistGate loading={<View />} persistor={persistor}>

            <ThemeProvider>
                <Navigation />
            </ThemeProvider>
        </PersistGate>
    </Provider>
);

export default App;
