import React, { Component,Fragment } from 'react';
import {  
  Button, 
  Modal,
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  FormGroup,
  Col,
  Label,
  Input,
  Alert,
  ListGroup,
  ListGroupItem,
  Row 
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import { addExercise, clearSuccess, clearErrors } from '../../../actions/exerciseActions';
import { getLessonIncourse } from '../../../actions/lessonActions';
import isEmptyObj from '../../../validation/is-empty';
import { withRouter } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import config from '../../../config'
import NoImg from '../../../assets/img/NoImg.png';
import DateTimePicker from 'react-datetime-picker';

class ExerciseBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      text: '',
      attachFiles: [],
      password: '',
      deadline: this.nextweek(),
      large: false,
      errors: {},
      isShowSuccess: false,
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  nextweek(){
    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    return nextweek;
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
      title: '',
      text: '',
      attachFiles: [],
      deadline: this.nextweek()
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const exerciseData = {
      title: this.state.title,
      text: this.state.text,
      attachFiles: this.state.attachFiles,
      deadline: this.state.deadline,
      password: this.state.password,
      courseId: this.props.match.params.id,
      lessonId: this.props.match.params.lessonId
    };
    this.props.addExercise(exerciseData);
    this.setState({isLoading: true});
    this.props.clearErrors();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.data === "Thêm bài tập thành công!") {
      this.setState({
        isShowSuccess: true,
        title: '',
        text: '',
        isLoading: false,
        attachFiles: [],
        deadline: this.nextweek()
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      modal: false,
    })
    this.props.clearSuccess();
    this.props.getLessonIncourse(this.props.match.params.id, this.props.match.params.lessonId);
  }


  showWidget =()=>{
    let widget = window.cloudinary.createUploadWidget({
      cloudName: config.CLOUD_NAME,
      uploadPreset: config.UPLOAD_PERSET
    },(err, result)=>
    {
      if(result.event === 'success'){
        const file = {
          id: result.info.public_id,
          name: result.info.original_filename,
          url: result.info.secure_url,
          thumbnail: result.info.thumbnail_url
        } 
        this.setState(prevState => ({
          attachFiles: [...prevState.attachFiles, file]
        }))
      }
    })
    widget.open()
  }

  delete(file){
    const attachFiles = this.state.attachFiles.filter(i => i.id !== file.id)
    this.setState({attachFiles})
  }

  onChangeDeadline = deadline => this.setState({ deadline })

  render() {
    const { errors } = this.state;
    var listFile = '';
    if(isEmptyObj(this.state.attachFiles))
    {
      listFile = <ListGroupItem>Không có tệp được chọn</ListGroupItem>
    }else{
      listFile = this.state.attachFiles.map(file=>
        <ListGroupItem key={file.id}>
          <Row>
            <Col xs="10">
              {
                file.thumbnail
                ?
                <img src={file.thumbnail} alt=""/> 
                :
                <img src={NoImg} style={{width:47}} alt=""/> 
              }  
              <a href={file.url} style={{marginLeft:10}}> {file.name} </a>
            </Col>
            <Col >
              <Button color="danger" onClick={this.delete.bind(this, file)}><i className="fa fa-trash-o"></i></Button>
            </Col>
          </Row>
        </ListGroupItem>
      )
    }
    
    return (
      <Fragment>
        <Button color="danger" onClick={this.toggleLarge} className="mr-1">Tạo bài tập</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg modal-danger'>
          <ModalHeader toggle={this.toggleLarge}>Thêm bài tập mới</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col md="3">
                <Label>Tiêu đề bài tập</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="title" value={this.state.title} onChange={this.onChange} placeholder="Tiêu đề..." spellCheck='false' />
                {errors.title && <Alert color="danger">{errors.title}</Alert>}
              </Col>
              
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Nội dung bài tập</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="textarea" name="text" value={this.state.text} onChange={this.onChange} rows="9" placeholder="Nội dung..." spellCheck='false'/>
                {errors.text && <Alert color="danger">{errors.text}</Alert>}
              </Col>
  
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Mật khẩu</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="password" value={this.state.password} onChange={this.onChange} rows="9" placeholder="Mật khẩu..." />
                {errors.password && <Alert color="danger">{errors.password}</Alert>}
              </Col>
  
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Hạn nộp</Label>
              </Col>
              <Col xs="12" md="9">
                <DateTimePicker value={this.state.deadline} onChange={this.onChangeDeadline} />
                {errors.deadline && <Alert color="danger">{errors.deadline}</Alert>}
              </Col>
  
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Đính kèm tập tin</Label>
              </Col>
              <Col md="2">
                <Button color="danger" onClick={this.showWidget}>Đính kèm</Button>
              </Col>
              <Col md="7" style={{wordWrap:'break-word'}}>
                <ListGroup>
                  {listFile}
                </ListGroup>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>Thêm</Button>{' '}
            <Button color="secondary" onClick={this.toggleLarge}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm bài tập thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

ExerciseBox.propTypes = {
  addExercise: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { addExercise, clearSuccess, clearErrors, getLessonIncourse })(ExerciseBox));  