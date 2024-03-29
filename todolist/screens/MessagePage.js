import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const MessagePage = () => {
  const [chats, setChats] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          return;
        }

        const response = await axios.get('http://192.168.0.111:4000/api/chat/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
        Alert.alert('Error', 'Failed to fetch chats. Please try again.');
      }
    };

    fetchChats();

    const fetchLoggedInUserId = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }
      
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id;
      setLoggedInUserId(userId);
    };

    fetchLoggedInUserId();
  }, []);

  const handleChatPress = async (chatData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      // Find the other user's ID in the users array
      const otherUserId = chatData.users.find(user => user._id !== loggedInUserId)._id;

      // Access the chat for the current user and the other user
      const response = await axios.post('http://192.168.0.111:4000/api/chat/', { userId: otherUserId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data._id) {
        // Navigate to ChatPage with chatData and otherUser information
        navigation.navigate('ChatPage', { chatData: response.data });
      }
    } catch (error) {
      console.error('Error creating/accessing chat:', error);
      Alert.alert('Error', 'Failed to create/access chat. Please try again.');
    }
  };

  const renderChatItem = ({ item }) => {
    const otherUser = item.users.find(user => user._id !== loggedInUserId);
    const latestMessage = item.latestMessage;
  
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
        <Text style={styles.chatName}>{otherUser.name}</Text>
        {/* Render the content property of latestMessage */}
        <Text style={styles.lastMessage}>{latestMessage.content}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.title}>
          <Ionicons name="chevron-back" size={24} color="#F0EAD2" style={styles.hamburgerIcon} />
          <Text style={styles.titleText}>Messages</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatlistContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lastMessage: {
    fontSize: 14,
    color: '#F0EAD2',
  },
  container: {
    flex: 1,
    backgroundColor: '#ADC178',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
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
  hamburgerIcon: {
    marginRight: 10,
  },
  flatlistContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0EAD2',
  },
});

export default MessagePage;