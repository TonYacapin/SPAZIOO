import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

import espasyoIcon from 'C:/Users/Administrator/Desktop/TestProject/todolist/assets/Logo1.png';


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
                        color="orange"
                        style={styles.hamburgerIcon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.welcomeText}>Welcome to Spazio</Text>

            <View style={styles.content}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Space')}>
                        <Icon2 name="landmark" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Message') }>
                        <Icon2 name="envelope" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Icon2 name="user" size={30} color="black" />
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
        backgroundColor: '#221307',
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
        color: 'orange',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    welcomeText: {
        fontSize: 18,
        color: 'orange',
        marginBottom: 20,
        fontWeight: 'bold',
      
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        width: '100%',
        marginTop: 20, // Adjust the margin based on your layout
    },
    button: {
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
        width: '30%', // Adjust the width based on your layout
        alignItems: 'center',
    },
    espasyoIcon: {
        width: 30,
        height: 30,
    },
});

export default HomePage;
