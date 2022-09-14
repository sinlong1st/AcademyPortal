import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Table, Button } from 'reactstrap';
import { getCourseInfo } from '../../actions/courseActions';
import Moment from 'react-moment'; 
import NumberFormat from 'react-number-format';
import ReactLoading from 'react-loading';
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
      courseinfo: [],
      loading: true
    };
  }

  componentDidMount = () => {
    this.props.getCourseInfo(this.props.match.params.id);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { courseinfo, loadingCourseInfo } = nextProps.courses
      this.setState({
        courseinfo,
        loading: loadingCourseInfo
      })
    }

  }

  render() {
    const { courseinfo, loading } = this.state
    return (
      <div className="animated fadeIn">
        {
          loading
          ?
          <Container>
            <ReactLoading type='bars' color='#05386B'/>
          </Container>
          :
          <Fragment>
            <Container>
              <div style={styles.imgbox3}>
                <img src={ courseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
              </div>
              <span style={{color:'#1E90FF', fontSize:20, fontWeight:'bold'}}>Mã khóa học: {courseinfo.course.code}</span>
              <h2 style={{marginTop:10, fontWeight:'bold'}}>{ courseinfo.course.title}</h2>
              <p className="lead">{ courseinfo.course.intro}</p>
            </Container>  
            <Container fluid>
              <hr/>
              <Row>
                <Col xs="9">
                  <b>Hạn đăng ký - </b>
                  <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                    { courseinfo.course.enrollDeadline}
                  </Moment><br/>
                  <b>Học phí - </b>
                  <NumberFormat thousandSeparator={true} value={ courseinfo.course_detail.fee} displayType={'text'}/> VND.<br/>
                  <b>Thời gian học - </b>
                  { courseinfo.course_detail.studyTime}.<br/>
                  <b>Ngày khai giảng - </b>
                  <Moment format="[ngày] DD [thg] MM, YYYY.">
                    { courseinfo.course_detail.openingDay}
                  </Moment><br/>
                  <b>Ngày kết thúc - </b>
                  <Moment format="[ngày] DD [thg] MM, YYYY.">
                    { courseinfo.course_detail.endDay}
                  </Moment><br/>
                  <b>Đã ghi danh - </b>
                    {courseinfo.course.students.length} / {courseinfo.course_detail.maxStudent}
                </Col>
                <Col>
                  <Button color="danger">
                    <b>Chuyển sang khóa học này</b>
                  </Button>
                </Col>
              </Row>

              <hr/>
              <Container>
                <h4 style={{fontWeight:'bold'}}>Giới thiệu nội dung khóa học</h4>
              </Container>
              <div dangerouslySetInnerHTML={ { __html:  courseinfo.course_detail.info} }></div>

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
                     courseinfo.schedule.events.map(e=>
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
            <br/>
          </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getCourseInfo })(CourseInfo); 
