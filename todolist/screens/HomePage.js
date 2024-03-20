import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

import espasyoIcon from '../assets/Logo1.png';

const HomePage = () => {
    console.log("Rendering HomePage component");
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.title}>
                    <Image source={espasyoIcon} style={styles.espasyoIcon} />
                    <Text style={styles.titleText}>Spazio</Text>
                </View>
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

            <View style={styles.buttonsContainer}>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Space')}>
        <Icon2 name="landmark" size={30} color="#F0EAD2" />
        <Text style={styles.buttonText}>Space</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LandPostScreen')}>
        <Icon2 name="landmark" size={30} color="#F0EAD2" />
        <Text style={styles.buttonText}>Land Post</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Message')}>
        <Icon2 name="envelope" size={30} color="#F0EAD2" />
        <Text style={styles.buttonText}>Message</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
        <Icon2 name="user" size={30} color="#F0EAD2" />
        <Text style={styles.buttonText}>User</Text>
    </TouchableOpacity>
</View>


            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({

    buttonText: {
        color: '#F0EAD2',
        marginTop: 5, // Adjust as needed
    },
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
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
        flex: 1,
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
