import React, { Component, Fragment } from 'react';
import { Card, CardBody, CardHeader, Row ,Col, Input, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions'; 
import { getPointColumns } from '../../actions/pointActions'; 
import ReactLoading from 'react-loading';
// import isEmptyObj from '../../validation/is-empty';
import ModalExercise from './ModalExercise';
import ModalQuiz from './ModalQuiz';

class PointList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: '0',
      pointColumns: [],
      currentcourses: [], 
      loadingCurrentcourses: true,
      loadingPointcolumns: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { currentcourses, loading } = nextProps.courses
      this.setState({ 
        currentcourses, 
        loadingCurrentcourses: loading 
      });
    }

    if (nextProps.point) {
      const { point_columns, loading } = nextProps.point
      const { pointColumns } = point_columns
      this.setState({ 
        pointColumns, 
        loadingPointcolumns: loading 
      });
    }
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
  }

  onChangeSelectCourse = e => {
    if(e.target.value !== '0')
      this.props.getPointColumns(e.target.value);
    this.setState({ courseId: e.target.value})
  }

  render() {
    const { currentcourses, pointColumns, loadingCurrentcourses, loadingPointcolumns, courseId } = this.state
    
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
          <Row >
              <Col sm="3">
                <strong>Quản lý cột điểm</strong>
              </Col>
              <Col>
                {
                  loadingCurrentcourses
                  ?
                  <div className="card-header-actions" style={{marginRight:10, marginBottom:40}} >
                    <ReactLoading type='bars' color='#05386B' height={10} width={50}/>
                  </div>
                  :
                  <Fragment>
                  {
                    currentcourses.length === 0
                    ?
                    <div className="card-header-actions" style={{marginRight:10}} >
                      <Input  type="select">
                        <option value="0">Chưa tham gia khóa học</option>
                      </Input>
                    </div>
                    :
                    <div className="card-header-actions" style={{marginRight:10}}>
                      <Input  type="select" name="courseId" onChange={this.onChangeSelectCourse}>
                        <option value="0">Hãy chọn khóa học</option>
                          { 
                            currentcourses.map(course=>
                              <option key={course._id} value={course._id}>{course.code}</option>
                            )
                          }
                      </Input>
                    </div>
                  }
                  </Fragment>
                }
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
          {
            courseId === '0'
            ?
            <h3>Hãy chọn khóa học</h3>
            :
            <Fragment>
            {
              loadingPointcolumns
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
              {
                pointColumns.length === 0
                ?
                <h3>Không có cột điểm</h3>
                :
                <Table bordered responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Tên cột điểm</th>
                      <th>Tỉ lệ % điểm</th>
                      <th>Tên bài làm đã chọn</th>
                      <th>Bài tập</th>
                      <th>Trắc nghiệm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      pointColumns.map(element =>
                        <tr key={element._id}>
                          <td>{element.pointName}</td> 
                          <td>{element.pointRate}</td>
                          <td>
                            {
                              element.test
                              ?
                              element.test.title                              
                              :
                              <span style={{color:'#A8A8A8'}}>
                                Chưa chọn
                              </span>
                            }
                          </td>
                          <td><ModalExercise pointColumnsId={element._id} courseId={courseId}/></td>
                          <td><ModalQuiz pointColumnsId={element._id} courseId={courseId}/></td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
              }
              </Fragment>
            }
            </Fragment>
          }

          </CardBody>
        </Card>
      </div>
    )
  }
}

PointList.propTypes = {
  getCurentCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses,
  point: state.point
});
export default connect(mapStateToProps, { getCurentCourse, getPointColumns })(PointList); 