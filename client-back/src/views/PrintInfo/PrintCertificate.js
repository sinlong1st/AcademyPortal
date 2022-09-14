import React, { Component, Fragment } from 'react';
import { Card, CardBody, Container, Row, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { getStudent } from '../../actions/userActions';
import { getPointColumnsStudent } from '../../actions/pointActions';
import { getCourseInfo } from '../../actions/courseActions';
import isEmptyObj from '../../validation/is-empty'; 
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 
import { withRouter } from 'react-router-dom';
import PrintComponents from "react-print-components";

class PrintCertificate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingPoint: true,
      loadingStudent: true,
      loadingCourse: true
    };

  }

  componentDidMount = () => {
    this.props.getCourseInfo(this.props.match.params.courseId)
    this.props.getStudent(this.props.match.params.studentId)
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
      const { courseinfo, loadingCourseInfo } = nextProps.courses
      if(courseinfo.course._id === this.props.match.params.courseId)
        this.setState({
          courseinfo,
          loadingCourse: loadingCourseInfo
        })
    }

    if (!isEmptyObj(nextProps.point)) {
      const { student_point, loading } = nextProps.point

      this.setState({
        student_point,
        loadingPoint: loading
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
      loadingStudent, 
      loadingCourse,
      student, 
      courseinfo,
      student_point
    } = this.state
    console.log(courseinfo)
    return (
      <div className="animated fadeIn">
        <PrintComponents trigger={<Button color='danger'><i className="fa fa-print"></i> Print</Button>}>
          <Card>
            <CardBody>
              {
                loadingPoint || loadingStudent || loadingCourse
                ?
                <Container>
                  <Row className="justify-content-center">
                    <ReactLoading type='spinningBubbles' color='#05386B' />
                  </Row>
                </Container>
                :
                <Fragment>
                  <center>
                    <div style={{width: '1000px', height: '900px', padding: '20px', textAlign: 'center', border: '10px solid #787878'}}>
                      <div style={{width: '950px', height: '850px', padding: '20px', textAlign: 'center', border: '5px solid #787878'}}>
                        <span style={{fontSize: '20px'}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
                        <br/>
                        <span style={{fontSize: '18px'}}>Độc lập - Tự do - Hạnh phúc</span>
                        <hr style={{ width: 230}}/>
                        <br/>
                        <span style={{fontSize: '50px', fontWeight: 'bold'}}>Chứng chỉ {courseinfo.course.certification.name}</span>
                        <br /><br />
                        <span style={{fontSize: '25px'}}><i>Chứng chỉ xác nhận học viên</i></span>
                        <br /><br />
                        <span style={{fontFamily:'Lobster, cursive', fontSize:30}}>{student.name}</span><br /><br />
                        <span style={{fontSize: '25px'}}><i>đã hoàn thành khóa học</i></span> <br /><br />
                        <span style={{fontSize: '30px'}}>{courseinfo.course.title}</span> <br /><br />
                        <span style={{fontSize: '20px'}}>với số điểm <b>{this.caculateTotalPoint(student_point.pointColumns)}</b></span> <br /><br /><br /><br />
                        <span style={{fontSize: '25px'}}>
                          <i>Đã hoàn thành khóa học từ ngày
                            <Moment format=" DD/MM/YYYY ">
                              {courseinfo.course_detail.openingDay}
                            </Moment>
                            đến ngày
                            <Moment format=" DD/MM/YYYY">
                              {courseinfo.course_detail.endDay}
                            </Moment>
                          </i>
                        </span>
                        <table style={{marginTop: '60px', float: 'right'}}>
                          <tbody>
                            <tr>
                              <td><span><b>Giám đốc</b></span></td>
                            </tr>
                            <tr>
                              <td style={{width: '200px', float: 'right', border: 0, borderBottom: '1px solid #000'}} />
                            </tr>
                            <tr>
                              <td style={{textAlign: 'center'}}><span><b>Ký tên</b></span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </center>
                </Fragment>
              }
            </CardBody>
          </Card>
        </PrintComponents>

        <Card style={{marginTop: 20}}>
          <CardBody>
            {
              loadingPoint || loadingStudent || loadingCourse
              ?
              <Container>
                <Row className="justify-content-center">
                  <ReactLoading type='spinningBubbles' color='#05386B' />
                </Row>
              </Container>
              :
              <Fragment>
                <center>
                  <div style={{width: '1000px', height: '900px', padding: '20px', textAlign: 'center', border: '10px solid #787878'}}>
                    <div style={{width: '950px', height: '850px', padding: '20px', textAlign: 'center', border: '5px solid #787878'}}>
                      <span style={{fontSize: '20px'}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
                      <br/>
                      <span style={{fontSize: '18px'}}>Độc lập - Tự do - Hạnh phúc</span>
                      <hr style={{ width: 230}}/>
                      <br/>
                      
                      <span style={{fontSize: '50px', fontWeight: 'bold'}}>Chứng chỉ {courseinfo.course.certification.name}</span>
                      <br /><br />
                      <span style={{fontSize: '25px'}}><i>Chứng chỉ xác nhận học viên</i></span>
                      <br /><br />
                      <span style={{fontFamily:'Lobster, cursive', fontSize:30}}>{student.name}</span><br /><br />
                      <span style={{fontSize: '25px'}}><i>đã hoàn thành khóa học</i></span> <br /><br />
                      <span style={{fontSize: '30px'}}>{courseinfo.course.title}</span> <br /><br />
                      <span style={{fontSize: '20px'}}>với số điểm <b>{this.caculateTotalPoint(student_point.pointColumns)}</b></span> <br /><br /><br /><br />
                      <span style={{fontSize: '25px'}}>
                        <i>Đã hoàn thành khóa học từ ngày
                          <Moment format=" DD/MM/YYYY ">
                            {courseinfo.course_detail.openingDay}
                          </Moment>
                          đến ngày
                          <Moment format=" DD/MM/YYYY">
                            {courseinfo.course_detail.endDay}
                          </Moment>
                        </i>
                      </span>
                      <table style={{marginTop: '60px', float: 'right'}}>
                        <tbody>
                          <tr>
                            <td><span><b>Giám đốc</b></span></td>
                          </tr>
                          <tr>
                            <td style={{width: '200px', float: 'right', border: 0, borderBottom: '1px solid #000'}} />
                          </tr>
                          <tr>
                            <td style={{textAlign: 'center'}}><span><b>Ký tên</b></span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </center>
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
  point: state.point,
  courses: state.courses
});

export default withRouter(connect(mapStateToProps, { getPointColumnsStudent, getStudent, getCourseInfo })(PrintCertificate));  