import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, Dimensions } from 'react-native';
import { SearchBar, Card, Divider, Image, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { getManageCourses } from '../actions/courseActions'; 
import { NavigationEvents } from 'react-navigation';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class ManageCourses extends Component {
  constructor() {
    super();
    this.state = {
      managecourses: [],
      intialManagecourses: [],
      loading: true,
      search: null,
    };
  }

  componentDidMount=()=>{
    this.props.getManageCourses();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { managecourses, loading } = nextProps.courses
      this.setState({ 
        intialManagecourses: managecourses,
        managecourses, 
        loading 
      });
    }
  }

  onSearch = search =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialManagecourses));
    updatedList = updatedList.filter((course)=>
      course.title.toLowerCase().search(search.toLowerCase()) !== -1 ||
      course.code.toLowerCase().search(search.toLowerCase()) !== -1
    );
    this.setState({ 
      managecourses: updatedList,
      search 
    });
  }

  handleClickApproveStudent(courseId){
    this.props.navigation.navigate('ApproveStudent',{ courseId: courseId })
  } 

  handleClickApproveTeacher(courseId){
    this.props.navigation.navigate('ApproveTeacher',{ courseId: courseId })
  } 

  render() {
    let { managecourses, loading, search } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
      {
        loading
        ?
        <View style={styles.container}> 
          <ActivityIndicator size="large" />
        </View>
        :
        <View >
          <SearchBar
            placeholder="Mã hoặc Tên khóa học ..."
            platform="ios"
            value={search} 
            onChangeText={this.onSearch}
          />
          <ScrollView style={{height: SCREEN_HEIGHT - 160, width: SCREEN_WIDTH}}>
          <View>
            {
              managecourses.map(course =>
                <Card key={course._id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={{ uri: course.coursePhoto }}
                      style={{ width: 50, height: 50, borderColor:'rgba(241,240,241,1)', borderWidth: 1, borderRadius: 5 }}
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
                  <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    {/* <Button
                      backgroundColor='#03A9F4'
                      onPress={this.handleClickApproveStudent.bind(this, course._id)}
                      title=' Quản lý học viên' 
                    /> */}
                    <Button
                      backgroundColor='#03A9F4'
                      onPress={this.handleClickApproveTeacher.bind(this, course._id)}
                      containerStyle={{marginLeft: 20}}
                      title=' Quản lý giáo viên' 
                    />
                  </View>
                </Card>
              )
            }
          </View>
          </ScrollView>
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});

const mapStateToProps = state => ({
  courses: state.courses,
  auth: state.auth
});
export default connect(mapStateToProps, { getManageCourses })(ManageCourses); 