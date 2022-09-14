import axios from 'axios';
import config from '../config';

import { CLEAR_ERRORS, CLEAR_SUCCESS, GET_RATING, RATING_LOADING } from './types';

export const setRatingLoading = () => {
  return {
    type: RATING_LOADING
  };
};

// get teacher rating
export const getRating = (teacherId) => dispatch => {
  dispatch(setRatingLoading())
  axios
    .get(config.ADDRESS +`/api/users/get-teacher-rating/${teacherId}`)
    .then(res =>
      dispatch({
        type: GET_RATING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_RATING,
        payload: {}
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
