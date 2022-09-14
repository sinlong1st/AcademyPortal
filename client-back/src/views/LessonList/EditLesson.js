import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CKEditor from 'ckeditor4-react';
import { 
  FormGroup, 
  Label,
  Modal, 
  ModalBody, 
  Input, 
  Button, 
  ListGroup, 
  ListGroupItem, 
  Row, 
  Col, 
  Card,
  CardBody,
  CardFooter
} from 'reactstrap';
import { getLesson, editLesson, clearSuccess } from '../../actions/lessonActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import config from '../../config';
import SweetAlert from 'react-bootstrap-sweetalert';
import NoImg from '../../assets/img/NoImg.png';

class EditLesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowSuccess: false,
      isLoading: false,
      loading: true,
      text: '',
      content: '',
      files: [],
    };
    this.onEditorChange = this.onEditorChange.bind( this );
  }

  onEditorChange( evt ) {
    this.setState({
      content: evt.editor.getData()
    });
  }

  componentDidMount(){
    this.props.getLesson(this.props.match.params.listId, this.props.match.params.lessonId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Thay đổi nội dung bài học thành công') {
      this.setState({isShowSuccess: true, isLoading: false})
    }
    
    const { lesson, loading } = nextProps.lesson
    if(!isEmptyObj(lesson))
    {
      var { text, content, files } = lesson.lesson[0]

      this.setState({ 
        text,
        content,
        files,
        loading 
      });
    }
    this.setState({ 
      loading
    });

  }


  handleChange = name => event => {
    const value = event.target.value
    this.setState({ [name]: value })
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
          files: [...prevState.files, file]
        }))
      }
    })
    widget.open()
  }

  delete(file){
    const files = this.state.files.filter(i => i.id !== file.id)
    this.setState({files})
  }

  submitChange=()=>{
    const lessonData ={
      text: this.state.text,
      content: this.state.content,
      files: this.state.files
    }
    this.props.editLesson(this.props.match.params.listId, this.props.match.params.lessonId, lessonData);
    this.setState({isLoading: true});
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      isLoading: false
    })
    this.props.clearSuccess();
    this.props.getLesson(this.props.match.params.listId, this.props.match.params.lessonId);
  }

  render() {
    const { 
      content, 
      text, 
      loading,
      files
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <Card>
          <CardBody>
            <FormGroup>
              <Label style={{fontWeight:'bold'}}>
                Tiêu đề buổi học
              </Label>
              <Input type="text" value={text} onChange={this.handleChange('text')} spellCheck="false"/>
            </FormGroup>
            <FormGroup>
              <Label style={{fontWeight:'bold'}}>
                Nội dung học
              </Label>
              <CKEditor data={content} onChange={this.onEditorChange} />
            </FormGroup>
            <FormGroup>
              <Label style={{fontWeight:'bold'}}>
                Tài liệu học
              </Label>
              <br/>
              <Button color="danger" onClick={this.showWidget}>Đính kèm tài liệu</Button>
              <ListGroup style={{marginTop:10}}>
                {
                  files.length === 0
                  ?
                  <ListGroupItem>Chưa có tài liệu</ListGroupItem>
                  :
                  <Fragment>
                  {
                    files.map(file=>
                      <ListGroupItem key={file.id}>
                        <Row style={{alignContent: 'center'}}>
                          <Col xs="11">
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
                  </Fragment>
                }
              </ListGroup>

            </FormGroup>
          </CardBody>
          <CardFooter>
            <Button color="primary" onClick={this.submitChange}>Lưu thay đổi</Button>
          </CardFooter>
        </Card>

        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Chỉnh sửa bài học thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang lưu thay đổi</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  success: state.success,
  lesson: state.lesson
});

export default withRouter(connect(mapStateToProps, { getLesson, editLesson, clearSuccess })(EditLesson));  