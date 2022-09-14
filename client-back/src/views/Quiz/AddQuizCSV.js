import React, { Component, Fragment } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import { Card, CardHeader, CardBody, FormGroup, Alert, Button, ListGroup, ListGroupItem, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import CSVReader from "react-csv-reader";
import { addTestQuizCSV } from '../../actions/testQuizAction';

class AddQuizCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: null,
      isShowSuccess: false,
      isLoading: false
    };
  }

  handleForce = data => {
    var quiz = {
      title: data[0][0],
      description: data[0][1],
      time: data[0][2],
      listQuiz: []
    }
    for(var i = 1; i < data.length - 1; i++ )
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === "Thêm bài kiểm tra thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }
  }

  save=()=>{
    this.props.addTestQuizCSV(this.state.quiz);
    this.setState({
      isLoading: true
    })
  }

  hideAlertSuccess(){
    this.setState({
      quiz: null,
      isShowSuccess: false
    })
    this.props.history.push('/quiz')
  }

  render() {
    const { quiz } = this.state
    return (
      <div className="animated fadeIn">
        <ListGroup style={{marginTop:10, width: 180}}>
          <ListGroupItem action className='changeCursor' onClick={()=>window.open('https://drive.google.com/file/d/19_2QxB7x54ADzRrUWS_lQgqGSX7SlwqV/view?usp=sharing')}>
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
              Lưu bài trắc nghiệm
            </Button>
            <Card style={{marginTop:20}}>
              <CardHeader>
                <b>{quiz.title}</b>
                <div className="card-header-actions" style={{marginRight:10}} >
                </div>
              </CardHeader>
              <CardBody>
                <p>Thời gian làm bài: {quiz.time} phút</p>
                {
                  quiz.description &&
                  <Alert color="secondary">
                    <span>
                      {quiz.description}
                    </span>
                  </Alert>
                }
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
              </CardBody>
            </Card>
          </Fragment>
          :
          null
        }
        <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Thêm bài kiểm tra thành công!"
          show={this.state.isShowSuccess}
          onConfirm={this.hideAlertSuccess.bind(this)}
          onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
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

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { addTestQuizCSV })(AddQuizCSV);
