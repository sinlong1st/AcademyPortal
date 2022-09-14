import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button, Icon, Divider } from 'react-native-elements';
import { getAllCourse } from '../actions/courseActions'; 
import isEmptyObj from '../validation/is-empty';
import moment from "moment";
import { NavigationEvents } from 'react-navigation';


class CourseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      allcourses: []
    };
    this.handleDetail = this.handleDetail.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.courses)) {
      const {allcourses, loading} = nextProps.courses
      this.setState({
        allcourses,
        loading
      })
    }
  }

  componentDidMount = () => {
    this.props.getAllCourse();
  }

  handleDetail(courseId){
    this.props.navigation.navigate('CourseDetail',{ courseId: courseId });
  }

  render() {
    const { allcourses, loading } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(241,240,241,1)' }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
      {
        loading
        ?
        <View style={styles.container}> 
          <ActivityIndicator size="large" />
        </View>
        :
        <ScrollView>
          {
            allcourses.map(course =>
              <Card key={course._id}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{ uri: course.coursePhoto }}
                    style={{ width: 70, height: 70, borderColor:'rgba(241,240,241,1)', borderWidth: 1, borderRadius: 5 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 10,
                      flex: 1, 
                      flexWrap: 'wrap'
                    }}
                  >
                    {course.title}
                  </Text>
                </View>
                <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Icon type="font-awesome" name="clock-o" />
                    <Text  style={{ marginLeft: 5 }} >
                      Hạn đăng ký - 
                    </Text>
                    <Text style={styles.infoText}>{moment(course.enrollDeadline).format("HH:mm [ngày] DD [thg] MM, YYYY.")}</Text>
                  </View>
                <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
                <Text style={{marginBottom: 10, marginTop: 10}}>
                  {course.intro}
                </Text>
                <Button
                  icon={<Icon name='code' color='#ffffff' />}
                  backgroundColor='#03A9F4'
                  onPress={this.handleDetail.bind(this, course._id)}
                  title=' Xem chi tiết' />
              </Card>
            )
          }
        </ScrollView>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  infoText:{
    color: 'grey',
    flex: 1, 
    flexWrap: 'wrap', 
    marginLeft: 4
  }
});

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getAllCourse })(CourseList); 