import React, { Component, Fragment } from 'react';
import { Container, Table, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { getTeachersRating } from '../../actions/ratingActions'; 
import { withRouter } from 'react-router-dom';
import ModalRatingEdit from './ModalRatingEdit';

class Rating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teachers_rating: [],
      loading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rating) {
      const { teachers_rating, loading } = nextProps.rating
      if(this.props.match.params.id === teachers_rating._id)
        this.setState({
          teachers_rating: teachers_rating.teachers,
          loading
        })
    }

    if (nextProps.success.mes === "Đánh giá 2 thành công") {
      this.props.getTeachersRating(this.props.match.params.id);
    }

  }

  componentDidMount=()=>{
    this.props.getTeachersRating(this.props.match.params.id);
  }

  caculateTotalPoint(rate){
    var totalPoint = 0; 
    var type = '';
    for(var i=0; i<rate.length; i++)
    {
      totalPoint = totalPoint + rate[i].star 
    }
    totalPoint = totalPoint / rate.length
    if(totalPoint >= 3.4)
    {
      type = ' ( Đạt )'
    }else{
      type = ' ( Không đạt )'
    }
    return totalPoint.toFixed(1) + type
  }

  render() {
    const { teachers_rating, loading } =this.state;
    return (
      <Container fluid>
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B'/>
          :
          <Fragment>
            {
              teachers_rating.length === 0
              ?
              <h3>Chưa có giáo viên</h3>
              :
              <Fragment>
                {
                  teachers_rating.map(teacher=>
                    <div key={teacher._id}>
                      <h3>Đánh giá của giáo viên <b>{teacher.name}</b></h3>
                      {
                        teacher.teacherRating.length === 0
                        ?
                        <Table style={{marginTop:20}} bordered responsive>
                          <tr>
                            <td>
                              Chưa có đánh giá nào của học viên
                            </td>
                          </tr>
                        </Table>
                        :
                        <Table style={{marginTop:20}} bordered responsive className="table-outline mb-0 d-none d-sm-table">
                          <thead className="thead-light">
                            <tr>
                              <th>Học viên</th>
                              <th>Góp ý</th>
                              <th>Điểm Trung Bình</th>
                              <th>Chi tiết</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              teacher.teacherRating.map(e=>
                                <tr key={e._id}>
                                  <td>
                                    <Row>
                                      <Col sm="2">
                                        <div className="avatar">
                                          <img src={e.user.photo} className="img-avatar" alt="" />
                                        </div>
                                      </Col>
                                      <Col>
                                        <div><b>{e.user.name}</b></div>
                                        <div className="small text-muted">
                                          {e.user.code}
                                        </div>
                                      </Col>
                                    </Row>
                                  </td>
                                  <td>
                                    {e.text}
                                  </td>
                                  <td>
                                    {e.star}
                                  </td>
                                  <td>
                                    <ModalRatingEdit teacherId={teacher._id} teacherRatingId={e._id}/>
                                  </td>
                                </tr>
                              )
                            }
                            <tr>
                              <td colSpan='2' bgcolor="grey" align="center">
                                <font color="white"><b>Điểm trung bình các học viên :</b></font>
                              </td>
                              <td>
                                <b>{this.caculateTotalPoint(teacher.teacherRating)}</b>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      }
                      
                    </div>
                  )
                }
              </Fragment>
            }
          </Fragment>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  rating: state.rating,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { getTeachersRating })(Rating));
