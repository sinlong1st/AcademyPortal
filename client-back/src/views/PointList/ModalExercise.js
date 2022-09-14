import React, { Component,Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { connect } from 'react-redux';
import { getExerciseList, clearSuccess } from '../../actions/exerciseActions'; 
import ReactLoading from 'react-loading';
import { setPointColumnsExercise, getPointColumns } from '../../actions/pointActions'; 
import SweetAlert from 'react-bootstrap-sweetalert';

class ModalExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      loading: true,
      isOpenModal: false,
      isLoading: false,
      isShowSuccess: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleClickExercise = this.handleClickExercise.bind(this);
  }

  toggleModal() {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.props.getExerciseList(this.props.courseId);
    this.setState({
      isOpenModal: !this.state.isOpenModal
    });
  }

  handleClickExercise(exerciseId){
    this.props.setPointColumnsExercise(this.props.courseId, this.props.pointColumnsId, exerciseId)
    this.setState({ isLoading: true })
  } 

  componentWillReceiveProps(nextProps) {
    if (nextProps.exercises) {
      const { exercises, loading } = nextProps.exercises
      this.setState({
        exercises,
        loading
      })
    }

    if (nextProps.success.mes === "Chọn bài tập thành công") {
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
    const { exercises, loading } = this.state;
    return (
      <Fragment>
        <Button color="success" className="btn-pill" onClick={this.onOpenModal}>chọn bài tập</Button>
        <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal} className='modal-lg'>
          <ModalHeader  toggle={this.toggleModal}>Chọn bài tập</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:400}}>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B' />
            :
            <Fragment>
            {
              exercises.length === 0
              ?
              <b>Chưa có bài tập</b>
              :
              <ListGroup>
              {
                exercises.map(exercise=>
                  <ListGroupItem key={exercise._id} tag="button" onClick={this.handleClickExercise.bind(this, exercise._id)} action>{exercise.title}</ListGroupItem>
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
            Chọn bài tập thành công!
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
  exercises: state.exercises,
  success: state.success
});

export default connect(mapStateToProps, { getExerciseList, setPointColumnsExercise, clearSuccess, getPointColumns })(ModalExercise);  