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
import LoginPage from './screens/LoginPage';
import SignUp from './screens/SignUp';
import LandPostScreen from './screens/LandPostScreen';
import LandDetails from './screens/LandDetails';
import ChatPage from './screens/ChatPage';
import MapPage from './screens/MapPage';




const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Space" component={SpaceScreen} options={{headerShown: false}}  />
        <Stack.Screen name="Message" component={MessageScreen} options={{headerShown: false}}/>
        <Stack.Screen name="User" component={UserScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Signup" component={SignUp} options={{headerShown: false}}/>
        <Stack.Screen name="LandPostScreen" component={LandPostScreen} options={{headerShown: false}}/>
        <Stack.Screen name="LandDetails" component={LandDetails} options={{headerShown: false}}/>
        <Stack.Screen name="ChatPage" component={ChatPage} options={{headerShown: false}}/>
        <Stack.Screen name="MapPage" component={MapPage} options={{headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
