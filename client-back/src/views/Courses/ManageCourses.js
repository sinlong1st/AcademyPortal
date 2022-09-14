import React, { Component, Fragment } from 'react';
import {    
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalBody,
  Input,
  Row,
  Col,
  InputGroup, 
  InputGroupAddon, 
  InputGroupText
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getManageCourses, joinCourse, clearSuccess } from '../../actions/courseActions'; 
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';

const styles = {
  bigAvatar: {
    height: 60,
    width: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

let prev  = 0;
let last  = 0;

class ManageCourses extends Component {
  constructor() {
    super();
    this.state = {
      managecourses: [],
      loading: true,
      currentPage: 1,
      coursesPerPage: 5,
      isShowSuccess: false,
      isLoading: false,
      titleSuccess: '',
      intialManagecourses: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
    this.handleClickApprove = this.handleClickApprove.bind(this);
    this.handleJoinCourse = this.handleJoinCourse.bind(this);
    this.handleEditCourse = this.handleEditCourse.bind(this);
  }

  componentDidMount=()=>{
    this.props.getManageCourses();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { managecourses, loading } = nextProps.courses
      this.setState({ 
        intialManagecourses: managecourses,
        managecourses, 
        loading 
      });
    }

    if (nextProps.success === "Tham gia khóa học thành công" || nextProps.success === "Đã tham gia vào khóa học này") {
      this.setState({
        isShowSuccess: true, 
        isLoading: false,
        titleSuccess: nextProps.success
      })
    }
  }
  
  handleClick(event) {
    event.preventDefault();
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  handleLastClick(event) {
    event.preventDefault();
    this.setState({
      currentPage:last
    });
  }

  handleFirstClick(event) {
    event.preventDefault();
    this.setState({
      currentPage:1
    });
  }

  handleEditCourse(courseId){
    this.props.history.push('/manage-courses/edit-course/' + courseId)
  } 

  handelManageTeacher(courseId) {
    this.props.history.push('/manage-courses/approve/teacher/' + courseId)
  }
  handleClickApprove(courseId){
    this.props.history.push('/manage-courses/approve/student/' + courseId)
  } 

  handleJoinCourse(courseId){
    this.props.joinCourse(courseId);
    this.setState({isLoading: true});
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      isLoading: false,
      titleSuccess: ''
    })
    this.props.clearSuccess();
  }

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialManagecourses));
    updatedList = updatedList.filter((course)=>
      course.title.toLowerCase().search(e.target.value.toLowerCase()) !== -1 ||
      course.code.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({ managecourses: updatedList });
  }

  onChangeStatus = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialManagecourses));
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

    this.setState({ managecourses: returnList });
  }

  render() {
    let { managecourses, currentPage, coursesPerPage, loading } = this.state;
    const { role } = this.props.auth.user

    // Logic for displaying current courses
    let indexOfLastTodo = currentPage * coursesPerPage;
    let indexOfFirstTodo = indexOfLastTodo - coursesPerPage;
    let currentcourses = managecourses.slice(indexOfFirstTodo, indexOfLastTodo);
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(managecourses.length/coursesPerPage);

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-wrench"></i><b>Quản lý khóa học</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
                <Row>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Mã hoặc Tên khóa học . . ." spellCheck='false'/>                     
                    </InputGroup>
                  </Col>
                  <Col>
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
                  </Col>
                </Row>
                <Table style={{marginTop:20}} responsive className="mb-0 d-none d-sm-table">
                  <tbody>
                    {
                      currentcourses.map(course=>
                        <tr key={course._id}>
                          <td>
                            <div className="text-center">
                              <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                            </div>
                          </td>
                          <td>
                            <b>{course.title}</b><br/>
                            <span style={{color:'#1E90FF', fontWeight:'bold'}}>Mã khóa học: {course.code}</span>
                            <p style={{color:'grey'}}>Nơi học: {course.infrastructure ? course.infrastructure.name : <i>chưa cập nật</i>}</p>
                          </td>
                          <Fragment>
                            {
                              role === 'ministry' || role === 'admin'
                              ?
                              <Fragment>
                                <td>
                                  <Button onClick={this.handleEditCourse.bind(this, course._id)} className="btn-pill" color="secondary">
                                    Chỉnh sửa
                                  </Button>
                                </td>
                                <td>
                                  <Button onClick={this.handelManageTeacher.bind(this, course._id)} className="btn-pill" color="secondary">
                                    Quản lý giáo viên
                                  </Button>
                                </td>
                                <td>
                                  <Button onClick={this.handleClickApprove.bind(this, course._id)} className="btn-pill" color="secondary">
                                    Quản lý học viên
                                  </Button>
                                </td>
                              </Fragment>
                              :
                              <Fragment>
                                <td>
                                  <Button onClick={this.handleEditCourse.bind(this, course._id)} className="btn-pill" color="secondary">
                                    Chỉnh sửa
                                  </Button>
                                </td>
                              </Fragment>
                            }
                          </Fragment>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
                <br/>
                <nav>
                  <Pagination>
                    <PaginationItem>
                      { 
                        prev === 0 
                        ? <PaginationLink previous tag="button" disabled />
                        : <PaginationLink previous tag="button" onClick={this.handleFirstClick} id={prev} href={prev} />
                      }
                    </PaginationItem>
                    <PaginationItem>
                      { 
                        prev === 0 
                        ? <PaginationLink disabled>Trước</PaginationLink> 
                        : <PaginationLink onClick={this.handleClick} id={prev} href={prev}>Trước</PaginationLink>
                      }
                    </PaginationItem>
                      {
                        pageNumbers.map((number,i) =>
                          <PaginationItem key= {i} active = {pageNumbers[currentPage-1] === (number) ? true : false} >
                            <PaginationLink onClick={this.handleClick} href={number} key={number} id={number}>
                              {number}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }

                    <PaginationItem>
                      {
                        currentPage === last 
                        ? <PaginationLink disabled>Sau</PaginationLink> 
                        : <PaginationLink onClick={this.handleClick} id={pageNumbers[currentPage]} href={pageNumbers[currentPage]}>Sau</PaginationLink>
                      }
                    </PaginationItem>

                    <PaginationItem>
                      {
                        currentPage === last 
                        ? <PaginationLink next tag="button" disabled />
                        : <PaginationLink next tag="button" onClick={this.handleLastClick} id={pageNumbers[currentPage]} href={pageNumbers[currentPage]}/>
                      }
                    </PaginationItem>
                  </Pagination>
                </nav>
              </Fragment>
            }
          </CardBody>
        </Card>
        <SweetAlert
          	confirmBtnText="OK"
          	title={this.state.titleSuccess}
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

ManageCourses.propTypes = {
  courses: PropTypes.object.isRequired,
  getManageCourses: PropTypes.func.isRequired,
  joinCourse: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses,
  success: state.success,
  auth: state.auth
});
export default connect(mapStateToProps, { getManageCourses, joinCourse, clearSuccess })(ManageCourses); 