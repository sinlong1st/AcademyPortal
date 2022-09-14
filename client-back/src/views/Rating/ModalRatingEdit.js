import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Input, Alert, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import Rating from 'react-rating';
import isEmptyObj from '../../validation/is-empty';
import { ratingTeacher2, getTeacherRating, clearErrors, clearSuccess } from '../../actions/ratingActions';
import { withRouter } from 'react-router-dom';

class ModalRatingEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      text: '',
      star1: 0,
      star2: 0,
      star3: 0,
      star4: 0,
      star5: 0,
      loading: true,
      errors: {},
      isShowSuccess: false,
      isLoading: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    var star = 0;
    star = (this.state.star1 + this.state.star2 + this.state.star3 + this.state.star4 + this.state.star5) / 5
    var ratingData = {
      star1: this.state.star1,
      star2: this.state.star2,
      star3: this.state.star3,
      star4: this.state.star4,
      star5: this.state.star5,
      star,
      text: this.state.text
    }
    this.props.ratingTeacher2(ratingData, this.props.teacherId, this.state.teacherRatingId)
    this.setState({isLoading: true});
    this.props.clearErrors();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.mes === "Đánh giá 2 thành công") {
      this.props.clearSuccess();
      this.setState({isLoading: false, modal: false});
    }

    if (!isEmptyObj(nextProps.rating)) {
      const { teacher_rating, loadingT } = nextProps.rating
      this.setState({
        teacherRatingId: teacher_rating._id,
        star1: teacher_rating.star1,
        star2: teacher_rating.star2,
        star3: teacher_rating.star3,
        star4: teacher_rating.star4,
        star5: teacher_rating.star5,
        text: teacher_rating.text,
        loading: loadingT
      })
    }
  }

  onChangeRate1 = value => {
    this.setState({ star1: value }); 
  }

  onChangeRate2 = value => {
    this.setState({ star2: value }); 
  }

  onChangeRate3 = value => {
    this.setState({ star3: value }); 
  }

  onChangeRate4 = value => {
    this.setState({ star4: value }); 
  }

  onChangeRate5 = value => {
    this.setState({ star5: value }); 
  }

  onOpenModal = e => {
    e.preventDefault();
    this.props.getTeacherRating(this.props.teacherId, this.props.teacherRatingId);
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { errors, loading } = this.state;
    return (
      <Fragment>
        <Button onClick={this.onOpenModal} color="danger">Chi tiết</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className='modal-lg'>
          <ModalHeader toggle={this.toggle}>Đánh giá giáo viên</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:470}}>
            <Rating
              stop={1}
              initialRating={1}
              fullSymbol="fa fa-star fa-x text-warning"
              emptySymbol="fa fa-star-o fa-x text-warning"
              readonly='true'
            />: Kém <br/>

            <Rating
              stop={2}
              initialRating={2}
              fullSymbol="fa fa-star fa-x text-warning"
              emptySymbol="fa fa-star-o fa-x text-warning"
              readonly='true'
            />: Trung bình<br/>

            <Rating
              stop={3}
              initialRating={3}
              fullSymbol="fa fa-star fa-x text-warning"
              emptySymbol="fa fa-star-o fa-x text-warning"
              readonly='true'
            />: Khá<br/>

            <Rating
              stop={4}
              initialRating={4}
              fullSymbol="fa fa-star fa-x text-warning"
              emptySymbol="fa fa-star-o fa-x text-warning"
              readonly='true'
            />: Giỏi<br/>
            <hr/>
            {
              loading
              ?
              <Container>
                <Row className="justify-content-center">
                  <ReactLoading type='spinningBubbles' color='#05386B' />
                </Row>
              </Container>
              :
              <Form action="" method="post">
                <FormGroup>
                  <p>Giáo viên lên lớp có đúng giờ không?</p>
                  <Rating
                    stop={4}
                    initialRating={this.state.star1}
                    emptySymbol="fa fa-star-o fa-2x text-warning"
                    fullSymbol="fa fa-star fa-2x text-warning"
                    onChange={value => this.onChangeRate1(value)}
                  />
                </FormGroup>

                <FormGroup>
                  <p>Bạn cảm thấy như thế nào về phương pháp giảng dạy của giáo viên?</p>
                  <Rating
                    stop={4}
                    initialRating={this.state.star2}
                    emptySymbol="fa fa-star-o fa-2x text-warning"
                    fullSymbol="fa fa-star fa-2x text-warning"
                    onChange={value => this.onChangeRate2(value)}
                  />
                </FormGroup>

                <FormGroup>
                  <p>Giảng viên có nhiệt tình trong giảng dạy?</p>
                  <Rating
                    stop={4}
                    initialRating={this.state.star3}
                    emptySymbol="fa fa-star-o fa-2x text-warning"
                    fullSymbol="fa fa-star fa-2x text-warning"
                    onChange={value => this.onChangeRate3(value)}
                  />
                </FormGroup>

                <FormGroup>
                  <p>Bạn thấy tác phong giảng dạy của giáo viên có phù hợp?</p>
                  <Rating
                    stop={4}
                    initialRating={this.state.star4}
                    emptySymbol="fa fa-star-o fa-2x text-warning"
                    fullSymbol="fa fa-star fa-2x text-warning"
                    onChange={value => this.onChangeRate4(value)}
                  />
                </FormGroup>

                <FormGroup>
                  <p>Kiến thức bạn thu thập được từ giáo viên có đủ không?</p>
                  <Rating
                    stop={4}
                    initialRating={this.state.star5}
                    emptySymbol="fa fa-star-o fa-2x text-warning"
                    fullSymbol="fa fa-star fa-2x text-warning"
                    onChange={value => this.onChangeRate5(value)}
                  />  
                </FormGroup>

                <FormGroup>
                  <span>Góp ý của bạn</span>
                  <Input type="textarea" name="text" value={this.state.text} onChange={this.onChange} spellCheck='false'/>
                  {errors.text && <Alert color="danger">{errors.text}</Alert>}
                </FormGroup>

              </Form>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={this.onSubmit}>Thay đổi đánh giá</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
      
    );
  }
}

const mapStateToProps = state => ({
  rating: state.rating,
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { ratingTeacher2, getTeacherRating, clearErrors, clearSuccess })(ModalRatingEdit));
