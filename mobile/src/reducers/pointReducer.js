import {
  POINT_LOADING, 
  GET_POINT_COLUMNS,
  GET_STUDENT_POINT
} from '../actions/types';

const initialState = {
  student_point: {
    pointColumns: []
  },
  point_columns: {
    pointColumns: []
  },
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POINT_COLUMNS:
      return {
        ...state,
        point_columns: action.payload,
        loading: false
      };
    case GET_STUDENT_POINT:
      return {
        ...state,
        student_point: action.payload,
        loading: false
      };
    case POINT_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
