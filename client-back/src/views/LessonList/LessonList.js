import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  Input,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import ModalAdd from './ModalAdd';
import { getLessonList } from '../../actions/lessonActions';
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 

let prev  = 0;
let last  = 0;

class LessonList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialList: [],
      lesson_list: [],
      loading: true,
      currentPage: 1,
      listPerPage: 5,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
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

  componentDidMount = () => {
    this.props.getLessonList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lesson) {
      const { lesson_list, loading } = nextProps.lesson
      this.setState({
        initialList: lesson_list,
        lesson_list,
        loading
      })
    }
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  handleClickLessonList(listId){
    this.props.history.push(`/lesson-list/${listId}`);
  } 

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.initialList));
    updatedList = updatedList.filter((list)=>
    list.title.toLowerCase().search(e.target.value.toLowerCase()) !== -1 
    );
    this.setState({ lesson_list: updatedList });
  }

  render() {
    const { lesson_list, loading, currentPage, listPerPage, } = this.state;

    // Logic for displaying current courses
    let indexOfLastTodo = currentPage * listPerPage;
    let indexOfFirstTodo = indexOfLastTodo - listPerPage;
    let currentlists = lesson_list.slice(indexOfFirstTodo, indexOfLastTodo);
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(lesson_list.length/listPerPage);

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <ModalAdd/>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div style={{marginTop: 20}}>
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-search"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên danh sách bài học" spellCheck='false'/>
                </InputGroup>
                
                <Table bordered responsive hover style={{marginTop:10}}>
                  <thead className="thead-light">
                    <tr>
                      <th>Tên danh sách bài học</th>
                      <th>Số buổi học</th>
                      <th>Chứng chỉ nhận được</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      currentlists.map(list =>
                        <tr key={list._id} className="changeCursor" onClick={this.handleClickLessonList.bind(this, list._id)}>
                          <td>{list.title}</td>
                          <td>{list.lesson.length}</td>
                          <td>{list.certification ? list.certification.name : ''}</td>
                          <td>
                            <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                              {list.created}
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
              </div>
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  lesson: state.lesson
});

export default connect(mapStateToProps, { getLessonList })(LessonList);  