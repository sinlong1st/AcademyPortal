import React, { Component } from 'react';
import { connect } from 'react-redux'
// import { Col, Button, Form, FormGroup, Label, Input} from 'reactstrap';
// import  validateFormTestQuiz  from '../../validation/validateFormTestQuiz';
import "./style.css";

class TestQuizResult extends Component {
  submit = (values) => {
    return this.props.submitTestQuiz(values);
  }

  renderQuizResultQuestions = (quizTest) => {
    return quizTest.listQuiz.map((question, questionIdx) => {
      return (
        <div className="result-answer-wrapper" key={questionIdx+1}>
          <h3>
            Câu {questionIdx+1}: {question.question}
          </h3>
          <div className="result-answer">
            {
              question.answers.map( (answer, index) => {
                return(
                  <div>
                      {/*eslint-disable-next-line*/}
                      <button disabled={true} className={"answerBtn btn" + (index+1 == question.correctAnswer ? ' correct': '')}>
                      <span>{ answer }</span>
                    </button>
                  </div>
                )
              })
            }
        </div>
        {/* {this.renderExplanation(question, true)} */}
      </div>
      )
    })
  }
  render() {

  const { quizTest } = this.props;
    return (
      <div className="react-quiz-container">
        { this.renderQuizResultQuestions(quizTest) }
      </div>
    );
  }
}

TestQuizResult = connect(
  state => {
  },
)(TestQuizResult)

export default TestQuizResult;
