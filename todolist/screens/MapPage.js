import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import address from './config.js';

const MapScreen = () => {
  const navigation = useNavigation();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialRegion = {
    latitude: 16.2014,
    longitude: 121.1656,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const isWeb = Platform.OS === 'web';

  const handleBackButton = () => {
    navigation.replace('Home');
  };

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get(`http://${address}/api/lands`);
        setLands(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lands:', error);
        setError('Error fetching lands. Please try again later.');
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  return (
    <View style={styles.container}>
      {!loading && !error && lands.length > 0 && (
        <>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
          >
            {lands.map((land, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: land?.location?.coordinates[1],
                  longitude: land?.location?.coordinates[0],
                }}
                title={land?.landName || 'Unknown Name'}
                description={`Price: ₱${land?.price || 'Unknown'}, Size: ${land?.landSize || 'Unknown'}`}
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
        </>
      )}
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
      {!loading && !error && lands.length === 0 && <Text>No data found.</Text>}
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
