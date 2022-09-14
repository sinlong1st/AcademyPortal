import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Logout from './drawer/Logout'
import { DrawerItems } from 'react-navigation';

class CustomDrawerContentComponent extends Component {

  render() {
    const { role } = this.props.auth.user
    const { items, ...rest } = this.props;
    let Items;

    switch (role) {
      case 'student': Items =  
        items.filter(
          item => 
            item.key === "Dashboard" || 
            item.key === "Profile" || 
            item.key === "MyInfo" ||
            item.key === "MyCourse" ||
            item.key === "ChangePassword" 
        );
        break;
      case 'teacher': Items =  
        items.filter(item => 
          item.key === "Dashboard" || 
          item.key === "Profile" || 
          item.key === "Attendance" ||
          item.key === "MyCourse" ||
          item.key === "ChangePassword"             
        );
        break;
      case 'educator': Items = 
        items.filter(item => 
          item.key === "Dashboard" || 
          item.key === "Profile" || 
          item.key === "ViewCourse" ||
          item.key === "ViewAttendance" ||
          item.key === "ChangePassword" 
        );
        break;
      case 'ministry': Items =  
        items.filter(item => 
          item.key === "Dashboard" || 
          item.key === "Profile" || 
          item.key === "ManageCourses" ||
          item.key === "ChangePassword" 
        );
        break;  
      case 'admin': Items =  
        items.filter(item => 
          item.key === "Dashboard" || 
          item.key === "Profile" || 
          item.key === "ViewCourse" || 
          item.key === "ManageCourses" || 
          item.key === "Attendance" || 
          item.key === "ViewAttendance" ||
          item.key === "CreateAccount"  ||
          item.key === "ChangePassword" 
        );
        break;     
      case 'manager': Items = 
        items.filter(item => 
          item.key === "Dashboard" || 
          item.key === "Profile" ||
          item.key === "CreateAccount" ||
          item.key === "ChangePassword"           
        );
        break;
      default : Items = items; break;
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#43484d' }}>
        <ScrollView>
          <View
            style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={require('./images/Ai-Edu.png')}
              style={{ width: 50, height: 50}}
              resizeMode="contain"
            />
          </View>
          <View style={{ marginLeft: 10 }}>
          <DrawerItems items={Items} {...rest} />
          </View>
          <Logout navigation={this.props.navigation}/>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { })(CustomDrawerContentComponent); 