import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty'; 
import { getTodayAttendance, addAttendance, editAttendance, clearSuccess } from '../../actions/attendanceActions';
import { getUsers } from '../../actions/userActions';
import { getSchedule } from '../../actions/scheduleAtions';
import { NavigationEvents } from 'react-navigation';
import 'moment/locale/vi';

var moment = require('moment');

const SCREEN_WIDTH = Dimensions.get('window').width;

class CheckAttendance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      loadingEvent :true,
      selectDate: '',
      user:[],
      userAttendance:[],
      attendanceId:'',
      loadingUser: true,
      loadingUserAttendance: true,
      courseId: null,
      loadingSubmit1: false,
      loadingSubmit2: false,
      select: false
    };
  }
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID');
    this.setState({
      courseId
    })
    this.props.getSchedule(courseId);
  }

  componentWillReceiveProps(nextProps) {

    const { schedule, loading } = nextProps.schedule
    if(!isEmptyObj(schedule))
      if(schedule.courseId === this.state.courseId)
        this.setState({ 
          events: schedule.events,
          loadingEvent: loading
        });
    this.setState({
      loadingEvent: loading 
    });  

    if (!isEmptyObj(nextProps.users)) {
      const { users, loading } = nextProps.users

      users.students.map(user => {
        return user.isPresent = false;
      })

      this.setState({
        user: users.students,
        loadingUser: loading
      })
    }

    if (!isEmptyObj(nextProps.attendance)) {
      const { loading, today_attendance } = nextProps.attendance
      if(today_attendance === null)
      {
        if(this.state.select === true)
          this.setState({
            attendanceId: '',
            userAttendance: [],
            loadingUserAttendance: loading,
            select: false
          })
        this.setState({
          loadingUserAttendance: false,
          select: false
        })
      }
      else{
        if(today_attendance.date === this.state.selectDate && today_attendance.courseId === this.state.courseId)
          this.setState({
            attendanceId: today_attendance._id,
            userAttendance: today_attendance.students,
            loadingUserAttendance: loading,
            select: false
          })
      }
      this.setState({ loadingUserAttendance: loading })

    }

    if (nextProps.success.data === "Điểm danh thành công") {
      Alert.alert(
        'Thành công',
        'Điểm danh thành công'
      )
      this.props.clearSuccess();
      this.props.getTodayAttendance(this.state.courseId, this.state.selectDate);      
      this.setState({ loadingSubmit1: false, loadingSubmit2: false })
    }

  }

  onCheck(userid){
    this.state.user.map(user => {
      if(user._id.toString() === userid.toString())
        return user.isPresent = !user.isPresent;
      return user;
    })

    this.setState({
      user: this.state.user
    })
  }

  onCheck2(userid){
    this.state.userAttendance.map(user => {
      if(user.userId._id.toString() === userid.toString())
        return user.isPresent = !user.isPresent;
      return user;
    })

    this.setState({
      userAttendance: this.state.userAttendance
    })
  }

  submit = () => {

    var newAttendance = {
      courseId: this.state.courseId,
      date: this.state.selectDate,
      students: []
    };

    newAttendance.students = JSON.parse(JSON.stringify(this.state.user));
    newAttendance.students.map(student => {
      student.userId = student._id
      delete student._id
      delete student.name
      delete student.photo
      delete student.code
      return student
    })
 
    this.props.addAttendance(newAttendance);
    this.setState({loadingSubmit1: true})

  }

  submit2 = () => {

    var editAttendance = {
      _id: this.state.attendanceId,
      students: []
    };

    editAttendance.students = JSON.parse(JSON.stringify(this.state.userAttendance));
    editAttendance.students.map(student => {
      return student.userId = student.userId._id
    })

    this.props.editAttendance(editAttendance);
    this.setState({loadingSubmit2: true})

  }

  handleSelectDate(selectDate){
    this.props.getTodayAttendance(this.state.courseId, selectDate);
    this.props.getUsers(this.state.courseId);
    this.setState({
      selectDate,
      select: true
    })
  }

  back=()=>{
    this.setState({
      selectDate: '',
      user:[],
      userAttendance:[]
    })
  }

  render() {
    const { user, userAttendance, loadingUser, loadingUserAttendance, loadingSubmit1, loadingSubmit2, loadingEvent, events, selectDate } = this.state

    var StudentList = <Text>Chưa có học viên ghi danh</Text>;

    if(!isEmptyObj(user) && isEmptyObj(userAttendance)){
      StudentList = 
      <View>
        <View style={{flexDirection: 'row'}}>
          <Button 
            title="Trở về"
            containerStyle = {{ marginHorizontal: 10, height: 50, width: 100 }}
            titleStyle = {{ fontWeight: 'bold' }}
            buttonStyle={{
              backgroundColor: 'green'
            }}
            icon={{
              name: 'arrow-left',
              type: 'font-awesome',
              color: 'white'
            }}
            onPress={this.back}
          />
          <Button
            title="Lưu điểm danh"
            loading={loadingSubmit1}
            onPress = {this.submit}
            containerStyle={{ marginHorizontal: 10, height: 50, width: 200 }}
            titleStyle={{ fontWeight: 'bold' }}
          />
        </View>
        {
          user.map(u => {
            return (
              <ListItem
                key={u._id}
                leftAvatar={{ rounded: true, source: { uri: u.photo } }}
                title={u.name}
                subtitle={u.code}
                containerStyle={{
                  borderRadius: 8,
                  marginTop: 10,
                  marginHorizontal: 10
                }}
                checkBox={{
                  checked: u.isPresent,
                  onPress: this.onCheck.bind(this, u._id)
                }}
              />
            );
          })
        }
      </View>
    }

    if(!isEmptyObj(user) && !isEmptyObj(userAttendance)){
      StudentList = 
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <Button 
            title="Trở về"
            containerStyle = {{ marginHorizontal: 10, height: 50, width: 100 }}
            titleStyle = {{ fontWeight: 'bold' }}
            buttonStyle={{
              backgroundColor: 'green'
            }}
            icon={{
              name: 'arrow-left',
              type: 'font-awesome',
              color: 'white'
            }}
            onPress={this.back}
          />
          <Button
            title="Chỉnh sửa điểm danh"
            loading={loadingSubmit2}
            onPress = {this.submit2}
            containerStyle = {{ marginHorizontal: 10, height: 50, width: 200 }}
            titleStyle = {{ fontWeight: 'bold' }}
          />
        </View>
        {
          userAttendance.map(u => {
            return (
              <ListItem
                key={u._id}
                leftAvatar={{ rounded: true, source: { uri: u.userId.photo } }}
                title={u.userId.name}
                subtitle={u.userId.code}
                containerStyle={{
                  borderRadius: 8,
                  marginTop: 10,
                  marginHorizontal: 10
                }}
                checkBox={{
                  checked: u.isPresent,
                  onPress: this.onCheck2.bind(this, u.userId._id)
                }}
              />
            );
          })
        }
      </ScrollView>
    }

    return (
      <View style={{ flex: 1 , backgroundColor: 'rgba(241,240,241,1)'}}>    
        <ScrollView>
          <View style={{marginBottom:20}}>
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}>
                Điểm danh { selectDate && <Text>{this.capitalizeFirstLetter(moment(selectDate).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}</Text>}
              </Text>
            </View>
            {
              selectDate
              ?
              <View>
              {
                loadingUser || loadingUserAttendance
                ?
                <View style={styles.container}> 
                  <ActivityIndicator size="large" />
                </View>
                :
                StudentList
              }
              </View>
              :
              <View>
              {
                loadingEvent
                ?
                <View style={styles.container}> 
                  <ActivityIndicator size="large" />
                </View>
                :
                <View>
                  {
                    events.map(e => {
                      return (
                        <ListItem
                          key={e._id}
                          title={this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}
                          subtitle={'Bài học: ' + e.text}
                          containerStyle={{
                            borderRadius: 8,
                            marginTop: 10,
                            marginHorizontal: 10
                          }}
                          onPress={this.handleSelectDate.bind(this, e.date)}
                        />
                      );
                    })
                  }
                </View>
              }
              </View>
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  statusBar: {
    height: 10,
  },
  navBar: {
    height: 60,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
  },
  nameHeader: {
    color: 'black',
    fontSize: 18,
    marginLeft: 20,
  }
});

const mapStateToProps = state => ({
  users: state.users,
  attendance: state.attendance,
  success: state.success,
  schedule: state.schedule
});
export default connect(mapStateToProps, { getTodayAttendance, getUsers, addAttendance, editAttendance, clearSuccess, getSchedule })(CheckAttendance); 