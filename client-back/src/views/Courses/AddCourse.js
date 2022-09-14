import React, { Component, Fragment } from 'react';
import {
  Modal,
  ModalBody,
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  ModalHeader,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { addCourse, clearErrors, clearSuccess } from '../../actions/courseActions';
import { getListLessonTotal } from '../../actions/lessonActions';
import { getInfrastructure } from '../../actions/infrastructureAction';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import ReactDropzone from "react-dropzone";
import CKEditor from 'ckeditor4-react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
var moment = require('moment');

const styles = {
  bigAvatar: {
    height: 200,
    width: 200,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  },
  buttonDanger: {
    margin: '0 0 0 10px'
  }
}

class AddCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: [],
      title:'',
      intro: '',
      coursePhoto: '',
      enrollDeadline: null,
      studyTime: '',
      openingDay: null,
      endDay: null,
      fee: '',
      info: '',
      file: null,
      isShowSuccess: false,
      errors:{},
      isLoading: false,
      invalidImg: false,
      infrastructureList: [],
      pointColumns: [
        {
          pointName: 'Điểm giữa kỳ',
          pointRate: '30',
        },
        {
          pointName: 'Điểm cuối kỳ',
          pointRate: '70',
        }
      ],
      lesson_total_list: [],
      lessonTotal: null,
      loading: true,
      isOpenModal: false,
      listId: '',
      listTitle: '',
      maxStudent: '',
      minStudent: '',
      code:'',
      minScore: 5,
      minAbsent: 1
    };
    this.onEditorChange = this.onEditorChange.bind( this );
  }

  componentDidMount() {
    this.props.getInfrastructure();
  }

  handleChange = name => event => {
    const value = event.target.value
    this.setState({ [name]: value })
  }

  handleDayChange = event => {
    var a = {
      dayName: event.target.value,
      time: ['19:00','21:00']
    }

    var daysArr = this.state.days.slice(0);

    var found = daysArr.find(function(day) {
      return event.target.value === day.dayName;
    });

    if(found)
    {
      this.setState({
        days: this.state.days.filter(j => j.dayName !== event.target.value)
      })
    }
    else
    {
      this.setState({
        days: [...this.state.days, a]
      })
    }
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
          coursePhoto: reader.result,
          invalidImg: false
        });
      }
      reader.readAsDataURL(file)
      this.setState({
        file: files[0]
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.infrastructure) ) {
      const { infrastructureList } = nextProps.infrastructure;
      this.setState({
        infrastructureList: infrastructureList,
      });
    }

    if (nextProps.lesson) {
      const { lesson_total_list, loading } = nextProps.lesson
      this.setState({
        lesson_total_list,
        loading
      })
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});


    if (nextProps.success.data === "Thêm khóa học thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess();
    }
  }

  getDaysBetweenDates(start, end, days) {
    var result = [];
    for(var i=0; i< days.length; i++)
    {
      var current = new Date(start);
      current.setDate(current.getDate() + (days[i].dayName - current.getDay() + 7) % 7);
      while (current < end) {
        var a = {};
        a.date = moment(+current).format('YYYY-MM-DD')
        a.start = moment(+current).format('YYYY-MM-DD') + 'T' + days[i].time[0] + ':00'
        a.end = moment(+current).format('YYYY-MM-DD') + 'T' + days[i].time[1] + ':00'
        a.time = days[i].time
        result.push(a);
        current.setDate(current.getDate() + 7);
      }
    }

    result.sort(function(a,b){
      return new Date(a.start) - new Date(b.start);
    });
    return result;  
  }

  getStudyTime(days) {
    var result = '';
    var objdays = { 1: 'Thứ Hai',2: 'Thứ Ba',3: 'Thứ Tư',4: 'Thứ Năm',5: 'Thứ Sáu',6: 'Thứ Bảy',0: 'Chủ Nhật'};
    for(var i=0; i< days.length; i++)
    {
      var day = objdays[days[i].dayName];
      if(i === days.length - 1)
      {
        result = result + day + ' từ ' + days[i].time[0] + ' đến ' + days[i].time[1]
      }
      else{
        result = result + day + ' từ ' + days[i].time[0] + ' đến ' + days[i].time[1] + ', '
      }
    }
    return result;  
  }

  toDayName(dayName) {
    var objdays = { 1: 'Thứ Hai',2: 'Thứ Ba',3: 'Thứ Tư',4: 'Thứ Năm',5: 'Thứ Sáu',6: 'Thứ Bảy',0: 'Chủ Nhật'};
    var result = objdays[dayName]
    return result;  
  }

  onSubmit = e => {
    e.preventDefault();
    if(this.state.days.length === 0)
    {
      this.setState(prevState => ({
        errors: {
            ...prevState.errors,
            days: 'Hãy chọn buổi học trong tuần'
        }
      }))
    }
    else{
      const courseData = {
        title: this.state.title,
        intro: this.state.intro,
        minStudent: this.state.minStudent,
        maxStudent: this.state.maxStudent,
        enrollDeadline: this.state.enrollDeadline,
        studyTime: this.getStudyTime(this.state.days),
        openingDay: this.state.openingDay,
        endDay: this.state.endDay,
        fee: this.state.fee,
        info: this.state.info,
        pointColumns: this.state.pointColumns,
        events: this.getDaysBetweenDates(this.state.openingDay, this.state.endDay, this.state.days),
        listId: this.state.listId,
        code: this.state.code,
        days: this.state.days,
        infrastructure: this.state.infrastructure,
        minScore: this.state.minScore,
        minAbsent: this.state.minAbsent
      };
      this.props.clearErrors();
      this.props.addCourse(courseData, this.state.file);
      this.setState({isLoading: true});
    }
  }

  hideAlertSuccess(){
    this.setState({
      code: '',
      days: [],
      title:'',
      intro: '',
      coursePhoto: '',
      enrollDeadline: null,
      studyTime: '',
      openingDay: null,
      endDay: null,
      fee: '',
      info: '',
      file: null,
      isShowSuccess: false,
      errors:{},
      isLoading: false,
      invalidImg: false,
      pointColumns: [
        {
          pointName: 'Điểm giữa kỳ',
          pointRate: '30',
        },
        {
          pointName: 'Điểm cuối kỳ',
          pointRate: '70',
        }
      ],
      lesson_total_list: [],
      lessonTotal: null,
      loading: true,
      isOpenModal: false,
      listId: '',
      listTitle: '',
      maxStudent: '',
      minStudent: '',
      minScore: 5,
      minAbsent: 1
    })
    document.getElementById("add-course-form").reset();
  }

  onEditorChange( evt ) {
    this.setState( {
      info: evt.editor.getData()
    });
  }

  onChangeDeadline = enrollDeadline => this.setState({ enrollDeadline })

  onChangeOpeningDay = openingDay => this.setState({ openingDay })

  onChangeEndDay = endDay => this.setState({ endDay })

  onChangeTime = (dayName, time) => 
  {
    var daysArr = this.state.days.slice(0);

    daysArr.map(function(day) {
      if(dayName === day.dayName)
        return day.time = time
      return day
    });
    this.setState({days: daysArr})
  }

  handlePointColumnNameChange = idx => evt => {
    const newpointColumns = this.state.pointColumns.map((column, sidx) => {
      if (idx !== sidx) return column;
      return { ...column, pointName: evt.target.value };
    });

    this.setState({ pointColumns: newpointColumns });
  };

  handlePointColumnPointRateChange = idx => evt => {
    const newpointColumns = this.state.pointColumns.map((column, sidx) => {
      if (idx !== sidx) return column;
      return { ...column, pointRate: evt.target.value };
    });

    this.setState({ pointColumns: newpointColumns });
  };

  handleAddPointColumn = () => {
    this.setState({
      pointColumns: this.state.pointColumns.concat([{ pointName: "", pointRate: ""}])
    });
  };

  handleRemovePointColumn = idx => () => {
    this.setState({
      pointColumns: this.state.pointColumns.filter((s, sidx) => idx !== sidx)
    });
  };

  toggleModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    if(this.state.days.length === 0 || this.state.openingDay == null || this.state.endDay == null)
    {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          list: 'Hãy chọn ngày khai giảng, ngày kết thúc, buổi học trong tuần'
        }
      }))
    }else{
      var events = this.getDaysBetweenDates(this.state.openingDay, this.state.endDay, this.state.days)
      this.props.getListLessonTotal(events.length);
      this.setState({
        isOpenModal: !this.state.isOpenModal,
        lessonTotal: events.length
      });
    }

  }

  handleSelectList(listId, listTitle){
    this.setState({ listId, listTitle, isOpenModal: false })
  }

  render() {
    const { errors, days, loading, lesson_total_list, lessonTotal, listTitle, infrastructureList } = this.state;
    return (
      <div className="animated fadeIn">
        <Form className="form-horizontal" id="add-course-form" onSubmit={this.onSubmit}>
          <Card>
            <CardHeader>
              <i className="fa fa-list-alt" aria-hidden="true"></i>Tóm tắt khóa học
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Mã khóa học</Label>
                <Input type="text" value={this.state.code} onChange={this.handleChange('code')} spellCheck="false"/>
              </FormGroup>
              {errors.code && <Alert color="danger">{errors.code}</Alert>}
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Tên khóa học</Label>
                <Input type="text" value={this.state.title} onChange={this.handleChange('title')} spellCheck="false"/>
              </FormGroup>
              {errors.title && <Alert color="danger">{errors.title}</Alert>}
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Giới thiệu ngắn về khóa học</Label>
                <Input rows="3" type="textarea" value={this.state.intro} onChange={this.handleChange('intro')} spellCheck="false"/>
              </FormGroup>
              {errors.intro && <Alert color="danger">{errors.intro}</Alert>}
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Học phí</Label>
                <InputGroup>
                  <Input type="number" min='0' value={this.state.fee} onChange={this.handleChange('fee')} spellCheck="false"/>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>VND</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              {errors.fee && <Alert color="danger">{errors.fee}</Alert>}
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Địa điểm học</Label>
                <select onChange={this.handleChange('infrastructure')} className="form-control">
                  <option value=''>Chọn cơ sở</option>
                  {
                    infrastructureList.map((item, index) =>
                      <option key={index} value={item._id}>{item.name}</option>
                    )
                  }
                </select>
              </FormGroup>
              {errors.infrastructure && <Alert color="danger">{errors.infrastructure}</Alert>}
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Hình đại diện khóa học</Label>
                <Row>
                  <Col xs="4">
                    <div className="preview-image">
                      {
                        this.state.coursePhoto === ''
                        ?
                        <img src='https://res.cloudinary.com/dk9jsd8vf/image/upload/v1552047406/1.png' alt="avatar" style={styles.bigAvatar}/>
                        :
                        <img src={this.state.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                      }
                    </div>
                  </Col>
                  <Col>
                    <ReactDropzone accept="image/*" onDrop={this.onDrop} >
                      Thả hình vào đây!
                    </ReactDropzone>
                  </Col>
                </Row>
              </FormGroup>
              {
                this.state.invalidImg === true
                ? <Alert color="danger">Hình ảnh không hợp lệ</Alert>
                : null
              }
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Hạn chót ghi danh</Label> <br/>
                <DatePicker
                  selected={this.state.enrollDeadline}
                  onChange={this.onChangeDeadline}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  isClearable={true}
                  dateFormat="dd/MM/yyyy HH:mm aa"
                  customInput={<Input />}
                  timeCaption="time"
                />
              </FormGroup>
              {errors.enrollDeadline && <Alert color="danger">{errors.enrollDeadline}</Alert>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <i className="fa fa-info-circle" aria-hidden="true"></i>Chi tiết khóa học
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Ngày khai giảng</Label> <br/>
                <DatePicker
                  selected={this.state.openingDay}
                  onChange={this.onChangeOpeningDay}
                  isClearable={true}
                  dateFormat="dd/MM/yyyy"
                  customInput={<Input />}
                />
              </FormGroup>
              {errors.openingDay && <Alert color="danger">{errors.openingDay}</Alert>}
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Ngày kết thúc</Label> <br/>
                <DatePicker
                  selected={this.state.endDay}
                  onChange={this.onChangeEndDay}
                  isClearable={true}
                  dateFormat="dd/MM/yyyy"
                  customInput={<Input />}
                />
              </FormGroup>
              {errors.endDay && <Alert color="danger">{errors.endDay}</Alert>}
              <FormGroup row>
                <Col md="3">
                  <Label style={{fontWeight: 'bold'}}>Buổi học trong tuần</Label>
                </Col>
                <Col md="9">
                  <FormGroup check inline>
                    <Input onChange={this.handleDayChange} className="form-check-input" type="checkbox" id="inline-checkbox1" name="inline-checkbox1" value="1" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox1">Thứ 2</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input onChange={this.handleDayChange} className="form-check-input" type="checkbox" id="inline-checkbox2" name="inline-checkbox2" value="2" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox2">Thứ 3</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input onChange={this.handleDayChange} className="form-check-input" type="checkbox" id="inline-checkbox3" name="inline-checkbox3" value="3" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox3">Thứ 4</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input onChange={this.handleDayChange} className="form-check-input" type="checkbox" id="inline-checkbox4" name="inline-checkbox4" value="4" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox4">Thứ 5</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input onChange={this.handleDayChange} className="form-check-input" type="checkbox" id="inline-checkbox5" name="inline-checkbox5" value="5" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox5">Thứ 6</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input onChange={this.handleDayChange} className="form-check-input" type="checkbox" id="inline-checkbox6" name="inline-checkbox6" value="6" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox6">Thứ 7</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input onChange={this.handleDayChange} className="form-check-input" type="checkbox" id="inline-checkbox7" name="inline-checkbox7" value="0" />
                    <Label className="form-check-label" check htmlFor="inline-checkbox7">Chủ Nhật</Label>
                  </FormGroup>
                </Col>
              </FormGroup>
              {
                days.map(day => 
                  <FormGroup key={day.dayName}>
                    <Label>Thời gian học {this.toDayName(day.dayName)}</Label> <br/>
                    <TimeRangePicker
                      onChange={this.onChangeTime.bind(this, day.dayName)}
                      value={day.time}
                    />
                  </FormGroup>
                )
              }
              {errors.days && <Alert color="danger">{errors.days}</Alert>}
              <FormGroup>
                <Button color="success" onClick={this.onOpenModal}>Chọn danh sách bài học</Button>
                <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal} className='modal-lg'>
                  <ModalHeader  toggle={this.toggleModal}>Chọn danh sách bài học</ModalHeader>
                  <ModalBody style={{overflowY:'scroll', height:500}}>
                  {
                    loading
                    ?
                    <ReactLoading type='bars' color='#05386B' />
                    :
                    <Fragment>
                      <b>Danh sách bài học có {lessonTotal} buổi học:</b>
                      <ListGroup style={{marginTop:10}}>
                      {
                        lesson_total_list.length === 0
                        ?
                        <ListGroupItem>Không tìm thấy danh sách bài học</ListGroupItem>
                        :
                        <Fragment>
                        {
                          lesson_total_list.map(list=>
                            <ListGroupItem key={list._id} action tag="button" onClick={this.handleSelectList.bind(this, list._id, list.title)}>
                              {list.title}
                            </ListGroupItem>
                          )
                        }
                        </Fragment>
                      }
                      </ListGroup>
                    </Fragment>
                  }
                  </ModalBody>
                </Modal>
              </FormGroup>
              {listTitle && <Alert color="dark">{listTitle} </Alert>}
              {errors.list && <Alert color="danger">{errors.list}</Alert>}
              <FormGroup>
                <Label style={{fontWeight: 'bold'}}>Cột điểm</Label>
                {
                  this.state.pointColumns.map((pointColumn, idx) => 
                    <FormGroup key={idx}>
                      <div className="point-columns form-row">
                        <div className="col form-row">
                          <Label className="col-3">Tên cột điểm: </Label>
                          <input
                            className="form-control col"
                            type="text"
                            placeholder={`Tên cột điểm`}
                            value={pointColumn.pointName}
                            onChange={this.handlePointColumnNameChange(idx)}
                          />
                        </div>
                        <div className="col form-row">
                          <Label className="col-3">Tỉ lệ điểm (%): </Label>
                          <input
                            className="form-control col"
                            type="number"
                            min='0'
                            placeholder={`Tỉ lệ điểm`}
                            value={pointColumn.pointRate}
                            onChange={this.handlePointColumnPointRateChange(idx)}
                          />
                        </div>
                        <button style={styles.buttonDanger} type="button" className="btn btn-danger" onClick={this.handleRemovePointColumn(idx)}><i className="fa fa-times" aria-hidden="true"></i></button>
                      </div>
                    </FormGroup>
                  )
                }
                <FormGroup>
                  <button type="button" onClick={this.handleAddPointColumn} className="btn btn-success">Thêm cột điểm</button>
                </FormGroup>
              </FormGroup>
              {errors.pointColumns && <Alert color="danger">{errors.pointColumns}</Alert>}
              
              <FormGroup>
                <div className="form-row">
                  <Label className="col-3" style={{fontWeight: 'bold'}}>Số lượng học viên tối đa </Label>
                  <div className="col-2">
                    <Input type="number" min='0' value={this.state.maxStudent} onChange={this.handleChange('maxStudent')}/>
                  </div>
                </div>
              </FormGroup>
              {errors.maxStudent && <Alert color="danger">{errors.maxStudent}</Alert>}

              <FormGroup>
                <div className="form-row">
                  <Label className="col-3" style={{fontWeight: 'bold'}}>Số lượng học viên tối thiểu </Label>
                  <div className="col-2">
                    <Input type="number" min='0' value={this.state.minStudent} onChange={this.handleChange('minStudent')}/>
                  </div>
                </div>
              </FormGroup>
              {errors.minStudent && <Alert color="danger">{errors.minStudent}</Alert>}

              <FormGroup>
                <div className="form-row">
                  <Label className="col-3" style={{fontWeight: 'bold'}}>Điểm tổng kết tối thiểu để đậu</Label>
                  <div className="col-2">
                    <Input type="number" min='0' max='10' value={this.state.minScore} onChange={this.handleChange('minScore')}/>
                  </div>
                </div>
              </FormGroup>
              {errors.minScore && <Alert color="danger">{errors.minScore}</Alert>}

              <FormGroup>
                <div className="form-row">
                  <Label className="col-3" style={{fontWeight: 'bold'}}>Số ngày vắng tối đa cho phép</Label>
                  <div className="col-2">
                    <Input type="number" min='0' value={this.state.minAbsent} onChange={this.handleChange('minAbsent')}/>
                  </div>
                </div>
              </FormGroup>
              {errors.minAbsent && <Alert color="danger">{errors.minAbsent}</Alert>}

              <Label style={{fontWeight: 'bold'}}>Giới thiệu nội dung khóa học</Label>
              <CKEditor data={this.state.info} onChange={this.onEditorChange} />
              {errors.info && <Alert color="danger">{errors.info}</Alert>}
            </CardBody>
          </Card>
        </Form>

        <Button type="submit" style={{marginBottom:20}} color="primary" onClick={this.onSubmit}>Thêm</Button>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm khóa học thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm khóa học</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

AddCourse.propTypes = {
  addCourse: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lesson: state.lesson,
  infrastructure: state.infrastructure,
  errors: state.errors,
  success: state.success
});
export default connect(mapStateToProps, { addCourse, clearErrors, clearSuccess, getListLessonTotal, getInfrastructure })(AddCourse); 
