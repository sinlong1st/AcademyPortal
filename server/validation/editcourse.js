const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEditCourseInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.title)) 
    errors.title = 'Hãy điền tên khóa học';

  if (Validator.isEmpty(data.intro)) 
    errors.intro = 'Hãy điền giới thiệu ngắn';

  if (data.enrollDeadline === null) 
    errors.enrollDeadline = 'Hãy chọn hạn chót ghi danh';

  if (Validator.isEmpty(data.fee)) 
    errors.fee = 'Hãy điền học phí';  

  if (Validator.isEmpty(data.infrastructure)) 
    errors.infrastructure = 'Hãy Chọn cơ sở giảng dạy';

  if (Validator.isEmpty(data.info)) 
    errors.info = 'Hãy điền nội dung khoa học'; 

  if (!data.pointColumns || !data.pointColumns.length)
    errors.pointColumns = 'Hãy điền Thông tin cột điểm'; 
  else {
    total = 0;
    for(let i = 0; i < data.pointColumns.length; i++){
      if(Validator.isEmpty(data.pointColumns[i].pointName))
        data.pointColumns[i].pointName = "Cột điểm " + i;
      data.pointColumns[i].pointRate = isEmpty(data.pointColumns[i].pointRate) ? 0 : parseInt(data.pointColumns[i].pointRate);
      total += data.pointColumns[i].pointRate;
    }
    if(total !== 100){
      errors.pointColumns = 'Tỉ lệ điểm phải bằng 100%'; 
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
