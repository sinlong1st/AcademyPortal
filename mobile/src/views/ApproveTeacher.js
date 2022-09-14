import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, Dimensions } from 'react-native';
import { ListItem, Divider, Button, Overlay, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { getApproveListTeacher, clearSuccess, approveTeacher } from '../actions/userActions'; 
import { NavigationEvents } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ApproveTeacher extends Component {
  constructor() {
    super();
    this.state = {
      approve_list_teacher: {
        teacherInCourse: [],
        teachers: []
      },
      intialTeacher: [],
      courseId: null,
      loading: true,
      isLoadingApprove: false,
      search: null
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID');
    this.setState({ courseId })
    this.props.getApproveListTeacher(courseId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const { approve_list_teacher, loading } = nextProps.users;
      this.setState({ 
        intialTeacher: approve_list_teacher ? approve_list_teacher.teachers : [],
        approve_list_teacher, 
        loading 
      });
    }

    if (nextProps.success === "Duyệt thành công") {
      this.setState({isLoadingApprove: false})
      this.props.clearSuccess();
    }
  }

  handleClickApprove(teacherId){
    this.setState({isLoadingApprove: true})
    this.props.approveTeacher(this.state.courseId, teacherId)
  } 

  onSearch = search =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialTeacher));
    updatedList = updatedList.filter((teacher)=>
      teacher.name.toLowerCase().search(search.toLowerCase()) !== -1
    );
    this.setState({
      approve_list_teacher: {...this.state.approve_list_teacher, teachers: updatedList},
      search
    });
  }
  
  render() {
    let { approve_list_teacher, loading, isLoadingApprove, search }  = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(241,240,241,1)' }}>
        {
          loading
          ?
          <View style={styles.container}> 
            <ActivityIndicator size="large" />
          </View>
          :
          <ScrollView>
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}>Danh sách giáo viên trong khóa học</Text>
            </View>
            {
              approve_list_teacher.teacherInCourse.length === 0
              ?
              <Text style={{marginLeft: 20}}> không có giáo viên</Text>
              :
              approve_list_teacher.teacherInCourse.map(elem => {
                return (
                  <ListItem
                    key={elem._id}
                    leftAvatar={{ rounded: true, source: { uri: elem.photo } }}
                    title={elem.name}
                    subtitle={elem.email}
                    containerStyle={{
                      borderRadius: 8,
                      marginTop: 10,
                      marginHorizontal: 10
                    }}
                  />
                );
              })
            }
            <Divider style={{ backgroundColor: 'black', marginTop: 10, marginBottom: 10  }} />
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}>Danh sách giáo viên</Text>
            </View>
            <SearchBar
              placeholder="Tên giáo viên ..."
              platform="ios"
              value={search} 
              onChangeText={this.onSearch}
            />
            {
              approve_list_teacher.teachers.length === 0
              ?
              <Text style={{marginLeft: 20}}> không có giáo viên</Text>
              :
              approve_list_teacher.teachers.map(elem => {
                return (
                  <ListItem
                    key={elem._id}
                    leftAvatar={{ rounded: true, source: { uri: elem.photo } }}
                    title={elem.name}
                    subtitle={elem.email}
                    containerStyle={{
                      borderRadius: 8,
                      marginTop: 10,
                      marginHorizontal: 10
                    }}
                    rightElement={
                      <Button
                        title="Duyệt"
                        onPress={this.handleClickApprove.bind(this, elem._id)}
                      />
                    }
                  />
                );
              })
            }
          </ScrollView>
        }
        <Overlay
          isVisible={isLoadingApprove}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          width= {100}
          height= {70}
        >
          <ActivityIndicator style={{marginTop:10}}/>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
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
  success: state.success
});
export default connect(mapStateToProps, { getApproveListTeacher, clearSuccess, approveTeacher })(ApproveTeacher); 