import React, { Component, Fragment } from 'react';
import { Card, Table, CardBody, CardHeader, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions'; 
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 

const styles = {
  bigAvatar: {
    height: 60,
    width: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intialCurrentcourses: [],
      currentcourses: [], 
      loading: true
    };
    this.handleClickCourse = this.handleClickCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { currentcourses, loading } = nextProps.courses
      this.setState({ 
        intialCurrentcourses: currentcourses,
        currentcourses, 
        loading 
      });
    }
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
  }

  handleClickCourse(courseId){
    this.props.history.push('/courses/' + courseId)
  } 

  showStatus(date){
    var now = new Date();
    var openingDay = new Date(date.openingDay);
    var endDay = new Date(date.endDay);
    if(openingDay.getTime() > now.getTime()){
      return 'Chưa khai giảng'
    }else
    if(openingDay.getTime() <= now.getTime() && now.getTime() <= endDay.getTime()){
      return 'Đang hoạt động'
    }else
    if(now.getTime() > endDay.getTime()){
      return 'Đã kết thúc'
    }
  }

  onChangeStatus = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialCurrentcourses));
    var returnList = [];
    var now = new Date();
    if(e.target.value === '')
    {
      returnList = updatedList
    }
    if(e.target.value === 'Chưa khai giảng')
    {
      for(var i=0; i<updatedList.length; i++)
      {
        var openingDay = new Date(updatedList[i].coursedetail.openingDay);
        if(openingDay.getTime() > now.getTime()){
          returnList.push(updatedList[i])
        }
      }
    }
    if(e.target.value === 'Đang hoạt động')
    {
      for(var j=0; j<updatedList.length; j++)
      {
        var openingDay2 = new Date(updatedList[j].coursedetail.openingDay);
        var endDay2 = new Date(updatedList[j].coursedetail.endDay);
        if(openingDay2.getTime() <= now.getTime() && now.getTime() <= endDay2.getTime()){
          returnList.push(updatedList[j])
        }
      }
    }
    if(e.target.value === 'Đã kết thúc')
    {
      for(var k=0; k<updatedList.length; k++)
      {
        var endDay3 = new Date(updatedList[k].coursedetail.endDay);
        if(now.getTime() > endDay3.getTime()){
          returnList.push(updatedList[k])
        }
      }
    }

    this.setState({ currentcourses: returnList });
  }

  render() {
    const { currentcourses, loading } = this.state

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-book"></i>Khóa học của tôi
          </CardHeader>
          <CardBody>
            <br/>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-filter"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="select" onChange={this.onChangeStatus}>
                    <option value="">Tất cả khóa học</option>
                    <option value="Chưa khai giảng">Chưa khai giảng</option>
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Đã kết thúc">Đã kết thúc</option>
                  </Input>
                </InputGroup>

                <div style={{marginTop: 20}}>
                  {
                    currentcourses.length === 0
                    ?
                    <h3>Không có khóa học</h3>
                    :
                    <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                      <tbody>
                        {
                          currentcourses.map(course=>
                          <tr key={course._id} className="changeCursor" onClick={this.handleClickCourse.bind(this, course._id)}>
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
                              <b>{this.showStatus(course.coursedetail)}</b> <br/>
                              Khai giảng: 
                              <Moment format=" DD/MM/YYYY">
                                {course.coursedetail.openingDay}
                              </Moment><br/>
                              Kết thúc:
                              <Moment format=" DD/MM/YYYY">
                                {course.coursedetail.endDay}
                              </Moment>
                            </td>
                          </tr>
                          )
                        }
                      </tbody>
                    </Table>
                  }
                </div>
              </Fragment>
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}

CourseList.propTypes = {
  getCurentCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getCurentCourse })(CourseList); 