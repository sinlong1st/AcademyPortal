import axios from 'axios';
import config from '../config';

import { GET_ERRORS, GET_PROFILE, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS} from './types';

// Edit Profle
export const editProfile = (userData, fileData) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/users/edit-profile', userData)
    .then(res =>{

      if(fileData !== null)
      {
        let fd = new FormData();
        fd.append('image', fileData, fileData.name)
        axios.post(config.ADDRESS +'/api/users/edit-avatar', fd)
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
  axios
    .get(config.ADDRESS +'/api/users/current')
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
export const changePassword = (passwordData, history) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .post(config.ADDRESS +'/api/users/change-password', passwordData)
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

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};
