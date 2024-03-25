import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSignUp = async () => {
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await fetch('http://192.168.0.106:4000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        setMessage(null);
      } else {
        setMessage(data.message);
        setError(null);
        // Reset form fields after successful signup
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Internal server error');
      setMessage(null);
    }
  };

  // Function to enable/disable SignUp button based on password match
  const isSignUpDisabled = () => {
    return password === '' || confirmPassword === '' || password !== confirmPassword;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sign Up</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#ADC178"
          onChangeText={text => setUsername(text)}
          value={username}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#ADC178"
          onChangeText={text => setEmail(text)}
          value={email}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#ADC178"
          onChangeText={text => setPassword(text)}
          value={password}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Confirm Password"
          placeholderTextColor="#ADC178"
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.signUpBtn, { backgroundColor: isSignUpDisabled() ? '#ccc' : '#F0EAD2' }]}
        onPress={handleSignUp}
        disabled={isSignUpDisabled()}
      >
        <Text style={styles.signUpText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE5B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#ADC178',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#F0EAD2',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#ADC178',
  },
  signUpBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  signUpText: {
    color: '#ADC178',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  message: {
    color: 'green',
    marginBottom: 10,
  },
});

export default SignUpScreen;
