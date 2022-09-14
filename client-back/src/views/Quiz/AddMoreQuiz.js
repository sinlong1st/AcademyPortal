import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDetailQuiz, clearSuccess } from '../../actions/testQuizAction';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import { bindActionCreators } from 'redux';
import { Card, CardHeader, CardBody } from 'reactstrap';
import AddMoreQuizForm from './AddMoreQuizForm';
import SweetAlert from 'react-bootstrap-sweetalert';

class AddMoreQuiz extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isShowSuccess: false,
      quizDetail: {},
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

    if (nextProps.success.mes === "Thêm câu hỏi vào bài kiểm tra thành công") {
      this.setState({ isShowSuccess: true })
      this.props.clearSuccess()
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push(`/quiz/quiz-detail/${this.props.match.params.id}`)
  }

  render() {
    const { quizDetail, loading } = this.state;
    return (
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
            <AddMoreQuizForm/>
          </CardBody>
          <SweetAlert
            success
            confirmBtnText="OK"
            confirmBtnBsStyle="success"
            title="Thêm câu hỏi vào bài kiểm tra thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
          </SweetAlert>
        </Card>
      }
      </div>
    )
  }
    
}

const mapDispatchToProps = dispatch => ({
  getDetailQuiz: bindActionCreators(getDetailQuiz, dispatch),
  clearSuccess: bindActionCreators(clearSuccess, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success  
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMoreQuiz);
