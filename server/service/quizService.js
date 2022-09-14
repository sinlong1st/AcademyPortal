const quizService = {
  //params: array: listQuiz, array submistionAnswer
  //return: float point
  calPointQuiz: (listQuiz, submistionAnswer) => {
    let numberQuizCorrect = 0;
    listQuiz.forEach((element, index) => {
        if(element.correctAnswer == submistionAnswer[element._id]) {
            numberQuizCorrect++;
        }
    });
    var numb = numberQuizCorrect / listQuiz.length * 10;
    numb = numb.toFixed(1);
    return numb;
  },
  checkvalueKeyExist: (arr, key, value) => {
    let result = -1;
    arr.forEach((element, index) => {
        if(JSON.stringify(element[key]) === JSON.stringify(value)) {
            result = index;
        }
    });
    return result;
  }
}

module.exports = quizService;