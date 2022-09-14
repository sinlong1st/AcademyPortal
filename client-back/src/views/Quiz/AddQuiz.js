import React, { Component } from 'react';
import SubmitValidationForm from '../../components/Quiz/Add/index';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import { Modal, ModalBody, Button } from 'reactstrap';
import { connect } from 'react-redux';

class QuizAddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: 300,
      isShowSuccess: false,
      isLoading: false,
      errors: {}
    };
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push('/quiz')
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.data === "Thêm bài kiểm tra thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }
  }
  
  toAddQuizCSV = () =>{
    this.props.history.push('/quiz/add/csv')
  }

  render() {
    return (
      <div>
        <Button color="danger" onClick={this.toAddQuizCSV}>Nhập file CSV</Button>
        <SubmitValidationForm/>
        <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Thêm bài kiểm tra thành công!"
          show={this.state.isShowSuccess}
          onConfirm={this.hideAlertSuccess.bind(this)}
          onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm bài kiểm tra</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
    
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { })(QuizAddPage);
