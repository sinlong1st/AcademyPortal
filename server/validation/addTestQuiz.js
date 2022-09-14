const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddTestQuizInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : '';
  data.time = !isEmpty(data.time) ? data.time : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Hãy điền tiêu đề bài tập';
  }

  if (Validator.isEmpty(data.time)) {
    errors.time = 'Hãy điền thời gian làm bài';
  }else{
    if(data.time < 1)
      errors.time = 'Thời gian làm bài phải lớn hơn 1';
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = 'Hãy điền mô tả bài tập';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
