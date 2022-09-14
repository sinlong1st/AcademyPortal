import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import ReactLoading from 'react-loading';
import { getSchedule } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import isEmptyObj from '../../validation/is-empty';
import Moment from 'react-moment'; 
import 'moment/locale/vi';
var moment = require('moment');

class LessonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading :true
    }

  }

  componentDidMount() {
    this.props.getSchedule(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {

    const { schedule, loading } = nextProps.schedule
    if(!isEmptyObj(schedule))
      if(schedule.courseId === this.props.match.params.id)
      {
        const { events } = schedule
        var now = new Date();
        for(var i=0;i < events.length; i++)
        {
          var date = new Date(events[i].end);
          if(date.getTime() >= now.getTime())
          {
            events[i].hilight = true;
            break;
          }
        }
        this.setState({ 
          events,
          loading 
        });
      }
    this.setState({
      loading 
    });  
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleEditLesson(lessonId){
    this.props.history.push(`/courses/${this.props.match.params.id}/add-in-lesson/${lessonId}`);
  }

  handleLesson(lessonId){
    this.props.history.push(`/courses/${this.props.match.params.id}/lesson/${lessonId}`);
  }

  handleViewLesson(lessonId){
    this.props.history.push(`/view-courses/${this.props.match.params.id}/lesson/${lessonId}`);
  }

  render() {
    var { events, loading } = this.state;
    const { role } = this.props.auth.user;

    var Content = null ;

    switch (role.toString()) {
      case 'student': 
        Content = 
          <tbody>
          {
            events.map(e=>
              <Fragment key={e._id}>
                {
                  e.hilight
                  ?
                  <tr key={e._id} className="changeCursor" onClick={this.handleLesson.bind(this, e.lessonId)} style={{backgroundColor:'#FFDEAD'}}>
                    <td>
                      <b>{this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}</b>
                    </td>
                    <td>
                      <b>
                        <Moment format="HH:mm - ">
                          {e.start}
                        </Moment>
                        <Moment format="HH:mm">
                          {e.end}
                        </Moment>
                      </b>
                    </td>
                    <td>
                      <b>{e.text}</b>
                    </td>
                  </tr>
                  :
                  <tr key={e._id} className="changeCursor" onClick={this.handleLesson.bind(this, e.lessonId)} >
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
                }
              </Fragment>

            )
          }
        </tbody>
        break;
        
      case 'admin':
      case 'teacher': 
        Content = 
            <tbody>
              {
                events.map(e=>
                  <Fragment key={e._id}>
                    {
                      e.hilight
                      ?
                      <tr key={e._id} className="changeCursor" onClick={this.handleEditLesson.bind(this, e.lessonId)} style={{backgroundColor:'#FFDEAD'}}>
                        <td>
                          <b>{this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}</b>
                        </td>
                        <td>
                          <b>
                            <Moment format="HH:mm - ">
                              {e.start}
                            </Moment>
                            <Moment format="HH:mm">
                              {e.end}
                            </Moment>
                          </b>
                        </td>
                        <td>
                          <b>{e.text}</b>
                        </td>
                      </tr>
                      :
                      <tr key={e._id} className="changeCursor" onClick={this.handleEditLesson.bind(this, e.lessonId)} >
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
                    }
                  </Fragment>

                )
              }
            </tbody>
      break;

      default: 
          Content = 
            <tbody>
             {
                events.map(e=>
                  <Fragment key={e._id}>
                    {
                      e.hilight
                      ?
                      <tr key={e._id} className="changeCursor" onClick={this.handleViewLesson.bind(this, e.lessonId)} style={{backgroundColor:'#FFDEAD'}}>
                        <td>
                          <b>{this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}</b>
                        </td>
                        <td>
                          <b>
                            <Moment format="HH:mm - ">
                              {e.start}
                            </Moment>
                            <Moment format="HH:mm">
                              {e.end}
                            </Moment>
                          </b>
                        </td>
                        <td>
                          <b>{e.text}</b>
                        </td>
                      </tr>
                      :
                      <tr key={e._id} className="changeCursor" onClick={this.handleViewLesson.bind(this, e.lessonId)} >
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
                    }
                  </Fragment>
                )
              }
            </tbody>
      break;
    }
    return (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B'/>
        :
        <Fragment>
          <Table borderless>
            <tbody>
              <tr>
                <td style={{backgroundColor:'#FFDEAD'}}>
                </td>
                <td>
                  <b>Bài học sắp tới</b>
                </td>
              </tr>
            </tbody>
          </Table>  
          <Table style={{marginTop: 10}} hover bordered responsive className="table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th>Ngày học</th>
                <th>Giờ học</th>
                <th>Bài học</th>
              </tr>
            </thead>
            {Content}
          </Table>        
        </Fragment>
      }
      </div>
    )
  }
}

LessonList.propTypes = {
  schedule: PropTypes.object.isRequired,
  getSchedule: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  schedule: state.schedule,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { getSchedule })(LessonList));  