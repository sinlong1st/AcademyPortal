import React, { Component } from 'react';
import {Modal,ModalBody,Alert, Card, CardBody, CardFooter, CardHeader, Col, Row, Button, Form, FormGroup, InputGroupAddon, Label, InputGroup, InputGroupText, Input} from 'reactstrap';
import { connect } from 'react-redux';
import { editProfile, getCurrentProfile, clearErrors, clearSuccess } from '../../actions/profileActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import ModalChangePasword from '../../components/ModalChangePassword';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty'
import ReactDropzone from "react-dropzone";
import CKEditor from 'ckeditor4-react';

const styles = {
  bigAvatar: {
    width: 200,
    height: 200,
    margin: 'auto',
    borderRadius: 100
  },
  input: {
    fontSize: 10
  }
}
class EditProfileTeacher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      name:'',
      email:'',
      photo: '',
      phone: '',
      idCard: '',
      teacherDegree: '',
      teacherIntro: '',
      isShowSuccess: false,
      errors:{},
      isLoading: false,
      invalidImg: false
    };
    this.onEditorChange = this.onEditorChange.bind( this );
  }

  handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    this.setState({ [name]: value })
  }
  
  componentDidMount = () => {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile
      this.setState({
        name: profile.name, 
        email: profile.email, 
        phone: profile.phone, 
        photo: profile.photo, 
        code: profile.code, 
        idCard: profile.idCard,
        teacherDegree: profile.teacherDegree ? profile.teacherDegree : '',
        teacherIntro: profile.teacherIntro ? profile.teacherIntro : ''
      })

    }

    if (nextProps.success.mes === "Thay ?????i th??nh c??ng") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess();
    }

  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({isLoading: true})
    const profileData = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      idCard: this.state.idCard,
      teacherDegree: this.state.teacherDegree,
      teacherIntro: this.state.teacherIntro
    };
    this.props.editProfile(profileData, this.state.file);
    this.props.clearErrors();
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  onDrop = (files) => {
    if(files[0] === undefined)
    {
      this.setState({
        invalidImg: true
      })
    }else{
      let file = files[0]
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          photo: reader.result,
          invalidImg: false
        });
      }
      reader.readAsDataURL(file)
    }
    this.setState({
      file: files[0]
    })
  }

  onEditorChange( evt ) {
    this.setState({
      teacherIntro: evt.editor.getData()
    });
  }

  render() {
    const { errors } = this.state;
    console.log(this.state.teacherIntro)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <i className="fa fa-edit"></i><b>Ch???nh s???a th??ng tin c?? nh??n</b>
              </CardHeader>
              <CardBody>
                <Form className="form-horizontal" id="editform" onSubmit={this.onSubmit}>

                  <FormGroup>
                    <Label>M?? s???</Label>
                    <div className="controls">
                      <InputGroup className="input-prepend">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText><i className="fa fa-pencil"></i></InputGroupText>
                        </InputGroupAddon>
                        <Input size="16" type="text" value={this.state.code || ''} disabled/>
                      </InputGroup>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>H??? v?? T??n</Label>
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
                    <Label>Ch???ng minh nh??n d??n</Label>
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
                    <Label>S??? ??i???n tho???i</Label>
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

                  <FormGroup>
                    <Label>H???c v???</Label>
                    <div className="controls">
                      <InputGroup className="input-prepend">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText><i className="fa fa-graduation-cap"></i></InputGroupText>
                        </InputGroupAddon>
                        <Input size="16" type="text" value={this.state.teacherDegree || ''} onChange={this.handleChange('teacherDegree')} spellCheck='false'/>
                      </InputGroup>
                      {errors.teacherDegree && <Alert color="danger">{errors.teacherDegree}</Alert>}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Gi???i thi???u b???n th??n</Label>
                    <CKEditor data={this.state.teacherIntro} onChange={this.onEditorChange} />
                    {errors.teacherIntro && <Alert color="danger">{errors.teacherIntro}</Alert>}
                  </FormGroup>

                  <hr/>
                  <Label htmlFor="prependedInput">H??nh ?????i di???n</Label>
                  <br/>
                  <Row>
                    <Col xs="4">
                      <div className="preview-image">
                        <img src={this.state.photo} alt="avatar" style={styles.bigAvatar}/>
                      </div>
                    </Col>
                    <Col>
                      <ReactDropzone accept="image/*" onDrop={this.onDrop} >
                        Th??? avatar c???a b???n v??o ????y!
                      </ReactDropzone>
                    </Col>
                  </Row>
                  {
                    this.state.invalidImg === true
                    ?
                    <div>
                      <br/>
                      <Alert color="danger">H??nh ???nh kh??ng h???p l???</Alert>
                    </div> 
                    : null
                  }
                </Form>
                <div >
                  <ModalChangePasword />
                </div>
              </CardBody>
              <CardFooter>
                <Button type="submit" color="primary" onClick={this.onSubmit}>L??u thay ?????i</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thay ?????i th??nh c??ng!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>??ang l??u thay ?????i</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors,
  success: state.success
});
export default connect(mapStateToProps, { editProfile, getCurrentProfile, clearErrors, clearSuccess })(EditProfileTeacher); 
