import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {  
  Modal, 
  ModalBody, 
  Button, 
  ListGroup, 
  ListGroupItem,  
  Card,
  CardHeader,
  CardBody,
  Collapse,
  Alert,
  Label,
  Jumbotron,
  Container
} from 'reactstrap';
import { getLessonIncourse } from '../../actions/lessonActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import ExerciseBox from './Exercise/ExerciseBox';
import NoImg from '../../assets/img/NoImg.png';
import Moment from 'react-moment'; 
import ExerciseComments from './Exercise/ExerciseComments';
import EditExercise from './Exercise/EditExercise';
import SweetAlert from 'react-bootstrap-sweetalert';

class InLesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      content: '',
      files: [],
      accordion: [],
      loading: true,
      exercises: [],
      quizzes: [],
      isShowSuccess: false
    };
  }

  componentDidMount(){
    this.props.getLessonIncourse(this.props.match.params.id, this.props.match.params.lessonId)
  }


  componentWillReceiveProps(nextProps) {
    const { lesson_in_course, loading } = nextProps.lesson
    if(!isEmptyObj(lesson_in_course))
    {
      var { text, content, files, exercises, quizzes, _id } = lesson_in_course
      if(this.props.match.params.lessonId === _id)
      {
        var accordion = [];
        exercises.map(()=>accordion.push(false))
  
        this.setState({ 
          text, 
          content, 
          files,
          exercises,
          accordion,
          quizzes,
          loading 
        });
      }
    }
    this.setState({ 
      loading
    });

    if (nextProps.success.mes === "Chỉnh sửa bài tập thành công") {
      this.setState({
        isShowSuccess: true
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

  score(exerciseId){
    this.props.history.push(`/score/${this.props.match.params.id}/${exerciseId}`)
  }

  jumpToQuizDetail(quizId){
    this.props.history.push(`/quiz/quiz-detail/${quizId}`);
  }
  
  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getLessonIncourse(this.props.match.params.id, this.props.match.params.lessonId);
  }

  render() {
    const { 
      content, 
      files, 
      text, 
      loading,
      exercises,
      quizzes 
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>

        <Alert color="dark" style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
          {text}
        </Alert>

        <Card>
          <CardBody>
            <Label style={{fontWeight:'bold'}}>
              Nội dung bài học
            </Label>
            <Jumbotron>
              {
                !isEmptyObj(content)
                ?
                <div dangerouslySetInnerHTML={ { __html: content} }></div>
                :
                <b>Chưa cập nhật nội dung bài học</b>
              }
            </Jumbotron>

            <Label style={{fontWeight:'bold'}}>
              Tài liệu học
            </Label>
            <ListGroup style={{marginTop:10}}>
            {
              files.length === 0
              ?
              <ListGroupItem>Chưa có tài liệu</ListGroupItem>
              :
              <Fragment>
              {
                files.map(file=>
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
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <i className="fa fa-file-text" aria-hidden="true"></i>
            <b>Bài tập</b>
          </CardHeader>
          <CardBody>
            <ExerciseBox/>
            {
              exercises.length === 0
              ?
              <ListGroup style={{marginTop:10}}>
                <ListGroupItem>Chưa có bài tập</ListGroupItem>
              </ListGroup>
              :
              exercises.map((exercise,index) => 
                <Card key={index} style={{marginTop:10}} >
                  <CardHeader style={{backgroundColor: 'lightblue'}} onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} className="changeCursor">
                    <h5>{exercise.title}</h5>
                    <b>Hạn nộp:</b>                   
                    <Moment format=" HH:mm ngày DD/MM/YYYY">
                      {exercise.deadline}
                    </Moment><br/>
                    {
                      exercise.password
                      ?
                      <div>
                        <b>Mật khẩu:</b> {exercise.password}
                      </div>
                      :
                      null
                    }
                  </CardHeader>
                  <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id="collapseOne">
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
                        <Button color="success" onClick={this.score.bind(this, exercise._id)} >Chấm điểm</Button>
                        <ExerciseComments exercise={exercise}/>
                        <EditExercise exercise={exercise}/>
                      </Container>
                    </CardBody>
                  </Collapse>
                </Card>
              )
            }
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <i className="fa fa-question-circle" aria-hidden="true"></i>
            <b>Quiz</b>
          </CardHeader>
          <CardBody>
            <Button color="danger" onClick={()=>this.props.history.push(`/courses/${this.props.match.params.id}/add-in-lesson/${this.props.match.params.lessonId}/add-quiz`)}>
              Chọn trắc nghiệm
            </Button>
            {
              quizzes.length === 0
              ?
              <ListGroup style={{marginTop:10}}>
                <ListGroupItem>Chưa có bài trắc nghiệm</ListGroupItem>
              </ListGroup>
              :
              <Fragment>
              {
                quizzes.map((quiz,index) => 
                  <Card className="mb-0" key={index} style={{marginTop:10}}>
                    <CardHeader style={{backgroundColor: 'lightblue'}} className="changeCursor" onClick={this.jumpToQuizDetail.bind(this, quiz.quizId._id)}>
                      <h5>{quiz.quizId.title}</h5>
                      <b>Thời gian bắt đầu làm:</b>                   
                      <Moment format=" HH:mm ngày DD/MM/YYYY">
                        {quiz.startTime}
                      </Moment><br/>
                      <b>Hạn chót làm bài: </b>                   
                      <Moment format=" HH:mm ngày DD/MM/YYYY">
                        {quiz.deadline}
                      </Moment>                 
                      {
                        quiz.password
                        ?
                        <div>
                          <b>Mật khẩu:</b> {quiz.password}
                        </div>
                        :
                        null
                      }
                    </CardHeader>
                  </Card>
                )
              }
              </Fragment>
            }
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Chỉnh sửa bài tập thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  lesson: state.lesson,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { getLessonIncourse })(InLesson));  