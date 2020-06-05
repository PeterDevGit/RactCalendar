import React, {Component} from "react";
import Calendar from "../Calendar/Calendar";

import {applyMiddleware, createStore} from "redux";

import reducer from "../rootReducer";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import logger from 'redux-logger'

const store = createStore (
    reducer,
    composeWithDevTools(applyMiddleware(
        thunk,
        logger
    ))
);

class App extends Component {
    render() {
        return(
            <Provider store={store}>
                <Calendar />
            </Provider>
        );
    }
}

export default App;