import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { ListItem, Button, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty'; 
import { Calendar } from 'react-native-calendars';
import { getAttendance, getTodayAttendance } from '../../actions/attendanceActions';
import { getSchedule } from '../../actions/scheduleAtions';
import 'moment/locale/vi';

var moment = require('moment');
const SCREEN_WIDTH = Dimensions.get('window').width;

class ListAttendance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      loadingEvent :true,
      attendance: [],
      loadingAttendance: true,
      highlightDates: {},
      selectDate: null,
      users: [],
      intialUsers: [],
      search: '',
      loadingUserAttendance: true
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID');
    this.setState({courseId})
    this.props.getSchedule(courseId);
    this.props.getAttendance(courseId);
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

    if (!isEmptyObj(nextProps.attendance)) {
      const { loading, attendance } = nextProps.attendance
      if(!isEmptyObj(attendance))
      {
        if(attendance.courseId === this.state.courseId)
        {
          this.setState({
            attendance: attendance.attendance,
            loadingAttendance: loading
          })
    
          var dateList = {};

          attendance.attendance.forEach(element => {
            dateList[element.date] = {
              customStyles: {
                container: {
                  backgroundColor: 'green',
                },
                text: {
                  color: 'white',
                  fontWeight: 'bold'
                },
              },
            }
          })
  
          this.setState({
            highlightDates: dateList
          })
        }

      }
      this.setState({
        loadingAttendance: loading
      })

    }

    if (!isEmptyObj(nextProps.attendance)) {
      const { loading, today_attendance } = nextProps.attendance

      if(today_attendance === null)
      {
        if(this.state.select === true)
          this.setState({
            intialUsers: [],
            users: [],
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
        {
          this.setState({
            intialUsers: today_attendance.students,
            users: today_attendance.students,
            loadingUserAttendance: loading,
            select: false
          })
        }
      }
      this.setState({ loadingUserAttendance: loading })
    }
  }

  submit=()=>{
    if(this.state.selectDate !== null)
    {
      var userList = [];
      this.state.attendance.forEach(element => {
        if(this.state.selectDate === element.date)
          userList = element.students
      })
      this.setState({
        users: userList,
        intialUsers: userList
      })
    }
  }

  updateSearch = search => {
    var updatedList = JSON.parse(JSON.stringify(this.state.intialUsers));
    updatedList = updatedList.filter((user)=>
      user.userId.code.toLowerCase().search(search.toLowerCase()) !== -1 ||
      user.userId.name.toLowerCase().search(search.toLowerCase()) !== -1
    );
    this.setState({
      users: updatedList,
      search
    });
  };

  handleSelectDate(selectDate) {
    this.props.getTodayAttendance(this.state.courseId, selectDate);
    this.setState({
      selectDate,
      select: true
    });
  }
  
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  back=()=>{
    this.setState({
      selectDate: '',
      users:[],
      intialUsers:[]
    })
  }

  render() {
      const { loadingAttendance, highlightDates, selectDate, users, search, intialUsers, loadingEvent, events, loadingUserAttendance  } = this.state
    return (
      <View style={{ flex: 1 , backgroundColor: 'rgba(241,240,241,1)'}}>
      {
        selectDate
        ?
        <View>
        {
          loadingUserAttendance
          ?
          <View style={styles.container}> 
            <ActivityIndicator size="large" />
          </View>
          :
          <ScrollView>
            <View style={{marginBottom:20}}>
              <View style={styles.statusBar} />
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
              <View style={styles.navBar}>
                <Text style={styles.nameHeader}>
                  Bảng điểm danh { selectDate && <Text>{this.capitalizeFirstLetter(moment(selectDate).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}</Text>}
                </Text>
              </View>
              {
                isEmptyObj(intialUsers)
                ?
                null
                :
                <View style={{marginBottom:20}}>
                  <SearchBar
                    placeholder="Mã số sinh viên hoặc Họ Tên ..."
                    platform="ios"
                    onChangeText={this.updateSearch}
                    value={search}
                  />
                  {
                    users.map(user => {
                      return (
                        <ListItem
                          key={user._id}
                          leftAvatar={{ rounded: true, source: { uri: user.userId.photo } }}
                          title={user.userId.name}
                          subtitle={user.userId.code}
                          containerStyle={{
                            borderRadius: 8,
                            marginTop: 10,
                            marginHorizontal: 10
                          }}
                          badge = {
                            user.isPresent
                            ?
                            {
                              status: 'success',
                              value: 'Hiện diện'
                            }
                            :
                            {
                              status: 'error',
                              value: 'Vắng'
                            }
                          }
                          
                        />
                      );
                    })
                  }
                </View>
              }
            </View>
          </ScrollView>
        }
        </View>
        :
        <View>
        {
          loadingAttendance || loadingEvent
          ?
          <View style={styles.container}> 
            <ActivityIndicator size="large" />
          </View>
          :
          <ScrollView>
            <Calendar
              markingType={'custom'}
              markedDates={highlightDates}
              onDayPress={(day) => this.handleSelectDate(day.dateString)}
            />
            <View style={{margin: 10}}>
              <View style={styles.navBar}>
                <Text style={styles.nameHeader}>
                  Hãy chọn ngày học
                </Text>
              </View>
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
          </ScrollView>
        }
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 150,
    flex: 1,
    justifyContent: 'center'
  },  
  statusBar: {
    height: 10,
  },
  navBar: {
    marginTop: 10,
    height: 60,
    width: SCREEN_WIDTH,
    flexDirection: 'row'
  },
  nameHeader: {
    marginTop: 5,
    color: 'black',
    fontSize: 15,
    marginLeft: 10,
  }
});

const mapStateToProps = state => ({
  attendance: state.attendance,
  schedule: state.schedule
});
export default connect(mapStateToProps, { getAttendance, getSchedule, getTodayAttendance })(ListAttendance); 