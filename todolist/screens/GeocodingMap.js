import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function GeocodingMap({ navigation, route }) {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);



  useEffect(() => {
    // Request location permissions when component mounts
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please grant location access to use this feature.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };
  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedCoordinates(coordinate);
  };

  const handleGeocode = async () => {
    if (!selectedCoordinates) {
      Alert.alert('Error', 'Please select a location on the map.');
      return;
    }

    try {
      const address = await reverseGeocode(selectedCoordinates);
      if (route.params?.onLocationSelect) {
        route.params.onLocationSelect(selectedCoordinates, address);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      Alert.alert('Error', 'Failed to get address for selected location.');
    }
  };

  const reverseGeocode = async (coordinates) => {
    try {
      const location = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      // Assuming you want a formatted address
      const address = `${location[0].city}, ${location[0].region}, ${location[0].country}`;
      return address;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 16.2014,
          longitude: 121.1656,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        onPress={handleMapPress}
      >
        {selectedCoordinates && (
          <Marker
            coordinate={selectedCoordinates}
            title="Selected Location"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.geocodeButton} onPress={handleGeocode}>
          <Text style={styles.buttonText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#ADC178',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  geocodeButton: {
    backgroundColor: '#ADC178',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#F0EAD2',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
