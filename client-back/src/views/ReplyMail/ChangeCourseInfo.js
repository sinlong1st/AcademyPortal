import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Table, Button, Modal, ModalBody } from 'reactstrap';
import { getCourseInfo } from '../../actions/courseActions';
import { repNotifyMail, clearSuccess, getApproveListStudent, clearErrors } from '../../actions/userActions';
import Moment from 'react-moment'; 
import NumberFormat from 'react-number-format';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
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

class ChangeCourseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseinfo: [],
      loading: true,
      isShowSuccess: false,
      isShowError: false
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

    if (nextProps.success.mes === 'Đã phản hồi mail thành công') {
      this.setState({ isLoading: false, isShowSuccess: true })
      this.props.clearSuccess()
      this.props.getApproveListStudent(this.props.match.params.courseId)
    }

    if (nextProps.errors.fail === 'Yêu cầu của bạn không thành công') {
      this.setState({ isShowError: true, isLoading: false });
      this.props.clearErrors()
    }

  }

  handleClickChange(courseId, courseCode){
    const repData = {
      replyMail: {
        chosen: `Chuyển sang lớp "${courseCode}"`,
        changeCourseId: courseId
      }
    }

    this.props.repNotifyMail(this.props.match.params.userId, this.props.match.params.courseId, repData)
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push(`/choose-option/${this.props.match.params.userId}/${this.props.match.params.courseId}`)
  }

  hideAlertError(){
    this.setState({
      isShowError: false
    })
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
                  <Button color="danger" onClick={this.handleClickChange.bind(this, courseinfo.course._id, courseinfo.course.code)} >
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
            title='Yêu cầu chuyển lớp của bạn đã được gửi'
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <SweetAlert
            danger
            confirmBtnText="OK"
            confirmBtnBsStyle="danger"
            title='Không thể gửi yêu cầu chuyển lớp'
            show={this.state.isShowError}
            onConfirm={this.hideAlertError.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  success: state.success,
  courses: state.courses,
  errors: state.errors
});
export default connect(mapStateToProps, { getCourseInfo, repNotifyMail, clearSuccess, getApproveListStudent, clearErrors })(ChangeCourseInfo); 
