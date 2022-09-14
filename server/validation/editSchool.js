const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEditSchoolInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.shortIntro = !isEmpty(data.shortIntro) ? data.shortIntro : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.facebook = !isEmpty(data.facebook) ? data.facebook : '';
  data.video = !isEmpty(data.video) ? data.video : '';
  data.intro = !isEmpty(data.intro) ? data.intro : '';

  if (Validator.isEmpty(data.name)) 
    errors.name = 'Hãy điền tên trung tâm';

  if (Validator.isEmpty(data.shortIntro)) 
    errors.shortIntro = 'Hãy điền giới thiệu ngắn';

  if (Validator.isEmpty(data.address)) 
    errors.address = 'Hãy điền địa chỉ';

  if (Validator.isEmpty(data.phone)) 
    errors.phone = 'Hãy điền số điện thoại';

  if (Validator.isEmpty(data.email)) 
    errors.email = 'Email không được bỏ trống';
  
  if (!Validator.isEmail(data.email))
    errors.email = 'Email không đúng định dạng';
  
  if (Validator.isEmpty(data.facebook)) 
    errors.facebook = 'Hãy điền link facebook';
  
  if (Validator.isEmpty(data.video)) 
    errors.video = 'Hãy điền link video giớ thiệu';
  
  if (Validator.isEmpty(data.intro)) 
    errors.intro = 'Hãy điền giới thiệu về trung tâm';

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
