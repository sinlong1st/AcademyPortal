import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { Button, Form, FormGroup, Label, Input, Alert, Card, CardBody } from 'reactstrap';
import { submitTestQuiz } from '../../../actions/testQuizAction';
import  validateFormTestQuiz  from '../../../validation/validateFormTestQuiz';
import "./style.css";
import { withRouter } from 'react-router-dom';
import Countdown from "react-countdown-now";
import { Prompt } from 'react-router'
import isEmptyObj from '../../../validation/is-empty';


// Random component
const Completionist = () => <span>Hết giờ!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Completionist />;
  } else {
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
};

class TestQuizForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issubmit: false,
      isStart: false,
      date: null
    };
  }

  submit = (values) => {
    this.setState({issubmit: true})

    if(values.answer === undefined)
      values.answer = []

    values.courseId = this.props.match.params.id
    this.props.submitTestQuiz(values);
  }

  submit2 = () => {
    this.setState({issubmit: true})
    var values = {}
    values.quizId = this.props.match.params.quizId
    values.courseId = this.props.match.params.id
    values.answer = []
    this.props.submitTestQuiz(values);
  }

  componentDidMount() {
    this.props.initialize({ quizId: this.props.quizTest._id });
  }

  renderQuestion = ({ input, quiz, index, meta: { touched, error } }) => {
    let answers = quiz.answers;
    return (
      <FormGroup tag="fieldset">
        <legend>Câu hỏi {index + 1}: <span style={{whiteSpace:'pre-wrap'}}>{quiz.question}</span></legend>
        <ul>
        {
          answers.map( (answer, key) => {
            return (
              <li className="custom-control custom-radio" key={key}>
                <Input className="custom-control-input" {...input} type="radio" id={index + '_' + key} value={key + 1} />{' '}
                <Label className="custom-control-label" for={index + '_' + key}><span style={{whiteSpace:'pre-wrap'}}>{answer}</span></Label>
              </li>
            )
          })
        }
        </ul>
        {touched && error && <Label className="error">{error}</Label>}
      </FormGroup>
    )
  }

  static contextTypes = {
    router: () => null
  }

  back = () => {
    this.context.router.history.goBack();
  }
  start = () => {
    const { quizTest } = this.props;
    this.setState({ 
      date: quizTest.time * 60000,
      isStart: true
    })
    this.countdownInterval = window.setInterval(() => {
      if (this.state.date <= 0 && this.state.issubmit === false) {
        return this.submit()
      }

      this.setState(({ date }) => ({ date: date - 1000 }));
    }, 1000);
  };

  componentDidUpdate = () => {
    window.onbeforeunload = () => {
      if(this.state.issubmit === false && this.state.isStart === true){
        this.submit2()
      }
        
      else
        return null
    }
  }

  componentWillUnmount() { window.onbeforeunload = null; }

  render() {

    const { handleSubmit, quizTest, submitting, quizDone } = this.props;
    const { isStart } = this.state;
    
    return (
      <Fragment>
        {
          quizTest === 'Mật khẩu sai' ? 
          <Card>
            <CardBody>
              <Alert color="danger">
                Bạn đã nhập sai mật khẩu, nhấn nút quay lại
              </Alert>
              <Button color="danger" onClick={this.back}>Quay lại</Button>
            </CardBody>
          </Card>
          :
          <Fragment>
            <Prompt when={isStart} message={this.submit2} />
            {
              isStart
              ?
              <Fragment>
                <div className="sticky">
                  <b>
                    <span style={{color: 'red'}}>
                      <Countdown
                        date={Date.now() + this.state.date}
                        onComplete={handleSubmit(this.submit)}
                        renderer={renderer}
                      />
                    </span>
                  </b>
                </div>
                <Form className="form-quiz-test" onSubmit={ handleSubmit(this.submit) } >
                  <div className="title" >{quizTest.title}</div>
                  {
                    quizTest.description &&
                    <div className="subtitle">
                      {quizTest.description}
                    </div>
                  }
                  <Field
                      name="quizId"
                      component="input"
                      type="hidden"
                    />
                  {
                    quizTest.listQuiz.map((quiz, index) => {
                      let name = 'answer[' + quiz._id + ']';
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
              </Fragment>
              :
              <Fragment>
              {
                isEmptyObj(quizDone)
                ?
                <Card>
                  <CardBody>
                    <Button color="danger" onClick={this.start}>Bắt đầu làm trắc nghiệm</Button>
                    <div className="tit" >{quizTest.title}</div>
                    <h5>
                      Thời gian làm bài : {quizTest.time} phút
                    </h5>
                    <h5 style={{marginBottom: 20}}>
                      Số câu hỏi : {quizTest.listQuiz.length}
                    </h5>
                    <Alert color="warning">
                      Cảnh báo! Nếu đang làm bài mà thoát ra khỏi trang làm bài khi chưa nộp bài sẽ bị 0 điểm.
                    </Alert>
                  </CardBody>
                </Card>
                :
                <Card>
                  <CardBody>
                    <div className="tit" >{quizTest.title}</div>
                    <h5 style={{marginBottom: 20}}>
                      Điểm của bạn bài làm này: {quizDone.point} điểm
                    </h5>
                    <Alert color="dark" style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
                      Đáp án và giải thích
                    </Alert>
                    {
                      quizTest.listQuiz.map((quiz,index) =>
                        <FormGroup tag="fieldset" key={quiz._id}>
                          <legend>Câu hỏi {index + 1}: <span style={{whiteSpace:'pre-wrap'}}>{quiz.question}</span></legend>
                          <ul>
                          {
                            quiz.answers.map((answer, key) => {
                              return (
                                <li key={key}>
                                  <span style={{whiteSpace:'pre-wrap'}}>{answer}</span>
                                </li>
                              )
                            })
                          }
                          </ul>
                          <Alert color="success">
                            Câu số <b>{quiz.correctAnswer}</b> là câu trả lời đúng !
                            <br/>
                            <b>Giải thích:</b> <span style={{whiteSpace:'pre-wrap'}}>{quiz.explanation}</span>
                          </Alert>
                        </FormGroup>
                      )
                    }
                  </CardBody>
                </Card>
              }
              </Fragment>
            }
          </Fragment>
        }
      </Fragment>
    );
  }
}

TestQuizForm = reduxForm({
  form: 'testForm',
  validateFormTestQuiz
})(TestQuizForm);

TestQuizForm = connect(
  state => {
    return {}
  },
  { submitTestQuiz }
)(TestQuizForm)

export default withRouter(TestQuizForm);