import axios from 'axios';
import config from '../config';

import { GET_SUCCESS, GET_ERRORS, CLEAR_ERRORS, CLEAR_SUCCESS, GET_INFRASTRUCTURE, GET_INFRASTRUCTURE_BY_ID } from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

export const addInfrastructure = (infrastructureData) => dispatch => {
    axios
        .post(config.ADDRESS + '/api/infrastructure/add', infrastructureData)
        .then(res => {
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

export const editInfrastructure = (infrastructureId, infrastructureData) => dispatch => {
  axios
      .post(config.ADDRESS + '/api/infrastructure/edit/' + infrastructureId, infrastructureData)
      .then(res => {
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

export const deleteInfrastructure = (infrastructureId) => dispatch => {
  axios
      .post(config.ADDRESS + '/api/infrastructure/delete/'+ infrastructureId)
      .then(res => {
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

export const getInfrastructure = () => dispatch => {
  socket.emit("infrastructure");
  socket.on("get_infrastructure", 
    res =>{
      dispatch({
        type: GET_INFRASTRUCTURE,
        payload: res
      })
    }
  ); 
};

export const getInfrastructureById = (infrastructureId ) => dispatch => {
    axios
        .get(config.ADDRESS + `/api/infrastructure/${infrastructureId}`)
        .then(res => {
            dispatch({
                type: GET_INFRASTRUCTURE_BY_ID,
                payload: res.data
            })
        })
        .catch(err =>
            dispatch({
                type: GET_INFRASTRUCTURE_BY_ID,
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