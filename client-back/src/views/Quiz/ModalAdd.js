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
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import { addTestQuiz, getListQuiz, clearSuccess, clearErrors } from '../../actions/testQuizAction'

class ModalAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSuccess: false,
      title: '',
      time: '',
      description: '',
      errors:{}
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
      title: '',
      time: '',
      description: ''
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const testData = {
      title: this.state.title,
      time: this.state.time,
      description: this.state.description
    };
    this.props.addTestQuiz(testData)
    this.setState({ isLoading: true });
    this.props.clearErrors();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {

    if(!isEmptyObj(nextProps.errors))
    {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }
    this.setState({ errors: nextProps.errors})

    if (nextProps.success.mes === "Thêm bài kiểm tra thành công") {
      this.setState({
        isShowSuccess: true,
        title: '',
        time: '',
        description: '',
        isLoading: false
      })
      this.props.clearSuccess();
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      modal: false,
    })
    this.props.getListQuiz();
  }

  render() {
    const { errors } = this.state;
    
    return (
      <Fragment>
        <Button color="danger" onClick={this.toggleLarge} className="mr-1">Tạo bài kiểm tra</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-danger modal-lg'>
          <ModalHeader toggle={this.toggleLarge}>Thêm bài kiểm tra mới</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col md="4">
                <Label>Tên bài kiểm tra</Label>
              </Col>
              <Col>
                <Input type="text" name="title" value={this.state.title} onChange={this.onChange} spellCheck="false"/> 
              </Col>
            </FormGroup>
            {errors.title && <Alert color="danger">{errors.title}</Alert>}

            <FormGroup row>
              <Col md="4">
                <Label>Mô tả về bài kiểm tra</Label>
              </Col>
              <Col>
                <Input type="textarea" rows="5" name="description" value={this.state.description} onChange={this.onChange} spellCheck="false"/> 
              </Col>
            </FormGroup>
            {errors.description && <Alert color="danger">{errors.description}</Alert>}

            <FormGroup row>
              <Col md="4">
                <Label>Thời gian làm bài (phút)</Label>
              </Col>
              <Col>
                <Input type="number" min='0' name="time" value={this.state.time} onChange={this.onChange}/> 
              </Col>
            </FormGroup>
            {errors.time && <Alert color="danger">{errors.time}</Alert>}

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
          	title="Thêm bài kiểm tra thành công!"
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
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { addTestQuiz, getListQuiz, clearSuccess, clearErrors })(ModalAdd);  