import React, { Component } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Button, Container } from 'reactstrap';
import Moment from 'react-moment'; 
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { getAllCourse } from '../actions/courseActions';
import emo from '../assets/img/emo.png';

const styles = {
  imgbox3: {
    marginTop: 15,
    position: 'relative',
    height: 150
  },
  bigAvatar: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  }
}

class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      allcourses: []
    };
  }

  componentDidMount = () => {
    this.props.getAllCourse();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { allcourses, loading } = nextProps.courses
      this.setState({
        allcourses,
        loading
      })
    }
  }

  handleDetail(courseId){
    this.props.history.push(`/course-info/${courseId}`);
  }

  render() {
    const { 
      loading, 
      allcourses
    } = this.state

    return (
      <div className="animated fadeIn">
        <Container>
          <h5 style={{fontSize:25, fontWeight:'bold'}}>Tất cả khóa học hiện có</h5>
          {
            loading
            ?
            <Container>
              <Row className="justify-content-center">
                <ReactLoading type='spinningBubbles' color='#05386B'/>
              </Row>
            </Container>
            :
            <div>
              {
                allcourses.length === 0
                ?
                <div style={{marginTop:70}}> 
                  <h4>Hiện tại trung tâm chưa có khóa học có thể ghi danh</h4>
                  <img src={emo} alt="avatar" style={{width: 70, height: 70}}/>
                </div>
                :
                <div>
                  <Row style={{marginTop:70}}>
                    {
                      allcourses.map(course =>
                      <Col xs="12" sm="6" md="4" key={course._id}>
                        <Card>
                          <CardHeader>
                            <div style={styles.imgbox3}>
                              <img src={course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                            </div>
                            <h6 style={{color:'#0082c8', fontWeight:'bold', marginTop: 10}}>{course.code}</h6>                            
                
                            <h5 style={{marginTop:10, fontWeight:'bold'}}>{course.title}</h5>
                            {
                              course.maxStudent - course.students.length === 0
                              ?
                              <div className="toprightfull">Đã hết chỗ</div>
                              :
                              <div className="topright">Còn {course.maxStudent - course.students.length} chỗ</div>
                            }
                          </CardHeader>
                          <CardBody>
                            <div style={{textAlign:'left'}}>
                              <b><i className="fa fa-clock-o fa-fw" aria-hidden="true"></i>&ensp;Hạn đăng ký - </b>
                              <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                                {course.enrollDeadline}
                              </Moment>
                              <br></br>
                              <b><i className="fa fa-map-marker fa-fw" aria-hidden="true"></i>&ensp;Địa điểm - </b>
                              <span>{course.infrastructure ? course.infrastructure.name : ''}</span>
                            </div>
                            <hr/>
                            <p className='max-lines'> {course.intro} </p>
                            <Button outline color="primary" onClick={this.handleDetail.bind(this, course._id)}><b>Xem chi tiết</b></Button>
                          </CardBody>
                        </Card>
                      </Col>
                      )
                    }
                  </Row>
                </div>
              }
            </div>
          }
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  courses: state.courses  
});

export default connect(mapStateToProps, { getAllCourse })(Confirm);
