import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//action
import { getDetailQuizByPassword, isDoQuiz } from '../../../actions/testQuizAction';
//component
import SweetAlert from 'react-bootstrap-sweetalert';
import { Modal, ModalBody } from 'reactstrap';
import QuizTest from './QuizTest';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../../validation/is-empty';

class QuizLesson extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizDetail: {},
      loading: true,
      timeout: 300,
      isShowSuccess: false,
      isLoading: false,
      alert: '',
      typeAlert: '',
      loadingQuizDone: true,
      quizDone: {}
    };
  }

  componentDidMount = () => {
    this.props.isDoQuiz(this.props.match.params.id, this.props.match.params.quizId);
    this.props.getDetailQuizByPassword(this.props.match.params.lessonId, this.props.match.params.quizId, this.props.location.state.password);
  }

  componentWillReceiveProps(nextProps) {
    let alert = '';
    let typeAlert = '';
    if(nextProps.success.data !== undefined && nextProps.success.data !== this.props.success.data) {
      if (nextProps.success.data.message === 'success') {
        alert = 'Số điểm của bạn là: ' + nextProps.success.data.data + ' điểm';
        typeAlert = 'success';
      } else {
        typeAlert = 'error';
        alert = nextProps.success.data.data;
      }
      this.setState({isShowSuccess: true, isLoading: false, alert: alert, typeAlert: typeAlert});
    }

    const { quizDetail, loading, quizDone, loadingQuizDone } = nextProps.testQuiz
    if(!isEmptyObj(quizDetail))
      this.setState({ 
        quizDetail,
        loading
      });
    this.setState({
      quizDone,
      loadingQuizDone,
      loading 
    });  
  }

  static contextTypes = {
    router: () => null
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.isDoQuiz(this.props.match.params.id, this.props.match.params.quizId);
    this.props.getDetailQuizByPassword(this.props.match.params.lessonId, this.props.match.params.quizId, this.props.location.state.password);
  }

  shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }
  render(){
    const { loading, loadingQuizDone, quizDone } = this.state;
    let quizDetail = this.state.quizDetail;
    if(quizDetail.listQuiz) {
      quizDetail.listQuiz = this.shuffleQuestions(quizDetail.listQuiz);
    }
    return  (
      <div>
        {
          loading || loadingQuizDone
          ?
          <ReactLoading type='bars' color='#05386B' />
          :
          <QuizTest quizTest={quizDetail} quizDone={quizDone} shuffle={true}/>
        }
        {
          this.state.typeAlert === 'success' ?
          (<SweetAlert
            custom
            confirmBtnText="Quay lại"
            confirmBtnBsStyle="primary"
            title={this.state.alert}
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            >
          </SweetAlert>) : 
          (
            <SweetAlert
              danger
              confirmBtnText="Quay lại"
              confirmBtnBsStyle='danger'
              title={ this.state.alert }
              show={this.state.isShowSuccess}
              onConfirm={this.hideAlertSuccess.bind(this)}
              >
            </SweetAlert>
          )
        }
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm bài kiểm tra</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

QuizLesson.propTypes = {
  getDetailQuizByPassword : PropTypes.func.isRequired,
  testQuiz: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getDetailQuizByPassword: bindActionCreators(getDetailQuizByPassword, dispatch),
  isDoQuiz: bindActionCreators(isDoQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success, 
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizLesson);