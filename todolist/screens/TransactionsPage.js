import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { List, Divider, IconButton } from 'react-native-paper';
import axios from 'axios';
import address from './config.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  //const userId = 'USER_ID'; // Replace 'USER_ID' with the actual user ID
    const [userId, SetUserId] = useState('');

    const getUserId = async () => {
        try {
          const _id = await AsyncStorage.getItem('userid');
          SetUserId(_id);
        } catch (error) {
          console.error('Error fetching user userid:', error);
        }
      };

      useEffect(() => {
        getUserId();
      }, []); // This useEffect fetches userId on initial render
      
      useEffect(() => {
        if (userId !== '') { // Only fetch transactions if userId is not empty
          fetchTransactions();
        }
      }, [userId]); // Fetch transactions whenever userId changes
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://${address}/api/transactions/getTransactionsForUser/${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSignTransaction = async (transactionId) => {
    try {
      // Get the details of the unsigned transaction contract
      const unsignedContractResponse = await axios.get(`http://${address}/api/transactionContracts/${transactionId}`);
      const unsignedContractData = unsignedContractResponse.data;
      
      // Assuming the unsigned contract has a field `transaction` which holds the associated transaction ID
      const transactionIdToUpdate = unsignedContractData.transaction;
  
      // Update the unsigned contract with the new signature
      const updatedContractResponse = await axios.put(`http://${address}/api/transactionContracts/${transactionIdToUpdate}`, {
        // Update fields of the transaction contract as needed
        signatures: [{ user: userId, signature: 'SOME_SIGNATURE_DATA' }],
        updatedAt: Date.now() // Update the updatedAt timestamp
      });
  
      console.log('Transaction contract updated:', updatedContractResponse.data);
  
      // Update the local state or re-fetch transactions
    } catch (error) {
      console.error('Error signing transaction:', error);
    }
  };
  
  

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>
        Transactions
      </Text>
      <List.Section>
        {transactions.map((transaction) => (
          <View key={transaction._id}>
            <List.Item
              title={`Transaction ID: ${transaction._id}`}
              description={`Amount: $${transaction.amount}`}
            />
            <Divider />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              {!transaction.isCompleted && (
                <Button
                  title="Sign"
                  onPress={() => handleSignTransaction(transaction._id)}
                />
              )}
            </View>
          </View>
        ))}
      </List.Section>
    </View>
  );
};

export default TransactionsPage;
