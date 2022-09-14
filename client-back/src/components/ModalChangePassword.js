import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,Form,FormGroup,Input,Label,Alert } from 'reactstrap';
import { changePassword } from '../actions/profileActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import isEmptyObj from '../validation/is-empty';

class ModalChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      opassword: '',
      password: '',
      password2: '',
      errors: {},
      isShowSuccess: false,
      isLoading: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const passwordData = {
      opassword: this.state.opassword,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.changePassword(passwordData, this.props.history);
    this.setState({isLoading: true});
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.mes === "Thay đổi password thành công") {
      this.setState({
        isShowSuccess: true,
        opassword: '',
        password: '',
        password2: '',
        isLoading: false
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      modal: false,
    })
  }

  render() {
    const { errors } = this.state;
    return (
      <Fragment>
        <Button onClick={this.toggle} color="danger" className="btn-pill float-right" ><i className="fa fa-key"></i> Thay đồi mật khẩu</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Thay đổi mật khẩu</ModalHeader>
          <ModalBody>
            <Form action="" method="post">
              <FormGroup>
                <Label htmlFor="opassword">Password hiện tại</Label>
                <Input type="password" id="opassword" name="opassword" value={this.state.opassword} onChange={this.onChange} placeholder="Nhập password hiện tại.." />
              </FormGroup>
              {errors.opassword && <Alert color="danger">{errors.opassword}</Alert>}
              <FormGroup>
                <Label htmlFor="password">Password mới</Label>
                <Input type="password" id="password" name="password" value={this.state.password} onChange={this.onChange} placeholder="Nhập password mới.." />
              </FormGroup>
              {errors.password && <Alert color="danger">{errors.password}</Alert>}
              <FormGroup>
                <Label htmlFor="password">Xác nhận lại password mới</Label>
                <Input type="password" id="password2" name="password2" value={this.state.password2} onChange={this.onChange} placeholder="Xác nhận.." />
              </FormGroup>
              {errors.password2 && <Alert color="danger">{errors.password2}</Alert>}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>Thay đổi</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thay đổi password thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thay đổi</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
      
    );
  }
}

ModalChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { changePassword })(ModalChangePassword);
