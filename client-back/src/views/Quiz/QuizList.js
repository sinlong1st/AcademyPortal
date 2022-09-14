import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Card, Table, CardBody, CardHeader, Input, PaginationItem, Pagination, PaginationLink, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import ReactLoading from 'react-loading';
import { getListQuiz } from '../../actions/testQuizAction';
import Moment from 'react-moment'; 
import ModalAdd from './ModalAdd';

let prev  = 0;
let last  = 0;

class QuizListPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      listTestQuiz: [],
      intiallistTestQuiz: [],
      loading: true,
      currentPage: 1,
      quizzesPerPage: 10
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
  }

  componentDidMount = () => {
    this.props.getListQuiz();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testQuiz) {
      const { listTestQuiz, loading } = nextProps.testQuiz
      if(listTestQuiz)
      {
        this.setState({
          intiallistTestQuiz: listTestQuiz,
          listTestQuiz,
          loading
        })
      }

      this.setState({
        loading
      })
    }
  }
  
  toQuizDetail = testQuizid => {
    this.props.history.push('/quiz/quiz-detail/' + testQuizid)
  }

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intiallistTestQuiz));
    updatedList = updatedList.filter((quiz)=>
      quiz.title.toLowerCase().search(e.target.value.toLowerCase()) !== -1 
    );
    this.setState({ listTestQuiz: updatedList });
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

  render () {
    const { loading, listTestQuiz, currentPage, quizzesPerPage } = this.state

    // Logic for displaying current courses
    let indexOfLastTodo = currentPage * quizzesPerPage;
    let indexOfFirstTodo = indexOfLastTodo - quizzesPerPage;
    let currentlist = listTestQuiz.slice(indexOfFirstTodo, indexOfLastTodo);
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(listTestQuiz.length/quizzesPerPage);

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Danh sách bài kiểm tra trắc nghiệm</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B' />
              :
              <Fragment>
                <ModalAdd/>
                {
                  currentlist.length === 0
                  ?
                  <div style={{marginTop: 10}}>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên bài kiểm tra trắc nghiệm . . ." spellCheck='false'/>
                    </InputGroup>
                    <h3 style={{marginTop:20}}>không có bài kiểm tra trắc nghiệm</h3>
                  </div>
                  :
                  <div style={{marginTop: 10}}>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên bài kiểm tra trắc nghiệm . . ." spellCheck='false'/>
                    </InputGroup>
                    
                    <Table style={{marginTop:20}} hover responsive bordered className="table-outline mb-0 d-none d-sm-table" >
                      <thead className="thead-light">
                        <tr>
                          <th>Tên bài kiểm tra</th>
                          <th>Thời gian làm</th>
                          <th>Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          currentlist.map(testQuiz=>
                            <tr key={testQuiz._id} className="changeCursor" onClick={this.toQuizDetail.bind(this, testQuiz._id)}>
                              <td>
                                {testQuiz.title}
                              </td>
                              <td>
                                {testQuiz.time} phút
                              </td>
                              <td>
                                <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                                  {testQuiz.created}
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
              </Fragment>
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}

QuizListPage.propTypes = {
  getListQuiz : PropTypes.func.isRequired,
  testQuiz: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  getListQuiz: bindActionCreators(getListQuiz, dispatch)
});

const mapStateToProps = state => ({
  testQuiz: state.testQuiz
});

export default connect(mapStateToProps, mapDispatchToProps)(QuizListPage);
