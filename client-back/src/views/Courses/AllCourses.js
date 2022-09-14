import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllCourse } from '../../actions/courseActions';
import { Row, Col, Card, CardBody, CardHeader, Button, Container } from 'reactstrap';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';

const styles = {
  bigAvatar: {
    height: 100,
    width: 100,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class AllCourses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      allcourses: []
    };
    this.handleDetail = this.handleDetail.bind(this);
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
    const { loading, allcourses } = this.state
    return (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B'/>
        :
        <Container>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B'/>
            :
            <Row>
              {
                allcourses.map(course =>
                <Col xs="12" sm="6" md="4" key={course._id}>
                  <Card>
                    <CardHeader>
                      <div style={styles.imgbox3}>
                        <img src={course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                      </div>
          
                      <h5 style={{marginTop:10, fontWeight:'bold'}}>{course.title}</h5>

                    </CardHeader>
                    <CardBody>
                      <b><i className="fa fa-clock-o" aria-hidden="true"></i>&ensp;&ensp;Hạn đăng ký - </b>
                      <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                        {course.enrollDeadline}
                      </Moment>
                      <hr/>
                      <p className='max-lines'> {course.intro} </p>
                      <Button outline color="primary" onClick={this.handleDetail.bind(this, course._id)}><b>Xem chi tiết</b></Button>
                    </CardBody>
                  </Card>
                </Col>
                )
              }
            </Row>
          }
        </Container>
      }
      </div>
    )
  }
}

AllCourses.propTypes = {
  getAllCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getAllCourse })(AllCourses); 
