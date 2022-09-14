import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Form, Button, FormGroup, Label, Input, Modal, Alert, ModalBody, Container } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import CKEditor from 'ckeditor4-react';
import ReactPlayer from 'react-player'
import { editSchool, clearErrors, clearSuccess, getSchool } from '../../actions/schoolActions';
import isEmptyObj from '../../validation/is-empty';
import { FacebookProvider, Page } from 'react-facebook';

class SchoolInfo extends Component {
  constructor() {
    super();
    this.state = {
      isShowSuccess: false,
      isLoading: false,
      errors: {},
      loading: true,
      name: '',
      shortIntro: '',
      address: '',
      phone: '',
      email: '',
      facebook: '',
      video: '',
      intro: ''
    };
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getSchool();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onEditorChange = (evt) => {
    this.setState( {
      intro: evt.editor.getData()
    });
  }

  componentDidMount(){
    this.props.getSchool();
  }

  componentWillReceiveProps(nextProps) {
    const { school, loading } = nextProps.school;
    this.setState({
      loading
    })
    if(!isEmptyObj(school))
    {
      this.setState({ 
        name: school.name,
        shortIntro: school.shortIntro,
        address: school.address,
        phone: school.phone,
        email: school.email,
        facebook: school.facebook,
        video: school.video,
        intro: school.intro
      });
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    if (nextProps.success.mes === "Chỉnh sửa thông tin thành công") {
      this.setState({
        isShowSuccess: true,
        isLoading: false
      })
      this.props.clearSuccess();
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const schoolData = {
      name: this.state.name,
      shortIntro: this.state.shortIntro,
      address: this.state.address,
      phone: this.state.phone,
      email: this.state.email,
      facebook: this.state.facebook,
      video: this.state.video,
      intro: this.state.intro
    };

    this.props.clearErrors();
    this.props.editSchool(schoolData);
    this.setState({isLoading: true});
    
  }

  render() {
    const { errors, loading } = this.state;

    return (
      <div className="animated fadeIn">
        <Card className="mx-4">
          <CardHeader>
           <strong>Quản lý trung tâm</strong>
          </CardHeader>
          <CardBody className="p-4">
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label>Tên trung tâm</Label>
                  <Input type="text" name='name' value={this.state.name} onChange={this.onChange}/>
                </FormGroup>
                {errors.name && <Alert color="danger">{errors.name}</Alert>}

                <FormGroup>
                  <Label>Giới thiệu ngắn</Label>
                  <Input rows="5" type="textarea" name='shortIntro' value={this.state.shortIntro} onChange={this.onChange}/>
                </FormGroup>
                {errors.shortIntro && <Alert color="danger">{errors.shortIntro}</Alert>}

                <FormGroup>
                  <Label>Địa chỉ</Label>
                  <Input rows="2" type="textarea" name='address' value={this.state.address} onChange={this.onChange}/>
                </FormGroup>
                {errors.address && <Alert color="danger">{errors.address}</Alert>}

                <FormGroup>
                  <Label>Số điện thoại</Label>
                  <Input type="text" name='phone' value={this.state.phone} onChange={this.onChange}/>
                </FormGroup>
                {errors.phone && <Alert color="danger">{errors.phone}</Alert>}

                <FormGroup>
                  <Label>Email</Label>
                  <Input type="text" name='email' value={this.state.email} onChange={this.onChange}/>
                </FormGroup>
                {errors.email && <Alert color="danger">{errors.email}</Alert>}

                <FormGroup>
                  <Label>Facebook</Label>
                  <Input type="text" name='facebook' value={this.state.facebook} onChange={this.onChange}/>
                  <Container>
                    {
                      this.state.facebook
                      ?
                      <FacebookProvider appId="978638978975725">
                        <Page href={this.state.facebook} tabs="timeline" />
                      </FacebookProvider>
                      :
                      null
                    }
                  </Container>
                </FormGroup>
                {errors.facebook && <Alert color="danger">{errors.facebook}</Alert>}

                <FormGroup>
                  <Label>Link video giới thiệu</Label>
                  <Input type="text" name='video' value={this.state.video} onChange={this.onChange}/>
                  <Container>
                    {
                      this.state.video
                      ?
                      <ReactPlayer url={this.state.video} controls/>
                      :
                      null
                    }
                  </Container>
                </FormGroup>
                {errors.video && <Alert color="danger">{errors.video}</Alert>}

                <FormGroup>
                  <Label>Giới thiệu về trung tâm</Label>
                  <CKEditor data={this.state.intro} onChange={this.onEditorChange} />
                </FormGroup>
                {errors.intro && <Alert color="danger">{errors.intro}</Alert>}

                <Button color="success" onClick={this.onSubmit} block> <b>Chỉnh sửa thông tin trung tâm</b></Button>
              </Form>
            }
          </CardBody>
        </Card>
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
          	title="Chỉnh sửa thông tin thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success,
  school: state.school
});

export default connect(mapStateToProps, { editSchool, clearErrors, clearSuccess, getSchool })(SchoolInfo);  