import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import espasyoIcon from '../assets/Logo1.png';
import SidebarMenu from './SidebarMenu';

const HomePage = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem('name');
      if (storedName) {
        setName(storedName);
      }
    };
    fetchName();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Image source={espasyoIcon} style={styles.espasyoIcon} />
          <Text style={styles.titleText}>Spazio</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userName}>{name}</Text>
          <IconButton
            icon="menu"
            size={24}
            color="#F0EAD2"
            style={styles.hamburgerIcon}
            onPress={toggleSidebar}
          />
        </View>
      </View>
      <Text style={styles.welcomeText}>Welcome to Spazio</Text>

      <View style={styles.content}>
        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Space')}>
            <IconButton
              icon="map-marker"
              color="#F0EAD2"
              size={30}
              style={styles.iconButton}
            />
            <Text style={styles.buttonText}>Space</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Message')}>
            <IconButton
              icon="message"
              color="#F0EAD2"
              size={30}
              style={styles.iconButton}
            />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TransactionsPage')}>
            <IconButton
              icon="clipboard-text"
              color="#F0EAD2"
              size={30}
              style={styles.iconButton}
            />
            <Text style={styles.buttonText}>Transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.replace('MapPage')}>
            <IconButton
              icon="map"
              color="#F0EAD2"
              size={30}
              style={styles.iconButton}
            />
            <Text style={styles.buttonText}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isSidebarOpen && (
        <>
          <TouchableWithoutFeedback onPress={closeSidebar}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.sidebar}>
            <SidebarMenu navigation={navigation} />
          </View>
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADC178',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerIcon: {
    marginLeft: 10,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0EAD2',
  },
  welcomeText: {
    fontSize: 18,
    color: '#F0EAD2',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#DDE5B6',
    padding: 10,
    borderRadius: 5,
    width: '45%', // Adjust this width as needed
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  espasyoIcon: {
    width: 50,
    height: 30,
  },
  userName: {
    color: '#F0EAD2',
    marginRight: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    width: '80%',
    zIndex: 100,
    
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
});

export default HomePage;
