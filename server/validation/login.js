const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email_login = 'Email không hợp lệ';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email_login = 'Email không được bỏ trống';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password_login = 'Password không được bỏ trống';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
