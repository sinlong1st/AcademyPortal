import React, { Component } from 'react';
import {
  Alert,
  LayoutAnimation,
  TouchableOpacity,
  Dimensions,
  Image,
  UIManager,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { cacheFonts } from "../../helpers/AssetsCaching";
import { Input, Button, Icon } from 'react-native-elements';
import {LinearGradient} from "../../components/LinearGradient";
import { registerUser, clearSuccess, clearErrors } from '../../actions/authActions';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty'
// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const USER_STUDENT = require('../../../assets/images/student.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class LoginScreen2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      isLoading: false,
      fontLoaded: false,
      role: 'student',
      name: '',
      email: '',
      password: '',
      password2: '',
    };

    this.signup = this.signup.bind(this);
  }

  async componentDidMount() {
    await cacheFonts({
      light: require('../../../assets/fonts/Ubuntu-Light.ttf'),
      bold: require('../../../assets/fonts/Ubuntu-Bold.ttf'),
      lightitalic: require('../../../assets/fonts/Ubuntu-Light-Italic.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.data === "Đăng ký thành công") {
      Alert.alert('Thành công','Đăng ký thành công');
      this.setState({ 
        isLoading: false,
        role: 'student',
        name: '',
        email: '',
        password: '',
        password2: ''
      });
      this.props.clearSuccess();
    }

  }

  signup() {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isLoading: true });
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      role: 'student'
    };
    this.props.registerUser(newUser);
    this.props.clearErrors();
  }

  render() {
    const {
      isLoading,
      fontLoaded,
      role,
      name,
      password,
      password2,
      email,
      errors
    } = this.state;

    return !fontLoaded ? (
      <Text> Loading... </Text>
    ) : (
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <KeyboardAvoidingView
          behavior="position"
          contentContainerStyle={styles.formContainer}
        >
          <Text style={styles.signUpText}>ĐĂNG KÝ</Text>
          <Text style={styles.whoAreYouText}>Tạo tài khoản nếu bạn là học viên</Text>
          <View style={styles.userTypesContainer}>
            <UserTypeItem
              label="Học Viên"
              labelColor="#2CA75E"
              image={USER_STUDENT}
              selected={role === 'student'} 
            />
          </View>
          <View style={{ width: '80%', alignItems: 'center' }}>
            <FormInput
              refInput={input => (this.usernameInput = input)}
              icon="user"
              value={name}
              onChangeText={name => this.setState({ name })}
              placeholder="Họ và Tên"
              returnKeyType="next"
              errorMessage={
                errors.name && errors.name
              }
              onSubmitEditing={() => {
                this.emailInput.focus();
              }}
            />
            <FormInput
              refInput={input => (this.emailInput = input)}
              icon="envelope"
              value={email}
              onChangeText={email => this.setState({ email })}
              placeholder="Email"
              keyboardType="email-address"
              returnKeyType="next"
              errorMessage={
                errors.email && errors.email
              }
              onSubmitEditing={() => {
                this.passwordInput.focus();
              }}
            />
            <FormInput
              refInput={input => (this.passwordInput = input)}
              icon="lock"
              value={password}
              onChangeText={password => this.setState({ password })}
              placeholder="Mật khẩu"
              secureTextEntry
              returnKeyType="next"
              errorMessage={
                errors.password && errors.password
              }
              onSubmitEditing={() => {
                this.confirmationPasswordInput.focus();
              }}
            />
            <FormInput
              refInput={input => (this.confirmationPasswordInput = input)}
              icon="lock"
              value={password2}
              onChangeText={password2 =>
                this.setState({ password2 })
              }
              placeholder="Xác nhận lại mật khẩu"
              secureTextEntry
              errorMessage={
                errors.password2 && errors.password2
              }
              returnKeyType="go"
              onSubmitEditing={() => {
                this.signup();
              }}
            />
          </View>
          <Button
            loading={isLoading}
            title="Đăng ký"
            containerStyle={{ flex: -1 }}
            buttonStyle={styles.signUpButton}
            linearGradientProps={{
              colors: ['#FF9800', '#F44336'],
              start: [1, 0],
              end: [0.2, 0],
            }}
            ViewComponent={LinearGradient}
            titleStyle={styles.signUpButtonText}
            onPress={this.signup}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

export const UserTypeItem = props => {
  const { image, label, labelColor, selected, ...attributes } = props;
  return (
    <TouchableOpacity {...attributes}>
      <View
        style={[
          styles.userTypeItemContainer,
          selected && styles.userTypeItemContainerSelected,
        ]}
      >
        <Text style={[styles.userTypeLabel, { color: labelColor }]}>
          {label}
        </Text>
        <Image
          source={image}
          style={[
            styles.userTypeMugshot,
            selected && styles.userTypeMugshotSelected,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export const FormInput = props => {
  const { icon, refInput, ...otherProps } = props;
  return (
    <Input
      {...otherProps}
      ref={refInput}
      inputContainerStyle={styles.inputContainer}
      leftIcon={<Icon name={icon} type={"simple-line-icon"} color="#7384B4" size={18} />}
      inputStyle={styles.inputStyle}
      autoFocus={false}
      autoCapitalize="none"
      keyboardAppearance="dark"
      errorStyle={styles.errorInputStyle}
      autoCorrect={false}
      blurOnSubmit={false}
      placeholderTextColor="#7384B4"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: '#293046',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  signUpText: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'light',
  },
  whoAreYouText: {
    color: '#7384B4',
    fontFamily: 'bold',
    fontSize: 14,
  },
  userTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  userTypeItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  userTypeItemContainerSelected: {
    opacity: 1,
  },
  userTypeMugshot: {
    margin: 4,
    height: 70,
    width: 70,
  },
  userTypeMugshotSelected: {
    height: 100,
    width: 100,
  },
  userTypeLabel: {
    color: 'yellow',
    fontFamily: 'bold',
    fontSize: 11,
  },
  inputContainer: {
    paddingLeft: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)',
    height: 45,
    marginVertical: 10,
  },
  inputStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontFamily: 'light',
    fontSize: 16,
  },
  errorInputStyle: {
    marginTop: 0,
    textAlign: 'center',
    color: '#F44336',
  },
  signUpButtonText: {
    fontFamily: 'bold',
    fontSize: 13,
  },
  signUpButton: {
    width: 250,
    borderRadius: 50,
    height: 45,
  }
});

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { registerUser, clearErrors, clearSuccess })(LoginScreen2);