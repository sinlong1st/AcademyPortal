import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen1 from './login/LoginScreen1';

export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LoginScreen1 navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
