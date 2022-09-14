import React, { Component } from 'react';
import {  Container, Row, Button } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
// import isEmptyObj from '../../validation/is-empty';
// import SweetAlert from 'react-bootstrap-sweetalert';
import { start, clearSuccess } from '../../actions/userActions'

class ForgetCP extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isShowSuccess: false
    };
  }

  componentDidMount() {
    this.props.start();
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.success.mes === 'Đã tạo tài khoản') {
      this.setState({ isShowSuccess: false, isLoading: false })
      this.props.clearSuccess()
    }

    if (nextProps.success.mes === 'Tạo tài khoản thành công') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
    }

  }
  
  render() {
    const { isLoading, isShowSuccess } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Button color="danger" style={{marginBottom: 20}} onClick={()=> this.props.history.push('/login')}>
            <i className="fa fa-sign-in" aria-hidden="true"></i>
            <b> Đăng nhập</b>
          </Button>
          <Row className="justify-content-center">
            {
              isLoading
              ?
              <ReactLoading type='spinningBubbles' color='#05386B' />
              :
              <div>
                {
                  isShowSuccess
                  ?
                  <div>
                    <div style={{textAlign: 'center', fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold'}}>
                      Đã tạo tài khoản admin và giám đốc
                    </div> 
                    <p style={{fontWeight:'bold'}}>
                      Tài khoản admin<br/>
                      Mã đăng nhập : admin<br/>
                      Mật khẩu : 123456
                    </p>
                    <p style={{fontWeight:'bold'}}>
                      Tài khoản giám đốc<br/>
                      Mã đăng nhập : giamdoc<br/>
                      Mật khẩu : 123456
                    </p>
                  </div>
                  :
                  <div>
                    <div style={{textAlign: 'center', fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold'}}>
                      Tài khoản admin và giám đốc đã được tạo
                    </div> 
                  </div>
                }
              </div>
            }
          </Row>
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  success: state.success
});

export default connect(mapStateToProps, { start, clearSuccess })(ForgetCP);
