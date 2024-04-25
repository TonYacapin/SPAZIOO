import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import address from './config.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageLand = () => {
  const [lands, setLands] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem('userid');
        setUserId(id);
        if (id) {
          const response = await axios.get(`http://${address}/api/manageland?seller=${id}`);
          setLands(response.data);
        } else {
          console.error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const updateAvailability = async (landId, isAvailable) => {
    try {
      await axios.put(`http://${address}/lands/${landId}/updateAvailability`, { isAvailable });
      setLands(prevLands =>
        prevLands.map(land =>
          land._id === landId ? { ...land, isAvailable: isAvailable } : land
        )
      );
    } catch (error) {
      console.error('Error updating land availability:', error);
    }
  };

  const renderLandItem = ({ item }) => (
    <View style={styles.landItem}>
      <Text>Land Name: {item.landName}</Text>
      <Text>Location: {item.location.locationName}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>Availability: {item.isAvailable ? 'Available' : 'Not Available'}</Text>
      <Button
        title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
        onPress={() => updateAvailability(item._id, !item.isAvailable)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Land</Text>
      <FlatList
        data={lands}
        renderItem={renderLandItem}
        keyExtractor={item => item._id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  landItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default ManageLand;
