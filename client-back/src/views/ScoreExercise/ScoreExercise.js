import React, { Component } from 'react';
import { Table, NavLink, Input, Button } from 'reactstrap';
import { getExercisePoint, getExercise, downloadSubmission, addPoint, clearSuccess } from '../../actions/exerciseActions';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, CardFooter, Modal, ModalBody, Row, Col } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import isEmptyObj from '../../validation/is-empty';
import Moment from 'react-moment'; 

class ScoreExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      studentSubmission :[],
      title:'',
      isShowSuccess: false,
      isLoading: false,
    }
    this.downloadExercise = this.downloadExercise.bind(this);
  }
    
  componentDidMount(){
    this.props.getExercise(this.props.match.params.exerciseId);
    this.props.getExercisePoint(this.props.match.params.exerciseId);
  }

  componentWillReceiveProps(nextProps) {
    const { loading } = nextProps.exercises
    this.setState({
      loading
    })

    if (!isEmptyObj(nextProps.exercises.studentSubmission)) {
      const { studentSubmission } = nextProps.exercises.studentSubmission
      this.setState({
        studentSubmission
      })
    }

    if (!isEmptyObj(nextProps.exercises.exercise)) {
      this.setState({
        title: nextProps.exercises.exercise.title
      })
    }
    
    if (nextProps.success.mes === "Nhập điểm thành công") {
      this.setState({
        isShowSuccess: true,
        isLoading: false
      })
      this.props.clearSuccess();
    }
  }

  downloadExercise(urlFile, fileName){
    const data={
      urlFile: urlFile
    }
    this.props.downloadSubmission(data, fileName);
  }

  statistical() {
    var khong=0;
    var mot=0;
    var hai=0;
    var ba=0;
    var bon=0;
    var nam=0;
    var sau=0;
    var bay=0;
    var tam=0;
    var chin=0;
    var muoi=0;

    var temp = JSON.parse(JSON.stringify(this.state.studentSubmission));

    temp.map(sub => {
      switch (sub.point) {
        case 0: khong+=1;break;
        case 1: mot+=1;break;
        case 2: hai+=1;break;
        case 3: ba+=1;break;
        case 4: bon+=1;break;
        case 5: nam+=1;break;
        case 6: sau+=1;break;
        case 7: bay+=1;break;
        case 8: tam+=1;break;
        case 9: chin+=1;break;
        case 10: muoi+=1;break;       
        default: break;
      }
      return sub
    })
      
    var thongke=[];
    thongke.push(khong);
    thongke.push(mot);
    thongke.push(hai);
    thongke.push(ba);
    thongke.push(bon);
    thongke.push(nam);
    thongke.push(sau);
    thongke.push(bay);
    thongke.push(tam);
    thongke.push(chin);
    thongke.push(muoi);

    return thongke;
  }

  onChangePoint(subId, e){
    this.state.studentSubmission.map(elem => {
      if(elem._id.toString() === subId.toString())
        return elem.point = e.target.value;
      return elem;
    })
    this.setState({
      studentSubmission: this.state.studentSubmission
    })
  }

  onChangeNote(subId, e){
    this.state.studentSubmission.map(elem => {
      if(elem._id.toString() === subId.toString())
        return elem.note = e.target.value;
      return elem;
    })
    this.setState({
      studentSubmission: this.state.studentSubmission
    })
  }

  submit = () => {
    var newPoint = {
      exerciseId: this.props.match.params.exerciseId,
      studentSubmission: this.state.studentSubmission
    };
    this.props.addPoint(newPoint);
    this.setState({isLoading: true});
  }
    
  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getExercisePoint(this.props.match.params.exerciseId);
  }

  static contextTypes = {
    router: () => null
  }

  render() {
    const line = {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          label: 'Điểm',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.statistical(),
        },
      ],
    }

    const options = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false
    }
    const { title, studentSubmission, loading } = this.state
    return (
      <div className="animated fadeIn">
        <Button style={{marginBottom: 10}} color="primary" onClick={this.context.router.history.goBack}>
          <i className="fa fa-arrow-left"></i> Trở về
        </Button>
        <Card >
          <CardHeader>
            <b>{title}</b>
          </CardHeader>
          <CardBody>
          {
            studentSubmission.length === 0
            ?
            <ReactLoading type='bars' color='#05386B'/>
            :
            <Table bordered responsive>
              <thead className="thead-light">
                <tr>
                  <th>Học viên</th>
                  <th>Thời gian nộp</th>
                  <th>Bài nộp</th>
                  <th>Điểm</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
              {
                studentSubmission.map(e =>
                  <tr key={e._id}>
                    <th>      
                      <Row >
                        <Col sm="3">
                          <div className="avatar">
                            <img src={e.userId.photo} className="img-avatar" alt="" />
                          </div>
                        </Col>
                        <Col>
                          <span>{e.userId.name}</span>
                          <br/>
                          <small style={{color:'#A8A8A8'}}>
                            {e.userId.code}
                          </small>
                        </Col>
                      </Row>         
                    </th>
                    <td>
                      {
                        e.isSubmit
                        ?
                        <Moment format="HH:mm [ngày] DD [thg] MM, YYYY">
                          {e.submitTime}
                        </Moment>
                        :
                        <span style={{color:'#A8A8A8'}}>
                          Chưa nộp bài
                        </span>
                      }
                    </td>
                    <td>
                      {
                        e.isSubmit
                        ?
                        <NavLink href="#" onClick={this.downloadExercise.bind(this, e.attachFile.url, e.attachFile.name)}>{e.attachFile.name} </NavLink>
                        :
                        <span style={{color:'#A8A8A8'}}>
                          Chưa nộp bài
                        </span>
                      }
                    </td>
                    <td>
                      {
                        e.point
                        ?
                        <Input size="1" min="0" max="10" type="number" value={e.point} onChange={this.onChangePoint.bind(this, e._id)}/>
                        :
                        <Input size="1" min="0" max="10" type="number" onChange={this.onChangePoint.bind(this, e._id)}/>
                      }
                    </td>
                    <td>
                      {
                        e.note
                        ?
                        <Input type="textarea" value={e.note} onChange={this.onChangeNote.bind(this, e._id)} spellCheck='false'/>
                        :
                        <Input type="textarea" onChange={this.onChangeNote.bind(this, e._id)} spellCheck='false'/>
                      }
                    </td>
                  </tr>
                )
              }
              </tbody>
            </Table>
          }
          </CardBody>
          <CardFooter>
            <Button color="primary" onClick={this.submit}>Thay đổi</Button>
          </CardFooter>
        </Card>
        <SweetAlert
            success
            confirmBtnText="OK"
            confirmBtnBsStyle="success"
            title="Chấm điểm thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <Modal isOpen={loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <Card>
          <CardHeader>
            Biểu đồ điểm bài tập này
          </CardHeader>
          <CardBody>
            <div className="chart-wrapper">
              <Line data={line} options={options} />
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  exercises: state.exercises,
  success: state.success
});

export default connect(mapStateToProps, { getExercisePoint, getExercise, downloadSubmission, addPoint, clearSuccess })(ScoreExercise); 
