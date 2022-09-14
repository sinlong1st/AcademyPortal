import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import ViewCourse from '../views/ViewCourse';
import PeopleInCourse from '../views/PeopleInCourse';
import StudentInfo from '../views/StudentInfo';
import LessonList from '../views/LessonList';
import Lesson from '../views/Lesson';


const MyCourse_Detail = createBottomTabNavigator(
  {
    LessonList: {
      screen: LessonList,
      path: '/lessonlist',
      navigationOptions: {
        tabBarLabel: 'Bài học ',
        tabBarIcon: ({ tintColor }) => (
          <Icon name='book' size={30} type="font-awesome" color={tintColor} />
        ),
      },
    },
    People: {
      screen: PeopleInCourse,
      path: '/people',
      navigationOptions: {
        tabBarLabel: 'Mọi người ',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="users" size={30} type="font-awesome" color={tintColor} />
        )
      }
    }
  },
  {
    initialRouteName: 'LessonList',
    animationEnabled: false,
    swipeEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#e91e63',
      showIcon: true,
    },
  }
);

const ViewCourseDrawerItem = createStackNavigator(
  {
    ViewCourse: {
      screen: ViewCourse,
      path: '/',
      navigationOptions: ({ navigation }) => ({
        title: 'Danh sách khóa học ',
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
    MyCourse_Detail: {
      screen: MyCourse_Detail,
      path: '/mycourse_detail',
      navigationOptions: {
        title: 'Chi tiết khóa học ',
      }
    },
    StudentInfo: {
      screen: StudentInfo,
      path: '/student-info',
      navigationOptions: {
        title: 'Thông tin học viên ',
      }
    },
    Lesson: {
      screen: Lesson,
      path: '/lesson',
      navigationOptions: {
        title: 'Nội dung bài học ',
      }
    }
  }
);

ViewCourseDrawerItem.navigationOptions = {
  drawerLabel: 'Danh sách khóa học ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="book"
      size={30}
      iconStyle={{
        width: 30,
        height: 30,
      }}
      type="material"
      color={tintColor}
    />
  ),
};

export default ViewCourseDrawerItem;
