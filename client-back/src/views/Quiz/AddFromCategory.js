import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//action
import { getCategory, clearErrors, clearSuccess } from '../../actions/quizbankActions';
import { addQuizFromCategory, getDetailQuiz } from '../../actions/testQuizAction';
//component
import { Card, CardHeader, CardBody, FormGroup, Alert, Row, Col, Label, CustomInput, Button, Container, Modal, ModalBody } from 'reactstrap';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';

class Category extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizDetail:[],
      chosenQuiz:[],
      category: {},
      loadingQuizDetail: true,
      loading: true,
      isShowSuccess: false,
      isShowError: false,
      isShowWarn: false,
      isLoading: false
    };
  }

  componentDidMount = () => {
    this.props.getCategory(this.props.match.params.catId);
    this.props.getDetailQuiz(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {

    const { category, loading } = nextProps.quizbank
    if(!isEmptyObj(category))
      if(category._id === this.props.match.params.catId)
      {
        category.listQuiz.map(quiz=>{
          return quiz.check = false;
        })
        this.setState({ 
          category,
          loading 
        });
      }
    this.setState({
      loading 
    });

    if(!isEmptyObj(nextProps.testQuiz))
    {
      const { quizDetail, loading } = nextProps.testQuiz
      if(!isEmptyObj(quizDetail))
        this.setState({ 
          quizDetail,
          loadingQuizDetail: loading 
        });
      this.setState({
        loadingQuizDetail: loading         
      });  
    }

    if (nextProps.success.mes === "Thêm câu hỏi vào bài kiểm tra thành công") {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push(`/quiz/quiz-detail/${this.props.match.params.id}`)
  }

  hideAlertError(){
    this.setState({
      isShowError: false
    })
  }

  hideAlertWarn(){
    this.setState({
      isShowWarn: false
    })
  }

  onChangeCheckbox(quizId){
    var checkExist = this.state.quizDetail.listQuiz.find( quiz => quiz._id === quizId );
    if(checkExist)
    {
      this.setState({ isShowError: true });
      return
    }

    const result = this.state.chosenQuiz.find( quiz => quiz._id === quizId );

    if(result)
    {
      var updatedList = JSON.parse(JSON.stringify(this.state.chosenQuiz));    
      updatedList = updatedList.filter((quiz)=>
        quiz._id.search(quizId) === -1 
      );
      this.setState({ chosenQuiz: updatedList });

      this.state.category.listQuiz.map(quiz => {
        if(quiz._id.toString() === quizId.toString())
          return quiz.check = false;
        return quiz;
      })
      this.setState({ category: this.state.category });

    }else{
      const find = this.state.category.listQuiz.find( quiz => quiz._id === quizId );
      var updatedList2 = JSON.parse(JSON.stringify(this.state.chosenQuiz));    
      updatedList2.push(find)
      this.setState({ chosenQuiz: updatedList2 });

      this.state.category.listQuiz.map(quiz => {
        if(quiz._id.toString() === quizId.toString())
          return quiz.check = true;
        return quiz;
      })
      this.setState({ category: this.state.category });
    }

  }

  onSubmit = () =>{
    if(this.state.chosenQuiz.length === 0)
    {
      this.setState({ isShowWarn: true })
    }else{
      var testQuizData ={
        listQuiz: this.state.chosenQuiz
      }
      this.props.addQuizFromCategory(this.props.match.params.id, testQuizData)
      this.setState({ isLoading: true })
    }
  }

  onSubmitAll=()=>{
    this.setState({
      chosenQuiz: []
    })

    var listQuiz = this.state.category.listQuiz
    var chosenQuiz = []
    for(var i=0; i < listQuiz.length; i++)
    {
      // eslint-disable-next-line
      var checkExist = this.state.quizDetail.listQuiz.find(quiz => quiz._id === listQuiz[i]._id );
      if(checkExist)
        listQuiz[i].check = false
      else{
        chosenQuiz.push(listQuiz[i])
        listQuiz[i].check = true
      }
    }
    this.setState({ chosenQuiz });

  }

  render(){
    const { category, loading } = this.state;
    return  (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B' />
        :
        <Card>
          <CardHeader>
            <b>{category.category}</b>
          </CardHeader>
          <CardBody>
            <Container>
              <Button color="primary" onClick={this.onSubmit}>
                Thêm các câu hỏi đã chọn vào bài trắc nghiệm
              </Button>
            </Container>
            <Button style={{marginLeft:10}} color="danger" onClick={this.onSubmitAll}>
              Chọn tất cả cẩu hỏi
            </Button>
            {
              category.listQuiz.map((quiz,index) =>
                <FormGroup tag="fieldset" key={quiz._id}>
                  <hr/>
                  <Label check>
                    <CustomInput type="checkbox" id="exampleCustomCheckbox" onChange={this.onChangeCheckbox.bind(this, quiz._id)} checked={quiz.check}/>
                    <legend>Câu hỏi {index + 1}: <span style={{whiteSpace:'pre-wrap'}}>{quiz.question}</span></legend>
                  </Label>
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
                    <br/>
                    <b>Người tạo:</b>
                    <Row>
                      <Col sm="1">
                        <div className="avatar" style={{marginLeft: 20}}>
                          <img src={quiz.creator.photo} className="img-avatar" alt="" />
                        </div>
                      </Col>
                      <Col>
                        <div><b>{quiz.creator.name}</b></div>
                        <div className="small text-muted">
                          {quiz.creator.email}
                        </div>
                      </Col>
                    </Row>
                  </Alert>
                </FormGroup>
              )
            }
          </CardBody>
        </Card>
      }
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          warning
          confirmBtnText="OK"
          confirmBtnBsStyle="warning"
          title="Không có câu hỏi nào được chọn"
          show={this.state.isShowWarn}
          onConfirm={this.hideAlertWarn.bind(this)}>
        </SweetAlert>
        <SweetAlert
          danger
          confirmBtnText="OK"
          confirmBtnBsStyle="danger"
          title="Câu hỏi này đã có trong bài trắc nghiệm!"
          show={this.state.isShowError}
          onConfirm={this.hideAlertError.bind(this)}>
        </SweetAlert>
        <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Thêm câu hỏi vào bài kiểm tra thành công!"
          show={this.state.isShowSuccess}
          onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getCategory: bindActionCreators(getCategory, dispatch),
  clearErrors: bindActionCreators(clearErrors, dispatch),
  clearSuccess: bindActionCreators(clearSuccess, dispatch),
  addQuizFromCategory: bindActionCreators(addQuizFromCategory, dispatch),
  getDetailQuiz: bindActionCreators(getDetailQuiz, dispatch)
});

const mapStateToProps = state => ({
  quizbank: state.quizbank,
  testQuiz: state.testQuiz,
  success: state.success,
  errors: state.errors
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);