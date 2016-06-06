import React, { Component } from 'react';

import {
    View,
    ScrollView,
    Text,
    StyleSheet
} from 'react-native';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import UrlBar from '../containers/UrlBar';
import UrlPreviewer from '../containers/UrlPreviewer';

import reducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);

export default class App extends Component {
    render() {
        return(
            <Provider store={createStoreWithMiddleware(reducer)}>
                <ScrollView style={{ padding: 20 }}>
                    <UrlBar />
                    <UrlPreviewer />
                </ScrollView>
            </Provider>
        );
    }
}