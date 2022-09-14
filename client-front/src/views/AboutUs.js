import React, { Component } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { getSchool } from '../actions/schoolActions';
import isEmptyObj from '../validation/is-empty';
import { FacebookProvider, Page } from 'react-facebook';
import ReactPlayer from 'react-player'

class Confirm extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      facebook: '',
      video: '',
      intro: ''
    };
  }

  componentDidMount() {
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
        intro: school.intro,
        facebook: school.facebook,
        video: school.video
      });
    }
  }

  render() {
    const { 
      loading,
      facebook,
      video,
      intro

    } = this.state
    return (
      <div className="animated fadeIn">
        {
          loading
          ?
          <ReactLoading type='bars' color='#05386B'/>
          :
          <Container fluid style={{ marginBottom: 30, marginTop: 30}}>
            <Row>
              <Col xs={8}>
                <p style={{ fontWeight: 'bold' , fontSize: 25}}>Video giới thiệu trung tâm</p>
                <ReactPlayer width='100%' url={video} controls/>
                <div style={{ marginTop: 20}} dangerouslySetInnerHTML={ { __html: intro} }></div>
              </Col>
              <Col>
                <div style={{ marginTop: 50}}>
                  <FacebookProvider appId="978638978975725">
                    <Page href={facebook} tabs="timeline" />
                  </FacebookProvider>
                </div>
              </Col>
            </Row>
          </Container>
        }
      </div>
    );
  }

}

const mapStateToProps = state => ({
  school: state.school
});

export default connect(mapStateToProps, { getSchool })(Confirm);
