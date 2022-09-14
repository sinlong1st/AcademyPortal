import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Container, Row, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { getStudentAbsent } from '../actions/attendanceActions';
import { getPointColumnsStudent } from '../actions/pointActions';
import isEmptyObj from '../validation/is-empty'; 
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 

class ModalInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      student_point: '',
      student_absent_list: '',
      loadingPoint: true,
      loadingStudentAbsentList: true
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.props.getStudentAbsent(this.props.courseId, this.props.userId);
    this.props.getPointColumnsStudent(this.props.courseId, this.props.userId);
    this.setState({
      modal: !this.state.modal
    });
  }

  componentWillReceiveProps(nextProps) {
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
    return totalPoint.toFixed(1)
  }

  render() {
    const { student_point, student_absent_list, loadingPoint, loadingStudentAbsentList } = this.state;
    return (
      <Fragment>
        <Button onClick={this.onOpenModal} color="danger">Thông tin trong khóa học</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-lg'>
          <ModalHeader toggle={this.toggle}>Thông tin của học viên trong khóa học</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:530}}>
            {
              loadingPoint || loadingStudentAbsentList
              ?
              <Container>
                <Row className="justify-content-center">
                  <ReactLoading type='spinningBubbles' color='#05386B' />
                </Row>
              </Container>
              :
              <Fragment>
                <div><strong>Số ngày nghỉ / Tổng số ngày điểm danh </strong>: {student_absent_list.absentlist.length} / {student_absent_list.attendanceNumber} </div>
                <br/>
                {
                  student_absent_list.absentlist.length === 0
                  ?
                  <h3>Học viên không nghỉ ngày nào</h3>
                  :
                  <Table responsive bordered>
                    <thead className="thead-light">
                      <tr>
                        <th>Ngày nghỉ</th>
                        <th>Giờ học</th>
                        <th>Bài học</th>
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
                <div><strong>Bảng điểm </strong></div>
                <br/>
                {
                  student_point.pointColumns.length === 0
                  ?
                  <h3>Chưa cập nhật cột điểm</h3>
                  :
                  <Table responsive bordered>
                    <thead className="thead-light">
                      <tr>
                        <th>Tên cột điểm</th>
                        <th>Tỉ lệ %</th>
                        <th>Tên bài làm</th>
                        <th>Điểm</th>
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
                                  Chưa cập nhật
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
                                    Chưa cập nhật
                                  </small>
                                }
                                </Fragment>
                                :
                                <small style={{color:'#A8A8A8'}}>
                                  Chưa cập nhật
                                </small>
                              }
                            </td>
                          </tr>
                        )
                      }
                      <tr>
                        <td colSpan='3' bgcolor="grey" align="center">
                          <font color="white"><b>Tổng điểm :</b></font>
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
          </ModalBody>
        </Modal>
      </Fragment>
      
    );
  }
}

const mapStateToProps = state => ({
  point: state.point,
  attendance: state.attendance
});

export default connect(mapStateToProps, { getStudentAbsent, getPointColumnsStudent })(ModalInfo);
