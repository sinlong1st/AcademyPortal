import {
  GET_MY_SUBMISSION, MY_SUBMISSION_LOADING, GET_MY_SUBMISSION_QUIZ, MY_SUBMISSION_QUIZ_LOADING
} from '../actions/types';

const initialState = {
  mysubmission: '',
  mysubmissionquiz: '',
  loading: false,
  loadingquiz: false
};
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MY_SUBMISSION:
      return {
        ...state,
        mysubmission: action.payload,
        loading: false
      };
    case MY_SUBMISSION_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_MY_SUBMISSION_QUIZ:
      return {
        ...state,
        mysubmissionquiz: action.payload,
        loadingquiz: false
      };
    case MY_SUBMISSION_QUIZ_LOADING:
      return {
        ...state,
        loadingquiz: true
      };
    default:
      return state;
  }
}
