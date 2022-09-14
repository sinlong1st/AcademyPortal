import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { getUsers } from '../actions/userActions';
import isEmptyObj from '../validation/is-empty';
import { NavigationEvents } from 'react-navigation';

class PeopleInCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {
        students:[],
        teachers:[]
      },
      loading: true
    };
    this.handlePressStudentInfo = this.handlePressStudentInfo.bind(this);
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID');
    this.props.getUsers(courseId);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users)) {
      const {users, loading} = nextProps.users
      this.setState({
        users,
        loading
      })
    }
  }

  handlePressStudentInfo(studentId){
    this.props.navigation.navigate('StudentInfo',{ studentId: studentId })
  } 

  render() {
    const { students, teachers } = this.state.users
    const { loading } = this.state
    const { role } = this.props.auth.user
    return (
      <View style={{ flex: 1 }}>     
      {
        loading
        ?
        <View style={styles.container}> 
          <ActivityIndicator size="large" />
        </View>
        :
        <ScrollView>
          <View style={{ marginBottom: 20 }}>
            <Card title="Giáo Viên">
            {
              teachers.length === 0
              ? <Text>Chưa có giáo viên tham gia</Text>
              :
              teachers.map(user => {
                return (
                  <ListItem
                    key={user._id}
                    leftAvatar={{ rounded: true, source: { uri: user.photo } }}
                    title={user.name}
                    subtitle={user.email}
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: 'grey',
                      borderRadius: 8,
                      marginTop: 10
                    }}
                  />
                );
              })
            }
            </Card>
            <Card title="Học Viên">
            {
              students.length === 0
              ? <Text>Chưa có học viên</Text>
              :
              students.map(user => {
                return (
                  <View key={user._id}>
                  {
                    role === 'student'
                    ?
                    <ListItem
                      leftAvatar={{ rounded: true, source: { uri: user.photo } }}
                      title={user.name}
                      subtitle={user.code}
                      containerStyle={{
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 8,
                        marginTop: 10
                      }}
                    />
                    :
                    <ListItem
                      leftAvatar={{ rounded: true, source: { uri: user.photo } }}
                      title={user.name}
                      subtitle={user.code}
                      onPress={this.handlePressStudentInfo.bind(this, user._id)}
                      containerStyle={{
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 8,
                        marginTop: 10
                      }}
                    />
                  }
                  </View>
                );
              })
            }
            </Card>
          </View>
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
  }
});

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});
export default connect(mapStateToProps, { getUsers })(PeopleInCourse); 