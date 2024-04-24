import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { List, Divider, Snackbar, useTheme, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionsPage = ({ navigation }) => {
  const [transactionContracts, setTransactionContracts] = useState([]);
  const [userId, setUserId] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);
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
      setLoading(true);

      const contractsResponse = await axios.get(`http://${address}/api/transactionsContract/getContractsForUser/${userId}`);
      const contracts = contractsResponse.data;
  
      const contractsWithData = [];
  
      for (const contract of contracts) {
        const transactionId = contract.transaction;
        const transactionResponse = await axios.get(`http://${address}/api/transactions/${transactionId}`);
        const transaction = transactionResponse.data;
  
        const landResponse = await axios.get(`http://${address}/api/lands/${transaction.land}`);
        const land = landResponse.data;
  
        contractsWithData.push({
          ...contract,
          transaction: transaction || {},
          land: land || {}
        });
      }
  
      setTransactionContracts(contractsWithData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transaction contracts:', error);
      setLoading(false);
    }
  };
  const handleSignTransaction = async (transactionId) => {
    try {
      const contractResponse = await axios.get(`http://${address}/api/transactionsContract/${transactionId}`);
      const contractData = contractResponse.data;
  
      if (!contractData) {
        console.error('Transaction contract not found.');
        return;
      }
  
      const alreadySigned = contractData.signatures.some(signature => signature.user === userId);
      if (alreadySigned) {
        console.log('You have already signed this contract.');
        return;
      }
  
      const updatedSignatures = [
        ...contractData.signatures,
        { user: userId, signature: 'SOME_SIGNATURE_DATA' }
      ];
  
      const updatedContractResponse = await axios.put(`http://${address}/api/transactionsContract/${contractData._id}`, {
        signatures: updatedSignatures,
        updatedAt: Date.now()
      });
  
      console.log('Transaction contract updated:', updatedContractResponse.data);
  
      // Update the land availability
      const updatedLandResponse = await axios.put(`http://${address}/lands/${contractData.land}/updateAvailability`, {
        isAvailable: false // Set land availability to false when signed
      });
  
      console.log('Land availability updated:', updatedLandResponse.data);
  
      let message = '';
      if (userId === contractData.landOwner) {
        message = 'Wait for The Land Buyer to Sign to Complete the Transaction';
      } else if (userId === contractData.landBuyer) {
        message = 'Wait for The Land Owner to Signed to Complete the Transaction';
      } else {
        message = 'The transaction is pending.';
      }
  
      setSnackbarMessage(`You have successfully signed the contract. ${message}`);
      setSnackbarVisible(true);
      fetchTransactionContracts();
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
  <TouchableOpacity key={contract._id} onPress={() => navigation.navigate('TransactionDetails', { transaction: contract.transaction, contract })}>
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
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
      {contract.signatures.length === 0 || !contract.signatures.some(sig => sig.user === userId) ? (
  <Button
    mode="contained"
    backgroundColor='#ADC178'
    onPress={() => handleSignTransaction(contract._id)}
    style={{ backgroundColor: '#ADC178', paddingHorizontal: 12 }}
    labelStyle={{ color: '#ffffff' }}
  >
    Sign
  </Button>
) : (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={{ color: theme.colors.disabled, marginRight: 8 }}>✓</Text>
    <Text style={{ color: theme.colors.disabled }}>Already Signed</Text>
  </View>
)}
      </View>
    </View>
  </TouchableOpacity>
))}
            </List.Section>
          </View>
        )}
      </ScrollView>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={{
          margin: 20,
          backgroundColor: '#ADC178' ,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        labelStyle={{
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        Back
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ margin: 20 }}
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
