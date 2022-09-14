import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, Dimensions, Alert } from 'react-native';
import { ListItem, Divider, Button, Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import { getApproveList, clearSuccess, approveStudent } from '../actions/userActions'; 
import { NavigationEvents } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ApproveStudent extends Component {
  constructor() {
    super();
    this.state = {
      approve_list: {
        enrollStudents: [],
        students: []
      },
      courseId: null,
      loading: true,
      isLoadingApprove: false
    };
    this.handleClickApprove = this.handleClickApprove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const { approve_list, loading } = nextProps.users
      this.setState({ 
        approve_list, 
        loading 
      });
    }

    if (nextProps.success === "Duyệt thành công") {
      Alert.alert('Thông báo', nextProps.success);
      this.setState({isLoadingApprove: false})
      this.props.clearSuccess();
    }
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID');
    this.setState({ courseId })
    this.props.getApproveList(courseId);
  }

  handleClickApprove(studentId){
    this.setState({isLoadingApprove: true})
    this.props.approveStudent(this.state.courseId, studentId)
  } 

  render() {
    let { approve_list, loading, isLoadingApprove }  = this.state;
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
          <View style={styles.navBar}>
            <Text style={styles.nameHeader}>Danh sách học viên ghi danh</Text>
          </View>
          {
            approve_list.enrollStudents.length === 0
            ?
            <Text style={{marginLeft: 20}}> không có học viên</Text>
            :
            approve_list.enrollStudents.map(elem => {
              return (
                <ListItem
                  key={elem._id}
                  leftAvatar={{ rounded: true, source: { uri: elem.student.photo } }}
                  title={elem.student.name}
                  subtitle={elem.student.email}
                  containerStyle={{
                    borderRadius: 8,
                    marginTop: 10,
                    marginHorizontal: 10
                  }}
                  rightElement={
                    <Button
                      title="Duyệt"
                      onPress={this.handleClickApprove.bind(this, elem.student._id)}
                    />
                  }
                />
              );
            })
          }
          <Divider style={{ backgroundColor: 'black', marginTop: 10, marginBottom: 10  }} />
          <View style={styles.navBar}>
            <Text style={styles.nameHeader}>Danh sách học viên đã duyệt</Text>
          </View>
          {
            approve_list.students.length === 0
            ?
            <Text style={{marginLeft: 20}}> không có học viên</Text>
            :
            approve_list.students.map(elem => {
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
    fontSize: 25,
    marginLeft: 20,
  }
});

const mapStateToProps = state => ({
  users: state.users,
  success: state.success
});
export default connect(mapStateToProps, { getApproveList, clearSuccess, approveStudent })(ApproveStudent); 