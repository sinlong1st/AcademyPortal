import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, Modal, ModalBody, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser, clearSuccess, clearErrors } from '../../../actions/authActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import { AppNavbarBrand, AppHeader } from '@coreui/react';
import logo from '../../../assets/img/e-icon.png';
import { Link } from 'react-router-dom';

class Register extends Component {
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
      role: ''
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Tạo tài khoản thành công') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
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
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      role: 'student'
    };
    this.setState({ isLoading: true });
    this.props.registerUser(newUser);
    this.props.clearErrors();
  }
  
  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push('/login');
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="animated fadeIn">
        <AppHeader>
          <AppNavbarBrand full={{ src: logo, width: 50, height: 50, alt: 'Logo' }} className='changeCursor' onClick={()=>this.props.history.push('/')}/>
          <b style={{fontFamily:'Roboto Slab, serif', fontSize:20}} onClick={()=>this.props.history.push('/')} className='changeCursor'>TRUNG TÂM ĐÀO TẠO</b>
          <Nav className="d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link to="/login">Đăng nhập</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to="/register">Đăng ký</Link>
            </NavItem>
          </Nav>
        </AppHeader>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="9" lg="7" xl="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <Form onSubmit={this.onSubmit}>
                      <h1>Đăng ký</h1>
                      <p className="text-muted">Tạo tài khoản nếu bạn là học viên</p>
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
                      <Button color="success" onClick={this.onSubmit} block>Tạo Tài Khoản</Button>
                    </Form>
                  </CardBody>
                </Card>
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
          	title="Tạo tài khoản thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
              Hãy vào mail của bạn và xác nhận 
        </SweetAlert>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { registerUser, clearSuccess, clearErrors })(withRouter(Register));
