import React, { Component } from 'react';
import { View, Image, StyleSheet, ScrollView, Alert, BackHandler, ActivityIndicator } from 'react-native';
import {
  Input,
  Icon,
  Button,
  Text,
  Divider,
} from 'react-native-elements';
import { ImagePicker } from 'expo';
import { connect } from 'react-redux';
import { editProfile, getCurrentProfile, clearErrors, clearSuccess } from '../actions/profileActions';
import isEmptyObj from '../validation/is-empty';
import { NavigationEvents } from 'react-navigation';

class Profile extends Component {
  state = {
    name:'',
    email:'',
    phone: '',
    photo: null,
    file: null,
    idCard: '',
    isLoading: false,
    errors:{},
    loading: true
  };

  handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [5, 5]
    });

    if (!result.cancelled) {
      this.setState({ 
        photo: result.uri,
        file: result.uri
      });
    }
  };

  handleCancelChoosePhoto = () =>{
    this.setState({ 
      photo: this.props.profile.profile.photo,
      file: null
    });
  }

  componentDidMount = () => {
    this.props.getCurrentProfile();
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

    this.setState({ errors: nextProps.errors});

    const { loading } = nextProps.profile
    this.setState({ loading })

    if (!isEmptyObj(nextProps.profile.profile)) {
      const { profile } = nextProps.profile
      this.setState({name: profile.name, email: profile.email, phone: profile.phone, photo: profile.photo, idCard: profile.idCard})
    }

    if (nextProps.success.mes === "Thay đổi thành công") {
      Alert.alert('Thành công','Thay đổi thành công');
      this.setState({isLoading: false})
      this.props.clearSuccess();
    }

  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({isLoading: true});
    const profileData = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      idCard: this.state.idCard
    };
    this.props.editProfile(profileData, this.state.file);
    this.props.clearErrors();
  }

  render() {
    const { email, name, phone, photo, isLoading, errors, loading, idCard } = this.state;
    return (
      <ScrollView>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        {
          loading
          ?
          <View style={styles.container}> 
            <ActivityIndicator size="large" />
          </View>
          :
          <View style={styles.container}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Input
                containerStyle={{ width: '90%' }}
                label="Email"
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
                label="Chứng minh nhân dân"
                value={idCard}
                onChangeText={idCard => this.setState({ idCard })}
                labelStyle={{ marginTop: 16 }}
                leftIcon={
                  <Icon name="id-card" type="font-awesome" color="black" size={25} />
                }
                leftIconContainerStyle={{
                  marginRight: 10,
                }}
                errorMessage={
                  errors.idCard && errors.idCard
                }
              />
              <Input
                containerStyle={{ width: '90%' }}
                label="Số điện thoại"
                value={phone || ''}
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
            </View>
            <Text style={{ marginLeft: 30, fontWeight: 'bold', fontSize: 17, color: 'grey'}}>Hình đại diện</Text>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: photo }}
                style={{ marginLeft: 30, width: 200, height: 200, borderColor:'rgba(241,240,241,1)', borderWidth: 1, borderRadius: 100, marginBottom: 20, marginTop: 10 }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
              <Button title="Chọn hình ảnh" type="clear" onPress={this.handleChoosePhoto} />
              <Button title="Hủy chọn" type="clear" onPress={this.handleCancelChoosePhoto} />
            </View>
            <Divider style={{ backgroundColor: 'black' }} />
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
        }        
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
  profile: state.profile,
  errors: state.errors,
  success: state.success
});
export default connect(mapStateToProps, { editProfile, getCurrentProfile, clearErrors, clearSuccess })(Profile);
