import React, { Component, Fragment } from 'react';
import {    
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Card,
  CardBody,
  CardHeader,
  Input,
  Row,
  Col, 
  InputGroup, 
  InputGroupAddon, 
  InputGroupText
} from 'reactstrap';
import { connect } from 'react-redux';
import { getManageCourses } from '../../actions/courseActions'; 
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

let prev  = 0;
let last  = 0;

class ViewCourseList extends Component {
  constructor() {
    super();
    this.state = {
      managecourses: [],
      loading: true,
      currentPage: 1,
      coursesPerPage: 5,
      isShowSuccess: false,
      isLoading: false,
      intialManagecourses: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
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

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialManagecourses));
    updatedList = updatedList.filter((course)=>
      course.title.toLowerCase().search(e.target.value.toLowerCase()) !== -1 ||
      course.code.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({ managecourses: updatedList });
  }

  handleClickCourse(courseId){
    this.props.history.push('/view-courses/' + courseId)
  } 

  showStatus(date){
    var now = new Date();
    var openingDay = new Date(date.openingDay);
    var endDay = new Date(date.endDay);
    if(openingDay.getTime() > now.getTime()){
      return 'Ch??a khai gi???ng'
    }else
    if(openingDay.getTime() <= now.getTime() && now.getTime() <= endDay.getTime()){
      return '??ang ho???t ?????ng'
    }else
    if(now.getTime() > endDay.getTime()){
      return '???? k???t th??c'
    }
  }

  onChangeStatus = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialManagecourses));
    var returnList = [];
    var now = new Date();
    if(e.target.value === '')
    {
      returnList = updatedList
    }
    if(e.target.value === 'Ch??a khai gi???ng')
    {
      for(var i=0; i<updatedList.length; i++)
      {
        var openingDay = new Date(updatedList[i].coursedetail.openingDay);
        if(openingDay.getTime() > now.getTime()){
          returnList.push(updatedList[i])
        }
      }
    }
    if(e.target.value === '??ang ho???t ?????ng')
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
    if(e.target.value === '???? k???t th??c')
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
            <b>Danh s??ch kh??a h???c</b>
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
                      <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="M?? ho???c T??n kh??a h???c . . ." spellCheck='false'/>                     
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
                        <option value="">T???t c??? kh??a h???c</option>
                        <option value="Ch??a khai gi???ng">Ch??a khai gi???ng</option>
                        <option value="??ang ho???t ?????ng">??ang ho???t ?????ng</option>
                        <option value="???? k???t th??c">???? k???t th??c</option>
                      </Input>
                    </InputGroup>
                  </Col>
                </Row>

                <Table style={{marginTop:20}} hover responsive className="table-outline mb-0 d-none d-sm-table" >
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
                            <span style={{color:'#1E90FF', fontWeight:'bold'}}>M?? kh??a h???c: {course.code}</span><br/>
                            <span style={{color:'grey'}}>N??i h???c: {course.infrastructure ? course.infrastructure.name : <i>ch??a c???p n???t</i>}</span>
                          </td>
                          <td>
                            <b>{this.showStatus(course.coursedetail)}</b> <br/>
                            Khai gi???ng: 
                            <Moment format=" DD/MM/YYYY">
                              {course.coursedetail.openingDay}
                            </Moment><br/>
                            K???t th??c:
                            <Moment format=" DD/MM/YYYY">
                              {course.coursedetail.endDay}
                            </Moment>
                          </td>
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
                        ? <PaginationLink disabled>Tr?????c</PaginationLink> 
                        : <PaginationLink onClick={this.handleClick} id={prev} href={prev}>Tr?????c</PaginationLink>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  courses: state.courses,
  auth: state.auth
});
export default connect(mapStateToProps, { getManageCourses })(ViewCourseList); 