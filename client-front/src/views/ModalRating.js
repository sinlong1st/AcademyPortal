import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { getRating } from '../actions/ratingActions';
import isEmptyObj from '../validation/is-empty'; 
import ReactLoading from 'react-loading';
import Moment from 'react-moment'; 
import Rating from 'react-rating';

const styles = {
  bigAvatar: {
    width: 35,
    height: 35,
    margin: 'auto',
    borderRadius:50
  }
}

class ModalRating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      rating: [],
      loading: true
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.props.getRating(this.props.teacherId);
    this.setState({
      modal: !this.state.modal
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.rating)) {
      const { rating, loading } = nextProps.rating

      this.setState({
        rating,
        loading
      })
    }

  }

  render() {
    const { loading, rating } = this.state;
    return (
      <Fragment>
        <Button onClick={this.onOpenModal}>Xem đánh giá</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-lg'>
          <ModalHeader toggle={this.toggle}>Các đánh giá về giáo viên</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:520}}>
            {
              loading
              ?
              <Container>
                <Row className="justify-content-center">
                  <ReactLoading type='spinningBubbles' color='#05386B' />
                </Row>
              </Container>
              :
              <Fragment>
                {
                  rating.map(rate=>
                    <Fragment key={rate._id}>
                      <Row >
                        <Col sm="1">
                          <img src={rate.user.photo} alt="avatar" style={styles.bigAvatar}/>
                        </Col>
                        <Col>
                          <b>{rate.user.name} </b>
                          <small style={{marginLeft:20, color:'#A8A8A8'}}>
                            <Moment format="HH:mm [ngày] DD [thg] MM, YYYY">
                              {rate.created}
                            </Moment>
                          </small>
                          <br/>
                          <Rating
                            stop={10}
                            initialRating={rate.star}
                            emptySymbol="fa fa-star-o fa-x text-warning"
                            fullSymbol="fa fa-star fa-x text-warning"
                            readonly
                          />
                          <br/>
                          {
                            rate.text.split('\n').map((itemChild, key) => {
                              return <span key={key}>{itemChild}<br/></span>
                            })
                          }
                        </Col>
                      </Row>
                      <br/>
                    </Fragment>
                  )
                }

              </Fragment>
            }
          </ModalBody>
        </Modal>
      </Fragment>
      
    );
  }
}

const mapStateToProps = state => ({
  rating: state.rating
});

export default connect(mapStateToProps, { getRating })(ModalRating);
