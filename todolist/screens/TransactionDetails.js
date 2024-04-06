import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Paragraph, Title } from 'react-native-paper';

const TransactionDetails = ({ route, navigation }) => {
  const { transaction, contract } = route.params;

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card elevation={5} style={styles.card}>
        <Card.Title title="Transaction Details" />
        <Card.Content>
          <Title>Transaction ID</Title>
          <Paragraph>{transaction._id}</Paragraph>

          <Title>Transaction Amount</Title>
          <Paragraph>${transaction.amount.toFixed(2)}</Paragraph>

          <Title>Contract Details</Title>
          <Paragraph>Contract ID: {contract._id}</Paragraph>
          <Paragraph>Contract Text:</Paragraph>
          <Paragraph style={styles.contractText}>{contract.contractText}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <IconButton
            icon="arrow-left"
            color="#000"
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
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  card: {
    width: '90%',
    borderRadius: 12,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  contractText: {
    marginBottom: 10,
  },
});

export default TransactionDetails;
