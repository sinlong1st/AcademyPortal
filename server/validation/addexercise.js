const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateAddCourseInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.text = !isEmpty(data.text) ? data.text : '';
  data.deadline = !isEmpty(data.deadline) ? data.deadline : '';
  
  if (Validator.isEmpty(data.title)) {
    errors.title = 'Hãy điền tiêu đề bài tập';
  }

  if (Validator.isEmpty(data.deadline)) {
    errors.deadline = 'Hãy điền hạn chót nộp bài';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Hãy điền nội dung bài tập';
  }

  return {
    errors, 
    isValid: isEmpty(errors)
  };
};
