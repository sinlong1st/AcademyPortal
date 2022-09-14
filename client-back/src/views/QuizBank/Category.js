import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//action
import { getCategory, editCatName, clearErrors, clearSuccess } from '../../actions/quizbankActions';
//component
import { Card, CardBody, FormGroup, Alert, Button, Container, Label, Row, Col, Input, Modal, ModalBody } from 'reactstrap';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import ModalEditQuiz from './ModalEditQuiz';
import DeleteQuiz from './DeleteQuiz';
import SweetAlert from 'react-bootstrap-sweetalert';

class Category extends Component {
  constructor (props) {
    super(props);
    this.state = {
      category: {},
      isShowSuccess: false,
      isShowSuccessDel: false,
      isShowSuccessChange: false,
      isShowError: false,
      categoryName: '',
      errors: {},
      loading: true,
      isLoading: false
    };
  }

  componentDidMount = () => {
    this.props.getCategory(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {

    const { category, loading } = nextProps.quizbank
    if(!isEmptyObj(category))
      if(category._id === this.props.match.params.id)
        this.setState({ 
          categoryName: category.category,
          category,
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

    if (nextProps.success.mes === 'Thay đổi tên danh mục thành công') {
      this.setState({
        isShowSuccessChange: true,
        isLoading: false
      })
      this.props.clearSuccess();
    }

    if(!isEmptyObj(nextProps.errors))
    {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }
    this.setState({ errors: nextProps.errors})
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getCategory(this.props.match.params.id);
  }

  hideAlertSuccessDel(){
    this.setState({
      isShowSuccessDel: false
    })
    this.props.getCategory(this.props.match.params.id);
  }

  hideAlertSuccessChange(){
    this.setState({
      isShowSuccessChange: false
    })
    this.props.getCategory(this.props.match.params.id);
  }

  hideAlertError(){
    this.setState({
      isShowError: false
    })
  }

  onChange = e =>{
    this.setState({ [e.target.name]: e.target.value });
  }

  changeCategoryName = e =>{
    e.preventDefault();
    const catData = {
      category: this.state.categoryName
    };
    this.props.editCatName(this.props.match.params.id, catData)
    this.setState({ isLoading: true });
    this.props.clearErrors();
  }

  render(){
    const { errors, categoryName, category, loading } = this.state;
    return  (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B' />
        :
        <Card>
          <CardBody>
            <FormGroup>
              <Label style={{fontWeight: 'bold'}}>Tên danh mục</Label>
              <Row>
                <Col xs='10'>
                  <Input type="text" value={categoryName} spellCheck="false" name="categoryName" onChange={this.onChange}/>
                </Col>
                <Col>
                  <Button color="danger" onClick={this.changeCategoryName}>Lưu thay đổi</Button>
                </Col>
              </Row>
            </FormGroup>
            {errors.category && <Alert color="danger">{errors.category}</Alert>}

            <Container>
              <Button color="primary" onClick={()=>this.props.history.push(`/quiz-bank/${this.props.match.params.id}/add-quiz`)}>Nhập câu hỏi mới</Button>
              <Button color="primary" onClick={()=>this.props.history.push(`/quiz-bank/${this.props.match.params.id}/add-quiz-csv`)} style={{marginLeft: 20}}>Import file CSV câu hỏi mới</Button>
            </Container>
            {
              category.listQuiz.map((quiz,index) =>
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
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Thay đổi tên danh mục!"
          show={this.state.isShowSuccessChange}
          onConfirm={this.hideAlertSuccessChange.bind(this)}>
      </SweetAlert>
      <SweetAlert
          danger
          confirmBtnText="OK"
          confirmBtnBsStyle="danger"
          title="Hãy điền hết nội dung yêu cầu"
          show={this.state.isShowError}
          onConfirm={this.hideAlertError.bind(this)}>
      </SweetAlert>
      <Modal isOpen={this.state.isLoading} className='modal-sm' >
        <ModalBody className="text-center">
          <h3>Đang lưu thay đổi</h3>
          <br/>
          <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
        </ModalBody>
      </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getCategory: bindActionCreators(getCategory, dispatch),
  editCatName: bindActionCreators(editCatName, dispatch),
  clearErrors: bindActionCreators(clearErrors, dispatch),
  clearSuccess: bindActionCreators(clearSuccess, dispatch)
});

const mapStateToProps = state => ({
  quizbank: state.quizbank,
  success: state.success,
  errors: state.errors
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);