import React, { Component } from 'react';
import {Input, Card, CardBody, Table, Button, CardHeader, Modal, ModalBody} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getApproveListTeacher, approveTeacher, deleteTeacher, clearSuccess, clearErrors } from '../../actions/userActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';


class ApproveTeacher extends Component {
  constructor() {
    super();
    this.state = {
      approve_list_teacher: {
        teacherInCourse: [],
        teachers: []
      },
      courseId: null,
      loading: true,
      isLoading: false,
      intialTeacher: [],
      isShowErr: false,
      errors: {
        err: ''
      }
    };
    this.handleClickApprove = this.handleClickApprove.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const { approve_list_teacher, loading } = nextProps.users;
      this.setState({ 
        intialTeacher: approve_list_teacher ? approve_list_teacher.teachers : [],
        approve_list_teacher, 
        loading 
      });
    }

    if (nextProps.success === "Duyệt thành công") {
      this.setState({isLoading: false})
      this.props.clearSuccess();
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false, isShowErr: true });
      this.props.clearErrors();
    }
  }

  componentDidMount = () => {
    this.props.getApproveListTeacher(this.props.match.params.courseId);
  }

  handleClickApprove(teacherId){
    this.setState({isLoading: true})
    this.props.approveTeacher(this.props.match.params.courseId, teacherId)
  } 

  handleClickDelete(teacherId){
    this.setState({isLoading: true})
    this.props.deleteTeacher(this.props.match.params.courseId, teacherId)
  } 

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialTeacher));
    updatedList = updatedList.filter((teacher)=>
      teacher.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({approve_list_teacher: {...this.state.approve_list_teacher, teachers: updatedList}});
  }
  
  hideAlert(){
    this.setState({
      isShowErr: false
    })
  }

  render() {
    const { approve_list_teacher, loading } = this.state;
    return (
      <div className="animated fadeIn">

        <Card>
          <CardHeader>
            <b>Danh sách giáo viên trong khóa</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
                {
                  approve_list_teacher.teacherInCourse.length === 0
                  ? <h2> không có giáo viên</h2>
                  :
                  <Table bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Hình đại diện</th>
                        <th>Email</th>
                        <th>Họ và Tên</th>
                        <th>Phê duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        approve_list_teacher.teacherInCourse.map((elem, index) =>
                          <tr key={elem._id}>
                            <th>                      
                              <div className="avatar">
                                <img src={elem.photo} className="img-avatar" alt="" />
                              </div>
                            </th>
                            <td>{elem.email}</td>
                            <td>{elem.name}</td>
                            <td><Button color="danger" onClick={this.handleClickDelete.bind(this, elem._id)} > Xóa </Button></td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                }
              </div>
            }
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <b>Danh sách giáo viên</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
                <Input style={{marginBottom:10}}type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên giáo viên . . ."/>
                {
                  approve_list_teacher.teachers.length === 0
                  ? 
                  <h2> Không có giáo viên</h2>
                  :
                  <Table bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Hình đại diện</th>
                        <th>Email</th>
                        <th>Họ và Tên</th>
                        <th>Phê duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        approve_list_teacher.teachers.map((elem, index) =>
                          <tr key={elem._id}>
                            <th>                      
                              <div className="avatar">
                                <img src={elem.photo} className="img-avatar" alt="" />
                              </div>
                            </th>
                            <td>{elem.email}</td>
                            <td>{elem.name}</td>
                            <td><Button color="danger" onClick={this.handleClickApprove.bind(this, elem._id)}> Thêm </Button></td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
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
          	danger
          	confirmBtnText="OK"
          	confirmBtnBsStyle="danger"
            title={this.state.errors.err}
            show={this.state.isShowErr}
            onConfirm={this.hideAlert.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

ApproveTeacher.propTypes = {
  getApproveListTeacher: PropTypes.func.isRequired,
  approveTeacher: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  success: state.success,
  errors: state.errors
});
export default connect(mapStateToProps, { getApproveListTeacher, approveTeacher, deleteTeacher, clearSuccess, clearErrors })(ApproveTeacher); 