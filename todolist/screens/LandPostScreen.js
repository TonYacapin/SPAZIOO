import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // Import axios

const LandPostScreen = () => {
  const [landName, setLandName] = useState('');
  const [landSize, setLandSize] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');
  const [base64Image, setBase64Image] = useState('');

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

  try {
    const response = await axios.post('http://192.168.0.106:4000/upload', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error posting land:', error);
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
        aspect: [4, 3],
        quality: 1,
       
      });
  
      console.log('Image Picker Result:', result);
  
      if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
        setImageName(result.assets[0].uri.split('/').pop()); // Set the image name
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

  console.log('Image URI:', imageUri); // Check the imageUri in console

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Post Land</Text>

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
});

export default LandPostScreen;
