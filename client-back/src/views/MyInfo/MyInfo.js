import React, { Component, Fragment } from 'react';
import {  Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { getStudent } from '../../actions/userActions';
import { getStudentCourse } from '../../actions/courseActions';
import { getStudentAbsent } from '../../actions/attendanceActions';
import { getPointColumnsStudent } from '../../actions/pointActions';
import { getSchedule } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty'; 
import Moment from 'react-moment'; 
import 'moment/locale/vi';
var moment = require('moment');

const styles = {
  Avatar: {
    width: 100,
    height: 100,
    margin: 'auto',
    borderRadius: 50
  },
  bigAvatar: {
    height: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class MyInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: {},
      studentcourses: [],
      schedule: {
        events:[]
      },
      loadingEvent :true,
      loadingStudent: true,
      loadingStudentCourse: true,
      loadingStudentAbsentList: false,
      loadingPoint: false,
      isShowAbsentList: false,
      isShowPointList: false,
      isShowLesson: false
    };
    this.handleAbsent = this.handleAbsent.bind(this);
    this.handlePoint = this.handlePoint.bind(this);
    this.handleLesson = this.handleLesson.bind(this);
  }

  componentDidMount(){
    this.props.getStudent(this.props.auth.user.id)
    this.props.getStudentCourse(this.props.auth.user.id)
  }

  handleAbsent(courseId){
    this.setState({
      isShowAbsentList: true,
      isShowPointList: false,
      isShowLesson: false
    })
    this.props.getStudentAbsent(courseId,this.props.auth.user.id)
  }

  handlePoint(courseId){
    this.setState({
      isShowPointList: true,
      isShowAbsentList: false,
      isShowLesson: false
    })
    this.props.getPointColumnsStudent( courseId, this.props.auth.user.id )
  }

  handleLesson(courseId){
    this.setState({
      isShowLesson: true,
      isShowPointList: false,
      isShowAbsentList: false
    })
    this.props.getSchedule(courseId)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users)) {
      const { student, loading } = nextProps.users

      this.setState({
        student,
        loadingStudent: loading
      })
    }

    if (!isEmptyObj(nextProps.point)) {
      const { student_point, loading } = nextProps.point

      this.setState({
        student_point,
        loadingPoint: loading
      })
    }

    if (!isEmptyObj(nextProps.courses)) {
      const { studentcourses, loading } = nextProps.courses

      this.setState({
        studentcourses,
        loadingStudentCourse: loading
      })
    } 

    if (!isEmptyObj(nextProps.attendance)) {
      const { student_absent_list, loading } = nextProps.attendance

      this.setState({
        student_absent_list,
        loadingStudentAbsentList: loading
      })
    } 

    const { schedule, loading } = nextProps.schedule
    if(!isEmptyObj(schedule))
      this.setState({ 
        schedule: schedule,
        loadingEvent: loading
      });
    this.setState({
      loadingEvent: loading
    }); 
  }

  caculateTotalPoint(pointColumns){
    var totalPoint = 0; 
    for(var i=0; i<pointColumns.length; i++)
    {
      if(!isEmptyObj(pointColumns[i].submit) )
        if(!isEmptyObj(pointColumns[i].submit.studentSubmission[0].point))
          totalPoint = totalPoint + pointColumns[i].submit.studentSubmission[0].point * pointColumns[i].pointRate / 100
    }
    return totalPoint.toFixed(1)
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleToLesson(courseId, lessonId){
    this.props.history.push(`/courses/${courseId}/lesson/${lessonId}`);
  }

  render() {
    const { 
      student, 
      loadingStudent, 
      loadingStudentCourse, 
      studentcourses, 
      loadingStudentAbsentList, 
      student_absent_list, 
      isShowAbsentList,
      student_point,
      loadingPoint,
      isShowPointList,
      schedule,
      loadingEvent,
      isShowLesson
    } = this.state
    var AbsentList = null;
    
    if(isShowAbsentList === true){
      AbsentList = 
      <Fragment>
        <div><strong>S??? ng??y ngh??? / T???ng s??? ng??y ??i???m danh </strong>: {student_absent_list.absentlist.length} / {student_absent_list.attendanceNumber} </div>
        <br/>
        {
          student_absent_list.absentlist.length === 0
          ?
          <h3>H???c vi??n kh??ng ngh??? ng??y n??o</h3>
          :
          <Table responsive bordered hover>
            <thead className="thead-light">
              <tr>
                <th>Ng??y ngh???</th>
                <th>Gi??? h???c</th>
                <th>B??i h???c</th>
              </tr>
            </thead>
            <tbody>
              {
                student_absent_list.absentlist.map(element=>
                  <Fragment key={element._id}>
                    {
                      element.event
                      ?
                      <tr  className="changeCursor"  onClick={this.handleToLesson.bind(this, student_absent_list.courseId, element.event.lessonId._id)}>
                        <td >
                          <Moment format="DD/MM/YYYY">
                            {element.date}
                          </Moment>
                        </td >
                        <td>
                          <Fragment>
                            <Moment format="HH:mm - ">
                              {element.event.start}
                            </Moment>
                            <Moment format="HH:mm">
                              {element.event.end}
                            </Moment>
                          </Fragment>
                        </td>
                        <td>
                          {element.event.lessonId.text}
                        </td>
                      </tr>
                      :
                      <tr>
                        <td >
                          <Moment format="DD/MM/YYYY">
                            {element.date}
                          </Moment>
                        </td >
                        <td>
                        </td>
                        <td>
                        </td>
                      </tr>
                    }
                  </Fragment>
                )
              }
            </tbody>
          </Table>
        }
      </Fragment>
    }

    var PointList = null;

    if(isShowPointList === true){
      PointList = 
      <Fragment>
        {
          student_point.pointColumns.length === 0
          ?
          <h3>Ch??a c???p nh???t c???t ??i???m</h3>
          :
          <Table responsive bordered>
            <thead className="thead-light">
              <tr>
                <th>T??n c???t ??i???m</th>
                <th>T??? l??? %</th>
                <th>T??n b??i l??m</th>
                <th>??i???m</th>
              </tr>
            </thead>
            <tbody>
              {
                student_point.pointColumns.map(element=>
                  <tr key={element._id} >
                    <td>
                      {element.pointName}
                    </td>
                    <td>
                      {element.pointRate}
                    </td>
                    <td>
                      {
                        element.test
                        ?
                        element.test.title
                        :
                        <small style={{color:'#A8A8A8'}}>
                          Ch??a c???p nh???t
                        </small>
                      }
                    </td>
                    <td>
                      {
                        element.submit
                        ?
                        <Fragment>
                        {
                          element.submit.studentSubmission[0].point
                          ?
                          element.submit.studentSubmission[0].point
                          :
                          <small style={{color:'#A8A8A8'}}>
                            Ch??a c???p nh???t
                          </small>
                        }
                        </Fragment>
                        :
                        <small style={{color:'#A8A8A8'}}>
                          Ch??a c???p nh???t
                        </small>
                      }
                    </td>
                  </tr>
                )
              }
              <tr>
                <td colSpan='3' bgcolor="grey" align="center">
                  <font color="white"><b>T???ng ??i???m :</b></font>
                </td>
                <td>
                  {this.caculateTotalPoint(student_point.pointColumns)}
                </td>
              </tr>
            </tbody>
          </Table>
        }
      </Fragment>
    }

    var LessonList = null;

    if(isShowLesson === true){
      LessonList = 
      <Fragment>
        {
          schedule.events.length === 0
          ?
          <h3>Ch??a c?? b??i h???c</h3>
          :
          <Table responsive bordered hover>
          <thead className="thead-light">
            <tr>
              <th>Ng??y h???c</th>
              <th>Ti??u ?????</th>
            </tr>
          </thead>
          <tbody>
          {
            schedule.events.map(e=>
              <tr key={e._id} className="changeCursor" onClick={this.handleToLesson.bind(this, schedule.courseId, e.lessonId)}>
                <td>
                  {this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ng??y] DD [thg] MM, YYYY"))}
                </td>
                <td>
                  {e.text}
                </td>
              </tr>
            )
          }
          </tbody>
        </Table>
        }
      </Fragment>
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            {
              loadingStudent || loadingStudentCourse
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Card>
                <CardHeader>
                  <Row >
                    <Col sm="3">
                      <img src={student.photo} alt="avatar" style={styles.Avatar}/>
                    </Col>
                    <Col>
                      <h4><strong>{student.name}</strong></h4>
                      <div><strong>M?? s???</strong>: {student.code}</div>
                      <div><strong>S??? ??i???n tho???i</strong>: {student.phone ? student.phone : 'Ch??a c???p nh???t'}</div>
                      <div><strong>Email</strong>: {student.email}</div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {
                    studentcourses.length === 0
                    ?
                    <h3>H???c vi??n ch??a ghi danh kh??a n??o</h3>
                    :
                    <Table responsive bordered>
                      <thead className="thead-light">
                        <tr>
                          <th colSpan="3" className="text-center">kh??a h???c c???a h???c vi??n</th>
                        </tr>
                      </thead>
                      <tbody>
                      {
                        studentcourses.map(course=>
                          <Fragment key={course._id} >
                            <tr >
                              <td rowSpan="3">
                                <div className="text-center">
                                  <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                                </div>
                              </td >
                              <td rowSpan="3">
                                <b>{course.title}</b><br/>
                                <span style={{color:'#1E90FF', fontWeight:'bold'}}>M?? kh??a h???c: {course.code}</span>
                              </td>
                              <td className="changeCursor" onClick={this.handleAbsent.bind(this, course._id)}>
                                Xem ng??y v???ng
                              </td>
                            </tr>
                            <tr>
                              <td className="changeCursor" onClick={this.handlePoint.bind(this, course._id)}>
                                Xem ??i???m s???
                              </td>
                            </tr>
                            <tr>
                              <td className="changeCursor" onClick={this.handleLesson.bind(this, course._id)}>
                                Xem bu???i h???c
                              </td>
                            </tr>
                          </Fragment>
                        )
                      }
                      </tbody>
                    </Table>
                  }
                </CardBody>
              </Card>
            }
          </Col>
          <Col>
            <Card>
              <CardHeader>
                <strong>Th??ng tin c???a h???c vi??n trong kh??a h???c</strong>
              </CardHeader>
              <CardBody>
                {
                  isShowAbsentList
                  ?
                  <Fragment>
                  {
                    loadingStudentAbsentList
                    ? 
                    <ReactLoading type='bars' color='#05386B' />
                    :
                    AbsentList
                  }
                  </Fragment>
                  :
                  <Fragment>
                  {
                    isShowLesson
                    ?
                    <Fragment>
                    {
                      loadingEvent
                      ? 
                      <ReactLoading type='bars' color='#05386B' />
                      :
                      LessonList
                    }
                    </Fragment>
                    :
                    <Fragment>
                    {
                      loadingPoint
                      ? 
                      <ReactLoading type='bars' color='#05386B' />
                      :
                      PointList
                    }
                    </Fragment>
                  }
                  </Fragment>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

MyInfo.propTypes = {
  getStudent: PropTypes.func.isRequired,
  getStudentCourse: PropTypes.func.isRequired,
  getStudentAbsent: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
  courses: state.courses,
  attendance: state.attendance,
  point: state.point,
  schedule: state.schedule,
  auth: state.auth
});

export default connect(mapStateToProps, { getStudent, getStudentCourse, getStudentAbsent, getPointColumnsStudent, getSchedule })(MyInfo);  