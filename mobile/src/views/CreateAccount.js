import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import {
  Input,
  Icon,
  Button,
  ButtonGroup,
  Text
} from 'react-native-elements';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { createUser, clearSuccess, clearErrors } from '../actions/authActions';
import isEmptyObj from '../validation/is-empty';

class CreateAccount extends Component {
  state = {
    name:'',
    code: '',
    email:'',
    password: '',
    password2: '',
    phone: '',
    idCard: '',
    role: '',
    isLoading: false,
    errors: {},
    selectedIndex: -1
  };

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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

    if (nextProps.success.mes === "Tạo tài khoản thành công") {
      Alert.alert('Thành công','Tạo tài khoản thành công');
      this.setState({ 
        name:'',
        code: '',
        email:'',
        password: '',
        password2: '',
        phone: '',
        idCard: '',
        role: '',
        isLoading: false,
        errors: {},
        selectedIndex: -1
       })
      this.props.clearSuccess();
    }
  }

  onSubmit = e => {
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
      password2: this.state.password2,
      role: this.state.role,
      idCard: this.state.idCard,
      code: this.state.code
    };
    this.setState({isLoading: true});
    this.props.clearErrors();
    this.props.createUser(newUser);
  }

  updateIndex (selectedIndex) {
    switch (selectedIndex) {
      case 0: this.setState({ role: 'ministry'});break;
      case 1: this.setState({ role: 'educator'});break;
      case 2: this.setState({ role: 'teacher'});break;
    }

    this.setState({selectedIndex})
  }

  render() {
    const buttons = ['Phòng giáo vụ', 'Phòng đào tạo', 'Giáo viên']
    const { email, name, code, password, password2, phone, idCard, selectedIndex, errors, isLoading } = this.state;
    return (
      <ScrollView>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        <View style={styles.container}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Input
              containerStyle={{ width: '90%' }}
              label="Họ và Tên"
              value={name}
              onChangeText={name => this.setState({ name })}
              labelStyle={{ marginTop: 16 }}
              leftIcon={
                <Icon name="user" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.name && errors.name
              }
            />
            <Input
              containerStyle={{ width: '90%' }}
              label="Mã đăng nhập"
              autoCapitalize="none"
              value={code}
              onChangeText={code => this.setState({ code })}
              labelStyle={{ marginTop: 16 }}
              leftIcon={
                <Icon name="pencil" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.code && errors.code
              }
            />
            <Input
              containerStyle={{ width: '90%' }}
              label="Mật khẩu"
              autoCapitalize="none"
              value={password}
              onChangeText={password => this.setState({ password })}
              labelStyle={{ marginTop: 16 }}
              secureTextEntry
              leftIcon={
                <Icon name="lock" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.password && errors.password
              }
            />
            <Input
              containerStyle={{ width: '90%' }}
              label="Xác nhận lại mật khẩu"
              autoCapitalize="none"
              value={password2}
              onChangeText={password2 => this.setState({ password2 })}
              labelStyle={{ marginTop: 16 }}
              secureTextEntry
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
            <Input
              containerStyle={{ width: '90%' }}
              label="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={email => this.setState({ email })}
              labelStyle={{ marginTop: 16 }}
              leftIcon={
                <Icon name="envelope" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.email && errors.email
              }
            />
            <Input
              containerStyle={{ width: '90%' }}
              label="Số điện thoại"
              value={phone}
              onChangeText={phone => this.setState({ phone })}
              labelStyle={{ marginTop: 16 }}
              leftIcon={
                <Icon name="phone" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.phone && errors.phone
              }
            />
            <Input
              containerStyle={{ width: '90%' }}
              label="Chứng minh nhân dân"
              value={idCard}
              onChangeText={idCard => this.setState({ idCard })}
              labelStyle={{ marginTop: 16 }}
              leftIcon={
                <Icon name="envelope" type="font-awesome" color="black" size={25} />
              }
              leftIconContainerStyle={{
                marginRight: 10,
              }}
              errorMessage={
                errors.idCard && errors.idCard
              }
            />

            <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 17, color: 'grey'}}>Chức danh</Text>

            <ButtonGroup
              onPress={this.updateIndex.bind(this)}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={{height: 40}}
            />
            {errors.role && <Text style={{ marginTop: 10, color:'red'}}>{errors.role}</Text>}

          </View>
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Button
                title="Tạo tài khoản"
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
export default connect(mapStateToProps, { createUser, clearSuccess, clearErrors })(CreateAccount);