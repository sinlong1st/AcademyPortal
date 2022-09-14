const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginLMSInput(data) {
  let errors = {};

  data.code = !isEmpty(data.code) ? data.code : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.code)) {
    errors.code = 'Hãy điền mã đăng nhập';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password không được bỏ trống';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
