import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Profile from '../views/Profile';

const ProfileDrawerItem = createStackNavigator(
  {
    Profile: {
      screen: Profile,

      navigationOptions: ({ navigation }) => ({
        title: 'Hồ sơ ',
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

ProfileDrawerItem.navigationOptions = {
  drawerLabel: 'Hồ sơ ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="person"
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

export default ProfileDrawerItem;
