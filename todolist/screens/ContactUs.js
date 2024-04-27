import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Import the custom theme
import theme from './theme';

const ContactUs = () => {
    const navigation = useNavigation();
  const handleContactEmail = () => {
    Linking.openURL('mailto:yacapinton@gmail.com');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          color={theme.colors.text}
          onPress={() => navigation.replace('Home')} // Assuming you have access to the navigation prop
        />
        <Text style={styles.title}>Contact Us</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          If you need assistance or have any inquiries, please feel free to contact us via email.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleContactEmail}>
          <Text style={styles.buttonText}>Email: yacapinton@gmail.com</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});

export default ContactUs;
