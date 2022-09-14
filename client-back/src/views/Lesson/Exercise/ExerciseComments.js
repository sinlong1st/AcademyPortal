import React, { Component,Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { addComment, getComments, clearErrors, clearSuccess } from '../../../actions/exerciseActions';
import { getEventSchedule } from '../../../actions/scheduleActions';
import PropTypes from 'prop-types';
import isEmptyObj from '../../../validation/is-empty';
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 
import { withRouter } from 'react-router-dom';

const styles = {
  bigAvatar: {
    width: 35,
    height: 35,
    margin: 'auto',
    borderRadius:50
  }
}
class ExerciseComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text:'',
      large: false,
      errors: {},
      isLoading: false,
      loading: true,
      comments: [],
      _id: ''
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.mes === "Bình luận của bạn đã được gửi") {
      this.setState({
        isLoading: false,
        text:''
      })
      this.props.clearSuccess();
    }

    if (!isEmptyObj(nextProps.comments)) {
      const { exercise_comments, loading } = nextProps.comments
      const { _id, comments } = exercise_comments
      if(_id === this.props.exercise._id)
      {
        this.setState({
          _id,
          comments,
          loading
        })
      }
    }
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.clearErrors();

    const commentData = {
      text: this.state.text
    };

    this.props.addComment(commentData, this.props.exercise._id);
    this.setState({
      isLoading: true
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.props.getComments(this.props.exercise._id);
    this.setState({
      large: !this.state.large
    });
  }


  render() {
    const { comments, loading } = this.state
    return (
      <Fragment>
        <Button style={{marginLeft:10}} color="secondary" onClick={this.onOpenModal}>Bình luận</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg'>
          <ModalHeader  toggle={this.toggleLarge}>Bình luận về bài tập</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:400}}>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B' height={100} width={50} />
              :
              <Fragment>
              {
                comments.length === 0
                ?
                <b>Không có bình luận nào</b>
                :
                comments.map(comment=>
                  <Fragment key={comment._id}>
                    <Row >
                      <Col sm="1">
                        <img src={comment.user.photo} alt="avatar" style={styles.bigAvatar}/>
                      </Col>
                      <Col>
                        <b>{comment.user.name} </b>
                        <small style={{marginLeft:20, color:'#A8A8A8'}}>
                          <Moment format="HH:mm [ngày] DD [thg] MM, YYYY">
                            {comment.created}
                          </Moment>
                        </small>
                        <br/>
                        {
                          comment.text.split('\n').map((itemChild, key) => {
                            return <span key={key}>{itemChild}<br/></span>
                          })
                        }
                      </Col>
                    </Row>
                    <br/>
                  </Fragment>
                )
              }
              </Fragment>
            }
          </ModalBody>
          <ModalFooter >
            <Input type="textarea" name="text" value={this.state.text} onChange={this.onChange} placeholder="Bình luận ..." />
            <Button className="btn-lg" onClick={this.onSubmit} style={{height:55}} color="primary"><i className="fa fa-paper-plane" aria-hidden="true"></i></Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang gửi bình luận</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

ExerciseComments.propTypes = {
  addComment: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success,
  comments: state.comments
});

export default withRouter(connect(mapStateToProps, { addComment, getComments, clearErrors, clearSuccess, getEventSchedule })(ExerciseComments));  