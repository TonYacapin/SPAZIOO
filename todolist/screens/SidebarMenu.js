import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SidebarMenu = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage or any other logout logic
      await AsyncStorage.clear();
      console.log('Logged out successfully!');
      setSnackbarVisible(true);
      navigation.replace('Login'); // Navigate to Login screen after logout
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ADC178' }]}>
      <TouchableOpacity
        onPress={() => navigateToScreen('LandPostScreen')}
        style={[styles.menuItem, { backgroundColor: '#DDE5B6' }]}
      >
        <Text style={[styles.menuItemText, { color: '#345243' }]}>Post Land</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateToScreen('TransactionsPage')}
        style={[styles.menuItem, { backgroundColor: '#DDE5B6' }]}
      >
        <Text style={[styles.menuItemText, { color: '#345243' }]}>Transactions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.menuItem, { backgroundColor: '#DDE5B6' }]}
      >
        <Text style={[styles.menuItemText, { color: '#345243' }]}>Logout</Text>
      </TouchableOpacity>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000} // Snackbar will be visible for 2 seconds
        style={{ backgroundColor: '#333', marginBottom: 20 }}
        action={{
          label: 'Close',
          onPress: onDismissSnackbar,
        }}
      >
        Logged out successfully!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
  },
});

export default SidebarMenu;
