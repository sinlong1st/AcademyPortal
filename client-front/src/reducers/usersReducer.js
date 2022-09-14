import {
  GET_USERS, CLEAR_USER, GET_STUDENT, GET_APPROVE_LIST_STUDENT, GET_APPROVE_LIST_TEACHER, USERS_LOADING, GET_PAY_URL, CLEAR_URL, GET_VNPAY_RETURN, CLEAR_VNPAY_RETURN
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
  pay_url: '',
  pay_return: '',
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,        
        loading: false        
      };
    case GET_PAY_URL:
      return {
        ...state,
        pay_url: action.payload,        
        loading: false        
      };
    case GET_VNPAY_RETURN:
      return {
        ...state,
        pay_return: action.payload,        
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
    case CLEAR_USER:
      return {
        ...state,
        users: {
          students:[],
          teachers:[]
        }
      };
    case CLEAR_URL:
      return {
        ...state,
        pay_url: ''
      };
    case CLEAR_VNPAY_RETURN:
      return {
        ...state,
        pay_return: ''
      };
    default:
      return state;
  }
}
