import {
    GET_SUBMISSION, DEL_SUBMISSION,GET_SUBMISSION2, SUBMIT_LOADING
  } from '../actions/types';
  
  const initialState = {
    submission: '',
    loading: false
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case GET_SUBMISSION2:{
        //console.log(GET_SUBMISSION2)
        return {
          submission: action.payload,
        };
      }
      case GET_SUBMISSION:
        return {
          ...state,
          submission: action.payload,
          loading: false
        };
      case SUBMIT_LOADING:
        return {
          ...state,
          loading: true
        };
      case DEL_SUBMISSION:
          return {
            submission: ''
          };
      default:
        return state;
    }
  }
  