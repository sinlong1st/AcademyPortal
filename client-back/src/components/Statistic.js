import React, { Component } from 'react';
import { Table, Alert, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getStatistic } from '../actions/statisticActions';
import ReactLoading from 'react-loading';
import ModalInfo from './ModalInfo';

class Statistic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statistic: [],
      loading: true
    };

  }

  componentDidMount = () => {
    this.props.getStatistic(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    const { statistic, loading } = nextProps.statistic
    if(statistic._id === this.props.match.params.id)
      this.setState({
        statistic,
        loading
      })
  }

  render() {
    const { statistic, loading } = this.state;
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
              Điểm tổng kết tối thiểu: <b>{statistic.minScore}</b><br/>
              Số buổi vắng tối đa: <b>{statistic.minAbsent}</b>
            </Alert>

            <h3 style={{marginTop: 50}}>Danh sách học viên đủ điều kiện đậu</h3>
            <Table responsive className="table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Hình đại diện</th>
                  <th>Thông tin học viên</th>
                  <th>Điểm tổng kết</th>
                  <th>Số buổi vắng</th>
                  <th>Thông tin chi tiết</th>
                  <th>In thông tin</th>
                  <th>In chứng chỉ</th>
                </tr>
              </thead>
              <tbody>
                {
                  statistic.passStudent.length === 0
                  ?
                  <tr><td></td><td>Không có học viên</td><td></td><td></td><td></td><td></td></tr>
                  :
                  statistic.passStudent.map(user =>
                    <tr key={user._id}>
                      <td>                      
                        <div className="avatar">
                          <img src={user.photo} className="img-avatar" alt="" />
                        </div>
                      </td>
                      <td>
                        <div><b>{user.name}</b></div>
                        <div className="small text-muted">
                          {user.code}
                        </div>
                      </td>
                      <td>
                        {user.totalPoint}
                      </td>
                      <td>
                        {user.absent}
                      </td>
                      <td>
                        <ModalInfo userId={user._id} courseId={this.props.match.params.id} />
                      </td>
                      <td>
                        <Button color='primary' onClick={()=>window.open(`/print-info/${this.props.match.params.id}/${user._id}`)}>
                          In thông tin
                        </Button>
                      </td>
                      <td>
                        <Button color='success' onClick={()=>window.open(`/print-certificate/${this.props.match.params.id}/${user._id}`)}>
                          In chứng chỉ
                        </Button>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>

            
            <h3 style={{marginTop: 50}}>Danh sách học viên không đủ điều kiện đậu</h3>
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
                {
                  statistic.failStudent.length === 0
                  ?
                  <tr><td></td><td>Không có học viên</td><td></td><td></td><td></td><td></td></tr>
                  :
                  statistic.failStudent.map(user =>
                    <tr key={user._id}>
                      <td>                      
                        <div className="avatar">
                          <img src={user.photo} className="img-avatar" alt="" />
                        </div>
                      </td>
                      <td>
                        <div><b>{user.name}</b></div>
                        <div className="small text-muted">
                          {user.code}
                        </div>
                      </td>
                      <td>
                        {user.totalPoint}
                      </td>
                      <td>
                        {user.absent}
                      </td>
                      <td>
                        <ModalInfo userId={user._id} courseId={this.props.match.params.id} />
                      </td>
                      <td>
                        <Button color='primary' onClick={()=>window.open(`/print-info/${this.props.match.params.id}/${user._id}`)}>
                          In thông tin
                        </Button>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  statistic: state.statistic
});

export default withRouter(connect(mapStateToProps, { getStatistic })(Statistic));  