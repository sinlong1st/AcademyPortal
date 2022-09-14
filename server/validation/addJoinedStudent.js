const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddJoinedStudentInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.recipient_name)) {
    errors.recipient_name = 'Hãy điền tên người thanhh toán';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Hãy điền email người thanhh toán';
  }

  if (Validator.isEmpty(data.line1)) {
    errors.line1 = 'Hãy điền địa chỉ';
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = 'Hãy điền thành phố';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
