import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // Add your signup logic here
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sign Up</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#FFA500" // Orange placeholder text color
          onChangeText={text => setEmail(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#FFA500" // Orange placeholder text color
          onChangeText={text => setPassword(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Confirm Password"
          placeholderTextColor="#FFA500" // Orange placeholder text color
          onChangeText={text => setConfirmPassword(text)}
        />
      </View>

      <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signUpText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#FFA500', // Orange text color
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#FFA500', // Orange input field color
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#000', // Black text color
  },
  signUpBtn: {
    width: '80%',
    backgroundColor: '#FFA500', // Orange button color
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  signUpText: {
    color: '#000', // Black text color
  },
});

export default SignUpScreen;
