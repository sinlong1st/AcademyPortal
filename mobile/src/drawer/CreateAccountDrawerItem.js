import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import CreateAccount from '../views/CreateAccount';

const CreateAccountItem = createStackNavigator(
  {
    CreateAccount: {
      screen: CreateAccount,

      navigationOptions: ({ navigation }) => ({
        title: 'Tạo tài khoản ',
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

CreateAccountItem.navigationOptions = {
  drawerLabel: 'Tạo tài khoản ',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="user-plus"
      size={25}
      iconStyle={{
        width: 30,
        height: 30,
      }}
      type="font-awesome"
      color={tintColor}
    />
  ),
};

export default CreateAccountItem;
