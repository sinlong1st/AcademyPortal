const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateChangePasswordInput(data) {
  let errors = {};
  data.opassword = !isEmpty(data.opassword) ? data.opassword : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (Validator.isEmpty(data.opassword)) {
    errors.opassword = 'Password hiện tại không được bỏ trống';
  }

  if (!Validator.isLength(data.opassword, { min: 6, max: 30 })) {
    errors.opassword = 'Password hiện tại phải ít nhất 6 ký tự';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password không được bỏ trống';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password phải ít nhất 6 ký tự';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Không được bỏ trống Password xác nhận';
  } else {
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = 'Password xác nhận không đúng';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
