import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, AsyncStorage } from 'react-native';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { setCurrentUser } from '../actions/authActions';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkLoginAsync();
  }

  checkLoginAsync = async () => {
    const userToken = await AsyncStorage.getItem('jwtToken');
    const initialRouteName = userToken ? 'App' : 'Login';
    if (userToken) {
      setAuthToken(userToken);
      const decoded = jwt_decode(userToken);
      this.props.setCurrentUser(decoded);
    }
    this.props.navigation.navigate(initialRouteName);
  };

  render() {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <NavigationEvents onDidFocus={() => this.checkLoginAsync()} />
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { setCurrentUser })(LoadingScreen);
