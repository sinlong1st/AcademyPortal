import React, { Component } from 'react';
import { Button, ModalHeader, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Alert, Modal, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUserModal, clearErrors, resendMail, clearSuccess } from '../actions/authActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';

class LoginModal extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      isShowSuccess: false,
      isLoading: false,
      email: '',
      password: '',
      errors: {},
      titleSuccess: ''
    };
  }

  toggle = ()=> {
    this.setState({
      modal: !this.state.modal,
    });
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false });
    }

    if (nextProps.success.mes === 'Đã gửi lại mail xác nhận') {
      this.setState({ isShowSuccess: true, isLoading: false, titleSuccess: nextProps.success.mes })
      this.props.clearSuccess()
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.setState({ isLoading: true });
    this.props.clearErrors();
    this.props.loginUserModal(userData);
  }

  onSendMail = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email
    };
    this.setState({ isLoading: true });
    this.props.resendMail(userData);
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Button color="danger" onClick={this.toggle} className="btn-pill" size="lg" block>
          <i className="fa fa-pencil-square-o"></i>&nbsp;Đăng nhập để ghi danh
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Đăng nhập</ModalHeader>
          <ModalBody>
            <Form>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="email" name="email" placeholder="Email" autoComplete="email" value={this.state.email} onChange={this.onChange} />
              </InputGroup>
              {errors.email_login && <Alert color="danger">{errors.email_login}</Alert>}
              {
                errors.email_login === 'Hãy xác nhận email của bạn trước khi đăng nhập'
                && 
                <div style={{marginBottom: 20}}>
                  <Button onClick={this.onSendMail} color="danger" className="px-4" >Gửi lại mail xác nhận</Button>
                  <p>Hãy kiểm tra spam mail nếu bạn không nhận được thư xác nhận</p>
                </div>
              }
              <InputGroup className="mb-4">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-lock"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="password" name="password" placeholder="Mật khẩu" autoComplete="current-password" value={this.state.password} onChange={this.onChange} />
              </InputGroup>
              {errors.password_login && <Alert color="danger">{errors.password_login}</Alert>}
              <Row>
                <Col xs="6">
                  <Button color="primary" className="px-4" onClick={this.onSubmit}>Đăng nhập</Button>
                </Col>
                <Col xs="6" className="text-right">
                  <Button color="link" className="px-0" onClick={()=>this.props.history.push('/register')}>Chưa có tài khoản?</Button>
                </Col>
              </Row>
              
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Hủy</Button>
          </ModalFooter>
        </Modal>
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
          	title={this.state.titleSuccess}
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    );
  }
}

LoginModal.propTypes = {
  loginUserModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { loginUserModal, clearErrors, resendMail, clearSuccess })(LoginModal));
