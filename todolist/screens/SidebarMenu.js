import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Snackbar, DefaultTheme, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the custom theme
import theme from './theme';

const SidebarMenu = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // State to hold user's verification status

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const verificationStatus = await AsyncStorage.getItem('isVerified'); // Retrieve verification status
        setIsVerified(verificationStatus === 'true'); // Convert string to boolean
      } catch (error) {
        console.error('Error fetching verification status:', error.message);
      }
    };
    checkVerificationStatus();
  }, []);

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
    <ScrollView contentContainerStyle={styles.container}>
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

      {/* Conditionally render "Post Land" if user is verified */}
      {isVerified ? (
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
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('ContactUs')} // Navigate to Contact Us screen for verification
          style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon="alert-circle-outline"
              color={theme.colors.error}
              size={24}
              style={{ marginRight: 10 }}
            />
           <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
  You are not verified. To post land, please verify your account by contacting us.
</Text>


          </View>
        </TouchableOpacity>
      )}

      {/* Conditionally render "Manage Land" if user is verified */}
      {isVerified && (
        <TouchableOpacity
          onPress={() => navigateToScreen('ManageLand')}
          style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
        >
          <IconButton
            icon="cog"
            color={theme.colors.text}
            size={24}
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Manage Land</Text>
        </TouchableOpacity>
      )}

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
        onPress={() => navigateToScreen('LandPostScreen')}
        style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      >
        <IconButton
          icon="book"
          color={theme.colors.text}
          size={24}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>User Manual</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 20,
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
    fontSize: 15,
    flex: 1,
  },
});

export default SidebarMenu;
