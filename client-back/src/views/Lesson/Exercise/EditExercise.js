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
import ReactLoading from 'react-loading';
import { editExercise, clearSuccess, clearErrors } from '../../../actions/exerciseActions';
import { getLessonIncourse } from '../../../actions/lessonActions';
import isEmptyObj from '../../../validation/is-empty';
import { withRouter } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import config from '../../../config'
import NoImg from '../../../assets/img/NoImg.png';
import DateTimePicker from 'react-datetime-picker';

class EditExercise extends Component {
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
      large: !this.state.large
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const exerciseData = {
      _id: this.props.exercise._id,
      title: this.state.title,
      text: this.state.text,
      attachFiles: this.state.attachFiles,
      deadline: this.state.deadline,
      password: this.state.password,
      courseId: this.props.match.params.id,
      lessonId: this.props.match.params.lessonId
    };
    this.props.editExercise(exerciseData);
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

    if (nextProps.success.mes === "Ch???nh s???a b??i t???p th??nh c??ng") {
      this.props.clearSuccess();
      this.setState({
        isLoading: false
      })
    }
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

  openModal = () =>{

    this.setState({
      large: !this.state.large,
      title: this.props.exercise.title,
      text: this.props.exercise.text,
      attachFiles: this.props.exercise.attachFiles,
      password: this.props.exercise.password,
      deadline: this.props.exercise.deadline
    });
  }

  render() {
    const { errors } = this.state;
    var listFile = '';
    if(isEmptyObj(this.state.attachFiles))
    {
      listFile = <ListGroupItem>Kh??ng c?? t???p ???????c ch???n</ListGroupItem>
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
        <Button color="danger" style={{marginLeft:10}} onClick={this.openModal} className="mr-1">Ch???nh s???a</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg modal-danger'>
          <ModalHeader toggle={this.toggleLarge}>Ch???nh s???a b??i t???p</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col md="3">
                <Label>Ti??u ????? b??i t???p</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="title" value={this.state.title} onChange={this.onChange} placeholder="Ti??u ?????..." spellCheck='false' />
                {errors.title && <Alert color="danger">{errors.title}</Alert>}
              </Col>
              
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>N???i dung b??i t???p</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="textarea" name="text" value={this.state.text} onChange={this.onChange} rows="9" placeholder="N???i dung..." spellCheck='false'/>
                {errors.text && <Alert color="danger">{errors.text}</Alert>}
              </Col>
  
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>M???t kh???u</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="password" value={this.state.password} onChange={this.onChange} rows="9" placeholder="M???t kh???u..." />
                {errors.password && <Alert color="danger">{errors.password}</Alert>}
              </Col>
  
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>H???n n???p</Label>
              </Col>
              <Col xs="12" md="9">
                <DateTimePicker value={this.state.deadline} onChange={this.onChangeDeadline} />
                {errors.deadline && <Alert color="danger">{errors.deadline}</Alert>}
              </Col>
  
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>????nh k??m t???p tin</Label>
              </Col>
              <Col md="2">
                <Button color="danger" onClick={this.showWidget}>????nh k??m</Button>
              </Col>
              <Col md="7" style={{wordWrap:'break-word'}}>
                <ListGroup>
                  {listFile}
                </ListGroup>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>Ch???nh s???a</Button>{' '}
            <Button color="secondary" onClick={this.toggleLarge}>H???y</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>??ang ch???nh s???a</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { editExercise, clearSuccess, clearErrors, getLessonIncourse })(EditExercise));  