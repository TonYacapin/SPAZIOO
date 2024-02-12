// StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomePage'; // Import your screen components
import SpaceScreen from './screens/SpacePage';
import MessageScreen from './screens/MessagePage';
import UserScreen from './screens/UserScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
        
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Space" component={SpaceScreen} />
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
