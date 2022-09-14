import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  Card, CardHeader, CardBody, Input, Button, Modal, ModalBody, Table, ModalHeader, ListGroup, ListGroupItem, Alert } from 'reactstrap';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "./CalendarStyles.css";
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { getActiveCourses } from '../../actions/courseActions';
import { addSchedule, getSchedule } from '../../actions/scheduleActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import { clearSuccess } from '../../actions/courseActions';
import isEmptyObj from '../../validation/is-empty';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
var moment = require('moment');

const styles = {
  left: {
    float: "left",
    width: "220px"
  },
  main: {
    marginLeft: "220px"
  },
  bigAvatar: {
    height: 40,
    width: 40,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
};

class AddSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intialActivecourses: [],
      activecourse: [],
      loadingCourse: false,
      events: [],
      loading: false,
      isLoading: false,
      isShowSuccess: false,
      courseId: '0',
      viewType: "Week",
      headerHeight: 30,
      hourWidth: 60,
      cellHeight: 30,
      timeRangeSelectedHandling: "Disabled",
      durationBarVisible: false,
      isOpenModal: false,
      courseTitle: null,
      courseCode: null
    };
  }

  toggleModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.clearSuccess();
    this.props.getSchedule(this.state.courseId)
  }

  componentDidMount() {
    this.props.getActiveCourses();

    document.getElementsByClassName("calendar_default_corner")[0].innerHTML = `<div class="calendar_default_corner_inner" unselectable="on"></div>`;

    this.setState({
      startDate: DayPilot.Date.today(),
      events: []
    });
  }

  onChangeSelectCourse(courseId, courseTitle, courseCode) {
    this.props.getSchedule(courseId)
    this.setState({ 
      courseId,
      courseTitle,
      courseCode,
      isOpenModal: false
    });
  }

  componentWillReceiveProps(nextProps) {

    const { activecourse, loading } = nextProps.courses
    this.setState({
      intialActivecourses: activecourse,
      activecourse,
      loadingCourse: loading
    });

    if (nextProps.success.mes === "Lưu thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }

    if (nextProps.schedule)
    {
      const { schedule, loading } = nextProps.schedule

      if(!isEmptyObj(schedule))
      {
        if(schedule.courseId === this.state.courseId)
          this.setState({ 
            events: schedule.events,
            loading 
          });
      }
      this.setState({ 
        loading 
      });
    }
  }

  submit=()=>{

    var newSchedule = {
      courseId: this.state.courseId,
      events: this.state.events
    };

    this.props.addSchedule(newSchedule)
    this.setState({isLoading: true})
  }

  onChangeTime = (eventId, time) => 
  {
    var Arr = this.state.events.slice(0);

    Arr.map(function(e) {
      if(eventId === e._id)
      {
        e.time = time
        e.start = moment(e.date).format('YYYY-MM-DD') + 'T' + time[0] + ':00'
        e.end = moment(e.date).format('YYYY-MM-DD') + 'T' + time[1] + ':00'
      }
      return e
    });
    this.setState({events: Arr})
  }

  onChangeDate = (eventId, date) => 
  {
    var Arr = this.state.events.slice(0);

    Arr.map(function(e) {
      if(eventId === e._id)
      {
        e.date = moment(date).format('YYYY-MM-DD')
        e.start = moment(date).format('YYYY-MM-DD') + 'T' + e.time[0] + ':00'
        e.end = moment(date).format('YYYY-MM-DD') + 'T' + e.time[1] + ':00'
      }
      return e
    });
    this.setState({events: Arr})
  }
  
  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialActivecourses));
    updatedList = updatedList.filter((course)=>
      course.title.toLowerCase().search(e.target.value.toLowerCase()) !== -1 ||
      course.code.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({ activecourse: updatedList });
  }

  render() {
    var {...config } = this.state;
    var { loadingCourse, activecourse, courseTitle, courseCode } = this.state;

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-calendar" aria-hidden="true"></i>
            <strong>Chỉnh sửa thời khóa biểu</strong>
          </CardHeader>
          <CardBody >
            {
              loadingCourse
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Button color="primary" onClick={this.toggleModal}> Chọn khóa học </Button>
            }
            <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal} className='modal-lg'>
              <ModalHeader  toggle={this.toggleModal}>Chọn khóa học</ModalHeader>
              <ModalBody style={{overflowY:'scroll', height:500}}>
                <Input style={{marginBottom: 10}} type="text" onChange={this.onSearch} placeholder="Tên hoặc Mã khóa học . . ."/>
                {
                  activecourse.length === 0
                  ?
                  <b>Không có khóa học</b>
                  :
                  <ListGroup>
                  {
                    activecourse.map(course=>
                      <ListGroupItem key={course._id} color="secondary" tag="button" action onClick={this.onChangeSelectCourse.bind(this, course._id, course.title, course.code)}>
                        <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                        <span style={{fontWeight: 'bold', marginLeft: 10}}>{course.code}</span> - <span>{course.title}</span> 
                      </ListGroupItem>
                    )
                  }
                  </ListGroup>
                }
              </ModalBody>
            </Modal>

            <div style={{display: this.state.courseId === '0' ? 'none' : 'block'}}>
              <Alert style={{marginBottom: 20, marginTop: 20, textAlign: 'center', fontWeight:'bold'}} color="primary">
                Thời khóa biểu của {courseCode} - {courseTitle}
              </Alert>
              <Button style={{marginBottom: 20}} color="danger" onClick={this.submit}> Lưu </Button>
              {
                this.state.events.length === 0
                ?
                null
                :
                <Table responsive bordered>
                  <thead className="thead-light">
                    <tr>
                      <th>Ngày học</th>
                      <th>Giờ học</th>
                      <th>Bài học</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.events.map(e=>
                      <tr key={e._id}>
                        <td>
                          <DatePicker
                            selected={new Date(e.date)}
                            onChange={this.onChangeDate.bind(this, e._id)}
                            dateFormat="dd/MM/yyyy"
                            customInput={<Input />}
                          />
                        </td>
                        <td>
                          <TimeRangePicker
                            onChange={this.onChangeTime.bind(this, e._id)}
                            value={e.time}
                          />
                        </td>
                        <td>
                          {e.text}
                        </td>
                      </tr>
                    )
                  }
                  </tbody>
                </Table>
              }
              <div style={styles.left}>
                <DayPilotNavigator
                  selectMode={"week"}
                  cellWidth={30}
                  cellHeight={30}
                  dayHeaderHeight={30}
                  titleHeight={30}
                  showMonths={3}
                  skipMonths={3}
                  onTimeRangeSelected={ args => {
                    this.setState({
                      startDate: args.day
                    });
                  }}
                  events= {this.state.events}
                />
              </div>
              <div style={styles.main}>
              <DayPilotCalendar
                {...config}
                ref={component => {
                  this.calendar = component && component.control;
                }}
              />
              </div>
            </div>
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Lưu thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading ...</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

AddSchedule.propTypes = {
  courses: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  getActiveCourses : PropTypes.func.isRequired,
  addSchedule : PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  getSchedule: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses,
  success: state.success,
  schedule: state.schedule,
});

export default connect(mapStateToProps, { getActiveCourses, addSchedule, clearSuccess, getSchedule })(AddSchedule);  