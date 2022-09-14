import { GET_INFRASTRUCTURE, GET_INFRASTRUCTURE_BY_ID } from '../actions/types';

const initialState = {
    infrastructure: {},
    infrastructureList: [],
    loading: false
  };

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_INFRASTRUCTURE:
            return {
                ...state,
                infrastructureList: action.payload,
                loading: false
            };
        case GET_INFRASTRUCTURE_BY_ID:
            return {
                ...state,
                infrastructure: action.payload,
                loading: false
            }
        default:
            return state;
    }
}