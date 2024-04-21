import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button, Platform, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import address from './config.js';
import ModalDropdown from 'react-native-modal-dropdown';

import theme from './theme';

const MapScreen = ({ route }) => {
  const { initialRegion } = route.params;
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);

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
        const uniqueNames = [...new Set(response.data.map(land => `${land.landName} - ${land.locationName}`))];
        setDropdownOptions(uniqueNames);
      } catch (error) {
        console.error('Error fetching lands:', error);
        setError('Error fetching lands. Please try again later.');
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const searchMarker = () => {
    const results = lands.filter(
      land => land.landName.toLowerCase() === searchTerm.toLowerCase()
    );
  
    if (results.length === 0) {
      setSearchResult(null);
      alert('Marker not found.');
    } else if (results.length === 1) {
      const result = results[0];
      setSearchResult(result);
      mapRef.current.animateToRegion({
        latitude: result.location.coordinates[1],
        longitude: result.location.coordinates[0],
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      setDropdownOptions(results.map(land => `${land.landName} - ${land.locationName}`));
      setSearchResult(null);
      alert(`Multiple markers found with the name "${searchTerm}". Please choose one from the dropdown.`);
    }
  };

  const onSelectDropdown = (index) => {
    const selectedLandName = dropdownOptions[index];
    const result = lands.find(land => land.landName === selectedLandName);
    if (result) {
      setSearchResult(result);
      mapRef.current.animateToRegion({
        latitude: result.location.coordinates[1],
        longitude: result.location.coordinates[0],
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}
      {!loading && !error && lands.length > 0 && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
          >
            {lands.map((land, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: land.location.coordinates[1],
                  longitude: land.location.coordinates[0],
                }}
                title={land.landName || 'Unknown Name'}
                description={`Price: ₱${land.price || 'Unknown'}, Size: ${land.landSize || 'Unknown'}`}
              />
            ))}
          </MapView>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search by name..."
              onChangeText={setSearchTerm}
              value={searchTerm}
            />
            <Button title="Search" onPress={searchMarker} color={theme.colors.primary} />
          </View>
          {dropdownOptions.length > 0 && (
            <ModalDropdown
              options={dropdownOptions}
              style={styles.dropdown}
              dropdownStyle={styles.dropdownList}
              onSelect={onSelectDropdown}
              defaultIndex={null}
            />
          )}
          {!isWeb && lands.length === 0 && (
            <View style={styles.backButtonContainer}>
              <Button title="Back" onPress={handleBackButton} color={theme.colors.logoutButton} />
            </View>
          )}
        </>
      )}
      {!loading && !error && lands.length === 0 && <Text>No data found.</Text>}
      {error && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    color: theme.colors.text,
  },
  dropdown: {
    position: 'absolute',
    top: 72, // Adjust as needed
    left: 16,
    width: 200,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    padding: 8,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  dropdownList: {
    maxHeight: 200,
    backgroundColor: theme.colors.surface,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
});

export default MapScreen;
