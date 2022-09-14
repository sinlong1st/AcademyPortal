const isEmpty = require('./is-empty');

module.exports = function validateAddMoreQuizInput(data) {
  let errors = {};

  if (!data.listQuiz || !data.listQuiz.length) {
    errors.listQuiz = { _error: 'Không có câu hỏi nào được thêm' };
  } else {
    //validate array question
    const quizArrayErrors = [];
    data.listQuiz.forEach((quiz, quizIndex) => {
      const quizErrors = {};
      if(!quiz || !quiz.question) {
        quizErrors.question = 'Yêu cầu';
        quizArrayErrors[quizIndex] = quizErrors;
      }
      if(!quiz || !quiz.correctAnswer) {
        quizErrors.correctAnswer = 'Yêu cầu';
        quizArrayErrors[quizIndex] = quizErrors;
      }
      if (quiz || !quiz.answers || !quiz.answers.length) {
        //validate array answer
        const answerArrayErrors = [];
        quiz.answers.forEach((answer, answerIndex) => {
          if(!answer || !answer.length) {
            answerArrayErrors[answerIndex] = 'Yêu cầu';
          }
        })
        if (answerArrayErrors.length) {
          quizErrors.answers = answerArrayErrors;
          quizArrayErrors[quizIndex] = quizErrors;
        }
        //end array answer
      }
    });
    if(quizArrayErrors.length) {
      errors.listQuiz = quizArrayErrors;
    }
    //end array question
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
