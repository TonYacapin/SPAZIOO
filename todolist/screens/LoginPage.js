import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import espasyoLogo from '../assets/Logo1.png';
import address from './config.js';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`http://${address}/api/user/login`, {
                email: email,
                password: password,
            });

            const { token, name, _id } = response.data;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('userid', _id)


            console.log('Login successful!');
            navigation.replace('Home', { name: name });
        } catch (error) {
            if (error.response) {
                console.error('Login failed:', error.response.data.message);
                setError( "Invalid Email or Password");
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError('No response received. Please check your network connection.');
            } else {
                console.error('Error:', error.message);
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={espasyoLogo} style={styles.logo} />

            {error && <Text style={styles.error}>{error}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}

            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#F0EAD2"
                    onChangeText={(text) => setEmail(text)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#F0EAD2"
                    onChangeText={(text) => setPassword(text)}
                />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>SIGN UP</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DDE5B6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 170,
        height: 98,
        marginBottom: 40,
    },
    inputView: {
        width: '80%',
        backgroundColor: '#ADC178',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
    },
    inputText: {
        height: 50,
        color: '#F0EAD2',
    },
    loginBtn: {
        width: '80%',
        backgroundColor: '#ADC178',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    loginText: {
        color: '#F0EAD2',
    },
    signupBtn: {
        width: '80%',
        backgroundColor: '#ADC178',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    signupText: {
        color: '#F0EAD2',
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
