import React, { Component, Fragment } from 'react';
import { Card, CardBody, Container, Row, Table, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { getStudent } from '../../actions/userActions';
import { getStudentAbsent } from '../../actions/attendanceActions';
import { getPointColumnsStudent } from '../../actions/pointActions';
import { getCourse } from '../../actions/courseActions';
import isEmptyObj from '../../validation/is-empty'; 
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 
import { withRouter } from 'react-router-dom';
import PrintComponents from "react-print-components";

const styles = {
  Avatar: {
    width: 100,
    height: 100,
    margin: 'auto',
    borderRadius: 50
  },
  bigAvatar: {
    height: 100,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class Print extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingPoint: true,
      loadingStudentAbsentList: true,
      loadingStudent: true,
      loadingCourse: true

    };

  }

  componentDidMount = () => {
    this.props.getCourse(this.props.match.params.courseId)
    this.props.getStudent(this.props.match.params.studentId)
    this.props.getStudentAbsent(this.props.match.params.courseId, this.props.match.params.studentId)
    this.props.getPointColumnsStudent(this.props.match.params.courseId, this.props.match.params.studentId)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users)) {
      const { student, loading } = nextProps.users

      this.setState({
        student,
        loadingStudent: loading
      })
    }

    if (!isEmptyObj(nextProps.courses)) {
      const { course, loading } = nextProps.courses
      if(course._id === this.props.match.params.courseId)
        this.setState({
          course,
          loadingCourse: loading
        })
    }

    if (!isEmptyObj(nextProps.point)) {
      const { student_point, loading } = nextProps.point

      this.setState({
        student_point,
        loadingPoint: loading
      })
    }

    if (!isEmptyObj(nextProps.attendance)) {
      const { student_absent_list, loading } = nextProps.attendance

      this.setState({
        student_absent_list,
        loadingStudentAbsentList: loading
      })
    } 

  }

  caculateTotalPoint(pointColumns){
    var totalPoint = 0; 
    for(var i=0; i<pointColumns.length; i++)
    {
      if(!isEmptyObj(pointColumns[i].submit) )
        if(!isEmptyObj(pointColumns[i].submit.studentSubmission[0].point))
          totalPoint = totalPoint + pointColumns[i].submit.studentSubmission[0].point * pointColumns[i].pointRate / 100
    }
    return totalPoint
  }

  render() {
    const { 
      loadingPoint, 
      loadingStudentAbsentList,
      loadingStudent, 
      loadingCourse,
      student, 
      course,
      student_absent_list,
      student_point
    } = this.state

    return (
      <div className="animated fadeIn">
        <PrintComponents trigger={<Button color='danger'><i className="fa fa-print"></i> Print</Button>}>
          <Card>
            <CardBody>
              {
                loadingPoint || loadingStudentAbsentList || loadingStudent || loadingCourse
                ?
                <Container>
                  <Row className="justify-content-center">
                    <ReactLoading type='spinningBubbles' color='#05386B' />
                  </Row>
                </Container>
                :
                <Fragment>
                  <Row className="justify-content-center">
                    <h1>TH??NG TIN H???C VI??N</h1>
                  </Row>

                  <hr/>
                  
                  <Row >
                    <Col xs="2">
                      <img src={student.photo} alt="avatar" style={styles.Avatar}/>
                    </Col>
                    <Col>
                      <h4><strong>{student.name}</strong></h4>
                      <div><strong>M?? s???</strong>: {student.code}</div>
                      <div><strong>Email</strong>: {student.email}</div>
                      <div><strong>S??? ??i???n tho???i</strong>: {student.phone ? student.phone : 'Ch??a c???p nh???t'}</div>
                    </Col>
                  </Row>

                  <hr/>
                  <Row >
                    <Col xs="2">
                      <img src={course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                    </Col>
                    <Col>
                      <h4><strong>{course.title}</strong></h4>
                      <div><strong>M?? kh??a h???c</strong>: {course.code}</div>
                      <div><strong>Ch???ng ch???</strong>: {course.certification.name}</div>
                    </Col>
                  </Row>

                  <hr/>
                  <div><strong>Ng??y v???ng</strong></div>
                  <br/>
                  {
                    student_absent_list.absentlist.length === 0
                    ?
                    <h3>H???c vi??n kh??ng ngh??? ng??y n??o</h3>
                    :
                    <Table responsive bordered>
                      <thead className="thead-light">
                        <tr>
                          <th>Ng??y v???ng</th>
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
                                <tr>
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
                  <hr/>
                  <div><strong>B???ng ??i???m </strong></div>
                  <br/>
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
                          <td colSpan='3' align="center">
                            <font color="grey"><b>T???ng ??i???m :</b></font>
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
            </CardBody>
          </Card>
        </PrintComponents>

        <Card style={{marginTop: 20}}>
          <CardBody>
            {
              loadingPoint || loadingStudentAbsentList || loadingStudent || loadingCourse
              ?
              <Container>
                <Row className="justify-content-center">
                  <ReactLoading type='spinningBubbles' color='#05386B' />
                </Row>
              </Container>
              :
              <Fragment>
                <Row className="justify-content-center">
                  <h1>TH??NG TIN H???C VI??N</h1>
                </Row>

                <hr/>
                
                <Row >
                  <Col xs="2">
                    <img src={student.photo} alt="avatar" style={styles.Avatar}/>
                  </Col>
                  <Col>
                    <h4><strong>{student.name}</strong></h4>
                    <div><strong>M?? s???</strong>: {student.code}</div>
                    <div><strong>Email</strong>: {student.email}</div>
                    <div><strong>S??? ??i???n tho???i</strong>: {student.phone ? student.phone : 'Ch??a c???p nh???t'}</div>
                  </Col>
                </Row>

                <hr/>
                <Row >
                  <Col xs="2">
                    <img src={course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                  </Col>
                  <Col>
                    <h4><strong>{course.title}</strong></h4>
                    <div><strong>M?? kh??a h???c</strong>: {course.code}</div>
                    <div><strong>Ch???ng ch???</strong>: {course.certification.name}</div>
                  </Col>
                </Row>

                <hr/>
                <div><strong>Ng??y v???ng</strong></div>
                <br/>
                {
                  student_absent_list.absentlist.length === 0
                  ?
                  <h3>H???c vi??n kh??ng ngh??? ng??y n??o</h3>
                  :
                  <Table responsive bordered>
                    <thead className="thead-light">
                      <tr>
                        <th>Ng??y v???ng</th>
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
                              <tr>
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
                <hr/>
                <div><strong>B???ng ??i???m </strong></div>
                <br/>
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
          </CardBody>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users,
  attendance: state.attendance,
  point: state.point,
  courses: state.courses
});

export default withRouter(connect(mapStateToProps, { getStudentAbsent, getPointColumnsStudent, getStudent, getCourse })(Print));  