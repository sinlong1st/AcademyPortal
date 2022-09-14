import axios from 'axios';
import config from '../config'
import { 
  GET_SUCCESS, 
  GET_ERRORS, 
  GET_EXERCISE_LIST, 
  GET_COMMENT, 
  CLEAR_SUCCESS, 
  GET_SUBMISSION,
  GET_SUBMISSION2,
  DEL_SUBMISSION, 
  CLEAR_ERRORS,
  EXERCISE_LOADING, 
  COMMENT_LOADING,
  SUBMIT_LOADING,
  GET_EXER,
  GET_EXERPOINT 
} from './types';


export const getExercisePoint = (id) => dispatch => {
  dispatch(setExercisesLoading());
  axios
    .get(config.ADDRESS +`/api/exercises/exercisePointOP/${id}`)
    .then(res => {
      dispatch({
        type: GET_EXERPOINT,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_EXERPOINT,
        payload: {}
      }
    ))
}
// Add Exercise
export const addExercise = (exerciseData) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/exercises/add-exercise', exerciseData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Thêm bài tập thành công!'}
      })
      dispatch(getExerciseList(exerciseData.courseId));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setExercisesLoading = () => {
  return {
    type: EXERCISE_LOADING
  };
};

// Add Point
export const addPoint= (newPoint) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/exercises/add-point', newPoint)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//////
export const getExerciseList = (courseId) => dispatch => {
  dispatch(setExercisesLoading());
  axios
    .get(config.ADDRESS +`/api/exercises/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_EXERCISE_LIST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EXERCISE_LIST,
        payload: {}
      })
    );
};

// Add Comment
export const addComment = (commentData, exerciseId) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/exercises/comment/${exerciseId}`, commentData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      dispatch(getComments(exerciseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get comment
export const getComments = (exerciseId) => dispatch => {
  dispatch(setCommentsLoading());
  axios
    .get(config.ADDRESS +`/api/exercises/get-comments/${exerciseId}`)
    .then(res =>
      dispatch({
        type: GET_COMMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COMMENT,
        payload: {}
      })
    );
};

export const setCommentsLoading = () => {
  return {
    type: COMMENT_LOADING
  };
};
// get 1 exercise
export const getExercise = (id) => dispatch => {
  axios
    .get(config.ADDRESS +`/api/exercises/exercise/${id}`)
    .then(res =>
      dispatch({
        type: GET_EXER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EXER,
        payload: {}
      }
    ))
}

// Add Submission
export const addSubmission = (data, exerciseId) => dispatch => {
  let fd = new FormData();
  fd.append('file',data.file)
  axios({
    method: "post",
    url: config.ADDRESS +`/api/exercises/${exerciseId}/submit`,
    data: fd,
    headers:{'Content-Type': 'multipart/form-data'},
  }).then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      //gọi cái này để cập nhật tên file vừa upload
      dispatch(getSubmission(exerciseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setSubmitLoading = () => {
  return {
    type: SUBMIT_LOADING
  };
};

export const getSubmission = (exerciseId) => dispatch => {
  dispatch(setSubmitLoading())
  axios
    .get(config.ADDRESS +`/api/exercises/${exerciseId}/get-submission`)
    .then(res =>{
      dispatch({
        type: GET_SUBMISSION,
        payload: res.data
      })
    }
    )
    .catch(err =>{

    });
};

export const getSubmissionExer = (exerciseId) => dispatch => {
  
  axios
    .get(config.ADDRESS +`/api/exercises/${exerciseId}/get-submissionTai`)
    .then(res =>{
      dispatch({
        type: GET_SUBMISSION2,
        payload: res.data
      })
    }
    )
    .catch(err =>{

    });
};

export const download = (exerciseId, submission) => dispatch => {
  axios
    .get(config.ADDRESS +`/api/exercises/${exerciseId}/download`,{
      responseType: 'blob'
    })
    .then(res =>{
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', submission);
      document.body.appendChild(link);
      link.click();
    })
    .catch(err =>{

    }
    );
};

export const downloadSubmission = (data, fileName) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/exercises/get-file-submission`, data)
    .then(res =>{
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    })
    .catch(err =>{

    });
};

export const deleteSubmission = (exerciseId) => dispatch => {
  axios
    .delete(config.ADDRESS +`/api/exercises/${exerciseId}/delete`)
    .then(res =>
      dispatch({
        type: DEL_SUBMISSION
      })
    )
    .catch(err =>{
    });
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
