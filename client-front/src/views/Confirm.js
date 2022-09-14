import React, { Component, Fragment } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { confirmMail, clearSuccess } from '../actions/authActions';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';

class Confirm extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isConfirmed: false
    };
  }

  componentDidMount() {
    this.props.confirmMail(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Tài khoản mail đã được kích hoạt') {
      this.setState({ isLoading: false })
      this.props.clearSuccess()
    }
    if (nextProps.success.mes === 'Xác nhận thành công') {
      this.setState({ isLoading: false, isConfirmed: true })
      this.props.clearSuccess()
    }
  }


  render() {
    const { isLoading, isConfirmed } = this.state
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            {
              isLoading
              ?
              <ReactLoading type='spinningBubbles' color='#05386B' />
              :
              <Fragment>
                {
                  isConfirmed
                  ?
                  <Col md="6">
                    <h1>Xác nhận mail</h1>
                    <div style={{textAlign: 'center', fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold'}}>
                      Chúc mừng! Bạn đã xác nhận mail thành công.
                    </div>         
                    <Button color="primary" size="lg" block onClick={()=>this.props.history.push(`/login`)}>
                      <span style={{fontFamily:'Baloo Bhai, cursive', fontSize:25}}>
                        ĐĂNG NHẬP
                      </span>
                    </Button>
                  </Col>
                  :
                  <Col md="6">
                    <h1>Mail  của bạn đã được xác nhận</h1>    
                    <Button color="primary" size="lg" block onClick={()=>this.props.history.push(`/login`)}>
                      <span style={{fontFamily:'Baloo Bhai, cursive', fontSize:25}}>
                        ĐĂNG NHẬP
                      </span>
                    </Button>
                  </Col>
                }
              </Fragment>
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

export default connect(mapStateToProps, { confirmMail, clearSuccess })(Confirm);
