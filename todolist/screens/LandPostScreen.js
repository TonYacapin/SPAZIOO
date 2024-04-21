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
  const [state, setState] = useState({
    landName: '',
    landSize: '',
    location: '',
    locationName: '',
    price: '',
    imageUri: null,
    imageName: '',
    base64Image: '',
    error: null,
    message: null,
    option: 'Buy',
    isAvailable: true,
    description: '',
    selectedLocation: {},
  });

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  useEffect(() => {
    if (route.params && route.params.selectedLocation) {
      setState(prevState => ({ ...prevState, selectedLocation: route.params.selectedLocation }));
    }
    if (route.params && route.params.selectedLocationAddress) {
      setState(prevState => ({
        ...prevState,
        selectedLocation: route.params.selectedCoordinate,
        locationName: route.params.selectedLocationAddress,
      }));
    }
  }, [route.params]);

  const handleSignUp = async () => {
    const {
      landName,
      landSize,
      locationName,
      price,
      description,
      imageUri,
      imageName,
      option,
      selectedLocation,
    } = state;

    const requiredFields = [landName, landSize, locationName, price, description, imageUri];
    if (requiredFields.some(field => !field)) {
      setState(prevState => ({ ...prevState, error: 'Please fill out all fields' }));
      return;
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      setState(prevState => ({ ...prevState, error: 'Price must be a valid number greater than 0' }));
      return;
    }

    if (Object.keys(selectedLocation).length === 0) {
      setState(prevState => ({ ...prevState, error: 'Please select a location' }));
      return;
    }

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
        isAvailable: true,
        description,
        seller: userId,
      };

      if (imageUri && imageName) {
        const base64 = await convertImageToBase64(imageUri);
        data.base64Image = base64;
      }

      const response = await axios.post(`http://${address}/upload`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setState(prevState => ({
          ...prevState,
          message: 'Land posted successfully!',
          error: null,
          landName: '',
          landSize: '',
          locationName: '',
          price: '',
          imageUri: null,
          imageName: '',
          option: 'Buy',
          isAvailable: true,
          description: '',
        }));
      }
    } catch (error) {
      console.error('Error posting land:', error);
      setState(prevState => ({ ...prevState, error: 'Error posting land. Please try again.', message: null }));
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
        setState(prevState => ({ ...prevState, imageUri: result.assets[0].uri, imageName: result.assets[0].uri.split('/').pop() }));
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
    setState(prevState => ({
      ...prevState,
      selectedLocation: location,
      locationName: address,
    }));
  };

  const { landName, landSize, locationName, price, description, imageUri } = state;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>Post Land</Text>

      {state.error && <Text style={styles.error}>{state.error}</Text>}
      {state.message && <Text style={styles.message}>{state.message}</Text>}

      <TextInput
        label="Land Name"
        value={landName}
        onChangeText={(text) => setState(prevState => ({ ...prevState, landName: text }))}
        style={styles.input}
      />

      <TextInput
        label="Land Size"
        value={landSize}
        onChangeText={(text) => setState(prevState => ({ ...prevState, landSize: text }))}
        style={styles.input}
      />

      <View style={styles.locationContainer}>
        <ScrollView style={styles.locationScrollView}>
          <TextInput
            label="Location"
            value={locationName}
            onChangeText={(text) => setState(prevState => ({ ...prevState, locationName: text }))}
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
        onChangeText={(text) => setState(prevState => ({ ...prevState, price: text }))}
        style={styles.input}
      />

      <View style={styles.radioContainer}>
        <Text>Option:</Text>
        <RadioButton.Group onValueChange={(newValue) => setState(prevState => ({ ...prevState, option: newValue }))} value={state.option}>
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
        onChangeText={(text) => setState(prevState => ({ ...prevState, description: text }))}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>SELECT IMAGE</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>POST LAND</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Home')}
      >
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
