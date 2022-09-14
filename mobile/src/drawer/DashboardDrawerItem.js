import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Dashboard from '../views/Dashboard';

const DashboardDrawerItem = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      path: '/',
      navigationOptions: ({ navigation }) => ({
        title: 'Trang chủ ',
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
    }
  }
);

DashboardDrawerItem.navigationOptions = {
  drawerLabel: 'Trang chủ ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="home"
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

export default DashboardDrawerItem;
