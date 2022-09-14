import React, { Component, Fragment } from 'react';
import { Card, CardBody, Table, Button, CardHeader, Modal, ModalBody, Container, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { getApproveListStudent, clearSuccess, notifyMail, confirmRequest } from '../../actions/userActions';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';


class ApproveStudent extends Component {
  constructor() {
    super();
    this.state = {
      approve_list: {
        enrollStudents: [],
        maxStudent: ''
      },
      courseId: null,
      loading: true,
      isLoading: false,
      isShowSuccess: false,
      titleSuccess: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const { approve_list, loading } = nextProps.users
      if(this.props.match.params.courseId === approve_list.courseId)
        this.setState({ 
          approve_list, 
          loading 
        });
    }

    if (nextProps.success.mes === "Đã gửi mail cho các học viên") {
      this.setState({isLoading: false, isShowSuccess: true, titleSuccess: nextProps.success.mes})
      this.props.clearSuccess();
    }

    if (nextProps.success.mes === "Xác nhận thành công") {
      this.setState({isLoading: false, isShowSuccess: true, titleSuccess: nextProps.success.mes})
      this.props.clearSuccess();
    }
  }

  componentDidMount = () => {
    this.props.getApproveListStudent(this.props.match.params.courseId);
  }

  notifyMail = () => {
    this.setState({isLoading: true})
    this.props.notifyMail(this.props.match.params.courseId);
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getApproveListStudent(this.props.match.params.courseId);
  }

  handleClickConfirm(enrollStudentsId){
    this.setState({isLoading: true})
    this.props.confirmRequest(this.props.match.params.courseId, enrollStudentsId)
  }

  render() {
    const { approve_list, loading } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Danh sách học viên đã ghi danh</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
                <Container>
                  <Alert color='danger' style={{fontWeight: 'bold', fontSize: 20}}>{approve_list.code} - {approve_list.title}</Alert>
                  <div style={{marginTop: 10}}>
                    {
                      approve_list.isFull === true
                      ?
                      null
                      :
                      <Fragment>
                        <Button color='primary' onClick={()=>this.props.history.push(`/manage-courses/approve/student/${this.props.match.params.courseId}/add-student`)}>
                          Thêm học viên mới vào khóa học
                        </Button>
                        <Button style={{marginLeft: 20}} color='primary' onClick={()=>this.props.history.push(`/manage-courses/approve/student/${this.props.match.params.courseId}/add-joined-student`)}>
                          Thêm học viên cũ vào khóa học
                        </Button>
                      </Fragment>
                    }
                    <Button style={{marginLeft: 20}} color='primary' onClick={this.notifyMail}>
                      Thông báo không thể mở lớp
                    </Button>
                  </div>
                </Container>


                <b>Số lượng học viên hiện tại:</b> {approve_list.enrollStudents.length} / {approve_list.maxStudent} <br/>
                <b>Số lượng học viên tối thiểu:</b> {approve_list.minStudent} <br/>
                <b>Hạn chót ghi danh:</b>                                 
                <Moment format=" HH:mm [ngày] DD [thg] MM, YYYY.">
                  {approve_list.enrollDeadline}
                </Moment>    
                {
                  approve_list.enrollStudents.length === 0
                  ? <h2> không có học viên</h2>
                  :
                  <div style={{marginTop: 20}}>
                    {
                      approve_list.isNotifyMail
                      ?
                      <Table bordered striped responsive size="sm">
                        <thead>
                          <tr>
                            <th>Mã học viên</th>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Phương thức thanh toán</th>
                            <th>Phản hồi</th>
                            <th>Xác nhận</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            approve_list.enrollStudents.map((elem, index) =>
                            {
                              return (
                                <tr key={elem._id}>
                                  <td>{elem.student.code}</td>
                                  <td>{elem.student.name}</td>
                                  <td>{elem.student.email}</td>
                                  <td>{elem.student.phone}</td>
                                  <td>{elem.paymentMethod}</td>
                                  {
                                    elem.replyMail
                                    ?
                                    <td>{elem.replyMail.chosen}</td>
                                    :
                                    <td>                       
                                      <small style={{color:'#A8A8A8'}}>
                                        Chưa phản hồi
                                      </small>
                                    </td>
                                  }
                                  <td>
                                    {
                                      elem.replyMail 
                                      ?
                                      <div>
                                        {
                                          elem.replyMail.chosen !== 'Đợi dời lịch học'
                                          ?
                                          <Button onClick={this.handleClickConfirm.bind(this, elem._id)} color='danger'>
                                            Xác nhận
                                          </Button>
                                          :
                                          null
                                        }
                                      </div>
                                      :
                                      null
                                    }
                                  </td>
                                </tr>
                              )
                            }
                            )
                          }
                        </tbody>
                      </Table>
                      :
                      <Table bordered striped responsive size="sm">
                        <thead>
                          <tr>
                            <th>Mã học viên</th>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Phương thức thanh toán</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            approve_list.enrollStudents.map((elem, index) =>
                            {
                              return (
                                <tr key={elem._id}>
                                  <td>{elem.student.code}</td>
                                  <td>{elem.student.name}</td>
                                  <td>{elem.student.email}</td>
                                  <td>{elem.student.phone}</td>
                                  <td>{elem.paymentMethod}</td>
                                </tr>
                              )
                            }
                            )
                          }
                        </tbody>
                      </Table>
                    }
                  </div>

                }
              </div>
            }

          </CardBody>
        </Card>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
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
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users,
  success: state.success
});
export default connect(mapStateToProps, { getApproveListStudent, clearSuccess, notifyMail, confirmRequest })(ApproveStudent); 