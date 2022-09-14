import {
  GET_USERS,
  USERS_LOADING,
  GET_APPROVE_LIST_STUDENT,
  GET_APPROVE_LIST_TEACHER,
  GET_STUDENT
} from '../actions/types';

const initialState = {
  student: null,
  users: {
    students:[],
    teachers:[]
  },
  approve_list: {
    enrollStudents: [],
    students: []
  },
  approve_list_teacher: {
    teacherInCourse: [],
    teachers: []
  },
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false        
      }
    case USERS_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_APPROVE_LIST_STUDENT:
      return {
        ...state,
        approve_list: action.payload,
        loading: false
      };
    case GET_APPROVE_LIST_TEACHER:
      return {
        ...state,
        approve_list_teacher: action.payload,
        loading: false
      };
    case GET_STUDENT:
      return {
        ...state,
        student: action.payload,
        loading: false        
      };
    default:
      return state;
  }
}
