import config from '../config';

import { 
  STATISTIC_LOADING,
  GET_STATISTIC
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

export const setStatisticLoading = () => {
  return {
    type: STATISTIC_LOADING
  };
};

// get statistic
export const getStatistic = (courseId) => dispatch => {
  dispatch(setStatisticLoading())
  socket.emit("statistic", courseId);
  socket.on("get_statistic", 
    res =>{
      dispatch({
        type: GET_STATISTIC,
        payload: res
      })
    }
  );
};