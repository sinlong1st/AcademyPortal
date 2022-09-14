import {
  GET_SCHEDULE, SCHEDULE_LOADING, GET_EVENT_SCHEDULE
} from '../actions/types';

const initialState = {
  loading: false,
  schedule: {
    events:[]
  },
  event: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SCHEDULE:
      return {
        schedule: action.payload,
        loading: false
      };
    case GET_EVENT_SCHEDULE:
      return {
        event: action.payload,
        loading: false
      };
    case SCHEDULE_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
