import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//action
import { getListQuiz, getQuizSubmisstion } from '../../actions/testQuizAction';
//component
import { Button} from 'reactstrap';
import QuizTestResult from '../../components/Quiz/QuizTestResult';
import ReactLoading from 'react-loading';
class QuizTestPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timeout: 300,
      isShowSuccess: false,
      isLoading: false,
      alert: '',
      typeAlert: '',
    };
  }

  componentDidMount = () => {
    this.props.getListQuiz();
    this.props.getQuizSubmisstion(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    let alert = '';
    let typeAlert = '';
    if(nextProps.success.data !== undefined && nextProps.success.data !== this.props.success.data) {
      if (nextProps.success.data.message === 'success') {
        // this.jumpToListQuiz();
        alert = 'Số điểm của bạn là: ' + nextProps.success.data.data + 'điểm';
        typeAlert = 'success';
      } else {
        typeAlert = 'error';
        alert = nextProps.success.data.data;
      }
      this.setState({isShowSuccess: true, isLoading: false, alert: alert, typeAlert: typeAlert});
    }
  }

  jumpToListQuiz = () => {
    this.props.history.push('/quiz');
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.jumpToListQuiz();
  }

  render(){
    var testQuiz = '';
    var quizSubmission = '';
    if(this.props.testQuiz.listTestQuiz != null)
    {
      testQuiz = this.props.testQuiz.listTestQuiz.find(test => test._id.toString() === this.props.match.params.id);
      quizSubmission = this.props.testQuiz.quizSubmission;
      return  (
        <div>
          <h3>Số điểm của bạn là: {quizSubmission.point}điểm</h3>
          <QuizTestResult quizTest={testQuiz} quizSubmission={quizSubmission} shuffle={true}/>
          <Button color="primary" onClick={this.jumpToListQuiz}>Quay về danh sách Bài thi</Button>
          </div>
      )
    }
    else {
      return <ReactLoading type='bars' color='#05386B' height={100} width={50} />
    }
    
  }
}

QuizTestPage.propTypes = {
  getListQuiz : PropTypes.func.isRequired,
  getQuizSubmisstion : PropTypes.func.isRequired,
  testQuiz: PropTypes.object.isRequired,
};

// const mapDispatchToProps = dispatch => ({
//   getListQuiz: bindActionCreators(getListQuiz, dispatch),
//   getQuizSubmisstion: bindActionCreators(getQuizSubmisstion, dispatch)
// });

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success, 
});

export default connect(mapStateToProps, {getListQuiz , getQuizSubmisstion})(QuizTestPage);