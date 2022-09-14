import axios from 'axios';
import { SubmissionError } from 'redux-form';
import isEmpty from '../validation/is-empty';
import config from '../config';

import {
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_SUCCESS,
  CLEAR_SUCCESS,
  GET_CURRENT_TESTQUIZ,
  GET_QUIZ_LIST,
  QUIZ_LOADING,
  GET_QUIZ_SUBMISSTION,
  GET_QUIZ_DETAIL,
  IS_DO_QUIZ_LOADING,
  GET_QUIZ_DONE
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

export const addTestQuiz = (testQuizData) => dispatch => {
  return axios
    .post(config.ADDRESS +'/api/test/add-quiz', testQuizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

export const addMoreQuiz = (quizId, quizData) => dispatch => {
  return axios
    .post(config.ADDRESS + '/api/test/add-more-quiz/' + quizId, quizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      throw new SubmissionError(err.response.data);
    });
};

export const addTestQuizCSV = (testQuizData) => dispatch => {
  return axios
    .post(config.ADDRESS +'/api/test/add-quiz-csv', testQuizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      console.log(err.response.data);
    });
};

export const addMoreQuizCSV = (quizId, quizData) => dispatch => {
  return axios
    .post(config.ADDRESS + '/api/test/add-more-quiz-csv/' + quizId, quizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      console.log(err.response.data);
    });
};

export const editQuiz = (quizId, quizData) => dispatch => {
  return axios
    .post(config.ADDRESS + '/api/test/edit-quiz/' + quizId, quizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

export const deleteQuiz = (quizId, listquizId) => dispatch => {
  return axios
    .post(`${config.ADDRESS}/api/test/delete-quiz/${quizId}/${listquizId}`)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

export const submitTestQuiz = (submisstionQuiz) => dispatch => {
  return axios
    .post(config.ADDRESS +'/api/test/sub-quiz', submisstionQuiz)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: {
          data: res.data
        }
      })
    })
    .catch(err =>{
      console.log(err.response.data);
    });
};

// Get list test quizzed
export const getListQuiz = () => dispatch => {
  dispatch(setQuizzesLoading());
  socket.emit("quiz");
  socket.on("get_quiz", 
    res =>{
      dispatch({
        type: GET_CURRENT_TESTQUIZ,
        payload: res
      })
    }
  );
}
// Get QuizSubmisstion by id
export const getQuizSubmisstion = (testQuizId) => dispatch => {
  axios
    .get(config.ADDRESS +`/api/test/sub-quiz/${testQuizId}`)
    .then(res =>{
      dispatch({
        type: GET_QUIZ_SUBMISSTION,
        payload: res.data
      })
    }
      
    )
    .catch(err =>
      dispatch({
        type: GET_QUIZ_SUBMISSTION,
        payload: {}
      }
    ))
}

// Get detail test quiz by id
export const getDetailQuiz = (testQuizId) => dispatch => {
  dispatch(setQuizzesLoading());
  axios
    .get(config.ADDRESS +`/api/test/quiz-detail/${testQuizId}`)
    .then(res => {
      dispatch({
        type: GET_QUIZ_DETAIL,
        payload: res.data
      })
    }).catch(err =>{
      dispatch({
        type: GET_QUIZ_DETAIL,
        payload: {}
      })}
    );
}

// Get detail test quiz by id
export const getDetailQuizByPassword = (lessonId, testQuizId, password) => dispatch => {
  dispatch(setQuizzesLoading());
  axios
    .get(config.ADDRESS +`/api/test/quiz-detail-password/`, {
      'params': {
        'lessonId': lessonId,
        'testQuizId': testQuizId,
        'password': password
      }
    })
    .then(res => {
      dispatch({
        type: GET_QUIZ_DETAIL,
        payload: res.data
      })
    }).catch(err =>{
      dispatch({
        type: GET_QUIZ_DETAIL,
        payload: {}
      })}
    );
}
export const setQuizzesLoading = () => {
  return {
    type: QUIZ_LOADING
  };
};

export const getQuizListInCourse = (courseId) => dispatch => {
  dispatch(setQuizzesLoading());
  axios
    .get(config.ADDRESS +`/api/test/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_QUIZ_LIST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_QUIZ_LIST,
        payload: {}
      })
    );
};

export const isDoQuiz = (courseId, quizId) => dispatch => {
  dispatch(setIsDoQuizzesLoading());
  axios
    .get(config.ADDRESS +`/api/test/is-do-quiz/${courseId}/${quizId}`)
    .then(res =>
      dispatch({
        type: GET_QUIZ_DONE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_QUIZ_DONE,
        payload: {}
      })
    );
};

export const addQuizFromCategory = (quizId, testQuizData) => dispatch => {
  return axios
    .post(config.ADDRESS +'/api/test/add-quiz-from-cat/'+ quizId, testQuizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      console.log(err.response.data);
    });
};

export const setIsDoQuizzesLoading = () => {
  return {
    type: IS_DO_QUIZ_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};

export const formatDataListQuizTest = data => {
  // let formatDate = format_date.default;
  if(isEmpty(data)){
    return data;
  }
  
  // data.deadline = moment(data.deadline, formatDate);
  return data;
}
