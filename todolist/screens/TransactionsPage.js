import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { List, Divider, Snackbar, useTheme, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionsPage = ({ navigation }) => {
  const [transactionContracts, setTransactionContracts] = useState([]);
  const [userId, setUserId] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [landData, setLandData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const theme = useTheme();

  const getUserId = async () => {
    try {
      const _id = await AsyncStorage.getItem('userid');
      setUserId(_id);
    } catch (error) {
      console.error('Error fetching user userid:', error);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId !== '') {
      fetchTransactionContracts();
    }
  }, [userId]);

  const fetchTransactionContracts = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data

      const contractsResponse = await axios.get(`http://${address}/api/transactionsContract/getContractsForUser/${userId}`);
      const contracts = contractsResponse.data;
  
      const contractsWithData = [];
  
      for (const contract of contracts) {
        const transactionId = contract.transaction;
        const transactionResponse = await axios.get(`http://${address}/api/transactions/${transactionId}`);
        const transaction = transactionResponse.data;
  
        // Fetch land data for the transaction
        const landResponse = await axios.get(`http://${address}/api/lands/${transaction.land}`);
        const land = landResponse.data;
  
        contractsWithData.push({
          ...contract,
          transaction: transaction || {},
          land: land || {} // Get corresponding land or empty object
        });
      }
  
      setTransactionContracts(contractsWithData);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error('Error fetching transaction contracts:', error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const handleSignTransaction = async (transactionId) => {
    try {
      // Sign transaction logic
    } catch (error) {
      console.error('Error signing transaction:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: theme.colors.text }}>
              Transactions
            </Text>
            <List.Section>
              {transactionContracts.map((contract) => (
                <View key={contract._id} style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                    Land: {contract.land.landName}
                  </Text>
                  <List.Item
                    title={`Transaction ID: ${contract.transaction._id}`}
                    description={`Amount: $${contract.transaction.amount}`}
                    titleStyle={{ color: theme.colors.text }}
                    descriptionStyle={{ color: theme.colors.text }}
                  />
                  <ScrollView style={{ maxHeight: 200, marginBottom: 10 }}>
                    <Text style={{ color: theme.colors.text }}>
                      {contract.contractText}
                    </Text>
                  </ScrollView>
                  <Divider />
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {!contract.signatures.find(sig => sig.user === userId) && (
                      <Button
                        mode="contained"
                        color={theme.colors.primary}
                        onPress={() => handleSignTransaction(contract._id)}
                        style={{ backgroundColor: '#DDE5B6' }}
                        labelStyle={{ color: '#F0EAD2' }}
                      >
                        Sign
                      </Button>
                    )}
                  </View>
                </View>
              ))}
            </List.Section>
          </View>
        )}
      </ScrollView>
      <Button
        mode="contained"
        color={theme.colors.primary}
        onPress={() => navigation.goBack()}
        style={{ margin: 20, backgroundColor: '#DDE5B6' }}
        labelStyle={{ color: '#F0EAD2' }}
      >
        Back
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000} // Optional, time duration in ms
        style={{ margin: 20 }} // Custom styles
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false)
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default TransactionsPage;
