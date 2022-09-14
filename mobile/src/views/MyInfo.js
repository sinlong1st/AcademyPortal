import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Divider, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { getStudent } from '../actions/userActions';
import { getStudentCourse } from '../actions/courseActions';
import StudentAbsentList from './StudentAbsentList';
import StudentPointList from './StudentPointList';
import { NavigationEvents } from 'react-navigation';



const SCREEN_WIDTH = Dimensions.get('window').width;

class MyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentId: null,
      student: {},
      studentcourses: [],
      loadingStudent: true,
      loadingStudentCourse: true,
      loadingStudentAbsentList: false,
    };
  }

  componentDidMount = () => {
    const { id } = this.props.auth.user;
    const studentId = id
    this.setState({ studentId });
    this.props.getStudent(studentId);
    this.props.getStudentCourse(studentId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const { student, loading } = nextProps.users

      this.setState({
        student,
        loadingStudent: loading
      })
    }

    if (nextProps.courses) {
      const { studentcourses, loading } = nextProps.courses

      this.setState({
        studentcourses,
        loadingStudentCourse: loading
      })
    } 

  }

  render() {
    const {    
      studentId,   
      student, 
      loadingStudent, 
      loadingStudentCourse, 
      studentcourses,  
    } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(241,240,241,1)' }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />        
        {
          loadingStudent || loadingStudentCourse
          ?
          <View style={styles.container}> 
            <ActivityIndicator size="large" />
          </View>
          :
          <ScrollView>
            <Card >
            <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: student.photo }}
                style={{ width: 80, height: 80, borderColor:'rgba(241,240,241,1)', borderWidth: 1, borderRadius: 40 }}
              />
              <View                  
                style={{
                  marginLeft: 10,
                  flex: 1, 
                  flexWrap: 'wrap'
                }}
              >
                <Text style={{ fontSize: 20, fontWeight:'bold' }}>
                  {student.name}
                </Text>
                <Text style={{ color: 'grey' }} >
                  <Text style={{color: 'black'}}> 
                    Mã số:{" "} 
                  </Text>
                  {student.code}
                </Text>
                <Text style={{ color: 'grey' }} >
                  <Text style={{color: 'black'}}> 
                    Email:{" "} 
                  </Text>
                  {student.email}
                </Text>
                <Text style={{ color: 'grey' }} >
                  <Text style={{color: 'black'}}> 
                    SDT:{" "}    
                  </Text>
                  {student.phone ? student.phone : 'Chưa cập nhật'}
                </Text>
              </View>

            </View>
            <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
            {
              studentcourses.length === 0
              ?
              <Text>Học viên chưa ghi danh khóa nào</Text>
              :
              studentcourses.map(course=>
                <View key={course._id}>
                  <View
                    style={{
                      marginTop: 10,
                      backgroundColor: 'rgba(241,240,241,1)',
                      borderRadius: 5
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10  }}>
                      <View style={{ marginLeft: 10 }}>
                        <Image
                          source={{ uri: course.coursePhoto }}
                          style={{ width: 50, height: 50, borderColor:'grey', borderWidth: 1, borderRadius: 5 }}
                        />
                      </View>
                      <Text style={{flex: 1, flexWrap: 'wrap', marginLeft: 10}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          {course.code}
                        </Text>
                        {"\n"}
                        <Text style={{fontSize: 15, color: 'gray'}} >
                          {course.title}
                        </Text>
                      </Text>
                    </View>
                    <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                      <StudentAbsentList courseId={course._id} studentId={studentId} />
                      <StudentPointList courseId={course._id} studentId={studentId} />
                    </View>
                  </View>
                </View>
              )
            }
            </View>
            </Card>
          </ScrollView>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    fontSize: 25,
    marginLeft: 20,
  }
});

const mapStateToProps = state => ({
  users: state.users,
  courses: state.courses,
  attendance: state.attendance,
  auth: state.auth
});
export default connect(mapStateToProps, { getStudent, getStudentCourse })(MyInfo); 