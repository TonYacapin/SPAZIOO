import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LandDetails = ({ route, navigation }) => {
  const { land } = route.params;
  const [sellerInfo, setSellerInfo] = useState(null);

  useEffect(() => {
    // Function to fetch seller information
    const fetchSellerInfo = async () => {
      try {
        // Retrieve the JWT token from AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get(`http://192.168.0.111:4000/api/user/${land.seller}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSellerInfo(response.data);
      } catch (error) {
        console.error('Error fetching seller information:', error);
      }
    };

    fetchSellerInfo();
  }, [land.seller]);

  const handleBackButton = () => {
    navigation.goBack();
  };

  const handleContactSeller = () => {
    console.log('Contact Seller');
    navigation.navigate('ChatPage');
  };

  const handleGoogleMaps = () => {
    console.log('Look at Google Maps');
  };

  return (
    <View style={styles.container}>
      <Card elevation={5} style={styles.card}>
        <Card.Cover source={{ uri: land.imageUrl }} resizeMode="cover" style={styles.image} />
        <Card.Content>
          <Title style={styles.title}>{land.landName}</Title>
          <View style={styles.infoContainer}>
            <Paragraph style={styles.info}>Size: {land.landSize}</Paragraph>
            <Paragraph style={styles.info}>Location: {land.location}</Paragraph>
            <Paragraph style={styles.info}>Price: {land.price}</Paragraph>
            <Paragraph style={styles.info}>Option: {land.option}</Paragraph>
            <Paragraph style={styles.info}>Available: {land.isAvailable ? 'Yes' : 'No'}</Paragraph>
            {sellerInfo && (
              <View>
                <Paragraph style={styles.info}>Seller Username: {sellerInfo.name}</Paragraph>
                <Paragraph style={styles.info}>Seller Email: {sellerInfo.email}</Paragraph>
              </View>
            )}
          </View>
          <Paragraph style={styles.description}>{land.description}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            icon="arrow-left"
            mode="outlined"
            onPress={handleBackButton}
            style={styles.backButton}
            labelStyle={styles.backButtonText}
          >
            Back
          </Button>
          <View style={styles.buttonContainer}>
            <Button
              icon="email"
              mode="contained"
              onPress={handleContactSeller}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Contact Seller
            </Button>
            <Button
              icon="map"
              mode="contained"
              onPress={handleGoogleMaps}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Google Maps
            </Button>
          </View>
          <IconButton
            icon="heart-outline"
            color="#F44336"
            size={30}
            style={styles.favoriteButton}
            onPress={() => console.log('Added to Favorites')}
          />
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  card: {
    marginBottom: 20,
    justifyContent: 'space-between',
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  backButton: {
    borderRadius: 8,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'column', // Changed to vertical
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    width: '70%', // Adjusted width for better visibility
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  favoriteButton: {
    backgroundColor: '#ffffff',
    elevation: 0,
    alignSelf: 'flex-end',
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default LandDetails;
