import React, { Component,Fragment } from 'react';
import { 
  Card, CardHeader, 
  CardBody, Button, 
  Collapse, ListGroupItem, 
  Col, FormGroup, Input,
  ListGroup, Label, Form, Container, Badge, Row
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Moment from 'react-moment'; 
import ExerciseComments from './ExerciseComments';
import SubmitExercise from './SubmitExercise';
import isEmptyObj from '../../../validation/is-empty';
import NoImg from '../../../assets/img/NoImg.png';
import { getMySubmission } from '../../../actions/submissionActions';

class Exercise extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: false,
      exercises: '',
      wrongPassword: true,
      password: '',
      loading: true,
      submission: ''
    };
  }

  toggleAccordion() {
    const prevState = this.state.accordion;
    const state = prevState ? false : true;
    this.setState({
      accordion: state,
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  checkPassword = e => {
    if(e)
      e.preventDefault();    
    if(this.state.password === this.props.exercise.password) {
      this.setState({
        wrongPassword: false
      })
    }
  }

  componentDidMount(){
    this.props.getMySubmission(this.props.exercise._id);
  }

  componentWillReceiveProps(nextProps) {

    const { mysubmission, loading } = nextProps.mysubmission
    if(mysubmission.exerciseId === this.props.exercise._id)
      this.setState({ 
        mysubmission,
        loading 
      });
  }

  render() {
    const { exercise, index } = this.props;
    const { role } = this.props.auth.user;
    const { mysubmission, loading } = this.state;
    console.log(mysubmission)
    return (
      <Fragment>
      {
        this.state.wrongPassword && !isEmptyObj(exercise.password)
        ?
        <Card key={index} style={{marginTop:10}}>
          <CardHeader style={{backgroundColor: 'lightblue'}} className="changeCursor" onClick={() => this.toggleAccordion()} aria-expanded={this.state.accordion} aria-controls="collapseOne">
            {
              role === 'student'
              ?
              <Row>
                <Col xs='10'>
                  <h5>{exercise.title}</h5>
                  <b>Hạn nộp:</b>                   
                  <Moment format=" HH:mm ngày DD/MM/YYYY">
                    {exercise.deadline}
                  </Moment> 
                  {
                    loading
                    ?
                    null
                    :
                    <Fragment>
                      {
                        mysubmission.point
                        ?
                        <div>
                          <b>Điểm:</b> {mysubmission.point} 
                        </div>
                        :
                        <div>
                          <b>Điểm:</b> chưa có
                        </div>
                      }
                      {
                        mysubmission.note
                        ?
                        <div>
                          <b>Ghi chú:</b> {mysubmission.note} 
                        </div>
                        :
                        null
                      }
                    </Fragment>
                  }
                </Col>
                <Col>
                  {
                    loading
                    ?
                    null
                    :
                    <Fragment>
                      {
                        mysubmission.isSubmit
                        ? 
                        <Fragment>
                          <h2 ><Badge color="success">Đã nộp bài</Badge></h2>
                        </Fragment>
                        :
                        <Fragment>
                          <h2><Badge color="danger">Chưa nộp</Badge></h2>
                        </Fragment>
                      }
                    </Fragment>
                  }
                </Col>
              </Row>
              :
              <Fragment>
                <h5>{exercise.title}</h5>
                <b>Hạn nộp:</b>                   
                <Moment format=" HH:mm ngày DD/MM/YYYY">
                  {exercise.deadline}
                </Moment> 
              </Fragment>
            }
          </CardHeader>
          <Collapse isOpen={this.state.accordion} data-parent="#accordion" id="collapseOne">
            <CardBody>
              <Form onSubmit={this.checkPassword}>
                <FormGroup row>
                  <Col md="2">
                    <Label style={{marginTop: 10}}>Hãy điền mật khẩu: </Label>
                  </Col>
                  <Col md="4">
                    <Input name="password" type="text" onChange={this.onChange}  placeholder="Mật khẩu..."/>
                  </Col>
                  <Col md="3">
                    <Button block color="primary" onClick={this.checkPassword} >Xác nhận</Button>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Collapse>
        </Card>
        :
        <Card key={index} style={{marginTop:10}}>
          <CardHeader style={{backgroundColor: 'lightblue'}} className="changeCursor" onClick={() => this.toggleAccordion()} aria-expanded={this.state.accordion} aria-controls="collapseOne">
            {
              role === 'student'
              ?
              <Row>
                <Col xs='10'>
                  <h5>{exercise.title}</h5>
                  <b>Hạn nộp:</b>                   
                  <Moment format=" HH:mm ngày DD/MM/YYYY">
                    {exercise.deadline}
                  </Moment> 
                  {
                    loading
                    ?
                    null
                    :
                    <Fragment>
                      {
                        mysubmission.point
                        ?
                        <div>
                          <b>Điểm:</b> {mysubmission.point} 
                        </div>
                        :
                        <div>
                          <b>Điểm:</b> chưa có
                        </div>
                      }
                      {
                        mysubmission.note
                        ?
                        <div>
                          <b>Ghi chú:</b> {mysubmission.note} 
                        </div>
                        :
                        null
                      }
                    </Fragment>
                  }
                </Col>
                <Col>
                  {
                    loading
                    ?
                    null
                    :
                    <Fragment>
                      {
                        mysubmission.isSubmit
                        ? 
                        <Fragment>
                          <h2 ><Badge color="success">Đã nộp bài</Badge></h2>
                        </Fragment>
                        :
                        <Fragment>
                          <h2><Badge color="danger">Chưa nộp</Badge></h2>
                        </Fragment>
                      }
                    </Fragment>
                  }
                </Col>
              </Row>
              :
              <Fragment>
                <h5>{exercise.title}</h5>
                <b>Hạn nộp:</b>                   
                <Moment format=" HH:mm ngày DD/MM/YYYY">
                  {exercise.deadline}
                </Moment> 
              </Fragment>
            } 
          </CardHeader>
          <Collapse isOpen={this.state.accordion} data-parent="#accordion" id="collapseOne">
            <CardBody>
              <Label style={{fontWeight: 'bold'}}>
                Nội dung bài tập
              </Label>
              <ListGroup>
                <ListGroupItem>
                  <span style={{whiteSpace:'pre-wrap'}}>{exercise.text}</span>              
                </ListGroupItem>
              </ListGroup>
              <br/>

              <Label style={{fontWeight: 'bold'}}>
                File đính kèm
              </Label>
              <ListGroup>
                {
                  exercise.attachFiles.length === 0
                  ?
                  <ListGroupItem>Không có file</ListGroupItem>
                  :
                  <Fragment>
                    {
                      exercise.attachFiles.map(file=>
                        <ListGroupItem key={file.id} action onClick={()=>window.open(file.url)} className='changeCursor' >
                          {
                            file.thumbnail
                            ?
                            <img src={file.thumbnail} alt=""/> 
                            :
                            <img src={NoImg} style={{width:47}} alt=""/> 
                          }  
                          <span style={{marginLeft:10}}>{file.name}</span>
                        </ListGroupItem>
                      )
                    }
                  </Fragment>
                }
              </ListGroup>
              <Container>
                {
                  role === 'student'
                  ?
                  <SubmitExercise exercise={exercise}/>
                  :
                  null
                }
                <ExerciseComments exercise={exercise}/>
              </Container>
            </CardBody>
          </Collapse>
        </Card>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  mysubmission: state.mysubmission
});

export default  withRouter(connect(mapStateToProps, { getMySubmission })(Exercise));  