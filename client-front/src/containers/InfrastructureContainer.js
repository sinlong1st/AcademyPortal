import React, { Component, Fragment } from 'react';
import { Card, CardBody, CardHeader, Container, Row, Col, FormGroup, Button } from 'reactstrap';
import { connect } from 'react-redux';
import isEmptyObj from '../validation/is-empty';
import { getInfrastructure } from '../actions/infrastructureAction';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

import config from '../config';

Geocode.setApiKey(config.KEY_API_MAP);

class infrastrutureContainer extends Component {
  constructor() {
    super();
    this.state = {
      showMap: true,
      infrastructureList: [],
      infrastructure: {
        mapPosition: {
          lat: '10.762887',
          lng: '106.6822571'
        }
      }
    };
  }

  componentDidMount() {
    this.props.getInfrastructure();
  }

  componentWillReceiveProps(nextProps) {
    const { infrastructureList } = nextProps.infrastructure;
    if (!isEmptyObj(infrastructureList)) {
      this.setState({
        infrastructureList: infrastructureList,
        infrastructure: infrastructureList[0]
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      infrastructure: this.state.infrastructureList[e.target.value]
    })
  }

  showMap = () => {
    this.setState({
      showMap: true
    })
  }

  hideMap = () => {
    this.setState({
      showMap: false
    })
  }

  render() {
    const {
      infrastructureList,
      infrastructure,
      showMap
    } = this.state;
    let mapPosition = {
      'lat': typeof(infrastructure.mapPosition.lat) == 'string' ? parseFloat(infrastructure.mapPosition.lat) : infrastructure.mapPosition.lat,
      'lng': typeof(infrastructure.mapPosition.lng) == 'string' ? parseFloat(infrastructure.mapPosition.lng) : infrastructure.mapPosition.lng
    }
    const AsyncMap = withScriptjs(
      withGoogleMap(
        props => (
          <GoogleMap google={this.props.google}
            defaultZoom={15}
            defaultCenter={{ lat: mapPosition.lat, lng: mapPosition.lng }}
          >
            {/* For Auto complete Search Box */}
            {/*Marker*/}
            <Marker google={this.props.google}
              name={'Dolores park'}
              draggable={true}
              position={{ lat: mapPosition.lat, lng: mapPosition.lng }}
            />
            <Marker />
            {/* InfoWindow on top of marker */}
            <InfoWindow
              onClose={this.onInfoWindowClose}
              position={{ lat: (mapPosition.lat + 0.0018), lng: mapPosition.lng }}
            >
              <div>
                <span style={{ padding: 0, margin: 0 }}>{infrastructure.address}</span>
              </div>
            </InfoWindow>
          </GoogleMap>
        )
      )
    );
    console.log(infrastructure.images)
    return (
      <React.Fragment>
        <Container fluid style={{ marginBottom: 30, marginTop: 50 }}>
          <Row>
            <Col md={6}>
              <Card style={{height: 350}}>
                <CardHeader><b>Liên hệ</b> </CardHeader>
                <CardBody>
                  <Row className="justify-content-center">
                    <Button color='primary' className={showMap ? 'active': ''} onClick={this.showMap} style={{ marginRight: 10, width: 140, padding: 10 }}>
                      <i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;Xem Bản đồ
                    </Button>
                    <Button color='primary' className={!showMap ? 'active': ''}  onClick={this.hideMap} style={{ marginRight: 10, width: 140, padding: 10 }}>
                      <i className="fa fa-camera" aria-hidden="true"></i>&nbsp;Xem hình ảnh
                    </Button>
                  </Row>
                  <FormGroup style={{marginTop: 20}}>
                    <select value={this.state.filteredValue} onChange={this.handleChange} className="form-control">
                      {
                        infrastructureList.map((infrastructure, index) =>
                          <option key={index} value={index}>{infrastructure.name}</option>
                        )
                      }
                    </select>
                  </FormGroup>
                    <p><b>Địa điểm</b>: { infrastructure.name}</p>
                    <p><b>Địa chỉ</b>: { infrastructure.address}</p>
                    <p><b>Số điện thoại</b>: { infrastructure.phone}</p>
                    <p><b>Email</b>: { infrastructure.email}</p>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              {
                showMap 
                ?
                <AsyncMap
                  googleMapURL={'https://maps.googleapis.com/maps/api/js?key=' + config.KEY_API_MAP + '&libraries=places'}
                  loadingElement={
                    <div style={{ height: `100%` }} />
                  }
                  containerElement={
                    <div style={{ height: 350 }} />
                  }
                  mapElement={
                    <div style={{ height: `100%` }} />
                  }
                />
                :
                <Fragment>
                {
                  infrastructure.images === undefined
                  ?
                  <Card>
                    <CardBody style={{height: 350}}>
                      <Container>
                        <h4>Chưa cập nhật hình ảnh</h4>
                      </Container>
                    </CardBody>
                  </Card>
                  :
                  <Fragment>
                    {
                      infrastructure.images.length === 0
                      ?
                      <Card>
                        <CardBody style={{height: 350}}>
                          <Container>
                            <h4>Chưa cập nhật hình ảnh</h4>
                          </Container>
                        </CardBody>
                      </Card>
                      :
                      <AwesomeSlider style={{height: 350}}>
                      {
                        infrastructure.images.map((image) =>
                          <div style={{height: 350}} key={image._id} data-src={image.url} />
                        )
                      }
                      </AwesomeSlider>
                    }
                  </Fragment>
                }
              </Fragment>
              }
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  infrastructure: state.infrastructure
});

export default connect(mapStateToProps, { getInfrastructure })(infrastrutureContainer);  
