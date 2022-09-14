import {
  GET_QUIZBANK,
  GET_CATEGORY,
  QUIZ_BANK_LOADING
} from '../actions/types';

const initialState = {
  quizbank: [],
  category: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_QUIZBANK:
      return {
        ...state,
        quizbank: action.payload,
        loading: false
      };
    case GET_CATEGORY:
      return {
        ...state,
        category: action.payload,
        loading: false
      };
    case QUIZ_BANK_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }
}
