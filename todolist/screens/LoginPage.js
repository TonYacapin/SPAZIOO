import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import espasyoLogo from 'C:/Users/Administrator/Desktop/TestProject/todolist/assets/Logo1.png';
const LoginPage = () => {
   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'Admin' && password === 'Admin') {
            // Username and password are correct, navigate to the homepage
            console.log('Login successful!');
            navigation.replace('Home');
        } else {
            // Username or password is incorrect, show an error message or take appropriate action
            console.log('Invalid username or password');
            // You can show an error message to the user, clear the input fields, etc.
        }
    };
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Replace "Spazio" text with the Espasyo logo */}
            <Image source={espasyoLogo} style={styles.logo} />

            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Username"
                    placeholderTextColor="#FFA500" // Orange placeholder text color
                    onChangeText={text => setUsername(text)}
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
        backgroundColor: '#000', // Black background color
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100, // Adjust width and height based on your logo dimensions
        height: 100,
        marginBottom: 40,
    },
    inputView: {
        width: '80%',
        backgroundColor: '#FFA500', // Orange input field background color
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
    loginBtn: {
        width: '80%',
        backgroundColor: '#FFA500', // Orange login button background color
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    loginText: {
        color: '#000', // Black login button text color
    },
});
