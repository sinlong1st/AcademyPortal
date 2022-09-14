import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//action
import { getDetailQuiz } from '../../actions/testQuizAction';
//component
import { Card, CardHeader, CardBody, FormGroup, Alert, Button, Container } from 'reactstrap';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import ModalEditQuiz from './ModalEditQuiz';
import DeleteQuiz from './DeleteQuiz';
import SweetAlert from 'react-bootstrap-sweetalert';

class QuizDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizDetail: {},
      isShowSuccess: false,
      isShowSuccessDel: false,
      isShowError: false,
      loading: true
    };
  }

  componentDidMount = () => {
    this.props.getDetailQuiz(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {

    const { quizDetail, loading } = nextProps.testQuiz
    if(!isEmptyObj(quizDetail))
      this.setState({ 
        quizDetail,
        loading 
      });
    this.setState({
      loading 
    });  

    if (nextProps.success.mes === "Thay đổi câu hỏi thành công") {
      this.setState({
        isShowSuccess: true
      })
    }

    if (nextProps.success.mes === "Xóa câu hỏi thành công") {
      this.setState({
        isShowSuccessDel: true
      })
    }

    if (nextProps.errors.err === "Hãy điền hết những nội dung yêu cầu") {
      this.setState({
        isShowError: true
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getDetailQuiz(this.props.match.params.id);
  }

  hideAlertSuccessDel(){
    this.setState({
      isShowSuccessDel: false
    })
    this.props.getDetailQuiz(this.props.match.params.id);
  }

  hideAlertError(){
    this.setState({
      isShowError: false
    })
  }

  render(){
    const { quizDetail, loading } = this.state;
    return  (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B' />
        :
        <Card>
          <CardHeader>
            <b>{quizDetail.title}</b>
          </CardHeader>
          <CardBody>
            <Container>
              <Button color="primary" onClick={()=>this.props.history.push(`/quiz/quiz-detail/${this.props.match.params.id}/quiz-bank`)}>
                Thêm câu hỏi từ ngân hàng
              </Button>
            </Container>
            {
              quizDetail.description &&
              <Alert color="secondary">
                <span style={{whiteSpace:'pre-wrap'}}>
                  {quizDetail.description}
                </span>
              </Alert>
            }
            {
              quizDetail.listQuiz.map((quiz,index) =>
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
                  <ModalEditQuiz quiz={quiz} />
                  <DeleteQuiz quizId={quiz._id} />
                </FormGroup>
              )
            }
          </CardBody>
        </Card>
      }
      <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Thay đổi câu hỏi thành công!"
          show={this.state.isShowSuccess}
          onConfirm={this.hideAlertSuccess.bind(this)}>
      </SweetAlert>
      <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Đã xóa!"
          show={this.state.isShowSuccessDel}
          onConfirm={this.hideAlertSuccessDel.bind(this)}>
      </SweetAlert>
      <SweetAlert
          danger
          confirmBtnText="OK"
          confirmBtnBsStyle="danger"
          title="Hãy điền hết nội dung yêu cầu"
          show={this.state.isShowError}
          onConfirm={this.hideAlertError.bind(this)}>
      </SweetAlert>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getDetailQuiz: bindActionCreators(getDetailQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success,
  errors: state.errors
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetail);