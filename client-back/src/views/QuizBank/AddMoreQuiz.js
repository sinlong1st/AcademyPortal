import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCategory, clearSuccess } from '../../actions/quizbankActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import { bindActionCreators } from 'redux';
import { Card, CardHeader, CardBody } from 'reactstrap';
import AddMoreQuizForm from './AddMoreQuizForm';
import SweetAlert from 'react-bootstrap-sweetalert';

class AddMoreQuiz extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isShowSuccess: false,
      category: {},
      loading: true
    };
  }

  componentDidMount = () => {
    this.props.getCategory(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {

    const { category, loading } = nextProps.quizbank
    if(!isEmptyObj(category))
      if(category._id === this.props.match.params.id)
        this.setState({ 
          category,
          loading 
        });
    this.setState({
      loading 
    });  

    if (nextProps.success.mes === "Thêm câu hỏi vào danh mục thành công") {
      this.setState({ isShowSuccess: true })
      this.props.clearSuccess()
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push(`/quiz-bank/${this.props.match.params.id}`)
  }

  render() {
    const { category, loading } = this.state;
    return (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B' />
        :
        <Card>
          <CardHeader>
            <b>{category.category}</b>
          </CardHeader>
          <CardBody>
            <AddMoreQuizForm/>
          </CardBody>
          <SweetAlert
            success
            confirmBtnText="OK"
            confirmBtnBsStyle="success"
            title="Thêm câu hỏi vào danh mục thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
          </SweetAlert>
        </Card>
      }
      </div>
    )
  }
    
}

const mapDispatchToProps = dispatch => ({
  getCategory: bindActionCreators(getCategory, dispatch),
  clearSuccess: bindActionCreators(clearSuccess, dispatch)
});

const mapStateToProps = state => ({
  quizbank: state.quizbank,
  success: state.success  
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMoreQuiz);
