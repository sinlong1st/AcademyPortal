import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, Modal, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, clearErrors, resendMail, clearSuccess } from '../actions/authActions';
import icon from '../assets/img/Ai-Edu.png'
import ReactLoading from 'react-loading';
import isEmptyObj from '../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isShowSuccess: false,
      isLoading: false,
      email: '',
      password: '',
      errors: {}
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false });
    }

    if (nextProps.success.mes === 'Đã gửi lại mail xác nhận') {
      this.setState({ isShowSuccess: true, isLoading: false })
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
    this.props.loginUser(userData);
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
      <div className="animated fadeIn" id="login">
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form onSubmit={this.onSubmit}>
                        <h1>Đăng nhập</h1>
                        <p className="text-muted">Đăng nhập vào tài khoản của bạn</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="email" name="email" placeholder="Email" autoComplete="email" value={this.state.email} onChange={this.onChange} spellCheck="false" />
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
                        <Button color="primary" className="px-4" onSubmit={this.onSubmit}>Đăng nhập</Button>
                      </Form>
                    </CardBody>
                  </Card>
                  <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                    <CardBody className="text-center">
                      <div>
                        <h2>Đăng ký</h2>
                        <p><img alt="Logo" src={icon} style={{width: 100, height: 100}} /></p>
                        <Link to="/register">
                          <Button color="primary" className="mt-3" active tabIndex={-1}>Đăng ký ngay!</Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
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
          	title="Đã gửi lại mail xác nhận!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { loginUser, clearErrors, resendMail, clearSuccess })(Login);
