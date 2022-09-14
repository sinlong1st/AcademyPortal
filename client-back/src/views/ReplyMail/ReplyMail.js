import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Container,
  Row,
  Button,
  Modal,
  ModalBody
} from 'reactstrap';
import isEmptyObj from '../../validation/is-empty';
import { getCourseInfo } from '../../actions/courseActions';
import { repNotifyMail, getrepNotifyMail, clearSuccess, getApproveListStudent, clearErrors } from '../../actions/userActions';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';

const styles = {
  imgbox3: {
    position: 'relative',
    height: 100
  },
  bigAvatar: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  }
}

class ReplyMail extends Component {
  constructor() {
    super();
    this.state = {
      loadingCourseInfo: true,
      loadingInfo: true,
      courseinfo: [],
      rep_mail_info: {},
      isLoading: false,
      errors: {},
      isShowSuccess: false
    };
  }

  componentDidMount = () => {
    this.props.getCourseInfo(this.props.match.params.courseId);
    this.props.getrepNotifyMail(this.props.match.params.userId, this.props.match.params.courseId)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.courses))
    {
      let { courseinfo, loadingCourseInfo } = nextProps.courses
      if(this.props.match.params.courseId === courseinfo.course._id)
        this.setState({ 
          loadingCourseInfo,
          courseinfo
        });
    }

    let { rep_mail_info, loading } = nextProps.users
    this.setState({ 
      loadingInfo: loading,
      rep_mail_info
    });

    if (nextProps.success.mes === 'Đã phản hồi mail thành công') {
      this.setState({ isLoading: false, isShowSuccess: true })
      this.props.clearSuccess()
      this.props.getApproveListStudent(this.props.match.params.courseId)
      this.props.getrepNotifyMail(this.props.match.params.userId, this.props.match.params.courseId)
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false });
      this.props.clearErrors()
    }

  }

  handleWaitCourse = () =>{
    const repData = {
      replyMail: {
        chosen: 'Đợi dời lịch học'
      }
    }

    this.props.repNotifyMail(this.props.match.params.userId, this.props.match.params.courseId, repData)
    this.setState({ isLoading: true })
  }

  handleOutCourse = () =>{
    const repData = {
      replyMail: {
        chosen: 'Rời khỏi khóa học'
      }
    }

    this.props.repNotifyMail(this.props.match.params.userId, this.props.match.params.courseId, repData)
    this.setState({ isLoading: true })
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  render() {
    const { rep_mail_info, courseinfo, loadingCourseInfo, loadingInfo, errors } = this.state
    return (
      <div className="animated fadeIn">
        {
          loadingCourseInfo || loadingInfo
          ?
          <Row className="justify-content-center">
            <ReactLoading type='spinningBubbles' color='#05386B'/>
          </Row>
          :
          <Container>
            <div style={styles.imgbox3}>
              <img src={courseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
            </div>
            <span style={{color:'#1E90FF', fontSize:15, fontWeight:'bold'}}>Mã khóa học: {courseinfo.course.code}</span>
            <h4 style={{marginTop:10, fontWeight:'bold'}}>{courseinfo.course.title}</h4>
            {
              errors.fail
              ?
              <p className="lead">{errors.fail}</p>
              :
              <div>
                {
                  rep_mail_info.enrollStudents
                  ?
                  <div>
                    {
                      rep_mail_info.enrollStudents[0].replyMail
                      ?
                      <div>
                        <p className="lead">Khóa học này hiện không thể mở lớp vì không đủ thành viên ghi danh và bạn đã chọn: <b style={{color: '#FF6347', fontWeight: 'bold'}}>{rep_mail_info.enrollStudents[0].replyMail.chosen}</b></p>
                        <Button onClick={()=>this.props.history.push(`/choose-option/${this.props.match.params.userId}/${this.props.match.params.courseId}/change-course`)} color="primary" >
                          <b>Chuyển sang khóa học khác</b>
                        </Button>
                        <Button onClick={this.handleOutCourse} color="primary" style={{marginLeft:10}}>
                          <b>Hủy ghi danh và hoàn tiền</b>
                        </Button>
                        <Button onClick={this.handleWaitCourse} color="primary" style={{marginLeft:10}}>
                          <b>Chờ dời lịch khai giảng</b>
                        </Button>
                      </div>
                      :
                      <div>
                        <p className="lead" style={{marginTop: 20}}>Khóa học này hiện không thể mở lớp vì không đủ thành viên ghi danh mời bạn chọn các phương án sau</p>
                        <Button onClick={()=>this.props.history.push(`/choose-option/${this.props.match.params.userId}/${this.props.match.params.courseId}/change-course`)} color="primary" >
                          <b>Chuyển sang khóa học khác</b>
                        </Button>
                        <Button onClick={this.handleOutCourse} color="primary" style={{marginLeft:10}}>
                          <b>Hủy ghi danh và hoàn tiền</b>
                        </Button>
                        <Button onClick={this.handleWaitCourse} color="primary" style={{marginLeft:10}}>
                          <b>Chờ dời lịch khai giảng</b>
                        </Button>
                      </div>
                    }
                  </div>
                  :
                  <p className="lead">Bạn đã không còn trong khóa học này</p>

                }
              </div>
            }
          </Container> 
        }
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Lựa chọn thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  courses: state.courses,
  users: state.users,
  success: state.success,
  errors: state.errors
});

export default connect(mapStateToProps, { getCourseInfo, repNotifyMail, getrepNotifyMail, clearSuccess, getApproveListStudent, clearErrors })(ReplyMail);
