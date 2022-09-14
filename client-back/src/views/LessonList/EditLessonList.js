import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  Alert
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getListInfo, editTitle, editCertification, clearErrors, clearSuccess } from '../../actions/lessonActions';
import isEmptyObj from '../../validation/is-empty';
import ReactLoading from 'react-loading';

class EditLessonList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      certification: '',
      list_info: {},
      loading: true,
      isLoading: false,
      isShowSuccess: false,
      errors: {}
    };
  }

  componentDidMount = () => {
    this.props.getListInfo(this.props.match.params.listId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lesson) {
      const { list_info, loading } = nextProps.lesson
      if(list_info._id === this.props.match.params.listId)
        this.setState({
          certification: list_info.certification ? list_info.certification.name : '',
          title: list_info.title,
          list_info,
          loading
        })
    }

    if(!isEmptyObj(nextProps.errors))
    {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }
    this.setState({ errors: nextProps.errors})

    if (nextProps.success.mes === 'Thay đổi tên danh sách thành công' || nextProps.success.mes === 'Thay đổi tên chứng chỉ thành công') {
      this.setState({
        isShowSuccess: true,
        isLoading: false
      })
      this.props.clearSuccess();
    }
  }

  handleClickLesson(lessonId){
    this.props.history.push(`/lesson-list/${this.props.match.params.listId}/edit-lesson/${lessonId}`);
  }

  onChange = e =>{
    this.setState({ [e.target.name]: e.target.value });
  }

  changeTitle = e =>{
    e.preventDefault();
    const lessonListData = {
      title: this.state.title
    };
    this.props.editTitle(this.props.match.params.listId, lessonListData)
    this.setState({ isLoading: true });
    this.props.clearErrors();
  }

  changeCertification = e =>{
    e.preventDefault();
    const lessonListData = {
      certification: this.state.certification
    };

    if(this.state.list_info.certification)
    {
      lessonListData.certificationId = this.state.list_info.certification._id
    }

    this.props.editCertification(this.props.match.params.listId, lessonListData)
    this.setState({ isLoading: true });
    this.props.clearErrors();
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getListInfo(this.props.match.params.listId);    
  }

  render() {
    const { list_info, loading, title, certification, errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
                <FormGroup>
                  <Label style={{fontWeight: 'bold'}}>Tên danh sách bài học</Label>
                  <Row>
                    <Col xs='10'>
                      <Input type="text" value={title} spellCheck="false" name="title" onChange={this.onChange}/>
                    </Col>
                    <Col>
                      <Button color="danger" onClick={this.changeTitle}>Lưu thay đổi</Button>
                    </Col>
                  </Row>
                </FormGroup>
                {errors.title && <Alert color="danger">{errors.title}</Alert>}

                <FormGroup>
                  <Label style={{fontWeight: 'bold'}}>Tên chứng chỉ nhận được</Label>
                  <Row>
                    <Col xs='10'>
                      <Input type="text" value={certification} spellCheck="false" name="certification" onChange={this.onChange}/>
                    </Col>
                    <Col>
                      <Button color="danger" onClick={this.changeCertification}>Lưu thay đổi</Button>
                    </Col>
                  </Row>
                </FormGroup>
                {errors.certification && <Alert color="danger">{errors.certification}</Alert>}

                <FormGroup>
                  <Label style={{fontWeight: 'bold'}}>Các buổi học</Label>
                  <ListGroup>
                    {
                      list_info.lesson.map(lesson=>
                        <ListGroupItem key={lesson._id} action tag="button" onClick={this.handleClickLesson.bind(this, lesson._id)}>
                          <span>{lesson.text}</span>
                        </ListGroupItem>
                      )
                    }
                  </ListGroup>
                </FormGroup>

              </Fragment>
            }
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Lưu thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  lesson: state.lesson,
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { getListInfo, editTitle, editCertification, clearErrors, clearSuccess })(EditLessonList);  