import {
  GET_ACCOUNTS, GET_ACCOUNT, ACCOUNTS_LOADING, GET_STUDENT_ACCOUNTS
} from '../actions/types';

const initialState = {
  student_accounts: [],
  loading: false,
  accounts: [],
  account: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload,
        loading: false
      };
    case GET_STUDENT_ACCOUNTS:
      return {
        ...state,
        student_accounts: action.payload,
        loading: false
      };
    case GET_ACCOUNT:
      return {
        ...state,
        account: action.payload,
        loading: false
      };
    case ACCOUNTS_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
