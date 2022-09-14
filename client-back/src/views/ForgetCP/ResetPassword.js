import React, { Component } from 'react';
import {  Container, Row, Col, Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import { clearErrors, resetPassword, clearSuccess } from '../../actions/userActions'

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      loading: false,
      isShowSuccess: false,
      password: '',
      password2: ''
    };
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, loading: false });
    }

    if (nextProps.success.mes === 'Đặt lại mật khẩu thành công') {
      this.setState({ isShowSuccess: true, loading: false })
      this.props.clearSuccess()
    }

  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = () => {
    this.setState({ loading: true })
    const passwordData = {
      password: this.state.password,
      password2: this.state.password2
    }
    this.props.clearErrors();
    this.props.resetPassword(this.props.match.params.userId, passwordData)
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push('/login')
  }

  render() {
    const { errors, loading } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-3">
                <CardBody className="p-3">
                  <h3>Đặt lại mật khẩu</h3>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" name="password" value={this.state.password} onChange={this.onChange} placeholder="Mật khẩu mới"/>
                  </InputGroup>
                  {errors.password && <Alert color="danger">{errors.password}</Alert>}

                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" name="password2" value={this.state.password2} onChange={this.onChange} placeholder="Xác nhận lại"/>
                  </InputGroup>
                  {errors.password2 && <Alert color="danger">{errors.password2}</Alert>}

                  <Button color="primary" onClick={this.onSubmit} block>
                    {
                      loading === false
                      ?
                      'Đặt lại'
                      :
                      <div>
                        <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                      </div>
                    }
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Đặt lại mật khẩu thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { clearErrors, resetPassword, clearSuccess })(ResetPassword);
