import React, { Component, Fragment } from 'react';
import { Container, Table } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { getMyTeacherRating } from '../../actions/ratingActions'; 
import { withRouter } from 'react-router-dom';
import isEmptyObj from '../../validation/is-empty';

class TeacherRating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      my_teacher_rating: [],
      loading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rating) {
      const { my_teacher_rating, loading } = nextProps.rating
      if(!isEmptyObj(my_teacher_rating))
        this.setState({
          my_teacher_rating,
          loading
        })
      this.setState({
        loading
      })
    }
  }

  componentDidMount=()=>{
    this.props.getMyTeacherRating(this.props.match.params.id);
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
    const { my_teacher_rating, loading } =this.state;
    return (
      <Container fluid>
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B'/>
          :
          <Fragment>
            {
              my_teacher_rating.length === 0
              ?
              <h3>Không có đánh giá của học viên</h3>
              :
              <Fragment>
                <h3>Các bài đánh giá của học viên</h3>
                <Table style={{marginTop:20}} bordered responsive className="table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th>Học viên</th>
                      <th>Góp ý</th>
                      <th>Điểm Trung Bình</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      my_teacher_rating.map((e,i)=>
                        <tr key={e._id}>
                          <td>
                            {i+1}
                          </td>
                          <td>
                            {e.text}
                          </td>
                          <td>
                            {e.star}
                          </td>
                        </tr>
                      )
                    }
                    <tr>
                      <td colSpan='2' bgcolor="grey" align="center">
                        <font color="white"><b>Điểm trung bình các học viên :</b></font>
                      </td>
                      <td>
                        <b>{this.caculateTotalPoint(my_teacher_rating)}</b>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Fragment>
            }
          </Fragment>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  rating: state.rating
});

export default withRouter(connect(mapStateToProps, { getMyTeacherRating })(TeacherRating));
