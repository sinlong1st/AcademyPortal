import axios from 'axios';

import { GET_ERRORS, GET_PROFILE, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS, PROFILE_LOADING } from './types';

import config from '../config';

// Edit Profle
export const editProfile = (userData, photo) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/users/edit-profile', userData)
    .then(res =>{

      if(photo !== null)
      {
        let fd = new FormData();
        fd.append('image', {
          uri: photo,
          name: 'photo.jpg',
          type: 'image/jpg'
        })

        axios.post(config.ADDRESS + '/api/users/edit-avatar', fd)
        .then(res2  => {
          dispatch({
            type: GET_SUCCESS,
            payload: res2.data
          })
          dispatch(getCurrentProfile());
        });
      }
      else
      {
        dispatch({
          type: GET_SUCCESS,
          payload: res.data
        })
        dispatch(getCurrentProfile());
      }
      
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};

// Get Profle
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(config.ADDRESS + '/api/users/current')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Change Password
export const changePassword = (passwordData) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/users/change-password', passwordData)
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

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};


export const getSuccess = () => dispatch => {
  dispatch({
    type: GET_SUCCESS,
    payload: {data: 'Thay đổi thành công'}
  })
};


export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};