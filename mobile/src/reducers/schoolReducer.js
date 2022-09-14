import {
  GET_SCHOOL, SCHOOL_LOADING
} from '../actions/types';

const initialState = {
  loading: false,
  school: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SCHOOL:
      return {
        school: action.payload,
        loading: false
      };
    case SCHOOL_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
