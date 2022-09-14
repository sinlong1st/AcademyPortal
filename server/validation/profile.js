const Validator = require('validator');
const isEmpty = require('./is-empty');
const isPhone =  require('is-phone')
module.exports = function validateProfileInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Tên phải từ 2 -> 30 ký tự';
  }

  if (!isPhone(data.phone)) {
    errors.phone = 'Số điện thoại không đúng';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Tên không được bỏ trống';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email không được bỏ trống';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email không đúng định dạng';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
