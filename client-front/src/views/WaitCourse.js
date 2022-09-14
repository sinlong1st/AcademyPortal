import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { Col, Container, Row } from 'reactstrap';
import { repNotifyMail, clearSuccess, getApproveListStudent, clearErrors } from '../actions/userActions';
import logo from '../assets/img/e-icon.png'
import isEmptyObj from '../validation/is-empty';

class WaitCourse extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      errors: {}
    };
  }

  componentDidMount() {

    const repData = {
      replyMail: {
        chosen: 'Đợi dời lịch học'
      }
    }

    this.props.repNotifyMail(this.props.match.params.userId, this.props.match.params.courseId, repData)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Đã phản hồi mail thành công') {
      this.setState({ isLoading: false })
      this.props.clearSuccess()
      this.props.getApproveListStudent(this.props.match.params.courseId)
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false });
      this.props.clearErrors()
    }
  }

  render() {
    const { isLoading, errors } = this.state
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            {
              isLoading
              ?
              <ReactLoading type='bars' color='#05386B' />
              :
              <Col md="6">
                <img src={logo} alt='Logo' height="150" width="150" />
                <div style={{textAlign: 'center', fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold'}}>
                {
                  errors.fail
                  ?
                  'Bạn đã không còn là học viên của khóa học này, hãy kiểm tra lại'
                  :
                  'Cảm ơn bạn, yêu cầu chờ dời lịch khai giảng của bạn đã được gửi về Trung Tâm'
                }
                </div>
              </Col>
            }
          </Row>
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  success: state.success,
  errors: state.errors
});

export default connect(mapStateToProps, { repNotifyMail, clearSuccess, getApproveListStudent, clearErrors })(WaitCourse);
