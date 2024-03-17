import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

import espasyoIcon from '../assets/Logo1.png';

const HomePage = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    <Image source={espasyoIcon} style={styles.espasyoIcon} /> Spazio
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <FontAwesome
                        name="bars"
                        size={24}
                        color="#F0EAD2" // Changed the color to match the theme
                        style={styles.hamburgerIcon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.welcomeText}>Welcome to Spazio</Text>

            <View style={styles.content}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Space')}>
                        <Icon2 name="landmark" size={30} color="#F0EAD2" /> {/* Changed the color to match the theme */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Message')}>
                        <Icon2 name="envelope" size={30} color="#F0EAD2" /> {/* Changed the color to match the theme */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Icon2 name="user" size={30} color="#F0EAD2" /> {/* Changed the color to match the theme */}
                    </TouchableOpacity>
                </View>
            </View>

            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ADC178',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        width: '100%',
    },
    hamburgerIcon: {
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flexDirection: 'row',
        alignItems: 'center',
        color: '#F0EAD2', // Changed the color to match the theme
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    welcomeText: {
        fontSize: 18,
        color: '#F0EAD2', // Changed the color to match the theme
        marginBottom: 20,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        width: '100%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#DDE5B6', // Changed the color to match the theme
        padding: 10,
        borderRadius: 5,
        width: '30%',
        alignItems: 'center',
    },
    espasyoIcon: {
        width: 50,
        height: 30,
    },
});

export default HomePage;
