import {
  GET_CURRENT_TESTQUIZ,
  GET_QUIZ_LIST,
  QUIZ_LOADING,
  GET_QUIZ_SUBMISSTION,
  GET_QUIZ_DETAIL,
  IS_DO_QUIZ_LOADING,
  GET_QUIZ_DONE
} from '../actions/types';

const initialState = {
  quizDetail: {},
  listTestQuiz: null,
  quizzes: [],
  loading: false,
  loadingQuizDone: false,
  quizDone: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_QUIZ_DONE:
      return {
        ...state,
        quizDone: action.payload,
        loadingQuizDone: false
      };
    case IS_DO_QUIZ_LOADING:
      return {
        ...state,
        loadingQuizDone: true
      };
    case GET_CURRENT_TESTQUIZ:
      return {
        ...state,
        listTestQuiz: action.payload,
        loading: false
      };
    case GET_QUIZ_SUBMISSTION:
      return {
        ...state,
        quizSubmission: action.payload,
      };
    case GET_QUIZ_LIST:
      return {
        ...state,
        quizzes: action.payload,
        loading: false
      };
    case GET_QUIZ_DETAIL:
      return{
        ...state,
        quizDetail: action.payload,
        loading: false
      }
    case QUIZ_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
