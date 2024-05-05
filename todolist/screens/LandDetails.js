import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, IconButton, Provider as PaperProvider, List, Avatar, Rating, ListItem } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import address from './config.js';
import { useNavigation } from '@react-navigation/native';
import theme from './theme.js'; // Import your custom theme file


const LandDetails = ({ route, navigation }) => {
  const { land } = route.params;
  const [sellerInfo, setSellerInfo] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userId, SetUserId] = useState('');
  const [userName, SetUserName] = useState('');
  const [ratings, setRatings] = useState([]);
  const [averageStars, setAverageStars] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  useEffect(() => {
    // Function to fetch seller information
    const fetchSellerInfo = async () => {
      console.log(land.seller);
      try {
        // Retrieve the JWT token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
  
        if (!token) {
          throw new Error('No token found. Please log in.');
        }
     
        const response = await axios.get(`http://${address}/api/user/${land.seller._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSellerInfo(response.data);
      } catch (error) {
        console.error('Error fetching seller information:', error);
      }
    };
  
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`http://${address}/api/ratings/land/${land._id}?populate=user`);
        setRatings(response.data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
  
    const getUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        setUserEmail(email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
    const getUserId = async () => {
      try {
        const _id = await AsyncStorage.getItem('userid');
        SetUserId(_id);
      } catch (error) {
        console.error('Error fetching user userid:', error);
      }
    };
    const getUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        SetUserName(name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
  
    fetchSellerInfo();
    getUserEmail();
    getUserId();
    getUserName();
    fetchRatings();
  
  }, [land.seller]); // Only run this effect when land.seller changes
  
  // useEffect to calculate average stars when ratings change
  useEffect(() => {
    const calculateAverageStars = () => {
      if (ratings.length === 0) {
        // If there are no ratings, set the average to 0
        setAverageStars(0);
        return;
      }
    
      const totalStars = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const average = totalStars / ratings.length;
      setAverageStars(average);
    };
  
    calculateAverageStars(); // Call calculateAverageStars whenever ratings change
  
  }, [ratings]); // Run this effect whenever ratings change/ Only run this effect when land.seller changes
  

  const handleBackButton = () => {
    navigation.goBack();
  };

  const renderRatings = () => {
    if (!showAllReviews) {
      // Display only the first two ratings
      return ratings.slice(0, 1).map((rating, index) => (
        <List.Item
          key={index}
          title={`${rating.user.name}`}
          description={`${rating.comment}`}
          left={() => <CustomRating rating={rating.rating} />}
          style={styles.ratingItem}
        />
      ));
    } else {
      // Display all ratings
      return ratings.map((rating, index) => (
        <List.Item
          key={index}
          title={`${rating.user.name}`}
          description={`${rating.comment}`}
          left={() => <CustomRating rating={rating.rating} />}
          style={styles.ratingItem}
        />
      ));
    }
  };
  

  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };
  

  const handleContactSeller = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      if (sellerInfo && sellerInfo.email === userEmail) {
        Alert.alert('You are the seller of this land.');
        return;
      }

      const response = await axios.post(
        `http://${address}/api/chat`,
        { userId: land.seller },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data._id) {
        // Pass sellerInfo to ChatPage
        navigation.navigate('ChatPage', { sellerInfo, chatData: response.data });
      }
    } catch (error) {
      console.error('Error creating/accessing chat:', error);
    }
  };
  const handleGoogleMaps = () => {
    navigation.navigate('MapPage', {
      initialRegion: {
        latitude: land.location.coordinates[1],
        longitude: land.location.coordinates[0],
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }
    });
  };


  const handleMakeTransaction = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      // Check if the user is the seller
      if (sellerInfo && sellerInfo.email === userEmail) {
        Alert.alert('You are the seller of this land. You cannot make a transaction.');
        return;
      }

      // Remove commas from the price and convert it to a number
      const priceWithoutCommas = parseFloat(land.price.replace(/,/g, ''));

      let transactionType = '';
      switch (land.option) {
        case 'Sale':
          transactionType = 'Sale';
          break;
        case 'Rent':
          transactionType = 'Rent';
          break;
        case 'Lease':
          transactionType = 'Lease';
          break;
        default:
          throw new Error('Invalid land option. Please check the land details.');
      }

      // Create a new transaction object
      const transactionData = {
        land: land._id,
        buyer: userId,
        transactionDate: new Date(),
        transactionType, // Set based on land option
        amount: priceWithoutCommas,
        isCompleted: false
      };

      console.log(transactionData);

      // Check for existing contract
      const existingContractsResponse = await axios.get(`http://${address}/api/transactionsContract/getContractsForLand/${land._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const existingContracts = existingContractsResponse.data;

      const existingContractForUser = existingContracts.find(contract => {
        return (
          contract.signingParties.includes(sellerInfo._id) &&
          contract.signingParties.includes(userId)
        );
      });

      if (existingContractForUser) {
        Alert.alert(
          'Existing Contract',
          'There is an existing contract for this land. Please wait for the Owner to Sign the Contract.'
        );
        return;
      }

      // Make POST request to create transaction
      const transactionResponse = await axios.post(`http://${address}/api/transactions/`, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedTransaction = transactionResponse.data;

      // Create contract text with transaction type included
      const contractText = `This contract represents the ${transactionType.toLowerCase()} transaction for ${land.landName} between ${sellerInfo.name} and ${userName}.
      The transaction amount is ${land.price} and the transaction date is ${new Date().toDateString()}.`;

      // Create a new contract object with the user already signed
      const contractData = {
        transaction: savedTransaction._id,
        land: land._id,
        contractText,
        signingParties: [sellerInfo._id, userId], // Include userId as already signed
        signatures: [{ user: userId, signature: 'SOME_SIGNATURE_DATA' }] // Add userId's signature
      };

      console.log(contractData)

      // Make POST request to create contract
      const contractResponse = await axios.post(`http://${address}/api/transactionsContract/`, contractData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedContract = contractResponse.data;

      // Now you have the savedTransaction and savedContract
      // You can navigate to a new screen, show a success message, etc.

      navigation.navigate('TransactionDetails', { transaction: savedTransaction, contract: savedContract });
    } catch (error) {
      console.error('Error making transaction:', error);
      console.log('Error response:', error.response.data);
      Alert.alert('Error', 'Failed to make transaction. Please try again.');
    }
  };
  const CustomRating = ({ rating }) => {
    // Convert rating to a star representation
    const stars = Array.from({ length: 5 }, (_, index) => (
      <Icon key={index} name={index < rating ? 'star' : 'star-outline'} size={24} color='#FFD700' />
    ));
  
    return (
      <View style={{ flexDirection: 'row' }}>
        {stars}
      </View>
    );
  };
  return (

    
    <ScrollView>


      <View style={styles.container}>
        <Card elevation={5} style={styles.card}>
          <Card.Cover source={{ uri: land.imageUrl }} resizeMode="cover" style={styles.image} />
          <Card.Content>
            <Title style={styles.title}>{land.landName}</Title>
            <View style={styles.infoContainer}>
              <Paragraph style={styles.info}>Size: {land.landSize}</Paragraph>
              <Paragraph style={styles.info}>Location: {land.locationName}</Paragraph>
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
                Message Seller
              </Button>
              <Button
                icon="map"
                mode="contained"
                onPress={handleGoogleMaps}
                style={styles.button}
                labelStyle={styles.buttonText}
              >
                Navigate to Maps
              </Button>
              <Button
                icon="wallet"
                mode="contained"
                onPress={handleMakeTransaction}
                style={styles.button}
                labelStyle={styles.buttonText}
              >
                Make Transaction
              </Button>
            </View>
          
          </Card.Actions>


      
        </Card>
        <List.Section style={styles.ratingContainer}>
  <List.Subheader>Reviews</List.Subheader>
  <List.Item
    title={`Average Stars: ${averageStars.toFixed(1)}`}
    left={() => <List.Icon icon="star" />}
  />
  <List.Item
    title={`Number of Ratings: ${ratings.length}`}
    left={() => <List.Icon icon="format-list-numbered" />}
  />
  {/* Render the ratings based on showAllReviews state */}
  {renderRatings()}
  {/* Button to toggle showing all reviews */}
  <Button
  onPress={toggleShowAllReviews}
  mode="contained"
  style={{ marginVertical: 10, backgroundColor: '#ADC178' }}
  labelStyle={{ color: '#f5f5f5' }}
>
  {showAllReviews ? "Hide reviews" : "View all reviews"}
</Button>

</List.Section>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ratingItem: {
    backgroundColor: theme.colors.surface,
    marginBottom: 10,
    borderRadius: theme.roundness,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: theme.roundness,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  backButton: {
    borderRadius: theme.roundness,
    marginBottom: 10,
    borderColor: theme.colors.primary,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: theme.roundness,
    width: '70%',
    marginBottom: 10,
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.surface,
  },
  favoriteButton: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    alignSelf: 'flex-end',
  },
  image: {
    width: '100%',
    height: 200,
  },
  ratingContainer: {
    marginBottom: 10,
    backgroundColor: '#DDE5B6',
    borderRadius: theme.roundness,
    elevation: 2,
  },
});

export default LandDetails;
