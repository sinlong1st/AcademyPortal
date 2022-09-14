import React, { Component } from 'react';
import { Modal, ModalBody, Button, Input, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { enrollCourse, getCourseInfo, clearSuccess } from '../actions/courseActions';
import { createOrder, clearUrl } from '../actions/userActions';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import isEmptyObj from '../validation/is-empty';

class Payment extends Component {
  constructor() {
    super();
    this.state = {
      isShowSuccess: false,
      isLoading: false,
      bankCode: '',
      pay_url: ''
    };
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.success.mes === 'Ghi danh thành công vào khóa học') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
    }

    if (!isEmptyObj(nextProps.users.pay_url)) {
      // window.vnpay.open({width: 768, height: 600, url: nextProps.users.pay_url});
      window.location.href = nextProps.users.pay_url
      this.props.clearUrl();
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getCourseInfo(this.props.match.params.courseId);
  }
  
  createOrder =()=>{
    const paymentData = {
      amount: Number(this.props.fee),
      bankCode: this.state.bankCode,
      courseId: this.props.match.params.courseId,
    }
    this.props.createOrder(paymentData)
  }

  changeBank = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <FormGroup>
          <Input type="select" name="bankCode" onChange={this.changeBank}>
            <option value="">Chọn ngân hàng</option>
            <option value="NCB"> Ngân hàng NCB</option>
            <option value="AGRIBANK"> Ngân hàng Agribank</option>
            <option value="SCB"> Ngân hàng SCB</option>
            <option value="SACOMBANK">Ngân hàng SacomBank</option>
            <option value="EXIMBANK"> Ngân hàng EximBank</option>
            <option value="MSBANK"> Ngân hàng MSBANK</option>
            <option value="NAMABANK"> Ngân hàng NamABank</option>
            <option value="VNMART"> Ví điện tử VnMart</option>
            <option value="VIETINBANK">Ngân hàng Vietinbank</option>
            <option value="VIETCOMBANK"> Ngân hàng VCB</option>
            <option value="HDBANK">Ngân hàng HDBank</option>
            <option value="DONGABANK"> Ngân hàng Dong A</option>
            <option value="TPBANK"> Ngân hàng TPBank</option>
            <option value="OJB"> Ngân hàng OceanBank</option>
            <option value="BIDV"> Ngân hàng BIDV</option>
            <option value="TECHCOMBANK"> Ngân hàng Techcombank</option>
            <option value="VPBANK"> Ngân hàng VPBank</option>
            <option value="MBBANK"> Ngân hàng MBBank</option>
            <option value="ACB"> Ngân hàng ACB</option>
            <option value="OCB"> Ngân hàng OCB</option>
            <option value="IVB"> Ngân hàng IVB</option>
            <option value="VISA"> VISA/MASTER</option>
          </Input>
        </FormGroup>
        <Button onClick={this.createOrder}>
          Thanh toán
        </Button>
        
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Ghi danh thành công vào khóa học"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  success: state.success,
  users: state.users
});

export default withRouter(connect(mapStateToProps, { enrollCourse, getCourseInfo, clearSuccess, createOrder, clearUrl })(Payment));
