// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';

import espasyoIcon from './assets/Logo1.png';
import HomeScreen from './screens/HomePage'; // Import your screen components
import SpaceScreen from './screens/SpacePage';
import MessageScreen from './screens/MessagePage';
import UserScreen from './screens/UserScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Space" component={SpaceScreen} options={{headerShown: false}}  />
        <Stack.Screen name="Message" component={MessageScreen} options={{headerShown: false}}/>
        <Stack.Screen name="User" component={UserScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
