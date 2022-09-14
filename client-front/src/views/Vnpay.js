import React, { Component } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { vnpayReturn, clearVnpayReturn, getApproveListStudent } from '../actions/userActions';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import isEmptyObj from '../validation/is-empty';
import smile from '../assets/img/smile.png'
import { getAllCourse, getGuestCourseInfo } from '../actions/courseActions';

class VnPay extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      idStudent: ''
    };
  }

  componentDidMount() {
    this.props.vnpayReturn(this.props.location.search)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users.pay_return)) {
      this.setState({ loading: false, idStudent: nextProps.users.pay_return.studentCode })
      this.props.clearVnpayReturn();
      this.props.getAllCourse();
      this.props.getApproveListStudent(nextProps.users.pay_return.courseId);
      this.props.getGuestCourseInfo(nextProps.users.pay_return.courseId);
    }
  }

  render() {
    const { loading, idStudent } = this.state
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            {
              loading
              ?
              <ReactLoading type='spinningBubbles' color='#05386B' />
              :
              <div>
                <img src={smile} alt="avatar" style={{width: 100, height: 100}}/>
                <div style={{textAlign: 'center', fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold'}}>
                  Chúc mừng! Bạn đã ghi danh thành công.
                </div> 
                <p style={{fontWeight:'bold'}}>
                  Mã số sinh viên của bạn là: {idStudent} <br/>
                  Mật khẩu đăng nhập vào hệ thống LMS của Ai-Edu là mật khẩu của bạn hiện tại
                </p>
                <Button color='danger' onClick={()=>window.open('http://www.lms.giangdayit.com')}>Tới trang LMS</Button>
              </div>
            }
          </Row>
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});

export default connect(mapStateToProps, { vnpayReturn, clearVnpayReturn, getAllCourse, getApproveListStudent, getGuestCourseInfo })(VnPay);
