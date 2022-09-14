import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  Card, CardHeader, CardBody, Input, Modal, ModalBody, ModalHeader} from 'reactstrap';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "./CalendarStyles.css";
import ReactLoading from 'react-loading';
import { getCurentCourse } from '../../actions/courseActions';
import { getSchedule } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import isEmptyObj from '../../validation/is-empty';

const styles = {
  left: {
    float: "left",
    width: "220px"
  },
  main: {
    marginLeft: "220px"
  }
};

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      events: [],
      courseId: '0',
      isShowModal: false,
      text: '',
      viewType: "Week",
      headerHeight: 30,
      hourWidth: 60,
      cellHeight: 30,
      durationBarVisible: false,
      timeRangeSelectedHandling: "Disabled",
      onEventClick: args => {
        this.props.auth.user.role === 'student'
        ?
        this.props.history.push(`/courses/${this.state.courseId}/lesson/${args.e.data.lessonId}`)
        :
        this.props.history.push(`/courses/${this.state.courseId}/add-in-lesson/${args.e.data.lessonId}`)
      },
    };
  }

  componentDidMount() {
    this.props.getCurentCourse();

    document.getElementsByClassName("calendar_default_corner")[0].innerHTML = `<div class="calendar_default_corner_inner" unselectable="on"></div>`;

    this.setState({
      startDate: DayPilot.Date.today(),
      events: []
    });
  }

  onChangeSelectCourse = e => {
    if(e.target.value !== '0')
    {
      this.props.getSchedule(e.target.value)
    }
    this.setState({ 
      courseId: e.target.value
    });
  }

  componentWillReceiveProps(nextProps) {

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

  toggleInfo = () => {
    this.setState({
      isShowModal: !this.state.isShowModal,
    });
  }

  render() {
    var {...config} = this.state;
    const { currentcourses, loading } = this.props.courses;

    var SelectCourse = 
                <div className="card-header-actions" style={{marginRight:10, marginBottom:40}} >
                  <ReactLoading type='bars' color='#05386B' height={10} width={50}/>
                </div>

    if(loading === false)
    {
      if(currentcourses.length === 0)
        SelectCourse = 
                  <div className="card-header-actions" style={{marginRight:10}} >
                      <Input  type="select">
                        <option value="0">Chưa tham gia khóa học</option>
                      </Input>
                  </div>
      else{
        SelectCourse = 
        <div className="card-header-actions" style={{marginRight:10}}>
          <Input  type="select" name="courseId" onChange={this.onChangeSelectCourse}>
            <option value="0">Hãy chọn khóa học</option>
              { 
                currentcourses.map(course=>
                  <option key={course._id} value={course._id}>{course.code}</option>
                )
              }
          </Input>
        </div>
      }
    }

    var DisPlay = <h2>Hãy chọn khóa học</h2>;
    if(this.state.courseId !== '0'){
      DisPlay = null;
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Xem thời khóa biểu</strong>
            {SelectCourse}
          </CardHeader>
          <CardBody >
            {DisPlay}
            <div style={{display: this.state.courseId === '0' ? 'none' : 'block'}}>
              <br/>
              <br/>
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
        <Modal isOpen={this.state.isShowModal} toggle={this.toggleInfo} className='modal-sm modal-info' >
          <ModalHeader toggle={this.toggleInfo}>Nội dung</ModalHeader>
          <ModalBody className="text-center">
            <div>{this.state.text}</div>
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

Schedule.propTypes = {
  courses: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  getCurentCourse : PropTypes.func.isRequired,
  getSchedule: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  courses: state.courses,
  schedule: state.schedule,
});

export default connect(mapStateToProps, {  getCurentCourse, getSchedule })(Schedule);  