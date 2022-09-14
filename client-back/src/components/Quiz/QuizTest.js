import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { submitTestQuiz } from '../../actions/testQuizAction';
import  validateFormTestQuiz  from '../../validation/validateFormTestQuiz';
import "./style.css";

class TestQuizForm extends Component {
  submit = (values) => {
    return this.props.submitTestQuiz(values);
  }
  componentDidMount() {
    this.props.initialize({ quizId: this.props.quizTest._id });
  }
  renderQuestion = ({ input, quiz, index, id='', meta: { touched, error } }) => {
  let answers = quiz.answers;
  return (
    <FormGroup tag="fieldset">
      <legend style={{whiteSpace:'pre-wrap'}}>{ quiz.question }</legend>
      <ul>
      {
        answers.map( (answer, key) => {
          return (
            <li className="custom-control custom-radio" key={key}>
                <Input className="custom-control-input" {...input} type="radio" id={index + '_' + key} value={key + 1} />{' '}
                <Label className="custom-control-label" style={{whiteSpace:'pre-wrap'}} for={index + '_' + key}>{answer}</Label>
            </li>
            
          )
        })
      }
      </ul>
      {touched && error && <Label className="error">{error}</Label>}
    </FormGroup>
    )
  }  
  render() {

  const { handleSubmit, quizTest, submitting } = this.props;
    return (
      <Form className="form-quiz-test" onSubmit={ handleSubmit(this.submit) } >
        <div className="title">{quizTest.title}</div>
        {/* <div>{quizTest.description}</div> */}
        <Field
            name="quizId"
            component="input"
            type="hidden"
          />
        {
          quizTest.listQuiz.map((quiz, index) => {
            let name = 'answer[' + index + ']';
            return (
              <Field
                name={name}
                component={this.renderQuestion}
                quiz={quiz}
                index={index}
                key={index}
              />
            )
          })
        }
        <FormGroup>
	        <Button color="primary" type="submit" disabled={submitting}>Nộp bài</Button>
	      </FormGroup>
	    </Form>
    );
  }
}

TestQuizForm = reduxForm({
  form: 'testForm',
  validateFormTestQuiz
})(TestQuizForm);

TestQuizForm = connect(
  state => {
  },
  { submitTestQuiz }
)(TestQuizForm)

export default TestQuizForm;
