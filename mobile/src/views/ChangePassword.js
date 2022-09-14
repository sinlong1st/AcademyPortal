import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import {
  Input,
  Icon,
  Button
} from 'react-native-elements';
import { connect } from 'react-redux';
import { changePassword, clearErrors, clearSuccess } from '../actions/profileActions';
import isEmptyObj from '../validation/is-empty';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opassword: '',
      password: '',
      password2: '',
      errors: {},
      isLoading: false
    };
  }

  handleBackButtonClick=()=> {
    Alert.alert(
      'Thoát Khỏi Ứng Dụng',
      'Bạn có muốn thoát không?', [{
          text: 'Cancel',
          style: 'cancel'
      }, {
          text: 'OK',
          onPress: () => BackHandler.exitApp()
      }, ], {
          cancelable: false
      }
   )
   return true;
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.mes === "Thay đổi password thành công") {
      Alert.alert('Thành công','Thay đổi password thành công');
      this.setState({
        isLoading: false,
        opassword: '',
        password: '',
        password2: ''
      })
      this.props.clearSuccess();
    }

  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({isLoading: true});
    const passwordData = {
      opassword: this.state.opassword,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.changePassword(passwordData);

    this.props.clearErrors();
  }

  render() {
    const { opassword, password, password2, errors, isLoading } = this.state 
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Input
              containerStyle={{ width: '90%' }}
              label="Password hiện tại"
              secureTextEntry={true}
              value={opassword}
              onChangeText={opassword => this.setState({ opassword })}
              labelStyle={{ marginTop: 16 }}
              autoCapitalize="none"
              leftIcon={
                <Icon name="lock" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.opassword && errors.opassword
              }
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
            />
            <Input
              ref={input => (this.passwordInput = input)}
              containerStyle={{ width: '90%' }}
              label="Password mới"
              secureTextEntry={true}
              value={password}
              onChangeText={password => this.setState({ password })}
              labelStyle={{ marginTop: 16 }}
              autoCapitalize="none"
              leftIcon={
                <Icon name="lock" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.password && errors.password
              }
              onSubmitEditing={() => {
                this.password2Input.focus();
              }}
            />
            <Input
              ref={input => (this.password2Input = input)}
              containerStyle={{ width: '90%' }}
              label="Xác nhận lại password mới"
              secureTextEntry={true}
              value={password2}
              onChangeText={password2 => this.setState({ password2 })}
              labelStyle={{ marginTop: 16 }}
              autoCapitalize="none"
              leftIcon={
                <Icon name="lock" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.password2 && errors.password2
              }
            />
          </View>

          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Button
                title="Lưu thay đổi"
                buttonStyle={{
                  backgroundColor: 'rgba(111, 202, 186, 1)',
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                onPress={this.onSubmit}
                loading={isLoading}
                containerStyle={{ marginVertical: 10, height: 50, width: 250 }}
                titleStyle={{ fontWeight: 'bold' }}
              />
          </View>
        </View>      
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});
export default connect(mapStateToProps, { changePassword, clearErrors, clearSuccess })(ChangePassword);
