import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { deleteQuiz, clearSuccess, clearErrors } from '../../actions/quizbankActions';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';

class DeleteQuiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      confirmbox: false
    };
  }

  openConfirm = e => {
    e.preventDefault();

    this.setState({
      confirmbox: !this.state.confirmbox
    });
  }

  onCancel = e =>{
    this.setState({
      confirmbox: false
    });
  }

  onConfirm = () =>{
    this.props.deleteQuiz(this.props.match.params.id, this.props.quizId)
    this.setState({
      confirmbox: false,
      isLoading: true
    });
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.success.mes === "Xóa câu hỏi thành công") {
      this.setState({
        isLoading: false
      })
      this.props.clearSuccess()
    }
  }

  render() {
    return (
      <Fragment>
        <Button onClick={this.openConfirm} color="danger"  style={{ marginLeft: 10 }}>Xóa câu hỏi</Button>

        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xóa</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          custom
          showCancel
          confirmBtnText="Có"
          cancelBtnText="Không"
          confirmBtnBsStyle="primary"
          cancelBtnBsStyle="default"
          title="Bạn có chắc muốn xóa?"
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          show={this.state.confirmbox}
        >
        </SweetAlert>
      </Fragment>
      
    );
  }
}

const mapStateToProps = state => ({
  success: state.success,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { deleteQuiz, clearSuccess, clearErrors })(DeleteQuiz));
