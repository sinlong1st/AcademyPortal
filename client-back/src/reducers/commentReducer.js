import {
  GET_COMMENT, COMMENT_LOADING
} from '../actions/types';

const initialState = {
  exercise_comments: [],
  loading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COMMENT:
      return {
        ...state,
        exercise_comments: action.payload,
        loading: false
      };
    case COMMENT_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
