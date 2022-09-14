import React, { Component } from 'react';
import { Provider } from 'react-redux'
import reduxStore from './store/store';
import App from "./App";

class Main extends Component {
  render() {
    return (
      <Provider store={reduxStore}>
        <App />
      </Provider>
    );
  }
}

export default Main;