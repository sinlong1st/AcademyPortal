import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { getCurentCourse } from '../actions/courseActions'; 
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class MyCourseAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentcourses: [], 
      loading: true
    };
    this.handleClickCourse = this.handleClickCourse.bind(this);
  }

  componentDidMount = () => {
    this.props.getCurentCourse()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { currentcourses, loading } = nextProps.courses
      this.setState({ 
        currentcourses, 
        loading 
      });
    }
  }

  handleClickCourse(courseId){
    this.props.navigation.navigate('CheckAttendance',{ courseId: courseId })
  } 

  render() {
    const { currentcourses, loading } = this.state

    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(241,240,241,1)' }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        <View style={styles.statusBar} />
        <View style={styles.navBar}>
          <Text style={styles.nameHeader}>Chọn khóa học</Text>
        </View>
        {
          loading
          ?
          <View style={styles.container}> 
            <ActivityIndicator size="large" />
          </View>
          :
          <ScrollView style={{height: SCREEN_HEIGHT - 30}}>
            {
              currentcourses.length === 0
              ?
              <Text style={{marginLeft:10, marginTop:10}}>Bạn hiện không có khóa học nào</Text>
              :
              currentcourses.map(course=>
                <TouchableOpacity key={course._id} onPress={this.handleClickCourse.bind(this, course._id)}>
                  <View
                    style={{
                      height: 60,
                      marginHorizontal: 10,
                      marginTop: 10,
                      backgroundColor: 'white',
                      borderRadius: 5,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Image
                      source={{ uri: course.coursePhoto }}
                      style={{ width: 50, height: 50, borderColor:'rgba(241,240,241,1)', borderWidth: 1, borderRadius: 5, marginLeft:10 }}
                    />
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
                </TouchableOpacity>
              )
            }
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

MyCourseAttendance.propTypes = {
  getCurentCourse: PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getCurentCourse })(MyCourseAttendance); 