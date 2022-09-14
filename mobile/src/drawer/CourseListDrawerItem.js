import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import CourseList from '../views/CourseList';
import CourseDetail from '../views/CourseDetail';

const CourseListDrawerItem = createStackNavigator(
  {
    CourseList: {
      screen: CourseList,
      path: '/',
      navigationOptions: ({ navigation }) => ({
        title: 'Tất cả khóa học ',
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
    CourseDetail: {
      screen: CourseDetail,
      path: '/course_detail',
      navigationOptions: {
        title: 'Thông tin khóa học ',
      }
    }
  }
);

CourseListDrawerItem.navigationOptions = {
  drawerLabel: 'Tất cả khóa học ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="list"
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

export default CourseListDrawerItem;
