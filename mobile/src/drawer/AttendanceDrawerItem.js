import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import MyCourseAttendance from '../views/MyCourseAttendance';
import CheckAttendance from '../views/Attendance/CheckAttendance';


const AttendanceDrawerItem = createStackNavigator(
  {
    MyCourseAttendance: {
      screen: MyCourseAttendance,
      path: '/',
      navigationOptions: ({ navigation }) => ({
        title: 'Điểm danh ',
        headerLeft: (
          <Icon
            name="menu"
            size={30}
            type="entypo"
            iconStyle={{ paddingLeft: 10 }}
            onPress={navigation.toggleDrawer}
          />
        ),
      })
    },
    CheckAttendance: {
      screen: CheckAttendance,
      path: '/check-attendance',
      navigationOptions: {
        title: 'Chi tiết điểm danh ',
      }
    }
  }
);

AttendanceDrawerItem.navigationOptions = {
  drawerLabel: 'Điểm danh ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="check"
      size={30}
      iconStyle={{
        width: 30,
        height: 30,
      }}
      type="font-awesome"
      color={tintColor}
    />
  ),
};

export default AttendanceDrawerItem;
