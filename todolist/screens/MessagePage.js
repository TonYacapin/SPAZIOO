import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

const MessagePage = () => {
  useEffect(() => {
    // Function to open the messenger link when the component mounts
    const openMessengerLink = async () => {
      // The messenger URL
      const messengerUrl = 'https://www.messenger.com/t/100002355207671';
      // Attempt to open the messenger link
      const supported = await Linking.canOpenURL(messengerUrl);
      if (supported) {
        await Linking.openURL(messengerUrl);
      } else {
        console.error("Don't know how to open URI: " + messengerUrl);
      }
    };

    // Call the function to open the messenger link
    openMessengerLink();

    // Clean-up function (optional)
    return () => {
      // Perform any clean-up here if needed
    };
  }, []);
  const navigation = useNavigation();
  return (
    <View>
      {   navigation.navigate('Home')   }
    </View>
  );
};

export default MessagePage;

const styles = StyleSheet.create({});
