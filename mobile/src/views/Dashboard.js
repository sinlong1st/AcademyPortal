import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Image, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { getSchool } from '../actions/schoolActions';
import isEmptyObj from '../validation/is-empty';

const LOGO_IMAGE = require('../images/Ai-Edu.png');

const SCREEN_WIDTH = Dimensions.get('window').width;

class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      schoolName: ''
    };
  }

  componentDidMount = () => {
    this.props.getSchool();
  }

  componentWillReceiveProps(nextProps) {
    const { school, loading } = nextProps.school;
    this.setState({
      loading
    })
    if(!isEmptyObj(school))
    {
      this.setState({ 
        schoolName: school.name
      });
    }
  }

  render() {
    const { name, role } = this.props.auth.user
    const { schoolName, loading } = this.state

    var Content = null ;

    switch (role) {
      case 'student': 
        Content = 
          <View>
            <Button
              title="Thông tin cá nhân"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('MyInfo')}
            />
            <Button
              title="Xem khóa học của bạn"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('MyCourse')}
            />
          </View>
        break;

      case 'teacher': 
        Content = 
          <View>
            <Button
              title="Điểm danh"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('Attendance')}
            />
            <Button
              title="Xem khóa học của bạn"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('MyCourse')}
            />
          </View>
        break;

      case 'educator': 
        Content = 
          <View>
            <Button
              title="Danh sách khóa học"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('ViewCourse')}
            />
            <Button
              title="Lịch sử điểm danh"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('ViewAttendance')}
            />
          </View>
        break;

      case 'ministry': 
        Content = 
          <View>
            <Button
              title="Quản lý khóa học"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('ManageCourses')}
            />
          </View>
        break;

      case 'manager': 
        Content = 
          <View>
            <Button
              title="Tạo tài khoản"
              titleStyle={{ fontWeight: '700', color: 'white' }}
              buttonStyle={{
                marginHorizontal: 52,
                marginTop:20,
                backgroundColor: 'grey',
                borderRadius: 20
              }}
              onPress={()=>this.props.navigation.navigate('CreateAccount')}
            />
          </View>
        break;
      case 'admin': 
        Content = 
          <View>
          </View>
        break;
      default: break;
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(241,240,241,1)' }}>
        {
          loading
          ?
          <View style={styles.container}> 
            <ActivityIndicator size="large" />
          </View>
          :
          <View> 
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
              <Text style={styles.nameHeader}>Xin chào <Text style={{fontWeight:'bold'}}>{name},</Text></Text>
            </View>
            <View style={styles.center}>
              <View style={{marginHorizontal:85}}>
                <Image
                  source={LOGO_IMAGE}
                  style={{ width: 180, height: 150 }}
                />
              </View>
              <View style={{ marginVertical: 30 }}>
                <Text style={{fontWeight:'bold', fontSize: 18, textAlign: 'center'}}>{schoolName}</Text>
              </View>
              {Content}
            </View>
          </View>
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
    fontSize: 18,
    marginLeft: 20,
  },
  center: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  school: state.school
});
export default connect(mapStateToProps, { getSchool })(Dashboard); 