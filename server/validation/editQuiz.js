const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function validateEditQuizInput(data) {
  let errors = {};
  data.question = !isEmpty(data.question) ? data.question : '';

  if (Validator.isEmpty(data.question)) {
    errors.err = 'Hãy điền hết những nội dung yêu cầu';
  }

  data.answers.forEach(answer => {
    if(!answer || !answer.length) {
      errors.err = 'Hãy điền hết những nội dung yêu cầu';
    }
  })

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
