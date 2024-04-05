import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import address from './config.js';

export const SpacePage = () => {
  const navigation = useNavigation();

  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      // Retrieve the JWT token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await axios.get(`http://${address}/api/lands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setLands(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching lands:', error.message);
      setError('Error fetching lands. Please try again.');
      setLoading(false);
    }
  };

  const renderLandItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => viewLandDetails(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.landName}</Text>
        <Text style={styles.cardText}>Size: {item.landSize}</Text>
        <Text style={styles.cardText}>Location: {item.locationName}</Text>
        <Text style={styles.cardText}>Price: {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const viewLandDetails = (land) => {
    // Navigate to LandDetails screen with the land object
    navigation.navigate('LandDetails', { land });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lands}
        renderItem={renderLandItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  flatListContent: {
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  backButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default SpacePage;
