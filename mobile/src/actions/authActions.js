import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { AsyncStorage, Platform } from 'react-native';
import { GET_ERRORS, SET_CURRENT_USER, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS } from './types';
import config from '../config';

// Register User
export const registerUser = (userData) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/users/register', userData)
    .then(res => 
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Đăng ký thành công'}
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create User
export const createUser = userData => dispatch => {
  axios
    .post(config.ADDRESS +'/api/users/register', userData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post(config.ADDRESS + '/api/users/login-lms', userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      AsyncStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
    
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from Storage
  signOutAsync = async () => {
    Platform.OS === 'ios' ? await AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove) : await AsyncStorage.clear();
  };
  signOutAsync();
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
