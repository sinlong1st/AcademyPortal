import React, { Component } from 'react';
import {  Container, Row, Col, Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText, Button, Table, Alert, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import { clearErrors, searchStudent, clearSearch, sendMailResetPassword, clearSuccess } from '../../actions/userActions'

class ForgetCP extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      errors: {},
      loading: false,
      search_student: {},
      isShowSuccess: false
    };
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false, loading: false });
    }

    const { search_student } = nextProps.users;
    if(!isEmptyObj(search_student))
    {
      this.setState({ search_student, loading: false });
      this.props.clearSearch();
    }
    
    if (nextProps.success.mes === 'Đã gửi mail') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
    }

  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSearch = () =>{
    const userData = {
      search: this.state.search
    }
    this.setState({ loading: true, search_student: {} })
    this.props.clearErrors();
    this.props.searchStudent(userData)
  }

  onSendMailResetPassword = () => {

    if(isEmptyObj(this.state.search_student))
    {
      let errors = {
        search: 'Hãy tìm kiếm học viên'
      }
      this.setState({ errors })
    }else{

      this.setState({ isLoading: true });
      this.props.sendMailResetPassword(this.state.search_student._id);
      this.props.clearErrors();
    }

  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  render() {
    const { errors, loading, search_student } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Button color="danger" style={{marginBottom: 20}} onClick={()=> this.props.history.push('/login')}>
            <i className="fa fa-sign-in" aria-hidden="true"></i>
            <b> Đăng nhập</b>
          </Button>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="9">
              <Card className="mx-3">
                <CardBody className="p-3">
                  <h3>Tìm kiếm thông tin</h3>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name="search" value={this.state.search} onChange={this.onChange} placeholder="Email / CMND"/>
                  </InputGroup>
                  <Button color="primary" onClick={this.onSearch} block>
                    {
                      loading === false
                      ?
                      'Tìm kiếm'
                      :
                      <div>
                        <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                      </div>
                    }
                  </Button>
                  {
                    !isEmptyObj(search_student)
                    ?
                    <div style={{marginTop: 20}}>
                      <Table bordered responsive size="sm">
                        <thead>
                          <tr className="thead-light">
                            <th>Hình đại diện</th>
                            <th>Mã học viên</th>
                            <th>Email</th>
                            <th>Họ và Tên</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>                      
                              <div className="avatar">
                                <img src={search_student.photo} className="img-avatar" alt="" />
                              </div>
                            </th>
                            <td>{search_student.code}</td>
                            <td>{search_student.email}</td>
                            <td>{search_student.name}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <Button color="danger" onClick={this.onSendMailResetPassword} block><b>Đặt lại mật khẩu</b></Button>
                    </div>
                    :
                    <div style={{marginTop: 20}}>
                      {errors.search && <Alert color="danger">{errors.search}</Alert>}
                    </div>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
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
          	title="Đã gửi mail đặt lại mật khẩu!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success,
  users: state.users
});

export default connect(mapStateToProps, { clearErrors, searchStudent, clearSearch, sendMailResetPassword, clearSuccess })(ForgetCP);
