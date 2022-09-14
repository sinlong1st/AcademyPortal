import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { 
  Row, 
  Col, 
  Button, 
  Nav, 
  NavItem, 
  Container, 
  Table
} from 'reactstrap';
import { getGuestCourseInfo, getCourseInfo } from '../../actions/courseActions';
import Moment from 'react-moment'; 
import NumberFormat from 'react-number-format';
import ReactLoading from 'react-loading';
import { AppNavbarBrand, AppHeader, AppFooter } from '@coreui/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/e-icon.png';
import 'moment/locale/vi';

var moment = require('moment');

const styles = {
  imgbox3: {
    position: 'relative',
    height: 200
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
      loading: true,
      guestcourseinfo: []
    };
  }

  componentDidMount = () => {
    this.props.getGuestCourseInfo(this.props.match.params.courseId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { guestcourseinfo, loadingCourseInfo } = nextProps.courses
      this.setState({
        guestcourseinfo,
        loading: loadingCourseInfo
      })
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const { guestcourseinfo, loading } = this.state
    return (
      <div className="animated fadeIn">
        <AppHeader>
          <AppNavbarBrand full={{ src: logo, width: 50, height: 50, alt: 'Logo' }} className='changeCursor' onClick={()=>this.props.history.push('/')}/>
          <b style={{fontFamily:'Roboto Slab, serif', fontSize:20}} onClick={()=>this.props.history.push('/')} className='changeCursor'>TRUNG TÂM ĐÀO TẠO</b>
          <Nav className="d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link to="/login">Đăng nhập</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to="/register">Đăng ký</Link>
            </NavItem>
          </Nav>
        </AppHeader>

        {
          loading
          ?
          <Container>
            <ReactLoading type='bars' color='#05386B'/>
          </Container>
          :
          <Fragment>

            <div className="app-body">
              <main className="main">
                <Container>
                  <div style={styles.imgbox3}>
                    <img src={guestcourseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                  </div>
                  <h2 style={{marginTop:10, fontWeight:'bold'}}>{guestcourseinfo.course.title}</h2>
                  <p className="lead">{guestcourseinfo.course.intro}</p>
                </Container>  
                <Container fluid>
                  <hr/>
                  <Row>
                    <Col xs="9">
                      <b>Hạn đăng ký - </b>
                      <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course.enrollDeadline}
                      </Moment><br/>
                      <b>Học phí - </b>
                      <NumberFormat thousandSeparator={true} value={guestcourseinfo.course_detail.fee} displayType={'text'}/> VND.<br/>
                      <b>Thời gian học - </b>
                      {guestcourseinfo.course_detail.studyTime}.<br/>
                      <b>Ngày khai giảng - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course_detail.openingDay}
                      </Moment><br/>
                      <b>Ngày kết thúc - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course_detail.endDay}
                      </Moment><br/>
                    </Col>
                    <Col>
                      <Button color="danger" onClick={()=>this.props.history.push('/login')} className="btn-pill" size="lg" block>
                        <i className="fa fa-pencil-square-o"></i>&nbsp;Đăng nhập để ghi danh
                      </Button>
                    </Col>
                  </Row>

                  <hr/>
                  <Container>
                    <h4 style={{fontWeight:'bold'}}>Giới thiệu nội dung khóa học</h4>
                  </Container>
                  <div dangerouslySetInnerHTML={ { __html: guestcourseinfo.course_detail.info} }></div>

                  <hr/>
                  <Container>
                    <h4 style={{fontWeight:'bold'}}>Lịch học và bài học</h4>
                  </Container>
                  <Table  dark bordered responsive className="table-outline mb-0 d-none d-sm-table">
                    <thead>
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

                </Container>


              </main>
            </div>
            <AppFooter style={{marginTop: 50}}>
              <Container><b >Trung Tâm Đào Tạo &copy; 2019</b></Container>
            </AppFooter>
          </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  courses: state.courses,  
  success: state.success
});
export default connect(mapStateToProps, { getGuestCourseInfo, getCourseInfo })(CourseInfo); 
