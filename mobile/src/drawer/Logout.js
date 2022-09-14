import React, { Component } from 'react';
import { View } from 'react-native';
import { logoutUser } from '../actions/authActions';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

class Logout extends Component {
  handleLogout() {
    this.props.logoutUser();
    this.props.navigation.navigate('Login');
  }
  render() {
    return (
      <View style={{ marginTop: 40 }}>
        <Button
          title="Đăng xuất "
          icon={{
            name: 'sign-out',
            type: 'font-awesome',
            size: 15,
            color: 'black',
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: '700', color: 'black' }}
          buttonStyle={{
            backgroundColor: 'white',
            borderRadius: 30
          }}
          onPress={this.handleLogout.bind(this)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { logoutUser })(Logout);
