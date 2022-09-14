import React, { Component } from 'react';
import {  Row, Col, Container, Table, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import isEmptyObj from '../validation/is-empty';
import { getUsers } from '../actions/userActions';
import { getCourseInfo } from '../actions/courseActions';
import { getTeachersRating } from '../actions/ratingActions'; 
import ModalInfo from './ModalInfo';
import ModalRating from './ModalRating';
import SweetAlert from 'react-bootstrap-sweetalert';

class PeopleInCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {
        students:[],
        teachers:[]
      },
      loading: true,
      isShowSuccess: false
    };
    this.handleToSudentInfo = this.handleToSudentInfo.bind(this);
  }

  handleToSudentInfo(studentId){
    this.props.history.push('/student-info/' + studentId)
  }

  componentDidMount = () => {
    this.props.getUsers(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users)) {
      const {users, loading} = nextProps.users
      this.setState({
        users,
        loading
      })
    }

    if (nextProps.success.mes === "Đánh giá thành công") {
      this.setState({
        isShowSuccess: true
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getTeachersRating(this.props.match.params.id);
  }
  
  render() {
    const { students, teachers } = this.state.users
    const { loading } = this.state
    const { role } = this.props.auth.user

    return (
      <Container fluid>
        <Row>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B' />
            :
            <Col sm="12" md={{ size: 10, offset: 1 }}>
              <h3>Giáo viên</h3>
              <Table responsive className="table-outline mb-0 d-none d-sm-table">
                <tbody>
                  {
                    teachers.length === 0
                    ?
                    <tr><td></td><td>Chưa có giáo viên tham gia</td></tr>
                    :
                    teachers.map(user =>
                      <tr key={user._id}>
                        <td>                      
                          <div className="avatar">
                            <img src={user.photo} className="img-avatar" alt="" />
                          </div>
                        </td>
                        <td>
                          <div><b>{user.name}</b></div>
                          <div className="small text-muted">
                            {user.email}
                          </div>
                        </td>
                        {
                          role === 'student'
                          ?
                          <td>
                            <ModalRating teacherId={user._id} />
                          </td>
                          :
                          null
                        }
                      </tr>
                    )
                  }
                </tbody>
              </Table>
              <h3 style={{marginTop: 50}}>Học viên</h3>
              {
                role === 'student'
                ?
                <Table responsive hover className="table-outline mb-0 d-none d-sm-table">
                  <tbody>
                    {                    
                      students.length === 0
                      ?
                      <tr><td></td><td>Chưa có học viên</td></tr>
                      :
                      students.map(user =>
                        <tr key={user._id}>
                          <td>                      
                            <div className="avatar">
                              <img src={user.photo} className="img-avatar" alt="" />
                            </div>
                          </td>
                          <td>
                            <div><b>{user.name}</b></div>
                            <div className="small text-muted">
                              {user.code}
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
                :
                <Table responsive hover className="table-outline mb-0 d-none d-sm-table">
                  <tbody>
                    {                    
                      students.length === 0
                      ?
                      <tr><td></td><td>Chưa có học viên</td></tr>
                      :
                      students.map(user =>
                        <tr key={user._id}>
                          <td>                      
                            <div className="avatar">
                              <img src={user.photo} className="img-avatar" alt="" />
                            </div>
                          </td>
                          <td>
                            <div><b>{user.name}</b></div>
                            <div className="small text-muted">
                              {user.code}
                            </div>
                          </td>
                          <td>
                            <ModalInfo userId={user._id} courseId={this.props.match.params.id} />
                          </td>
                          <td>
                            <Button color="danger" onClick={this.handleToSudentInfo.bind(this, user._id)}>
                              Thông tin chung
                            </Button>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
              }
            </Col>
          }
        </Row>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Đánh giá thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </Container>
    )
  }
}

PeopleInCourse.propTypes = {
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { getUsers, getCourseInfo, getTeachersRating })(PeopleInCourse));  