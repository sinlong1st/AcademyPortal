import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import CourseAttendance from '../views/CourseAttendance';
import ListAttendance from '../views/Attendance/ListAttendance';

const AttendanceDrawerItem = createStackNavigator(
  {
    CourseAttendance: {
      screen: CourseAttendance,
      path: '/',
      navigationOptions: ({ navigation }) => ({
        title: 'Lịch sử điểm danh ',
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
    ListAttendance: {
      screen: ListAttendance,
      path: '/list-attendance',
      navigationOptions: {
        title: 'Chi tiết lịch sử điểm danh ',
      }
    }
  }
);

AttendanceDrawerItem.navigationOptions = {
  drawerLabel: 'Lịch sử điểm danh ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="history"
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
