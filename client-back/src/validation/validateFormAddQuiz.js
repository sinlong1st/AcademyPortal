const validateFormAddQuiz = values => {
  const errors = {};
  if(!values.testTitle) {
    errors.testTitle = 'Yêu cầu';
  }
  if(!values.testSynopsis) {
    errors.testSynopsis = 'Yêu cầu';
  }
  if (!values.quizzes || !values.quizzes.length) {
    errors.quizzes = { _error: 'Bài kiểm tra phải có ít nhất một câu hỏi' };
  } else {
    //validate array question
    const quizArrayErrors = [];
    values.quizzes.forEach((quiz, quizIndex) => {
      const quizErrors = {};
      if(!quiz || !quiz.question) {
        quizErrors.question = 'Yêu cầu';
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
          quizErrors.answers = answerArrayErrors
          quizArrayErrors[quizIndex] = quizErrors
        }
        quizErrors.answers = answerArrayErrors;
        //end array answer
      }
    });
    if(quizArrayErrors.length) {
      errors.quizzes = quizArrayErrors;
    }
    //end array question
  }
  return errors;
}

export default validateFormAddQuiz;