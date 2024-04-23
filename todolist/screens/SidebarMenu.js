import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Snackbar, DefaultTheme, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the custom theme
import theme from './theme';

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity
        onPress={() => navigateToScreen('User')}
        style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      >
        <IconButton
          icon="account"
          color={theme.colors.text}
          size={24}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>User</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateToScreen('LandPostScreen')}
        style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      >
        <IconButton
          icon="earth"
          color={theme.colors.text}
          size={24}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Post Land</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateToScreen('Message')}
        style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      >
        <IconButton
          icon="message"
          color={theme.colors.text}
          size={24}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.menuItem, { backgroundColor: theme.colors.primary }]}
      >
        <IconButton
          icon="logout"
          color={theme.colors.text}
          size={24}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Logout</Text>
      </TouchableOpacity>

      {/* Updated Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={2000}
        style={{ marginBottom: 20 }} // Removed backgroundColor to use default color
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  menuItemText: {
    fontSize: 18,
  },
});

export default SidebarMenu;