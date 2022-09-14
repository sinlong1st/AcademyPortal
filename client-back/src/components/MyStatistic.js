import React, { Component } from 'react';
import { Table, Alert, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getMyStatistic } from '../actions/mystatisticActions';
import ReactLoading from 'react-loading';
import ModalInfo from './ModalInfo';

class MyStatistic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      my_statistic: {},
      loading: true
    };

  }

  componentDidMount = () => {
    this.props.getMyStatistic(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    const { my_statistic, loading } = nextProps.my_statistic
    this.setState({
      my_statistic,
      loading
    })
  }

  render() {
    const { my_statistic, loading } = this.state;
    return (
      <div className="animated fadeIn">
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B' />
          :
          <div>
            <Alert>
              <b>Điều kiện hoàn thành khóa học</b><br/>
              Điểm tổng kết tối thiểu: <b>{my_statistic.minScore}</b><br/>
              Số buổi vắng tối đa: <b>{my_statistic.minAbsent}</b>
            </Alert>

            <h3 style={{marginTop: 50}}>Thông tin học viên</h3>
            <Table responsive className="table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Hình đại diện</th>
                  <th>Thông tin học viên</th>
                  <th>Điểm tổng kết</th>
                  <th>Số buổi vắng</th>
                  <th>Thông tin chi tiết</th>
                  <th>In thông tin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>                      
                    <div className="avatar">
                      <img src={my_statistic.student.photo} className="img-avatar" alt="" />
                    </div>
                  </td>
                  <td>
                    <div><b>{my_statistic.student.name}</b></div>
                    <div className="small text-muted">
                      {my_statistic.student.code}
                    </div>
                  </td>
                  <td>
                    {my_statistic.totalPoint}
                  </td>
                  <td>
                    {my_statistic.absent}
                  </td>
                  <td>
                    <ModalInfo userId={my_statistic.student._id} courseId={this.props.match.params.id} />
                  </td>
                  <td>
                    <Button color='primary' onClick={()=>window.open(`/print-info/${this.props.match.params.id}/${my_statistic.student._id}`)}>
                      <i className="fa fa-print"></i>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  my_statistic: state.my_statistic
});

export default withRouter(connect(mapStateToProps, { getMyStatistic })(MyStatistic));  