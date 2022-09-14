import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import ChangePassword from '../views/ChangePassword';

const ChangePasswordDrawerItem = createStackNavigator(
  {
    ChangePassword: {
      screen: ChangePassword,
      path: '/',
      navigationOptions: ({ navigation }) => ({
        title: 'Đổi mật khẩu ',
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

ChangePasswordDrawerItem.navigationOptions = {
  drawerLabel: 'Đổi mật khẩu ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="lock"
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

export default ChangePasswordDrawerItem;
