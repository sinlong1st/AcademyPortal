import React, { Component,Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getQuizListInCourse, clearSuccess } from '../../actions/testQuizAction'; 
import { setPointColumnsQuiz, getPointColumns } from '../../actions/pointActions'; 

class ModalQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      loading: true,
      isOpenModal: false,
      isLoading: false,
      isShowSuccess: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleClickQuiz = this.handleClickQuiz.bind(this);
  }

  toggleModal() {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.props.getQuizListInCourse(this.props.courseId);
    this.setState({
      isOpenModal: !this.state.isOpenModal
    });
  }

  handleClickQuiz(quizId){
    this.props.setPointColumnsQuiz(this.props.courseId, this.props.pointColumnsId, quizId)
    this.setState({ isLoading: true })
  } 

  componentWillReceiveProps(nextProps) {
    if (nextProps.testQuiz) {
      const { quizzes, loading } = nextProps.testQuiz
      this.setState({
        quizzes,
        loading
      })
    }

    if (nextProps.success.mes === "Chọn trắc nghiệm thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess()
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getPointColumns(this.props.courseId)
  }

  render() {
    const { quizzes, loading } = this.state;
    return (
      <Fragment>
        <Button color="success" className="btn-pill" onClick={this.onOpenModal}>chọn trắc nghiệm</Button>
        <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal} className='modal-lg'>
          <ModalHeader  toggle={this.toggleModal}>Chọn trắc nghiệm</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:400}}>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B' />
            :
            <Fragment>
            {
              quizzes.length === 0
              ?
              <b>Chưa có bài trắc nghiệm</b>
              :
              <ListGroup>
              {
                quizzes.map(quiz=>
                  <ListGroupItem key={quiz._id} tag="button" onClick={this.handleClickQuiz.bind(this, quiz._id)} action>{quiz.title}</ListGroupItem>
                )
              }
              </ListGroup>
            }
            </Fragment>
          }
          </ModalBody>
        </Modal>
        <SweetAlert
          	success
            confirmBtnText="OK"
            title=''            
          	confirmBtnBsStyle="success"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
            Chọn trắc nghiệm thành công!
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success
});

export default connect(mapStateToProps, { getQuizListInCourse, clearSuccess, setPointColumnsQuiz, getPointColumns })(ModalQuiz);  