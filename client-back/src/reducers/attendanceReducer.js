import {
  GET_ATTENDANCE, CLEAR_ATTENDANCE, GET_STUDENT_ABSENT_LIST, ATTENDANCE_LOADING, GET_TODAY_ATTENDANCE
} from '../actions/types';

const initialState = {
  loading: false,
  today_attendance: {
    _id: '',
    students:[]
  },
  attendance: [],
  student_absent_list: {
    absentlist: [],
    attendanceNumber: null
  } 
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
        loading: false
      };
    case GET_TODAY_ATTENDANCE:
      return {
        ...state,
        today_attendance: action.payload,
        loading: false
      };
    case ATTENDANCE_LOADING:
      return {
        ...state,
        loading: true
      }
    case CLEAR_ATTENDANCE:
      return {
        ...state,
        today_attendance: {},
        attendance: []
      };
    case GET_STUDENT_ABSENT_LIST:
      return {
        ...state,
        student_absent_list: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
