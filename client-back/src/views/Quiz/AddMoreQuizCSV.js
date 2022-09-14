import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getDetailQuiz } from '../../actions/testQuizAction';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import { bindActionCreators } from 'redux';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem, Modal, ModalBody, Button, Alert, FormGroup } from 'reactstrap';
import CSVReader from "react-csv-reader";
import SweetAlert from 'react-bootstrap-sweetalert';
import { addMoreQuizCSV, clearSuccess } from '../../actions/testQuizAction';
import { withRouter } from 'react-router-dom';

class AddMoreQuizCSV extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quiz: null,
      quizDetail: {},
      loading: true,
      isShowSuccess: false,
      isLoading: false
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

    if (nextProps.success.mes === "Thêm câu hỏi thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess()
    }
  }

  handleForce = data => {
    var quiz = {
      listQuiz: []
    }
    for(var i = 0; i < data.length - 1; i++ )
    {
      var q = {
        question: data[i][0],
        answers: []
      }
      var k = 1;

      for(var j = 0; j < Number(data[i][1]); j++ )
        q.answers.push(data[i][++k])

      q.correctAnswer = data[i][++k]
      q.explanation = data[i][++k]
      quiz.listQuiz.push(q)
    }

    this.setState({ quiz })
  };

  save=()=>{
    this.props.addMoreQuizCSV(this.props.match.params.id, this.state.quiz);
    this.setState({
      isLoading: true
    })
  }

  hideAlertSuccess(){
    this.setState({
      quiz: null,
      isShowSuccess: false
    })
    this.props.history.push(`/quiz/quiz-detail/${this.props.match.params.id}`)
  }

  render() {
    const { quizDetail, loading, quiz } = this.state;
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
            <ListGroup style={{marginTop:10, width: 180}}>
              <ListGroupItem action className='changeCursor' onClick={()=>window.open('https://drive.google.com/file/d/10DvbO9SgtBYo6Ji1tBEGBLCX9mS6LeVm/view')}>
                <span style={{marginLeft:10}}>Template file CSV</span>
              </ListGroupItem>
            </ListGroup>

            <div className="container">
              <CSVReader
                cssClass="react-csv-input"
                label="Hãy chọn file CSV"
                onFileLoaded={this.handleForce}
              />
            </div>
            {
              quiz
              ?
              <Fragment>
                <Button color="danger" onClick={this.save}>
                  Lưu câu hỏi
                </Button>
                {
                  quiz.listQuiz.map((quiz,index) =>
                    <FormGroup tag="fieldset" key={index}>
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
                        Câu số {quiz.correctAnswer} là câu trả lời đúng !
                        <br/>
                        <b>Giải thích:</b> <span style={{whiteSpace:'pre-wrap'}}>{quiz.explanation}</span>
                      </Alert>
                    </FormGroup>
                  )
                }
              </Fragment>
              :
              null
            }
            <SweetAlert
              success
              confirmBtnText="OK"
              confirmBtnBsStyle="success"
              title="Thêm câu hỏi thành công!"
              show={this.state.isShowSuccess}
              onConfirm={this.hideAlertSuccess.bind(this)}>
            </SweetAlert>
            <Modal isOpen={this.state.isLoading} className='modal-sm' >
              <ModalBody className="text-center">
                <h3>Đang thêm câu hỏi</h3>
                <br/>
                <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
              </ModalBody>
            </Modal>
          </CardBody>
        </Card>
      }
      </div>
    )
  }
    
}

const mapDispatchToProps = dispatch => ({
  getDetailQuiz: bindActionCreators(getDetailQuiz, dispatch),
  addMoreQuizCSV: bindActionCreators(addMoreQuizCSV, dispatch),
  clearSuccess: bindActionCreators(clearSuccess, dispatch),
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddMoreQuizCSV));
