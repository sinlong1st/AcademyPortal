import {
  STATISTIC_LOADING,
  GET_STATISTIC
} from '../actions/types';

const initialState = {
  loading: false,
  statistic: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STATISTIC:
      return {
        statistic: action.payload,
        loading: false
      };
    case STATISTIC_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
