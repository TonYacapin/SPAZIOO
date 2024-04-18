import React, { useState, useEffect } from 'react';
import { Text, View, Button, Modal, TextInput, Alert } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the custom theme
import theme from './theme';

const UserScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userid');
      if (storedUserId) {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://${address}/api/user/${storedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChangePassword = () => {
    setModalVisible(true);
  };

  const handleSubmitPasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `http://${address}/api/user/changepassword`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      setModalVisible(false);
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Logged out successfully!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        {userData && (
          <>
            <Text style={{ marginBottom: 20, ...theme.fonts.medium }}>Username: {userData.name}</Text>
            <Text style={{ marginBottom: 20, ...theme.fonts.medium }}>Email: {userData.email}</Text>
          </>
        )}
        <Button title="Change Password" onPress={handleChangePassword} />
        <Button title="Logout" onPress={handleLogout} />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 20 }}>
            <TextInput
              style={{ marginBottom: 10, padding: 10, borderRadius: 5, backgroundColor: '#fff', width: '100%' }}
              placeholder="Current Password"
              secureTextEntry={true}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={{ marginBottom: 10, padding: 10, borderRadius: 5, backgroundColor: '#fff', width: '100%' }}
              placeholder="New Password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={{ marginBottom: 10, padding: 10, borderRadius: 5, backgroundColor: '#fff', width: '100%' }}
              placeholder="Confirm New Password"
              secureTextEntry={true}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <Button title="Confirm" onPress={handleSubmitPasswordChange} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

export default UserScreen;
