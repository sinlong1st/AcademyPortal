import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInfrastructureById, clearSuccess, clearErrors, editInfrastructure, getInfrastructure } from '../../actions/infrastructureAction';
import { ListGroup, ListGroupItem, Card, CardBody, Form, Button, FormGroup, Label, Input, Alert, Row, Col, Modal, ModalBody } from 'reactstrap';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import isEmptyObj from '../../validation/is-empty';
import Geocode from "react-geocode";
import config from '../../config';
import NoImg from '../../assets/img/NoImg.png';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
Geocode.setApiKey(config.KEY_API_MAP + '&language=vi');
Geocode.enableDebug();

class EditInfrastructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      isLoading: false,
      name: '',
      address: '',
      addressFormat: '',
      phone: '',
      email: '',
      city: '',
      images: [],
      mapPosition: {
        lat: 10.7624176,
        lng: 106.6811968
      },
      isShowSuccess: false,
      onMap: false
    };
  }

  componentDidMount = () => {
    this.props.getInfrastructureById(this.props.match.params.id);
    this.props.clearErrors();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.infrastructure) {
      const { infrastructure, loading } = nextProps.infrastructure
      this.setState({
        address: infrastructure.address,
        addressFormat: infrastructure.address,
        city: infrastructure.city,
        email: infrastructure.email,
        mapPosition: infrastructure.mapPosition,
        name: infrastructure.name,
        phone: infrastructure.phone,
        images: infrastructure.images? infrastructure.images : [],
        loading
      });
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false });
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.mes === "Chỉnh sửa cơ sở thành công") {
      this.setState({
        isShowSuccess: true,
        isLoading: false
      })
      this.props.clearSuccess();
    }

  }

  onSubmit = e => {
    e.preventDefault();
    this.setState({ errors: {} });

    Geocode.fromAddress(this.state.address).then(
      response => {
        if(response.results[0]) {
          let mapPosition = response.results[0].geometry.location;
          let city = this.getCity(response.results[0].address_components);
          let addressFormat = response.results[0].formatted_address;
          const infrastructureData = {
            name: this.state.name,
            address: addressFormat,
            phone: this.state.phone,
            email: this.state.email,
            images: this.state.images,
            mapPosition: mapPosition,
            city: city
          };
          this.props.clearErrors();
          this.props.editInfrastructure(this.props.match.params.id, infrastructureData);
          this.setState({isLoading: true});
        }
      },
      error => {
        let errors = {}
        errors.address = 'Địa chỉ không hợp lệ'
        this.setState({ errors });
      }
    );
  }

  getCity = (addressArray) => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };

  hideAlertSuccess(){
    this.setState({ isShowSuccess: false });
    this.props.getInfrastructureById(this.props.match.params.id);
    this.props.getInfrastructure();
  }

  checkAddress = () =>{
    this.setState({ errors: {} });
    Geocode.fromAddress(this.state.address).then(
      response => {
        if(response.results[0]) {
          const { lat, lng } = response.results[0].geometry.location;
          const city = this.getCity(response.results[0].address_components);
          const addressFormat = response.results[0].formatted_address;
          this.setState({
            addressFormat,
            mapPosition: {
              lat: lat,
              lng: lng
            },
            city: city
          })
        }
        else {
          let errors = {}
          errors.address = 'Không định dạng được'
          this.setState({ errors });
        }
      },
      error => {
        let errors = {}
        errors.address = 'Địa chỉ không hợp lệ'
        this.setState({ errors });
      }
    );
  }

  map=()=>{
    this.setState({
      onMap: !this.state.onMap
    })
  }

  showWidget =()=>{
    let widget = window.cloudinary.createUploadWidget({
      cloudName: config.CLOUD_NAME,
      uploadPreset: config.UPLOAD_PERSET
    },(err, result)=>
    {
      if(result.event === 'success'){
        const file = {
          id: result.info.public_id,
          name: result.info.original_filename,
          url: result.info.secure_url,
          thumbnail: result.info.thumbnail_url
        } 
        this.setState(prevState => ({
          images: [...prevState.images, file]
        }))
      }
    })
    widget.open()
  }

  delete(file){
    const images = this.state.images.filter(i => i.id !== file.id)
    this.setState({images})
  }

  render() {
    const { loading, errors } = this.state

    var listFile = '';
    if(isEmptyObj(this.state.images))
    {
      listFile = <ListGroupItem>Không có tệp được chọn</ListGroupItem>
    }else{
      listFile = this.state.images.map(file=>
        <ListGroupItem key={file.id}>
          <Row>
            <Col xs="10">
              {
                file.thumbnail
                ?
                <img src={file.thumbnail} alt=""/> 
                :
                <img src={NoImg} style={{width:47}} alt=""/> 
              }  
              <a href={file.url} style={{marginLeft:10}}> {file.name} </a>
            </Col>
            <Col >
              <Button color="danger" onClick={this.delete.bind(this, file)}><i className="fa fa-trash-o"></i></Button>
            </Col>
          </Row>
        </ListGroupItem>
      )
    }

    const AsyncMap = withScriptjs(
      withGoogleMap(
        props => (
          <GoogleMap 
            google={props.google}
            defaultZoom={15}
            defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
          >
            {/*Marker*/}
            <Marker google={props.google}
              name={'Dolores park'}
              draggable={true}
              position={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
            />
            <Marker />
            {/* InfoWindow on top of marker */}
            <InfoWindow
              onClose={this.onInfoWindowClose}
              position={{ lat: (this.state.mapPosition.lat + 0.0018), lng: this.state.mapPosition.lng }}
            >
              <div>
                <span style={{ padding: 0, margin: 0 }}>{this.state.addressFormat}</span>
              </div>
            </InfoWindow>
          </GoogleMap>
        )
      )
    );

    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <div style={{ marginTop: 20 }}>
              {
                loading
                ?
                <ReactLoading type='bars' color='#05386B' />
                :
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label>Tên cơ sở</Label>
                    <Input type="text" name='name' value={this.state.name} onChange={this.onChange} spellCheck='false'/>
                  </FormGroup>
                  {errors.name && <Alert color="danger">{errors.name}</Alert>}

                  <FormGroup>
                    <Label>Số điện thoại</Label>
                    <Input type="text" name='phone' value={this.state.phone} onChange={this.onChange} spellCheck='false'/>
                  </FormGroup>
                  {errors.phone && <Alert color="danger">{errors.phone}</Alert>}

                  <FormGroup>
                    <Label>Email</Label>
                    <Input type="text" name='email' value={this.state.email} onChange={this.onChange} spellCheck='false'/>
                  </FormGroup>
                  {errors.email && <Alert color="danger">{errors.email}</Alert>}

                  <Label>Hình ảnh cơ sở</Label>
                  <FormGroup row>
                    <Col md="2">
                      <Button color="danger" onClick={this.showWidget}>Thêm hình ảnh</Button>
                    </Col>
                    <Col md="10" style={{ wordWrap: 'break-word' }}>
                      <ListGroup>
                        {listFile}
                      </ListGroup>
                    </Col>
                  </FormGroup>
                  
                  <FormGroup>
                    <Row>
                      <Col md={5}>
                        <Label>Địa chỉ</Label>
                        <Input rows="2" type="textarea" name='address' value={this.state.address} onChange={this.onChange} spellCheck='false'/>
                      </Col>
                      <Col md={5}>
                        <Label>Địa chỉ được định dạng</Label>
                        <Input rows="2" type="textarea" name='addressFormat' value={this.state.addressFormat} readOnly spellCheck='false'/>
                      </Col> 
                      <Col>
                        <Button color='danger' onClick={this.checkAddress} style={{marginTop:10, width: 140}}>
                          <i className="fa fa-check-circle" aria-hidden="true"></i>  Kiểm tra địa chỉ
                        </Button>
                        <Button color='primary' style={{marginTop:10, width: 140}} onClick={this.map}>
                          <i className="fa fa-map" aria-hidden="true"></i>
                          {
                            this.state.onMap
                            ?
                            ' Đóng bản đồ'
                            :
                            ' Xem bản đồ'
                          }
                        </Button>
                      </Col> 
                    </Row>
                    {
                      this.state.onMap
                      ?
                      <AsyncMap
                        googleMapURL={'https://maps.googleapis.com/maps/api/js?key=' + config.KEY_API_MAP + '&libraries=places'}
                        loadingElement={
                          <div style={{ height: `100%` }} />
                        }
                        containerElement={
                          <div style={{ height: 300, marginTop: 20 }} />
                        }
                        mapElement={
                          <div style={{ height: `100%` }} />
                        }
                      />
                      :
                      null
                    }
                  </FormGroup>
                  {errors.address && <Alert color="danger">{errors.address}</Alert>}

                  <Button color="success" onClick={this.onSubmit} block> <b>Chỉnh sửa cơ sở trung tâm</b></Button>
                </Form>
              }
            </div>
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Chỉnh sửa cơ sở thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success,
  infrastructure: state.infrastructure
});

export default connect(mapStateToProps, { getInfrastructureById, clearSuccess, clearErrors, editInfrastructure, getInfrastructure })(EditInfrastructure);  