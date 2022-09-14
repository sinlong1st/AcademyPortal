import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Table, CardBody, CardHeader, Input, PaginationItem, Pagination, PaginationLink, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import ReactLoading from 'react-loading';
import { getQuizBank } from '../../actions/quizbankActions';
import Moment from 'react-moment'; 

let prev  = 0;
let last  = 0;

class AddFromQuizBank extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quizbank: [],
      intiallistQuizBank: [],
      loading: true,
      currentPage: 1,
      quizzesPerPage: 10
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
  }

  componentDidMount = () => {
    this.props.getQuizBank();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.quizbank) {
      const { quizbank, loading } = nextProps.quizbank
      if(quizbank)
      {
        this.setState({
          intiallistQuizBank: quizbank,
          quizbank,
          loading
        })
      }

      this.setState({
        loading
      })
    }
  }

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intiallistQuizBank));
    updatedList = updatedList.filter((cat)=>
      cat.category.toLowerCase().search(e.target.value.toLowerCase()) !== -1 
    );
    this.setState({ quizbank: updatedList });
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
    const { loading, quizbank, currentPage, quizzesPerPage } = this.state

    // Logic for displaying current courses
    let indexOfLastTodo = currentPage * quizzesPerPage;
    let indexOfFirstTodo = indexOfLastTodo - quizzesPerPage;
    let currentlist = quizbank.slice(indexOfFirstTodo, indexOfLastTodo);
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(quizbank.length/quizzesPerPage);

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Chọn danh mục từ ngân hàng</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B' />
              :
              <Fragment>
                {
                  currentlist.length === 0
                  ?
                  <div>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên danh mục . . ." spellCheck='false'/>
                    </InputGroup>
                    <h3 style={{marginTop:10}}>không có bài danh mục nào</h3>
                  </div>
                  :
                  <div>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên danh mục . . ." spellCheck='false'/>
                    </InputGroup>
                    
                    <Table style={{marginTop:10}} hover responsive bordered className="table-outline mb-0 d-none d-sm-table" >
                      <thead className="thead-light">
                        <tr>
                          <th>Tên danh mục</th>
                          <th>Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          currentlist.map(cat=>
                            <tr key={cat._id} className="changeCursor" onClick={()=>this.props.history.push(`/quiz/quiz-detail/${this.props.match.params.id}/quiz-bank/${cat._id}`)}>
                              <td>
                                {cat.category}
                              </td>
                              <td>
                                <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                                  {cat.created}
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

const mapDispatchToProps = dispatch => ({
  getQuizBank: bindActionCreators(getQuizBank, dispatch)
});

const mapStateToProps = state => ({
  quizbank: state.quizbank
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFromQuizBank);
