import React, { Component } from 'react';
import { Label, FormGroup ,Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { createUser, clearSuccess, clearErrors } from '../../actions/authActions';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';

class CreateAccount extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      password2: '',
      errors: {},
      role: '',
      idCard: '',
      code: '',
      isShowSuccess: false, 
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, isLoading: false });
    }

    if (nextProps.success.mes === "Tạo tài khoản thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess();
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
      phone: this.state.phone,
      password: this.state.password,
      password2: this.state.password2,
      role: this.state.role,
      idCard: this.state.idCard,
      code: this.state.code
    };
    this.setState({isLoading: true});
    this.props.clearErrors();
    this.props.createUser(newUser);
  }
  
  hideAlertSuccess(){
    this.setState({
      name: '',
      email: '',
      phone: '',
      password: '',
      password2: '',
      errors: {},
      role: '',
      idCard: '',
      code: '',
      isShowSuccess: false
    })
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="animated fadeIn">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-2">
                <CardBody className="p-4">
                  <Form onSubmit={this.onSubmit}>
                    <h1>Tạo tài khoản</h1>

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
                        <InputGroupText>
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Mã đăng nhập"  name="code" value={this.state.code} onChange={this.onChange} />
                    </InputGroup>
                    {errors.code && <Alert color="danger">{errors.code}</Alert>}

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

                    <b>Chức danh</b>
                    <Container>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio1" name="role" value="ministry" onChange={this.onChange}/>
                        <Label className="form-check-label" check htmlFor="inline-radio1">Phòng giáo vụ</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio2" name="role" value="educator" onChange={this.onChange}/>
                        <Label className="form-check-label" check htmlFor="inline-radio2">Phòng đào tạo</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inline-radio4" name="role" value="teacher" onChange={this.onChange}/>
                        <Label className="form-check-label" check htmlFor="inline-radio4">Giáo viên</Label>
                      </FormGroup>
                    </Container>
                    {errors.role && <Alert color="danger">{errors.role}</Alert>}

                    <Button color="success" onClick={this.onSubmit} block>Tạo Tài Khoản</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Tạo tài khoản thành công"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success

});

export default connect(mapStateToProps, { createUser, clearSuccess, clearErrors })(CreateAccount);