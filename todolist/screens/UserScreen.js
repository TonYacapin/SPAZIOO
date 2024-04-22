import React, { useState, useEffect } from 'react';
import { Text, View, Modal, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icon library
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
      <View style={styles.container}>
        <FontAwesome name="user-circle" size={100} color={theme.colors.primary} style={styles.userIcon} />
        {userData && (
          <>
            <Text style={styles.userInfo}>Username: {userData.name}</Text>
            <Text style={styles.userInfo}>Email: {userData.email}</Text>
          </>
        )}
        <TouchableOpacity style={[styles.button, styles.changePasswordButton]} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry={true}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry={true}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleSubmitPasswordChange}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  userIcon: {
    marginBottom: 30,
  },
  userInfo: {
    marginBottom: 20,
    fontFamily: 'Roboto',
    fontSize: 16,
    color: theme.colors.text,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  changePasswordButton: {
    backgroundColor: theme.colors.primary,
  },
  logoutButton: {
    backgroundColor: theme.colors.logoutButton,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 20,
  },
  input: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '100%',
    fontFamily: 'Roboto',
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
  },
});

export default UserScreen;
