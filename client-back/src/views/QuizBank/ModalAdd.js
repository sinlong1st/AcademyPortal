import React, { Component,Fragment } from 'react';
import {  
  Button, 
  Modal,
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  FormGroup,
  Col,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import { addCategory, clearSuccess, clearErrors, getQuizBank } from '../../actions/quizbankActions'

class ModalAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSuccess: false,
      category: '',
      errors:{}
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
      category: ''
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const categoryData = {
      category: this.state.category,
    };
    this.props.addCategory(categoryData);
    this.setState({ isLoading: true });
    this.props.clearErrors();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {

    if(!isEmptyObj(nextProps.errors))
    {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }
    this.setState({ errors: nextProps.errors})

    if (nextProps.success.mes === "Thêm danh mục thành công") {
      this.setState({
        isShowSuccess: true,
        category: '',
        isLoading: false
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      modal: false,
    })
    this.props.clearSuccess();
    this.props.getQuizBank();
  }

  render() {
    const { errors } = this.state;
    
    return (
      <Fragment>
        <Button color="danger" onClick={this.toggleLarge} className="mr-1">Tạo danh mục</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-danger modal-lg'>
          <ModalHeader toggle={this.toggleLarge}>Thêm danh mục mới</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col md="4">
                <Label>Tiêu đề danh mục</Label>
              </Col>
              <Col>
                <Input type="text" name="category" value={this.state.category} onChange={this.onChange} spellCheck="false" placeholder="Tiêu đề danh mục"/> 
              </Col>
            </FormGroup>
            {errors.category && <Alert color="danger">{errors.category}</Alert>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>Thêm</Button>{' '}
            <Button color="secondary" onClick={this.toggleLarge}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm danh mục thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { addCategory, clearSuccess, clearErrors, getQuizBank })(ModalAdd);  