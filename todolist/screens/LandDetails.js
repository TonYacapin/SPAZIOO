import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';

const LandDetails = ({ route, navigation }) => {
  const { land } = route.params;

  // Function to handle back button press
  const handleBackButton = () => {
    navigation.goBack();
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backButton: {
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
  },
  favoriteButton: {
    backgroundColor: '#ffffff',
    elevation: 0,
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default LandDetails;
