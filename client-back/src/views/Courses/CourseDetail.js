import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, CardBody, CardHeader, Card } from 'reactstrap';
import classnames from 'classnames';
import { getUsers } from '../../actions/userActions';
import { getCourseInfo } from '../../actions/courseActions';
import PeopleInCourse from '../../components/PeopleInCourse';
import LessonList from '../Lesson/LessonList';
import Statistic from '../../components/Statistic';
import MyStatistic from '../../components/MyStatistic';
import TeacherRating from './TeacherRating';
import Rating from '../Rating/Rating';
import ReactLoading from 'react-loading';

class CourseDetail extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      courseinfo: [],
      loading: true,
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount = () => {
    this.props.getCourseInfo(this.props.match.params.id);
    this.props.getUsers(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { courseinfo, loadingCourseInfo } = nextProps.courses
      if(this.props.match.params.id === courseinfo.course._id)
        this.setState({
          courseinfo,
          loading: loadingCourseInfo
        })
    }
  }

  render() {
    const { courseinfo, loading } = this.state
    const { role } = this.props.auth.user

    return (
      <div className="animated fadeIn">
        <Card>
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B'/>
          :
          <Fragment>
            <CardHeader>
              <strong>{courseinfo.course.code} - {courseinfo.course.title}</strong>
            </CardHeader>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Bài học
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2');}}
                  >
                    Mọi người
                  </NavLink>
                </NavItem>
                {
                  role === 'student'
                  ?
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '4' })}
                      onClick={() => { this.toggle('4');}}
                    >
                      Thông tin cá nhân
                    </NavLink>
                  </NavItem>
                  :
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '3' })}
                      onClick={() => { this.toggle('3');}}
                    >
                      Thống kê
                    </NavLink>
                  </NavItem>
                }
                {
                  role === 'teacher'
                  ?
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '5' })}
                      onClick={() => { this.toggle('5');}}
                    >
                      Đánh giá của học viên
                    </NavLink>
                  </NavItem>
                  :
                  null
                }
                {
                  role === 'student' ||role === 'teacher'
                  ?
                  null
                  :
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '6' })}
                      onClick={() => { this.toggle('6');}}
                    >
                      Đánh giá của học viên
                    </NavLink>
                  </NavItem>
                }
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <LessonList />
                </TabPane>
                <TabPane tabId="2">
                  <PeopleInCourse />
                </TabPane>
                <TabPane tabId="3">
                  <Statistic />
                </TabPane>
                <TabPane tabId="4">
                  <MyStatistic />
                </TabPane>
                <TabPane tabId="5">
                  <TeacherRating />
                </TabPane>
                <TabPane tabId="6">
                  <Rating />
                </TabPane>
              </TabContent>
            </CardBody>
          </Fragment>
        }
        </Card>

      </div>
    )
  }
}

CourseDetail.propTypes = {
  getCourseInfo : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired,
  getUsers : PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses,
  auth: state.auth
});
export default connect(mapStateToProps, { getUsers, getCourseInfo })(CourseDetail); 
