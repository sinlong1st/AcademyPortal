import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty';
import { withRouter } from 'react-router-dom';
import { editQuiz, clearSuccess, clearErrors } from '../../actions/testQuizAction';
import ReactLoading from 'react-loading';

class ModalEditQuiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      quiz: null,
      isLoading: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.setState({
      modal: !this.state.modal,
      quiz: this.props.quiz
    });
  }

  changeQuestion = e =>{
    e.preventDefault();
    var quiz = this.state.quiz
    quiz.question = e.target.value;

    this.setState({ quiz });
  }

  changeAnswer(key, e){
    var quiz = this.state.quiz
    for(var i=0; i < quiz.answers.length; i++)
    {
      if(i === key)
        quiz.answers[i] = e.target.value
    }
    this.setState({ quiz });
  }

  changeCorrestAnswer = e =>{
    e.preventDefault();
    var quiz = this.state.quiz
    quiz.correctAnswer = e.target.value;

    this.setState({ quiz });
  }

  changeExplanation = e =>{
    e.preventDefault();
    var quiz = this.state.quiz
    quiz.explanation = e.target.value;

    this.setState({ quiz });
  }

  submit = e =>{
    e.preventDefault();
    this.setState({ isLoading: true })
    var quizData = {
      quiz: this.state.quiz
    }
    this.props.editQuiz(this.props.match.params.id, quizData)
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.errors.err === "Hãy điền hết những nội dung yêu cầu") {
      this.setState({
        isLoading: false
      })
      this.props.clearErrors()
    }

    if (nextProps.success.mes === "Thay đổi câu hỏi thành công") {
      this.setState({
        isLoading: false
      })
      this.props.clearSuccess()
    }
  }

  render() {
    const { quiz } = this.state;
    return (
      <Fragment>
        <Button onClick={this.onOpenModal} color="success">Sửa câu hỏi</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-lg'>
          <ModalHeader toggle={this.toggle}>Chỉnh sửa câu hỏi</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:470}}>
            {
              isEmptyObj(quiz)
              ?
              null
              :
              <Form action="" method="post">
                <FormGroup>
                  <Label>Câu hỏi <span style={{ color: 'red' }}>*</span></Label>
                  <Input type="textarea" value={quiz.question} onChange={this.changeQuestion}/>
                </FormGroup>
                {
                  quiz.answers.map((answer, key) => {
                    return (
                      <FormGroup key={key}>
                        <Label>Câu trả lời {key+1} <span style={{ color: 'red' }}>*</span></Label>
                        <Input type="textarea" value={answer} onChange={this.changeAnswer.bind(this, key)}/>
                      </FormGroup>
                    )
                  })
                }
                <FormGroup>
                  <Label>Câu trả lời đúng <span style={{ color: 'red' }}>*</span></Label>
                  <Input type="select" onChange={this.changeCorrestAnswer} value={quiz.correctAnswer[0]}>
                    {
                      quiz.answers.map((answer, index) => {
                        return (
                          <option key={index+1} value={index+1}>{`Câu trả lời ${index + 1}`}</option>
                        )
                      })
                    }
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Giải thích</Label>
                  <Input type="textarea" value={quiz.explanation} onChange={this.changeExplanation}/>
                </FormGroup>
              </Form>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.submit}>Lưu</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thay đổi</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
      
    );
  }
}

const mapStateToProps = state => ({
  success: state.success,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { editQuiz, clearSuccess, clearErrors })(ModalEditQuiz));
