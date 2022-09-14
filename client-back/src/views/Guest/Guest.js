import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllCourse } from '../../actions/courseActions';
import { Row, Col, Card, CardBody, CardHeader, Button, Container, Nav, NavItem } from 'reactstrap';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';
import { AppNavbarBrand, AppHeader, AppFooter } from '@coreui/react';
import logo from '../../assets/img/e-icon.png';
import slide1 from '../../assets/img/slide1.jpg';
import slide2 from '../../assets/img/slide2.jpg';
import slide3 from '../../assets/img/slide3.jpg';
import slide4 from '../../assets/img/slide4.jpg';
import a2 from '../../assets/img/a2.jpg';

import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';


const styles = {
  imgbox: {
    display: 'grid',
    height: '100%',
    backgroundColor: '#000000'
  },
  centerFit: {  
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
    opacity: '0.5'
  },
  leftFit:{
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
  },
  imgbox2: {
    position: 'relative',
    height: 400,
    backgroundColor: '#000000',
    overflow: 'hidden'
  },
  imgbox3: {
    position: 'relative',
    height: 150
  },
  bigAvatar: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  },
  centerFit2: {  
    maxWidth: '100%',
    margin: 'auto',
    opacity: '0.5'
  },
}

const items = [
  {
    src: slide1,
    caption: 'CHÀO MỪNG BẠN ĐẾN VỚI TRUNG TÂM ĐÀO TẠO'
  },
  {
    src: slide2,
    caption: 'HỌC TẬP VUI VẺ'
  },
  {
    src: slide3,
    caption: 'HỌC TẬP SÁNG TẠO'
  },
  {
    src: slide4,
    caption: 'ĐỔI MỚI VÀ KHÁM PHÁ'
  }
];

class Guest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      allcourses: [],
      activeIndex: 0

    };
    this.handleDetail = this.handleDetail.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
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
    this.props.history.push(`/guest-course-info/${courseId}`);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { 
      loading, 
      allcourses, 
      activeIndex 
    } = this.state

    const slides = items.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <div style={styles.imgbox}>
            <img style={styles.centerFit} src={item.src} alt={item.altText}/>
          </div>
          <CarouselCaption captionHeader={item.caption} captionText='' />
        </CarouselItem>
      );
    });

    return (
      <div className="animated fadeIn">
        <AppHeader>
          <AppNavbarBrand full={{ src: logo, width: 50, height: 50, alt: 'Logo' }} className='changeCursor' onClick={()=>this.props.history.push('/')}/>
          <b style={{fontFamily:'Roboto Slab, serif', fontSize:20}} onClick={()=>this.props.history.push('/')} className='changeCursor'>TRUNG TÂM ĐÀO TẠO</b>
          <Nav className="d-md-down-none" navbar>
            <NavItem className="px-3">
              <Link to="/login">Đăng nhập</Link>
            </NavItem>
            <NavItem className="px-3">
              <Link to="/register">Đăng ký</Link>
            </NavItem>
          </Nav>
        </AppHeader>
        <div className="app-body">
          <main className="main">
            <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous} >
              <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                {slides}
              <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
              <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
            </Carousel>

            <Row style={{marginTop:70}}>
              <Col xs="6">
                <img style={styles.leftFit} src={a2} alt=''/>
              </Col>
              <Col xs="5">
                <h3 style={{fontSize:25, fontWeight:'bold', marginTop:30}}>GIÁO DỤC LÀ NỀN TẢNG ĐỂ XÂY DỰNG TƯƠNG LAI.</h3>
                <div style={{marginTop:30, marginBottom:30}}>
                  <span style={{ fontFamily:'Lobster Two, cursive', fontSize:22}}>
                    Chúng tôi lun cố gắng mang đến cho học viên những điều tốt nhất.
                  </span>
                </div>
                <p style={{fontSize:18}}>
                  Được thành lập từ 01/06/2019, Trung tâm đào tạo là địa chỉ học tập uy tín của các bạn trẻ Việt Nam. Chương trình học đa dạng, luôn được cập nhật với xu hướng công nghệ và thực tế tại các doanh nghiệp. Học viên được công nhận rộng rãi trong cộng đồng, được các Công ty tuyển dụng tin tưởng vào chất lượng.
                  Chúng tôi cam kết sẽ không ngừng nỗ lực để mang đến cho học viên các trải nghiệm học tập giúp thích ứng nhanh và khai thác tối đa cơ hội để thành công hơn trong thời đại số .
                </p>
              </Col>
            </Row>

            <div style={{marginTop:70}}>
              <div style={styles.imgbox2}>
                <img style={styles.centerFit2} src={slide1} alt=''/>
                <div style={{ position:'absolute', top: '20%', left: '15%', fontSize:30, fontWeight:'bold', color:'white'}}>
                  Chúng tôi lun cố gắng để giúp cho học viên có tương lai thành công
                </div>

                <div style={{ position:'absolute', top: '80%', left: '42%', fontSize:25, fontWeight:'bold', color:'white'}}>
                  <Button color="primary" onClick={()=>this.props.history.push('/login')}><b>Đăng nhập</b></Button>
                  <Button style={{marginLeft: 20}} color="danger" onClick={()=>this.props.history.push('/register')}><b>Đăng ký</b></Button>
                </div>
          
              </div>
            </div>

            <Container style={{marginTop:70}}>
              <h5 style={{fontSize:25, fontWeight:'bold'}}>Các khóa học hiện có</h5>
              {
                loading
                ?
                <ReactLoading type='bars' color='#05386B'/>
                :
                <Row style={{marginTop:70}}>
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
          </main>
        </div>
        <AppFooter>
          <Container><b>Trung Tâm Đào Tạo &copy; 2019</b></Container>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getAllCourse })(Guest); 
