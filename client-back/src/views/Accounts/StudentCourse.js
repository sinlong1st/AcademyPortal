import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getAccount, clearErrors, clearSuccess, outCourse } from '../../actions/accountActions';
import { 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardHeader, 
  Button,
  Modal,
  ModalBody,
  Table
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty'

const styles = {
  bigAvatar: {
    height: 60,
    width: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class StudentCourse extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      name: '',
      loading: true,
      errors: {},
      isShowSuccess: false,
      isLoading: false
    };
  }

  componentDidMount = () => {
    this.props.getAccount(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts) {
      const { account, loading } = nextProps.accounts
      this.setState({
        courses: account.courses, 
        name: account.name, 
        loading
      })
    }

    if (nextProps.success.mes === "Xóa học viên khỏi khóa học thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess();
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getAccount(this.props.match.params.id);
  }

  handleOutCourse(courseId){
    this.setState({isLoading: true})
    this.props.outCourse(this.props.match.params.id, courseId)
  }

  render() {
    const { loading, courses, name } = this.state
    return (
      <div className="animated fadeIn">
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B'/>
          :
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  Các khóa học của học viên <b>{name}</b>
                </CardHeader>
                <CardBody>
                  {
                    loading
                    ?
                    <ReactLoading type='bars' color='#05386B'/>
                    :
                    <Fragment>
                      {
                        courses.length === 0
                        ?
                        <h3>Học viên không có khóa học nào</h3>
                        :
                        <Fragment>
                          <Table style={{marginTop:20}} responsive className="mb-0 d-none d-sm-table">
                            <tbody>
                              {
                                courses.map(course=>
                                  <tr key={course._id}>
                                    <td>
                                      <div className="text-center">
                                        <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                                      </div>
                                    </td>
                                    <td>
                                      <b>{course.title}</b><br/>
                                      <span style={{color:'#1E90FF', fontWeight:'bold'}}>Mã khóa học: {course.code}</span>
                                    </td>
                                    <td>
                                      <Button onClick={this.handleOutCourse.bind(this, course._id)} className="btn-pill" color="secondary">
                                        Xóa học viên ra khỏi khóa học
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              }
                            </tbody>
                          </Table>
                        </Fragment>
                      }
                    </Fragment>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>       
        }
        <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Xóa học viên khỏi khóa học thành công!"
          show={this.state.isShowSuccess}
          onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>   
      </div>
    )
  }
}

const mapStateToProps = state => ({
  success: state.success,
  errors: state.errors,
  accounts: state.accounts  
});
export default connect(mapStateToProps, { getAccount, clearSuccess, clearErrors, outCourse })(StudentCourse); 