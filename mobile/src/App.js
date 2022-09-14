import React, { Component } from 'react';
import AppLoading from "./components/AppLoading";
import { Dimensions } from 'react-native';
import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { cacheAssets, cacheFonts } from "./helpers/AssetsCaching";

import ProfileDrawerItem from './drawer/ProfileDrawerItem';
import MyCourseDrawerItem from './drawer/MyCourseDrawerItem';
import ViewCourseDrawerItem from './drawer/ViewCourseDrawerItem';
import AttendanceDrawerItem from './drawer/AttendanceDrawerItem';
import ViewAttendanceDrawerItem from './drawer/ViewAttendanceDrawerItem';
import ManageCoursesDrawerItem from './drawer/ManageCoursesDrawerItem';
import DashboardDrawerItem from './drawer/DashboardDrawerItem';
import MyInfoDrawerItem from './drawer/MyInfoDrawerItem';
import CreateAccountDrawerItem from './drawer/CreateAccountDrawerItem';
import ChangePasswordDrawerItem from './drawer/ChangePasswordDrawerItem';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

import Login from './views/Login';
import LoadingScreen from './views/LoadingScreen';

import CustomDrawerContentComponent from './CustomDrawerContentComponent';

const WINDOW_WIDTH = Dimensions.get('window').width;

const AppDrawer = createDrawerNavigator(
  {
    Dashboard: {
      path: '/dashboard',
      screen: DashboardDrawerItem,
    },
    Profile: {
      path: '/profile',
      screen: ProfileDrawerItem,
    },
    MyCourse: {
      path: '/my-course',
      screen: MyCourseDrawerItem,
    },
    ViewCourse: {
      path: '/view-course',
      screen: ViewCourseDrawerItem,
    },
    ManageCourses:{
      path: '/manage-course',
      screen: ManageCoursesDrawerItem,
    },
    Attendance:{
      path: '/check-attendance',
      screen: AttendanceDrawerItem,
    },
    ViewAttendance:{
      path: '/list-attendance',
      screen: ViewAttendanceDrawerItem,
    },
    MyInfo: {
      path: '/my-info',
      screen: MyInfoDrawerItem,
    },
    CreateAccount: {
      path: '/create-account',
      screen: CreateAccountDrawerItem,
    },
    ChangePassword: {
      path: '/change-password',
      screen: ChangePasswordDrawerItem,
    }
  },
  {
    initialRouteName: 'Dashboard',
    contentOptions: {
      activeTintColor: '#548ff7',
      activeBackgroundColor: 'transparent',
      inactiveTintColor: '#ffffff',
      inactiveBackgroundColor: 'transparent',
      labelStyle: {
        fontSize: 15,
        marginLeft: 0,
      },
    },
    drawerWidth: Math.min(WINDOW_WIDTH * 0.8, 300),
    contentComponent: CustomDrawerContentComponent,
  }
);


const Application = createAppContainer(createStackNavigator(
  { 
    Loading: LoadingScreen,
    Login: Login, 
    App: AppDrawer 
  },
  {
    headerMode: 'none',
    mode: 'modal',
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
));


export default class App extends Component {
  state = {
    isReady: false,
  };

  async _loadAssetsAsync() {
    const imageAssets = cacheAssets([
      require("../assets/images/student.png"),
      require("../assets/images/teacher.png"),
    ]);

    const fontAssets = cacheFonts({
      "FontAwesome": require("@expo/vector-icons/fonts/FontAwesome.ttf"),
      "Ionicons": require("@expo/vector-icons/fonts/Ionicons.ttf"),
      "Entypo": require("@expo/vector-icons/fonts/Entypo.ttf"),
      "SimpleLineIcons": require("@expo/vector-icons/fonts/SimpleLineIcons.ttf"),
      "MaterialIcons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
      "MaterialCommunityIcons": require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
    });

    await Promise.all([imageAssets, fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
        />
      );
    }

    return <Application />;
  }
}