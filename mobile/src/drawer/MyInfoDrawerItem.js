import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import MyInfo from '../views/MyInfo';

const MyInfoDrawerItem = createStackNavigator(
  {
    MyInfo: {
      screen: MyInfo,

      navigationOptions: ({ navigation }) => ({
        title: 'Thông tin cá nhân ',
        headerLeft: (
          <Icon
            name="menu"
            size={30}
            type="entypo"
            iconStyle={{ paddingLeft: 10 }}
            onPress={navigation.toggleDrawer}
          />
        ),
      }),
    },
  }
);

MyInfoDrawerItem.navigationOptions = {
  drawerLabel: 'Thông tin cá nhân ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="user-circle-o"
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

export default MyInfoDrawerItem;
