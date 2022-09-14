import React, { Component,Fragment } from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  Button, 
  Row, 
  Col,
  CardBody,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import { addQuizLesson, getLessonIncourse, clearSuccess, clearErrors } from '../../../actions/lessonActions'; 
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class ChooseQuizModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      password: '',
      deadline: '',
      startTime: '',
      isOpenModal: false,
      isLoading: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleClickQuiz = this.handleClickQuiz.bind(this);
  }

  toggleModal() {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  onOpenModal = e => {
    e.preventDefault();
    this.setState({
      isOpenModal: !this.state.isOpenModal
    });
  }

  handleClickQuiz(){
    this.setState({ errors: {} })

    const timeData = {
      password: this.state.password,
      deadline: this.state.deadline,
      startTime: this.state.startTime
    }

    if(timeData.startTime === '' || timeData.deadline === ''){
      let errors = {}
      errors.deadline = 'Hãy chọn thời gian bắt đầu làm và deadline'

      this.setState({
        errors
      })
    }
    else{
      this.props.addQuizLesson(this.props.match.params.id, this.props.match.params.lessonId, this.props.quizId, timeData)
      this.setState({ isLoading: true })
    }

  } 

  componentWillReceiveProps(nextProps) {

    if (nextProps.success.mes === "Chọn bài trắc nghiệm cho bài học thành công") {
      this.setState({ isLoading: false })
      this.props.clearSuccess()
    }

    if (nextProps.errors.addfail === "Bài trắc nghiệm đã có trong khóa học này") {
      this.setState({ isLoading: false })      
      this.props.clearErrors()
    }
    
  }

  onChangedeadline = time =>{
    this.setState({
      deadline: time
    })
  }

  onChangePassword =e=> {
    this.setState({
      password: e.target.value
    })
  }

  onChangeStartTime = time=>{
    this.setState({
      startTime: time
    })
  }

  render() {
    const { password, startTime, deadline, errors } = this.state;
    return (
      <Fragment>
        <Button color="danger" onClick={this.onOpenModal}>Chọn</Button>
        <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal} className='modal-lg'>
          <ModalHeader  toggle={this.toggleModal}>Chọn trắc nghiệm</ModalHeader>
          <ModalBody>
            <CardBody>
              <Row>
                <Col xs="10">
                  <div>
                    <label className="col-md-4"  style={{ fontWeight:'bold', marginTop:10}}>Mật khẩu: </label>
                    <Input style={{display: 'inline-block', width: 182}} type="text" name="password" value={password} onChange={this.onChangePassword}/>
                  </div>
                  <div>
                    <Label className="col-md-4" style={{ fontWeight:'bold', marginTop:10}}>Thời gian bắt đầu làm: </Label> 
                    <DatePicker
                      className='col-md-12'
                      selected={startTime}
                      onChange={this.onChangeStartTime}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={30}
                      isClearable={true}
                      dateFormat="dd/MM/yyyy HH:mm aa"
                      customInput={<Input />}
                      timeCaption="time"
                    />
                  </div>

                  <div>
                    <Label className='col-md-4' style={{ fontWeight:'bold', marginTop:10}}>Hạn chót làm bài: </Label> 
                    <DatePicker
                      selected={deadline}
                      onChange={this.onChangedeadline}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={30}
                      isClearable={true}
                      dateFormat="dd/MM/yyyy HH:mm aa"
                      customInput={<Input />}
                      timeCaption="time"
                    />
                  </div>

                </Col>

                <Col >
                  <Button color="primary" onClick={this.handleClickQuiz}>
                    Chọn
                  </Button>
                </Col>
              </Row>
              {errors.deadline && <Alert style={{marginTop: 10}} color="danger">{errors.deadline}</Alert>}

            </CardBody>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  success: state.success,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { addQuizLesson, clearSuccess, getLessonIncourse, clearErrors })(ChooseQuizModal));  