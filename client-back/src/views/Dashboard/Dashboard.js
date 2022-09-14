import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/img/Ai-Edu.png'
import { Button, Container, Row, Col } from 'reactstrap';
import { getCurrentProfile } from '../../actions/profileActions';
import { getSchool } from '../../actions/schoolActions';
import isEmptyObj from '../../validation/is-empty';
import ReactLoading from 'react-loading';

class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      schoolName: ''
    };
  }

  componentDidMount = () => {
    this.props.getCurrentProfile();
    this.props.getSchool();
  }

  componentWillReceiveProps(nextProps) {
    const { school, loading } = nextProps.school;
    this.setState({
      loading
    })
    if(!isEmptyObj(school))
    {
      this.setState({ 
        schoolName: school.name
      });
    }
  }

  handleMycourse = () =>{
    this.props.history.push(`/courses`);
  }

  handleAllcourse = () =>{
    this.props.history.push(`/course-info`);
  }
  
  render() {
    const { name, role } = this.props.auth.user
    const { schoolName, loading } = this.state
    
    var Content = null ;

    switch (role.toString()) {
      case 'manager': 
        Content = 
          <div style={{ marginTop:30 }}>
            <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Tạo tài khoản
              </span>
            </Button>
            <Button color="secondary" size="lg" block onClick={()=> this.props.history.push(`/school-info`)}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Thông tin trung tâm
              </span>
            </Button>
          </div>
        break;

      case 'student': 
        Content = 
          <div style={{ marginTop:30 }}>
            <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Xem khóa học của bạn
              </span>
            </Button>
          </div>
        break;

      case 'teacher': 
        Content = 
        <div style={{ marginTop:30 }}>
          <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Xem khóa học của bạn
            </span>
          </Button>
        </div>
      break;

      case 'ministry': 
        Content = 
        <div style={{ marginTop:20 }}>
          <Button color="secondary" size="lg" block onClick={()=>this.props.history.push(`/manage-courses`)}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Quản lý khóa học
            </span>
          </Button>
          <Button color="secondary" size="lg" block onClick={()=>this.props.history.push(`/add-schedule`)}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Chỉnh sửa thời khóa biểu
            </span>
          </Button>
        </div>
      break;

      case 'admin': 
        Content = 
        <div style={{ marginTop:30 }}>
          <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Xem khóa học của bạn
            </span>
          </Button>
        </div>
      break;
      default: break;
    }

    return (
      <div className="animated fadeIn">
        <span style={{fontFamily:'Lobster, cursive', fontSize:20}}>Xin chào <b>{name},</b></span>
        <Container>
          <Row className="justify-content-center">
            {
              loading
              ?
              <ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} />
              :
              <Col md="9" lg="7" xl="6">
                <div>
                  <img src={logo} alt='Logo' height="150" width="150" />
                  <div style={{fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold' }}>{schoolName}</div>
                  {
                    Content
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
  auth: state.auth,
  school: state.school
});

export default connect(mapStateToProps, { getCurrentProfile, getSchool })(Dashboard);