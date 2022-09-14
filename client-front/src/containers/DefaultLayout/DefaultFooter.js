import React, { Component } from 'react';
import { Container, Button, Row, Col } from 'reactstrap';
import { getSchool } from '../../actions/schoolActions';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty';
import ReactLoading from 'react-loading';

class DefaultFooter extends Component {
  constructor() {
    super();
    this.state = {
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
        address: school.address,
        phone: school.phone,
        email: school.email,
        facebook: school.facebook,
        video: school.video
      });
    }
  }

  render() {
    const {
      name,
      address,
      phone,
      email,
      facebook,
      video,
      loading
    } = this.state;
    return (
      <React.Fragment>
        {
          loading
          ?
          <ReactLoading type='bars' color='#0082c8'/>
          :
          <React.Fragment>
            <Container >
              <div style={{ fontSize:25, fontWeight:'bold', color: '#1E90FF' }}>{name}</div>
            </Container>
            <Container fluid style={{ marginBottom: 30}}>
              <Row>
                <Col xs={10} style={{ color: '#1E90FF'}}>
                  <div>Địa chỉ: {address}</div>
                  <div>Địện thoại: {phone}</div>
                  <div>Email: {email}</div>
                </Col>
                <Col>
                  <Button size="sm" className="btn-facebook btn-brand mr-1 mb-1" href={facebook}>
                    <i className="fa fa-facebook"></i><span>Facebook</span>
                  </Button><br/>
                  <Button size="sm" className="btn-youtube btn-brand mr-1 mb-1" href={video}>
                    <i className="fa fa-youtube"></i><span>YouTube</span>
                  </Button>
                </Col>
              </Row>
            </Container>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  school: state.school
});

export default connect(mapStateToProps, { getSchool })(DefaultFooter);  
