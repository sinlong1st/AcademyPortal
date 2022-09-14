import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Question from './Question';
// import QuestionSubmit from './QuestionSubmit';
import "./style.css";

class Quiz extends Component {
  constructor(props){
    super(props);
    this.state = {
      start: false,
    }
    this.start = this.start.bind(this);
  }

  start = () => {
    this.setState({start: true})
  }

  shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }

  render() {
    const { quiz, shuffle, showDefaultResult, onComplete, customResultPage } = this.props;
    if(!quiz) {
      console.error("Quiz object is required.");
      return (null);
    } 
    let questions = quiz.listQuiz;
      if(shuffle) {
        questions = this.shuffleQuestions(questions);
      }
      return (
        <div className="react-quiz-container">
          {!this.state.start &&
            <div>
              <div className="questionModal">
                <div className="alert default">
                  <h2>{quiz.title}</h2>
                </div>
              </div>
              { quiz.description && 
                  <div className="quiz-synopsis">
                      {quiz.description}
                  </div> 
              }
              <div>Gồm {questions.length} câu hỏi</div>
              <div className="startQuizWrapper">
                <button onClick={this.start} className="startQuizBtn btn">Bắt đầu làm bài</button>
              </div>
            </div>
          }

          {/* {
            this.state.start && <Question questions={questions} showDefaultResult={showDefaultResult} onComplete={onComplete} customResultPage={customResultPage}/>
          } */}
          {
            this.state.start && <Question questions={questions} showDefaultResult={showDefaultResult} onComplete={onComplete} customResultPage={customResultPage}/>
          }
        </div>
      );
    }
}

Quiz.propTypes = {
  quiz: PropTypes.object,
  shuffle: PropTypes.bool,
  showDefaultResult: PropTypes.bool,
  onComplete: PropTypes.func,
  customResultPage: PropTypes.func
};

export default Quiz;