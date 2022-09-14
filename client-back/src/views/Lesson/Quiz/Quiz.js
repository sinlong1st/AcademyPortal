import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { 
  Card, 
  CardHeader,
  CardBody,
  Collapse,
  Form,
  FormGroup,
  Col,
  Label, 
  Input,
  Button,
  Badge,
  Row
} from 'reactstrap';
import Moment from 'react-moment'; 
import { getMySubmissionQuiz } from '../../../actions/submissionActions';

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: false,
      password: '',
      loading: true
    };
  }

  toggleAccordion() {
    if(this.props.quiz.password === '')
    {
      if(this.props.auth.user.role === 'student'){
        this.props.history.push(`/courses/${this.props.match.params.id}/lesson/${this.props.match.params.lessonId}/${this.props.quiz.quizId._id}`, { password: this.state.password });
      }else{
        this.props.history.push(`/quiz/quiz-detail/${this.props.quiz.quizId._id}`);
      }
    }else{
      const prevState = this.state.accordion;
      const state = prevState ? false : true;
      this.setState({
        accordion: state,
      });
    }

  }

  componentDidMount(){
    this.props.getMySubmissionQuiz(this.props.match.params.id, this.props.quiz.quizId._id);
  }

  componentWillReceiveProps(nextProps) {

    const { mysubmissionquiz, loadingquiz } = nextProps.mysubmission
    if(mysubmissionquiz.quizId === this.props.quiz.quizId._id)
      this.setState({ 
        mysubmissionquiz,
        loading: loadingquiz
      });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  checkPassword = e => {
    if(e)
      e.preventDefault(); 
    if(this.props.auth.user.role === 'student'){
      this.props.history.push(`/courses/${this.props.match.params.id}/lesson/${this.props.match.params.lessonId}/${this.props.quiz.quizId._id}`, { password: this.state.password });
    }else{
      this.props.history.push(`/quiz/quiz-detail/${this.props.quiz.quizId._id}`);
    }
  }

  render() {
    const { quiz } = this.props;
    const { role } = this.props.auth.user;
    const { mysubmissionquiz, loading } = this.state;
    return (
      <Fragment>
        {
          <Card style={{marginTop:10}}>
            <CardHeader style={{backgroundColor: 'lightblue'}} className="changeCursor" onClick={() => this.toggleAccordion()} aria-expanded={this.state.accordion} aria-controls="collapseOne">
            {
              role === 'student'
              ?
              <Row>
                <Col xs='10'>
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
                    loading
                    ?
                    null
                    :
                    <Fragment>
                      {
                        mysubmissionquiz.point
                        ?
                        <div>
                          <b>Điểm:</b> {mysubmissionquiz.point} 
                        </div>
                        :
                        <div>
                          <b>Điểm:</b> chưa có
                        </div>
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
                        mysubmissionquiz.point
                        ?
                        <Fragment>
                          <h2 ><Badge color="success">Đã làm bài</Badge></h2>
                        </Fragment>
                        :
                        <Fragment>
                          <h2><Badge color="danger">Chưa làm</Badge></h2>
                        </Fragment>
                      }
                    </Fragment>
                  }
                </Col>
              </Row>
              :
              <Fragment>
                <h5>{quiz.quizId.title}</h5>
                <b>Thời gian bắt đầu làm:</b>                   
                <Moment format=" HH:mm ngày DD/MM/YYYY">
                  {quiz.startTime}
                </Moment><br/>
                <b>Hạn chót làm bài: </b>                   
                <Moment format=" HH:mm ngày DD/MM/YYYY">
                  {quiz.deadline}
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
                  
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  mysubmission: state.mysubmission
});

export default  withRouter(connect(mapStateToProps, { getMySubmissionQuiz })(Quiz));  