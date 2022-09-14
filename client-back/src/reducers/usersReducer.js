import {
  GET_USERS, CLEAR_USER, GET_STUDENT, GET_APPROVE_LIST_STUDENT, GET_APPROVE_LIST_TEACHER, USERS_LOADING, SEARCH_STUDENT, CLEAR_SEARCH, GET_REP_MAIL_INFO
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
  search_student: {},
  loading: false,
  rep_mail_info: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,        
        loading: false        
      };
    case USERS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_STUDENT:
      return {
        ...state,
        student: action.payload,
        loading: false        
      };
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
    case SEARCH_STUDENT:
      return {
        ...state,
        search_student: action.payload,
        loading: false        
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        search_student: {},
        loading: false        
      };
    case CLEAR_USER:
      return {
        ...state,
        users: {
          students:[],
          teachers:[]
        }
      };
    case GET_REP_MAIL_INFO:
      return {
        ...state,
        rep_mail_info: action.payload,
        loading: false        
      };
    default:
      return state;
  }
}
