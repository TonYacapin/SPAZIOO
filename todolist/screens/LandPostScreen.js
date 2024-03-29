import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';


const LandPostScreen = () => {
  const [landName, setLandName] = useState('');
  const [landSize, setLandSize] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [option, setOption] = useState('Buy');
  const [isAvailable, setIsAvailable] = useState(true);
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const handleSignUp = async () => {
    try {
      // Retrieve the JWT token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }
  
      // Decode the token to get user ID
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id; // Destructure user data from payload
  
      // Create form data
      const formData = new FormData();
      formData.append('landName', landName);
      formData.append('landSize', landSize);
      formData.append('location', location);
      formData.append('price', price);
  
      // Check if imageUri and imageName are not null
      if (imageUri && imageName) {
        // Convert image to base64
        const base64 = await convertImageToBase64(imageUri);
  
        // Set the base64 image in formData
        formData.append('base64Image', base64);
      }
  
      formData.append('option', option);
      formData.append('isAvailable', isAvailable);
      formData.append('description', description);
      
      // Add seller ID, username, and email to form data
      formData.append('seller', userId);

      // Make POST request to upload endpoint
      const response = await axios.post('http://192.168.0.111:4000/upload', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include Authorization header with JWT token
        },
      });
  
      console.log('Response:', response.data);
  
      if (response.status >= 200 && response.status < 300) {
        // Reset form fields after successful post
        setMessage('Land posted successfully!');
        setError(null);
        setLandName('');
        setLandSize('');
        setLocation('');
        setPrice('');
        setImageUri(null);
        setImageName('');
        setOption('Buy');
        setIsAvailable(true);
        setDescription('');
      }
    } catch (error) {
      console.error('Error posting land:', error);
      setError('Error posting land. Please try again.');
      setMessage(null);
    }
  };
  
  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = () => {
          reject('Error occurred while reading the image.');
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 2],
        quality: 1,
      });

      console.log('Image Picker Result:', result);

      if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
        setImageName(result.assets[0].uri.split('/').pop());
      } else {
        console.log('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  useEffect(() => {
    console.log('Image URI:', imageUri);
  }, [imageUri]);

  return (
    <View style={styles.container}>
    <Text style={styles.logo}>Post Land</Text>

    {error && <Text style={styles.error}>{error}</Text>}
    {message && <Text style={styles.message}>{message}</Text>}

    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="Land Name"
        onChangeText={(text) => setLandName(text)}
        value={landName}
      />
    </View>

    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="Land Size"
        onChangeText={(text) => setLandSize(text)}
        value={landSize}
      />
    </View>

    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="Location"
        onChangeText={(text) => setLocation(text)}
        value={location}
      />
    </View>

    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="Price"
        onChangeText={(text) => setPrice(text)}
        value={price}
      />
    </View>

    <View style={styles.radioContainer}>
      <Text>Option:</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, option === 'Rent' && styles.radioButtonSelected]}
          onPress={() => setOption('Rent')}
        >
          <Text style={styles.radioButtonText}>Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, option === 'Lease' && styles.radioButtonSelected]}
          onPress={() => setOption('Lease')}
          >
            <Text style={styles.radioButtonText}>Lease</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, option === 'Buy' && styles.radioButtonSelected]}
            onPress={() => setOption('Buy')}
          >
            <Text style={styles.radioButtonText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Land Description"
          onChangeText={(text) => setDescription(text)}
          value={description}
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Select Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
        <Text style={styles.signUpText}>POST LAND</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpBtn}
        onPress={() => navigation.replace('Home')}
      >
        <Text style={styles.signUpText}>BACK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
  },
  imagePicker: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    height: 50,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#333',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  signUpBtn: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  message: {
    color: 'green',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  radioButton: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  radioButtonText: {
    color: '#333',
  },
});

export default LandPostScreen;