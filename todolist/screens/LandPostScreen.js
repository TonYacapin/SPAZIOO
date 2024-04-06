import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { TextInput, RadioButton, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { decode } from 'base-64';
import { MaterialIcons } from '@expo/vector-icons';

const LandPostScreen = () => {
  const [landName, setLandName] = useState('');
  const [landSize, setLandSize] = useState('');
  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [option, setOption] = useState('Buy');
  const [isAvailable, setIsAvailable] = useState(true);
  const [description, setDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({}); // Default empty object

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params && route.params.selectedLocation) {
      setSelectedLocation(route.params.selectedLocation);
    }
    if (route.params && route.params.selectedLocationAddress) {
      setSelectedLocation(route.params.selectedCoordinate);
      setLocationName(route.params.selectedLocationAddress);
    }
    console.log('Selected Location:', selectedLocation);
  }, [route.params]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleSignUp = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      const tokenParts = token.split('.');
      const payload = JSON.parse(decode(tokenParts[1]));
      const userId = payload.id;

      const data = {
        landName,
        landSize,
        locationName,
        location: {
          type: 'Point',
          coordinates: [selectedLocation.longitude, selectedLocation.latitude],
        },
        price,
        option,
        isAvailable,
        description,
        seller: userId,
      };

      if (imageUri && imageName) {
        const base64 = await convertImageToBase64(imageUri);
        data.base64Image = base64;
      }

      const response = await axios.post('http://192.168.0.100:4000/upload', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setMessage('Land posted successfully!');
        setError(null);
        setLandName('');
        setLandSize('');
        setLocationName('');
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

  const handlePinpointLocation = () => {
    navigation.navigate('GeocodingMap', {
      onLocationSelect: handleLocationSelect,
    });
  };

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setLocationName(address);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>Post Land</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}

      <TextInput
        label="Land Name"
        value={landName}
        onChangeText={(text) => setLandName(text)}
        style={styles.input}
      />

      <TextInput
        label="Land Size"
        value={landSize}
        onChangeText={(text) => setLandSize(text)}
        style={styles.input}
      />

      <View style={styles.locationContainer}>
        <ScrollView style={styles.locationScrollView}>
          <TextInput
            label="Location"
            value={locationName}
            onChangeText={(text) => setLocationName(text)}
            style={styles.locationInput}
            multiline
            textAlignVertical="top"
            placeholder="Enter location here"
            disabled
          />
        </ScrollView>
        <TouchableOpacity style={styles.buttonLocation} onPress={handlePinpointLocation}>
          <MaterialIcons name="location-on" size={24} color="#333" />
          <Text style={styles.buttonText}>Pinpoint Location</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        label="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        style={styles.input}
      />

      <View style={styles.radioContainer}>
        <Text>Option:</Text>
        <RadioButton.Group onValueChange={(newValue) => setOption(newValue)} value={option}>
          <View style={styles.radioGroup}>
            <RadioButton.Item label="Rent" value="Rent" color="#ADC178" />
            <RadioButton.Item label="Lease" value="Lease" color="#ADC178" />
            <RadioButton.Item label="Sale" value="Sale" color="#ADC178" />
          </View>
        </RadioButton.Group>
      </View>

      <TextInput
        label="Land Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
       {/* <MaterialIcons name="image" size={24} color="#333" /> */}
        <Text style={styles.buttonText}>SELECT IMAGE</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        {/* <MaterialIcons name="check" size={24} color="#333" /> */}
        <Text style={styles.buttonText}>POST LAND</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Home')}
      >
        {/* <MaterialIcons name="arrow-back" size={24} color="#333" /> */}
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ADC178',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#F0EAD2',
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#DDE5B6',
    color: '#333',
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#DDE5B6',
    padding: 10,
    borderRadius: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#DDE5B6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  message: {
    color: 'green',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#DDE5B6',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    minHeight: 60,
    paddingVertical: 10,
    backgroundColor: '#DDE5B6',
  },
  locationScrollView: {
    flex: 1,
    maxHeight: 150, // Set maximum height for the ScrollView
  },
});

export default LandPostScreen;
