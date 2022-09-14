import config from '../config';
import axios from 'axios';

import { 
  MY_STATISTIC_LOADING,
  GET_MY_STATISTIC
} from './types';


export const setMyStatisticLoading = () => {
  return {
    type: MY_STATISTIC_LOADING
  };
};

// get my statistic
export const getMyStatistic = (courseId) => dispatch => {
  dispatch(setMyStatisticLoading())
  axios
    .get(config.ADDRESS + '/api/users/get-my-statistic/' + courseId)
    .then(res =>{
      dispatch({
        type: GET_MY_STATISTIC,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_MY_STATISTIC,
        payload: {}
      })
    );
};