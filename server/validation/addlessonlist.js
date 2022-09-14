const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddLessonListInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Hãy điền tiêu đề';
  }

  if (Validator.isEmpty(data.certification)) {
    errors.certification = 'Hãy điền tên chứng chỉ';
  }

  if (Validator.isEmpty(data.noLesson)) {
    errors.noLesson = 'Hãy điền số bài học';
  }

  if (Number(data.noLesson) <= 0) {
    errors.noLesson = 'Số bài học phải lớn hơn 0';
  }

  return {
    errors, 
    isValid: isEmpty(errors)
  };
};
