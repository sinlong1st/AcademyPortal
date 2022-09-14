import {
  GET_RATING, 
  RATING_LOADING
} from '../actions/types';

const initialState = {
  rating: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RATING:
      return {
        ...state,
        rating: action.payload,
        loading: false
      };
    case RATING_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
