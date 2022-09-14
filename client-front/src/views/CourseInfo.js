import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { 
  Row, 
  Col, 
  Container, 
  Table,
  Alert,
  Card,
  CardBody,
  Button
} from 'reactstrap';
import { getCourseInfo, getGuestCourseInfo, clearSuccess } from '../actions/courseActions';
import Moment from 'react-moment'; 
import NumberFormat from 'react-number-format';
import ReactLoading from 'react-loading';
import LoginModal from './LoginModal';
import Payment from './Payment';
import 'moment/locale/vi';
// import Rating from 'react-rating';
// import ModalRating from './ModalRating';
import Map from '../components/Map'
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

var moment = require('moment');

const styles = {
  imgbox3: {
    position: 'relative',
    height: 200
  },
  Avatar: {
    width: 100,
    height: 100,
    margin: 'auto',
    borderRadius: 50
  },
  bigAvatar: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  }
}

class CourseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMap: true,
      loadingCourseInfo: true,
      loading: true,
      courseinfo: {},
      guestcourseinfo: []
    };
  }

  componentDidMount = () => {
    if(this.props.auth.isAuthenticated)
    {
      this.props.getGuestCourseInfo(this.props.match.params.courseId);
      this.props.getCourseInfo(this.props.match.params.courseId);
    }else{
      this.props.getGuestCourseInfo(this.props.match.params.courseId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { guestcourseinfo, courseinfo, loading, loadingCourseInfo } = nextProps.courses
      if(this.props.match.params.courseId === guestcourseinfo.course._id)
        this.setState({
          guestcourseinfo,
          courseinfo,
          loading,
          loadingCourseInfo
        })
    }

    if (nextProps.success.mes === 'đăng nhập thành công') {
      this.props.getCourseInfo(this.props.match.params.courseId)
      this.props.clearSuccess()
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  caculateRating(teacherRating) {
    var finalRating = 0;
    for(var i = 0; i < teacherRating.length; i++)
    {
      finalRating = finalRating + teacherRating[i].star 
    }
    finalRating = finalRating / teacherRating.length
    return finalRating
  }

  showMap = () => {
    this.setState({
      showMap: true
    })
  }

  hideMap = () => {
    this.setState({
      showMap: false
    })
  }

  render() {
    const { showMap, courseinfo, loading, guestcourseinfo, loadingCourseInfo } = this.state
    return (
      <div className="animated fadeIn">
        <div className="app-body" style={{marginBottom: 50}}>
          {
            loading || loadingCourseInfo
            ?
            <Container>
              <Row className="justify-content-center">
                <ReactLoading type='spinningBubbles' color='#05386B'/>
              </Row>
            </Container>
            :
            <main className="main">
              <Container>
                <div style={styles.imgbox3}>
                  <img src={guestcourseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                </div>
                <h5 style={{marginTop:20, color:'#1E90FF', fontSize:20, fontWeight:'bold'}}>Mã khóa học: {guestcourseinfo.course.code}</h5>
                <h2 style={{marginTop:10, fontWeight:'bold'}}>{guestcourseinfo.course.title}</h2>
                <p className="lead">{guestcourseinfo.course.intro}</p>
              </Container>  
              <Container fluid>
                <hr/>
                <Row>
                  <Col xs="9">
                    <div>
                      <b>Hạn đăng ký - </b>
                      <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course.enrollDeadline}
                      </Moment>
                    </div>

                    <div className="info">
                      <b>Học phí - </b>
                      <NumberFormat thousandSeparator={true} value={guestcourseinfo.course_detail.fee} displayType={'text'}/> VND.<br/>
                    </div>

                    <div className="info">
                      <b>Thời gian học - </b>
                      {guestcourseinfo.course_detail.studyTime}.
                    </div>

                    <div className="info">
                      <b>Ngày khai giảng - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course_detail.openingDay}
                      </Moment>
                    </div>

                    <div className='info'>
                      <b>Ngày kết thúc - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course_detail.endDay}
                      </Moment>
                    </div>
                    
                    <div className='info'>
                      <b>Số lượng học viên - </b>
                      {guestcourseinfo.course_detail.maxStudent}
                    </div>

                    <div className='info'>
                      Bạn sẽ nhận được chứng chỉ <b>{guestcourseinfo.course.certification.name}</b> do Trung Tâm cấp sau khi hoàn thành khóa học  
                    </div>
                    
                    <div className='warninfo'>
                      <b>Điều khoản: </b>
                      Không hoàn tiền khi đã đăng ký. Chỉ hoàn tiền thỏa mãn 2 điều kiện: Khi lớp học không thể mở và học viên có nhu cầu hoàn tiền
                    </div>
                  </Col>
                  <Col>
                  {
                    this.props.auth.isAuthenticated
                    ?
                    <Fragment>
                    {
                      courseinfo.isEnroll
                      ?
                      <Alert color='danger' style={{textAlign: 'center', fontWeight: 'bold'}}>Đã ghi danh</Alert>                        
                      :
                      <div>
                        {
                          guestcourseinfo.course_detail.isFull === true
                          ?
                          <Alert color='danger' style={{textAlign: 'center', fontWeight: 'bold'}}>Khóa học đã hết chỗ</Alert>                        
                          :
                          <div>
                            <div style={{color:'red', fontSize:17, fontWeight:'bold', textAlign: 'center'}}>Ghi danh ngay</div>
                            <p style={{color:'red', fontSize:20, fontWeight:'bold', textAlign: 'center'}}><NumberFormat thousandSeparator={true} value={guestcourseinfo.course_detail.fee} displayType={'text'}/> VND.</p>
                            <div style={{textAlign: 'center'}}><Payment fee={guestcourseinfo.course_detail.fee}/></div>
                          </div>
                        }
                      </div>
                    }
                    </Fragment>
                    :
                    <div>
                    {
                      guestcourseinfo.course_detail.isFull === true
                      ?
                      <Alert color='danger' style={{textAlign: 'center', fontWeight: 'bold'}}>Khóa học đã hết chỗ</Alert>                        
                      :
                      <LoginModal/>
                    }
                    </div>
                  }
                  </Col>
                </Row>

                <hr/>
                <Container>
                  <h4 style={{fontWeight:'bold'}}>Giới thiệu nội dung khóa học</h4>
                </Container>
                <div dangerouslySetInnerHTML={ { __html: guestcourseinfo.course_detail.info} }></div>

                <hr/>
                <Container>
                  <h4 style={{fontWeight:'bold'}}>Thông tin giáo viên</h4>
                </Container>
                {
                  guestcourseinfo.course.teachers.length === 0
                  ?
                  <h4 style={{color:'grey'}}>Chưa cập nhật giáo viên cho khóa học này</h4>
                  :
                  <div>
                    {
                      guestcourseinfo.course.teachers.map(teacher =>
                        <Alert color='secondary' key={teacher._id}>
                          <Row style={{marginTop: 20}}>
                            <Col sm="1">
                              <img src={teacher.photo} alt="avatar" style={styles.Avatar}/>
                            </Col>
                            <Col style={{marginLeft: 20}} sm="10">
                              <h4><strong>{teacher.name}</strong></h4>
                              <div><strong>Email</strong>: {teacher.email ? teacher.email : <i>chưa cập nhật</i>}</div>
                              <div><strong>Học vị</strong>: {teacher.teacherDegree ? teacher.teacherDegree : <i>chưa cập nhật</i>}</div>
                              <div style={{marginTop: 10}}><strong>Giới thiệu</strong>: </div>
                              {
                                teacher.teacherIntro
                                ?
                                <div dangerouslySetInnerHTML={ { __html: teacher.teacherIntro} }></div>
                                :
                                <i>chưa cập nhật</i>
                              }
                            </Col>
                          </Row>
                        </Alert>

                      )
                    }
                  </div>
                }
                <hr/>

                <Card>
                  <CardBody>
                    <Container>
                      <h4 style={{fontWeight:'bold'}}>Lịch học và bài học</h4>
                    </Container>
                    <Table bordered responsive className="table-outline mb-0 d-none d-sm-table">
                      <thead >
                        <tr>
                          <th>Ngày học</th>
                          <th>Giờ học</th>
                          <th>Bài học</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          guestcourseinfo.schedule.events.map(e=>
                            <tr key={e._id}>
                              <td>
                                {this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}
                              </td>
                              <td>
                                <Moment format="HH:mm - ">
                                  {e.start}
                                </Moment>
                                <Moment format="HH:mm">
                                  {e.end}
                                </Moment>
                              </td>
                              <td>
                                {e.text}
                              </td>
                            </tr>
                          )
                        }
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>

                <hr/>
                <Container>
                  <h4 style={{ fontWeight: 'bold' }}>Địa điểm học</h4>
                </Container>
                <Row>
                  <Col md={6}>
                    <Card>
                      <CardBody style={{height: 280}}>
                        <Row className="justify-content-center" style={{marginBottom: 20}}>
                          <Button color='primary' className={showMap ? 'active': ''} onClick={this.showMap} style={{ marginRight: 10, width: 140, padding: 10 }}>
                            <i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;Xem Bản đồ
                          </Button>
                          <Button color='primary' className={!showMap ? 'active': ''}  onClick={this.hideMap} style={{ marginRight: 10, width: 140, padding: 10 }}>
                            <i className="fa fa-camera" aria-hidden="true"></i>&nbsp;Xem hình ảnh
                          </Button>
                        </Row>
                        <p><b>Địa điểm</b>: {guestcourseinfo.course.infrastructure.name}</p>
                        <p><b>Địa chỉ</b>: {guestcourseinfo.course.infrastructure.address}</p>
                        <p><b>Số điện thoại</b>: {guestcourseinfo.course.infrastructure.phone}</p>
                        <p><b>Email</b>: {guestcourseinfo.course.infrastructure.email}</p>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={6}>
                    {
                      showMap 
                      ?
                      <Map
                        center={guestcourseinfo.course.infrastructure.mapPosition}
                        height='280px'
                        zoom={15}
                      />
                      :
                      <Fragment>
                        {
                          guestcourseinfo.course.infrastructure.images === undefined
                          ?
                          <Card>
                            <CardBody style={{height: 280}}>
                              <Container>
                                <h4>Chưa cập nhật hình ảnh</h4>
                              </Container>
                            </CardBody>
                          </Card>
                          :
                          <Fragment>
                            {
                              guestcourseinfo.course.infrastructure.images.length === 0
                              ?
                              <Card>
                                <CardBody style={{height: 280}}>
                                  <Container>
                                    <h4>Chưa cập nhật hình ảnh</h4>
                                  </Container>
                                </CardBody>
                              </Card>
                              :
                              <AwesomeSlider style={{height: 255}}>
                              {
                                guestcourseinfo.course.infrastructure.images.map((image, index) =>
                                  <div style={{height: 255}} key={index} data-src={image.url} />
                                )
                              }
                              </AwesomeSlider>
                            }
                          </Fragment>
                        }
                      </Fragment>
                    }
                  </Col>
                </Row>
              </Container>
            </main>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  courses: state.courses,  
  success: state.success
});
export default connect(mapStateToProps, { getCourseInfo, getGuestCourseInfo, clearSuccess })(CourseInfo);