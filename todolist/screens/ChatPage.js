import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button, Card, Paragraph, IconButton } from 'react-native-paper';
import io from 'socket.io-client';

const socket = io('http://192.168.0.109:4000'); // Update with your server URL

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleInputChange = (text) => {
    setInputMessage(text);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') {
      return;
    }
  
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      timestamp: new Date().toISOString(),
      type: 'sent', // Set message type to 'sent' for messages sent by current user
    };
  
    // Update the UI with the sent message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
  
    // Emit the new message to the server
    socket.emit('chat message', newMessage);
  };

  useEffect(() => {
    socket.on('chat message', (message) => {
      // Check if the received message is sent by the current user
      const messageType = message.type === 'sent' ? 'sent' : 'received';

      // Update the message object with the correct type
      const newMessage = {
        ...message,
        type: messageType,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const renderMessages = () => {
    return messages.map((message, index) => {
      let messageStyle = {};
      let contentStyle = {};
      if (message.type === 'sent') {
        messageStyle = { alignSelf: 'flex-end', marginRight: 5 };
        contentStyle = { backgroundColor: '#DDE5B6', color: '#F0EAD2' };
      } else {
        messageStyle = { alignSelf: 'flex-start', marginLeft: 5 };
        contentStyle = { backgroundColor: '#ADC178', color: '#F0EAD2' };
      }

      return (
        <View key={index} style={[{ marginVertical: 5, maxWidth: '80%' }, messageStyle]}>
          <Card style={contentStyle}>
            <Card.Content>
              <Paragraph style={{ fontSize: 16 }}>{message.text}</Paragraph>
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
