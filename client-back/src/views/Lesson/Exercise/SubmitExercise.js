import React, { Component,Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Col, FormGroup, ListGroup, ListGroupItem, Alert, Row, Container, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { addSubmission, getSubmission, download, deleteSubmission, clearErrors, clearSuccess } from '../../../actions/exerciseActions';
import { getMySubmission } from '../../../actions/submissionActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import ReactDropzone from "react-dropzone";
import isEmptyObj from '../../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';

class SubmitExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachFile: null,
      large: false,
      errors: {},
      isLoading: false,
      loading: false,
      submission: '',
      isShowFail: false,
      wrongPassword: true,
      password: ''
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});
    if (nextProps.success.mes === "Nộp bài tập thành công!") {
      this.setState({
        isLoading: false,
        attachFile: null,
        fileName: ''
      })
      this.props.clearSuccess();
      this.props.getMySubmission(this.props.exercise._id);
    }

    const { submission, loading } = nextProps.submission
    this.setState({ 
      submission,
      loading 
    });

  }


  onDrop = (files) => {
    var now = new Date();
    var deadline = new Date(this.props.exercise.deadline);
    if(deadline.getTime() >= now.getTime())
    {
      let file = files[0];
    
      this.setState({
        attachFile: file,
        fileName: file.name
      });
    }else{
      this.setState({
        isShowFail: true
      })
    }
  }

  onsubmit = (e) => {
    e.preventDefault();
    var now = new Date();
    var deadline = new Date(this.props.exercise.deadline);
    if(deadline.getTime() >= now.getTime())
    {
      const data = {
        file: this.state.attachFile,
      }
      this.props.clearErrors();
      this.props.addSubmission(data, this.props.exercise._id);
      this.setState({
        isLoading: true,
      })
    }else{
      this.setState({
        isShowFail: true
      })
    }

  }

  download = (e) => {
    e.preventDefault();
    this.props.download(this.props.exercise._id, this.props.submission.submission);
  }

  deleteSubmission = (e) => {
    e.preventDefault();
    var now = new Date();
    var deadline = new Date(this.props.exercise.deadline);
    if(deadline.getTime() >= now.getTime())
    {
      this.props.deleteSubmission(this.props.exercise._id);
    }else{
      this.setState({
        isShowFail: true
      })
    }

  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onOpenModal = e => {
    e.preventDefault();
    this.setState({
      exerciseId: this.props.exercise._id
    })
    this.props.getSubmission(this.props.exercise._id);
    this.setState({
      large: !this.state.large,
    });
  }

  hideAlertFail = () =>{
    this.setState({
      isShowFail: false
    })
  }

  render() {
    const { errors, submission, loading } = this.state;
    return (
      <Fragment>
            <Button color="primary" onClick={this.onOpenModal} >Nộp bài tập</Button>
            <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg modal-primary'>
              <ModalHeader  toggle={this.toggleLarge}>Nộp bài tập</ModalHeader>
              <ModalBody>
                <Container>
                  <Row className="justify-content-center">
                    <ReactDropzone onDrop={this.onDrop} >
                        {
                          this.state.fileName
                          ?
                          <div>
                            <b >File đã chọn</b>
                            <span className='max-lines'>
                              {this.state.fileName}
                            </span>
                          </div>
                          :
                          <b>Thả file hoặc nhấn vào đây để chọn file</b>                        
                        }
                    </ReactDropzone>
                  </Row>
                </Container>

                <FormGroup row>
                  <Col xs="">
                    <Label style={{marginTop: 10, fontWeight:'bold'}}>Đã nộp</Label>
                  </Col>
                  <Col xs="9"> 
                    <ListGroup>
                      {
                        submission === ''
                        ? 
                        <ListGroupItem>
                          Chưa có bài nộp
                        </ListGroupItem>
                        :
                        <ListGroupItem action onClick={this.download} className='changeCursor'>
                          <div style={{color: 'blue'}}>
                            {submission}
                          </div>
                        </ListGroupItem>
                      }                    
                    </ListGroup>
                  </Col>
                  <Col> 
                    <Button style={{marginTop: 5}} color="danger" onClick={this.deleteSubmission}><i className="fa fa-trash"></i></Button>
                  </Col>
                </FormGroup>
                {errors.file && <Alert color="danger">{errors.file}</Alert>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={this.onsubmit}>Nộp</Button>{' '}
                <Button color="secondary" onClick={this.toggleLarge}>Hủy</Button>
              </ModalFooter>
            </Modal>
            {/* Phần loading */}
            <Modal isOpen={loading} className='modal-sm' >
              <ModalBody className="text-center">
                <h3>Loading</h3>
                <br/>
                <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
              </ModalBody>
            </Modal>
            {/* Phần thông báo nộp bài thành công */}
            <Modal isOpen={this.state.isLoading} className='modal-sm' >
              <ModalBody className="text-center">
                <h3>Đang xử lý</h3>
                <br/>
                <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
              </ModalBody>
            </Modal>
            <SweetAlert
                danger
                confirmBtnText="OK"
                confirmBtnBsStyle="danger"
                title="Hết hạn chỉnh sửa bài tập"
                show={this.state.isShowFail}
                onConfirm={this.hideAlertFail}>
            </SweetAlert>
          </Fragment>
    )
  }
}

SubmitExercise.propTypes = {
  addSubmission: PropTypes.func.isRequired,
  submission: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  submission: state.submission,
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { addSubmission, getSubmission, download, deleteSubmission, clearErrors, getMySubmission, clearSuccess })(SubmitExercise)); 