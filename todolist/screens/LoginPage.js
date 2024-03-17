import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for making HTTP requests

import espasyoLogo from '../assets/Logo1.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/login', {
                email: email,
                password: password,
            });
            
            const { token } = response.data;
            // Save token to local storage, secure storage, or context for future requests
            
            console.log('Login successful!');
            navigation.replace('Home');
        } catch (error) {
            console.error('Login failed:', error.response.data.message);
            // Show an error message to the user, clear input fields, etc.
        }
    };

    return (
        <View style={styles.container}>
            <Image source={espasyoLogo} style={styles.logo} />

            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#FFA500"
                    onChangeText={text => setEmail(text)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#FFA500"
                    onChangeText={text => setPassword(text)}
                />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.loginText}>SIGN UP</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 40,
    },
    inputView: {
        width: '80%',
        backgroundColor: '#FFA500',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
    },
    inputText: {
        height: 50,
        color: '#000',
    },
    loginBtn: {
        width: '80%',
        backgroundColor: '#FFA500',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    loginText: {
        color: '#000',
    },
});
