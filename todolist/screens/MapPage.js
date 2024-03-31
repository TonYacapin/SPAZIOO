import React from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { dummyData } from '../data/dummyData'; // Import dummyData array from data folder
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const MapScreen = () => {
  const navigation = useNavigation(); // Initialize useNavigation hook

  const initialRegion = {
    latitude: 16.2014,
    longitude: 121.1656,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  // Check if the platform is web
  const isWeb = Platform.OS === 'web';

  // Define handleBackButton function to navigate back to the previous screen
  const handleBackButton = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
             {/* {isWeb ? (
        <WebView
          source={{ uri: 'https://your-map-website-url.com' }} // Replace with your Google Maps JavaScript API URL
          style={styles.map}
        />
      ) : ( */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {dummyData.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={`Price: ₱${marker.price}, Rating: ${marker.rating}`}
          />
        ))}
      </MapView>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Nueva Vizcaya, Philippines</Text>
      </View>
      {!isWeb && (
        <View style={styles.backButtonContainer}>
          <Button title="Back" onPress={handleBackButton} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
});

export default MapScreen;
