const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddInfrastructureInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.name)) 
    errors.name = 'Hãy điền tên cơ sở';

  if (Validator.isEmpty(data.address)) 
    errors.address = 'Hãy điền địa chỉ';

  if (Validator.isEmpty(data.phone)) 
    errors.phone = 'Hãy điền số điện thoại';

  if (Validator.isEmpty(data.email)) 
    errors.email = 'Hãy điền email';

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
