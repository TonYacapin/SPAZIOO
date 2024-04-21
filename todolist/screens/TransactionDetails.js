import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Text, Title, useTheme } from 'react-native-paper'; // Import Text from react-native-paper

const TransactionDetails = ({ route, navigation }) => {
  const { transaction, contract } = route.params;
  const theme = useTheme(); // Get the theme

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: '#DDE5B6' }]}>
      <Card elevation={5} style={styles.card(theme)}>
        <Card.Title title="Transaction Details" />
        <Card.Content style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.title}>Transaction ID:</Text>
            <Text style={styles.text}>{transaction._id}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Transaction Amount:</Text>
            <Text style={styles.text}>${transaction.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Contract ID:</Text>
            <Text style={styles.text}>{contract._id}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Contract Text:</Text>
            <Text style={[styles.text, styles.contractText]}>{contract.contractText}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <IconButton
            icon="arrow-left"
            color={theme.colors.text}
            size={20}
            onPress={handleBackButton}
          />
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ADC178', // Set the background color
  },
  
  card: (theme) => ({
    width: '90%',
    borderRadius: 12,
    backgroundColor: theme.colors.surface, // Apply surface color from theme
  }),
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  contractText: {
    fontFamily: 'Roboto', // Use a monospaced font for contract text
    lineHeight: 20, // Increase line height for readability
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
});

export default TransactionDetails;
