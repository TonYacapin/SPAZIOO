import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, TouchableWithoutFeedback, FlatList, PixelRatio } from 'react-native';
import { IconButton, Avatar, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import espasyoIcon from '../assets/Logo1.png';
import SidebarMenu from './SidebarMenu';
import { fetchLands } from './SpacePage';

// Import the custom theme
import theme from './theme'; // Update the path as needed

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.9; // Adjust as needed
const cardImageHeight = cardWidth * 0.6;

const fontScale = Math.min(
  width / 360,  // Change 360 to the base width for your design
  height / 640 // Change 640 to the base height for your design
);

const scaledFont = (size) => Math.round(PixelRatio.roundToNearestPixel(size * fontScale));

const HomePage = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');
  const [loadingLands, setLoadingLands] = useState(true);
  const [lands, setLands] = useState([]);
  const [landsError, setLandsError] = useState(null);

  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem('name');
      if (storedName) {
        setName(storedName);
      }
    };
    fetchName();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const fetchRecentLands = async () => {
    try {
      setLoadingLands(true);
      const landsData = await fetchLands();
  
      // Filter out lands that are not available
      const availableLands = landsData.filter(land => land.isAvailable);
  
      // Sort available lands by creation date in descending order
      availableLands.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      // Set the lands in reverse order to get the latest lands first
      setLands(availableLands.reverse().slice(0, 2));
  
      setLoadingLands(false);
      setLandsError(null);
    } catch (error) {
      console.error('Error fetching recent lands:', error.message);
      setLands([]);
      setLoadingLands(false);
      setLandsError('Error fetching recent lands. Please try again.');
    }
  };

  useEffect(() => {
    fetchRecentLands();
  }, []);

  // Render Item for FlatList
// Render Item for FlatList
const renderLandItem = ({ item }) => (
  <Card style={[styles.recentLandCard, { width: cardWidth }]} onPress={() => navigation.navigate('LandDetails', { land: item })}>
    <Card.Cover source={{ uri: item.imageUrl }} style={{ height: cardImageHeight, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
    <Card.Content>
      <Title style={[styles.recentLandTitle, { fontSize: scaledFont(18) }]}>{item.landName}</Title>
      <View style={styles.recentLandDetails}>
        <View style={styles.detailItem}>
          <IconButton
            icon="map-marker"
            color={theme.colors.text}
            size={scaledFont(18)}
            style={styles.iconButton}
          />
          <Paragraph style={[styles.detailText, { fontSize: scaledFont(14) }]}>{item.locationName}</Paragraph>
        </View>
        <View style={styles.detailItem}>
          <IconButton
            icon="currency-php"
            color={theme.colors.text}
            size={scaledFont(18)}
            style={styles.iconButton}
          />
          <Paragraph style={[styles.detailText, { fontSize: scaledFont(14) }]}>{item.price}</Paragraph>
        </View>
        <View style={styles.detailItem}>
          <IconButton
            icon="sale"
            color={theme.colors.text}
            size={scaledFont(18)}
            style={styles.iconButton}
          />
          <Paragraph style={[styles.detailText, { fontSize: scaledFont(14) }]}>{item.option}</Paragraph>
        </View>
      </View>
    </Card.Content>
  </Card>
);


// Reverse the order of items in the renderLandItem function



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Image source={espasyoIcon} style={styles.espasyoIcon} />
          <Text style={[styles.titleText, { fontSize: scaledFont(24) }]}>Spazio</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.userName, { fontSize: scaledFont(16) }]}>{name}</Text>
          <IconButton
            icon="menu"
            size={scaledFont(24)}
            color={theme.colors.text}
            onPress={toggleSidebar}
          />
        </View>
      </View>
      <Text style={[styles.welcomeText, { fontSize: scaledFont(20) }]}>Welcome to Spazio</Text>

      <View style={styles.recentLandsContainer}>
        <Text style={[styles.recentLandsTitle, { fontSize: scaledFont(20) }]}>Recent Lands Posted</Text>
        {loadingLands ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} size={scaledFont(24)} style={styles.loadingIndicator} />
        ) : landsError ? (
          <Text style={[styles.errorText, { fontSize: scaledFont(16) }]}>{landsError}</Text>
        ) : (
          <FlatList
          data={lands}
          renderItem={renderLandItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Space')}>
          <IconButton
            icon="view-list-outline"
            color={theme.colors.text}
            size={scaledFont(30)}
          />
          <Text style={[styles.buttonText, { fontSize: scaledFont(13) }]}>Lists</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MapPage', {
  initialRegion: {
    latitude: 16.2014,
    longitude: 121.1656,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },
})}>

          <IconButton
            icon="map-marker-outline"
            color={theme.colors.text}
            size={scaledFont(30)}
          />
          <Text style={[styles.buttonText, { fontSize: scaledFont(13) }]}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TransactionsPage')}>
          <IconButton
            icon="file-document-outline"
            color={theme.colors.text}
            size={scaledFont(30)}
          />
          <Text style={[styles.buttonText, { fontSize: scaledFont(13) }]}>Transactions</Text>
        </TouchableOpacity>
      </View>

      {isSidebarOpen && (
        <>
          <TouchableWithoutFeedback onPress={closeSidebar}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.sidebar}>
            <SidebarMenu navigation={navigation} />
          </View>
        </>
      )}

      <StatusBar style="auto" />
    </View>
  );
};



const styles = StyleSheet.create({
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 4, // Adjust as needed
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    elevation: 4,
  },
  buttonText: {
    color: theme.colors.text,
    marginTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
  },
  espasyoIcon: {
    width: 50,
    height: 30,
  },
  userName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    width: '60%',
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
  recentLandsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  recentLandsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  recentLandCard: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
  },
  recentLandImage: {
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recentLandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: theme.colors.text,
  },
  recentLandText: {
    fontSize: 10,
    marginBottom: 8,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default HomePage;
