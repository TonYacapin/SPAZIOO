import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Paragraph, IconButton, Appbar } from 'react-native-paper';
import io from 'socket.io-client';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import address from './config.js';

const socket = io(`${address}`); // Update with your server URL

function ChatPage({ route, navigation }) {
  const { sellerInfo, chatData } = route.params;

  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }
      
      const tokenParts = token.split('.');
      const payload = JSON.parse(decode(tokenParts[1]));
      const userId = payload.id;
      setLoggedInUserId(userId);
    };

    fetchLoggedInUserId();
  }, []);

  const handleInputChange = (text) => {
    setInputMessage(text);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !sellerInfo?._id) {
      console.error('Invalid data passed into request');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }
  
      const newMessage = {
        sender: loggedInUserId,
        content: inputMessage,
        chatId: chatData._id,
        timestamp: new Date().toISOString(),
      };
  
      const response = await axios.post(`http://${address}/api/message`, newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setInputMessage('');
      socket.emit('chat message', newMessage); // Send newMessage to the server
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };
  
  useEffect(() => {
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No token found. Please log in.');
          return;
        }

        const tokenParts = token.split('.');
        const payload = JSON.parse(decode (tokenParts[1]));
        const userId = payload.id;

        const response = await axios.get(`http://${address}/api/message/${chatData._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to fetch messages. Please try again.');
      }
    };

    fetchChatMessages();
  }, [sellerInfo]);

  const renderMessages = () => {
    return messages.map((message, index) => {
      let messageStyle = {};
      let contentStyle = {};
  
      if (message.sender._id === loggedInUserId) {
        // Message sent by the logged-in user
        messageStyle = { alignSelf: 'flex-end', marginRight: 5 };
        contentStyle = { backgroundColor: '#DDE5B6', color: '#F0EAD2' };
      } else {
        // Message received by the logged-in user
        messageStyle = { alignSelf: 'flex-start', marginLeft: 5 };
        contentStyle = { backgroundColor: '#ADC178', color: '#F0EAD2' };
      }
  
      // Check if the message has a 'content' property or 'text' property
      const messageContent = message.content ? message.content : message.text;
  
      return (
        <View key={index} style={[{ marginVertical: 5, maxWidth: '80%' }, messageStyle]}>
          <Card style={contentStyle}>
            <Card.Content>
              <Paragraph style={{ fontSize: 16 }}>{messageContent}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Paragraph style={{ fontSize: 12, color: '#888' }}>{message.timestamp}</Paragraph>
            </Card.Actions>
          </Card>
        </View>
      );
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ADC178' }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={sellerInfo ? sellerInfo.name : 'Chat'} />
      </Appbar.Header>
      <ScrollView style={{ flex: 1, padding: 10 }}>
        {renderMessages()}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TextInput
          label="Type your message..."
          value={inputMessage}
          onChangeText={handleInputChange}
          style={{ flex: 1, marginRight: 10, backgroundColor: '#F0EAD2' }}
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          style={{ borderRadius: 5, backgroundColor: '#DDE5B6' }}
        >
          Send
        </Button>
        <IconButton
          icon="attachment"
          color="#F0EAD2"
          size={20}
          style={{ marginLeft: 10 }}
          onPress={() => {
            // Handle attachment button press
          }}
        />
        <IconButton
          icon="camera"
          color="#F0EAD2"
          size={20}
          style={{ marginLeft: 10 }}
          onPress={() => {
            // Handle camera button press
          }}
        />
      </View>
    </View>
  );
}

export default ChatPage;
