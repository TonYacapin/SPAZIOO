// SpacePage.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const SpacePage = () => {
  const navigation = useNavigation();

  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await fetch('http://192.168.0.106:4000/api/lands'); // Update with your backend URL
      const data = await response.json();
      setLands(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lands:', error);
    }
  };

  const renderLandItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.landName}</Text>
        <Text style={styles.cardText}>Size: {item.landSize}</Text>
        <Text style={styles.cardText}>Location: {item.location}</Text>
        <Text style={styles.cardText}>Price: {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lands}
        renderItem={renderLandItem}
        keyExtractor={item => item._id}
      />

      
<TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.replace('Home')}>
        <Text style={styles.signUpText}>BACK</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({

  signUpBtn: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#221307',
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: 120,
    height: 120,
  },
  cardDetails: {
    flex: 1,
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpacePage;
