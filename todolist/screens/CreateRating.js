import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute hook
import { Button, Snackbar } from 'react-native-paper';
import axios from 'axios';
import address from './config.js';

const CreateRating = () => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  const route = useRoute(); // Use useRoute hook to access route object

  // Extract landId and userId from route.params
  const { landId, userId } = route.params;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://${address}/api/ratings`, {
        land: landId,
        user: userId,
        rating,
        comment,
      });
      setLoading(false);
      setSuccess(true);
      setVisible(true);
      console.log('Rating created:', response.data);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
      console.error('Error creating rating:', error.response.data.message);
    }
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };
  
  const renderStars = () => {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {[...Array(5)].map((_, index) => (
          <Text
            key={index}
            onPress={() => handleStarClick(index + 1)}
            style={{ fontSize: 24, color: index < rating ? '#FFD700' : '#A9A9A9', marginRight: 5 }}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Rate Land</Text>
      <View style={{ width: '100%', marginBottom: 10 }}>
        <TextInput
          value={comment}
          onChangeText={(text) => setComment(text)}
          multiline
          placeholder="Type your comment here..."
          placeholderTextColor="#A9A9A9"
          style={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
          maxLength={255} // Maximum characters set to 255
        />
      </View>
      <View style={{ width: '100%', marginBottom: 20 }}>{renderStars()}</View>
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={loading}
        loading={loading}
        style={{ backgroundColor: '#ADC178', width: '100%' }}
      >
        {loading ? 'Loading...' : 'Submit'}
      </Button>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#008000' }}
      >
        Rating created successfully!
      </Snackbar>
      {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
    </View>
  );
};

export default CreateRating;
