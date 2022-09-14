import React, { Component } from 'react';
import { Card, CardBody, Form, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Modal, Alert, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import { addStudent, clearSuccess, clearErrors } from '../../actions/userActions'
import { getCourseInfo, getAllCourse } from '../../actions/courseActions'

class AddStudent extends Component {
  constructor() {
    super();
    this.state = {
      isShowSuccess: false,
      isLoading: false,
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {},
      idCard: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Thêm học viên thành công') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
      this.props.getAllCourse();
      this.props.getCourseInfo(this.props.match.params.courseId);
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      courseId: this.props.match.params.courseId,
      phone: this.state.phone,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      idCard: this.state.idCard,
      role: 'student'
    };
    this.setState({ isLoading: true });
    this.props.addStudent(newUser);
    this.props.clearErrors();
  }
  
  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push(`/manage-courses/approve/student/${this.props.match.params.courseId}`);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="animated fadeIn">
        <Card className="mx-4">
          <CardBody className="p-4">
            <Form onSubmit={this.onSubmit}>

              <h3>Thông tin học viên</h3>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Họ và Tên" autoComplete="username" name="name" value={this.state.name} onChange={this.onChange} />
              </InputGroup>
              {errors.name && <Alert color="danger">{errors.name}</Alert>}

              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>@</InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Email" autoComplete="email" name="email" value={this.state.email} onChange={this.onChange}/>
              </InputGroup>
              {errors.email && <Alert color="danger">{errors.email}</Alert>}

              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText><i className="icon-phone"></i></InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Số điện thoại" name="phone" value={this.state.phone} onChange={this.onChange}/>
              </InputGroup>
              {errors.phone && <Alert color="danger">{errors.phone}</Alert>}

              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText><i className="fa fa-id-card" aria-hidden="true"></i></InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Chứng minh nhân dân" name="idCard" value={this.state.idCard} onChange={this.onChange}/>
              </InputGroup>
              {errors.idCard && <Alert color="danger">{errors.idCard}</Alert>}

              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-lock"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="password" placeholder="Mật khẩu" autoComplete="new-password" name="password" value={this.state.password} onChange={this.onChange}/>
              </InputGroup>
              {errors.password && <Alert color="danger">{errors.password}</Alert>}

              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-lock"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="password" placeholder="Xác nhận lại mật khẩu" autoComplete="new-password" name="password2" value={this.state.password2} onChange={this.onChange}/>
              </InputGroup>
              {errors.password2 && <Alert color="danger">{errors.password2}</Alert>}

              <Button color="success" onClick={this.onSubmit} block>Thêm học viên</Button>
            </Form>
          </CardBody>
        </Card>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm học viên thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});
export default connect(mapStateToProps, { addStudent, clearSuccess, clearErrors, getCourseInfo, getAllCourse })(AddStudent); 