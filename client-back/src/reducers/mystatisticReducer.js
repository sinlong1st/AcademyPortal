import {
  MY_STATISTIC_LOADING,
  GET_MY_STATISTIC
} from '../actions/types';

const initialState = {
  loading: false,
  my_statistic: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MY_STATISTIC:
      return {
        my_statistic: action.payload,
        loading: false
      };
    case MY_STATISTIC_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
