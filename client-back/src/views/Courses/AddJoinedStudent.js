import React, { Component } from 'react';
import { Card, CardBody, Form, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Modal, Alert, ModalBody, Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import { addJoinedStudent, clearSuccess, clearErrors, searchStudent, clearSearch } from '../../actions/userActions'
import { getCourseInfo, getAllCourse } from '../../actions/courseActions'

class AddJoinedStudent extends Component {
  constructor() {
    super();
    this.state = {
      isShowSuccess: false,
      isLoading: false,
      search: '',
      errors: {},
      loading: false,
      search_student: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Thêm học viên thành công') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess();
      this.props.getAllCourse();
      this.props.getCourseInfo(this.props.match.params.courseId);
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false, loading: false });
    }

    
    const { search_student } = nextProps.users;
    if(!isEmptyObj(search_student))
    {
      this.setState({ search_student, loading: false });
      this.props.clearSearch();
    }
    
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    if(isEmptyObj(this.state.search_student))
    {
      let errors = {
        search: 'Hãy tìm kiếm học viên'
      }
      this.setState({ errors })
    }else{

      const newUser = {
        courseId: this.props.match.params.courseId,
        studentId: this.state.search_student._id
      };
      this.setState({ isLoading: true });
      this.props.addJoinedStudent(newUser);
      this.props.clearErrors();
    }

  }
  
  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push(`/manage-courses/approve/student/${this.props.match.params.courseId}`);
  }

  onSearch = () =>{
    const userData = {
      search: this.state.search
    }
    this.setState({ loading: true, search_student: {} })
    this.props.clearErrors();
    this.props.searchStudent(userData)
  }

  render() {
    const { errors, loading, search_student } = this.state;
    return (
      <div className="animated fadeIn">
        <Card className="mx-4">
          <CardBody className="p-4">
            <Form onSubmit={this.onSubmit}>

              <h3>Tìm kiếm thông tin học viên</h3>

              <Row>
                <Col xs='10'>
                  <InputGroup className="mb-2">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name="search" value={this.state.search} onChange={this.onChange} placeholder="Email / CMND của học viên"/>
                  </InputGroup>
                </Col>
                <Col>
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
                </Col>
              </Row>
              {
                !isEmptyObj(search_student)
                ?
                <Table bordered responsive size="sm">
                  <thead>
                    <tr className="thead-light">
                      <th>Hình đại diện</th>
                      <th>Mã học viên</th>
                      <th>Chứng minh nhân dân</th>
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
                      <td>{search_student.idCard}</td>
                      <td>{search_student.email}</td>
                      <td>{search_student.name}</td>
                    </tr>
                  </tbody>
                </Table>
                :
                <div>
                  {errors.search && <Alert color="danger">{errors.search}</Alert>}
                </div>
              }
              {errors.fail && <Alert color="danger">{errors.fail}</Alert>}

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
  success: state.success,
  users: state.users
});
export default connect(mapStateToProps, { addJoinedStudent, clearSuccess, clearErrors, searchStudent, clearSearch, getCourseInfo, getAllCourse })(AddJoinedStudent); 