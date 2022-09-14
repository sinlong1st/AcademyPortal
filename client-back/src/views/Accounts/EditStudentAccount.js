import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAccount, clearErrors, clearSuccess, editAccount } from '../../actions/accountActions';
import { 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardHeader, 
  Form, 
  FormGroup, 
  Label, 
  InputGroup, 
  InputGroupAddon, 
  InputGroupText, 
  Input, 
  Button,
  Modal,
  ModalBody,
  Alert
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty'

class EditStudentAccount extends Component {
  constructor() {
    super();
    this.state = {
      name: '', 
      email: '', 
      phone: '', 
      code: '', 
      idCard: '',
      loading: true,
      errors: {},
      isShowSuccess: false,
      isLoading: false
    };
  }

  componentDidMount = () => {
    this.props.getAccount(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts) {
      const { account, loading } = nextProps.accounts
      this.setState({
        name: account.name, 
        email: account.email, 
        phone: account.phone, 
        code: account.code, 
        idCard: account.idCard,
        loading
      })
    }

    if (nextProps.success.mes === "Thay đổi thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess();
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getAccount(this.props.match.params.id);
  }

  handleChange = name => event => {
    const value = event.target.value
    this.setState({ [name]: value })
  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({isLoading: true})
    const accountData = {
      code: this.state.code,
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      idCard: this.state.idCard
    };
    this.props.editAccount(this.props.match.params.id, accountData);
    this.props.clearErrors();
  }

  render() {
    const { loading, errors } = this.state
    return (
      <div className="animated fadeIn">
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B'/>
          :
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <i className="fa fa-edit"></i><b>Chỉnh sủa thông tin tài khoản</b>
                </CardHeader>
                <CardBody>
                  <Form className="form-horizontal" id="editform" onSubmit={this.onSubmit}>

                    <FormGroup>
                      <Label>Mã số</Label>
                      <div className="controls">
                        <InputGroup className="input-prepend">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="fa fa-pencil"></i></InputGroupText>
                          </InputGroupAddon>
                          <Input size="16" type="text" value={this.state.code} onChange={this.handleChange('code')} spellCheck='false'/>
                        </InputGroup>
                        {errors.code && <Alert color="danger">{errors.code}</Alert>}
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <Label>Họ và Tên</Label>
                      <div className="controls">
                        <InputGroup className="input-prepend">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="icon-user"></i></InputGroupText>
                          </InputGroupAddon>
                          <Input size="16" type="text" value={this.state.name} onChange={this.handleChange('name')} spellCheck='false'/>
                        </InputGroup>
                        {errors.name && <Alert color="danger">{errors.name}</Alert>}
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <Label>Email</Label>
                      <div className="controls">
                        <InputGroup className="input-prepend">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="fa fa-envelope"></i></InputGroupText>
                          </InputGroupAddon>
                          <Input size="16" type="text" value={this.state.email || ''} onChange={this.handleChange('email')} spellCheck='false'/>
                        </InputGroup>
                        {errors.email && <Alert color="danger">{errors.email}</Alert>}
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <Label>Chứng minh nhân dân</Label>
                      <div className="controls">
                        <InputGroup className="input-prepend">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="fa fa-id-card"></i></InputGroupText>
                          </InputGroupAddon>
                          <Input size="16" type="text" value={this.state.idCard || ''} onChange={this.handleChange('idCard')} spellCheck='false'/>
                        </InputGroup>
                        {errors.idCard && <Alert color="danger">{errors.idCard}</Alert>}
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <Label>Số điện thoại</Label>
                      <div className="controls">
                        <InputGroup className="input-prepend">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="icon-phone"></i></InputGroupText>
                          </InputGroupAddon>
                          <Input size="16" type="text" value={this.state.phone || ''} onChange={this.handleChange('phone')} spellCheck='false'/>
                        </InputGroup>
                        {errors.phone && <Alert color="danger">{errors.phone}</Alert>}
                      </div>
                    </FormGroup>

                    <Button type="submit" color="primary" onClick={this.onSubmit}>Lưu thay đổi</Button>
                  </Form>
                </CardBody>
                
              </Card>
            </Col>
          </Row>       
        }
        <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Thay đổi thành công!"
          show={this.state.isShowSuccess}
          onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang lưu thay đổi</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>   
      </div>
    )
  }
}

const mapStateToProps = state => ({
  success: state.success,
  errors: state.errors,
  accounts: state.accounts  
});
export default connect(mapStateToProps, { getAccount, clearSuccess, clearErrors, editAccount })(EditStudentAccount); 