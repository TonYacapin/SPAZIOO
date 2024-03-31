import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import espasyoIcon from '../assets/Logo1.png';

const HomePage = () => {
    console.log("Rendering HomePage component");
    const navigation = useNavigation();
    const route = useRoute();

    const [name, setName] = React.useState('');

    React.useEffect(() => {
        const fetchName = async () => {
            const storedName = await AsyncStorage.getItem('name');
            if (storedName) {
                setName(storedName);
            }
        };
        fetchName();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.title}>
                    <Image source={espasyoIcon} style={styles.espasyoIcon} />
                    <Text style={styles.titleText}>Spazio</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.userName}>{name}</Text>
                    <IconButton
                        icon="menu"
                        size={24}
                        color="#F0EAD2"
                        style={styles.hamburgerIcon}
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            </View>
            <Text style={styles.welcomeText}>Welcome to Spazio</Text>

            <View style={styles.content}>
                {/* Buttons Container */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Space')}>
                        <IconButton
                            icon="map-marker"
                            color="#F0EAD2"
                            size={30}
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('Space')}
                        />
                        <Text style={styles.buttonText}>Space</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LandPostScreen')}>
                        <IconButton
                            icon="earth"
                            color="#F0EAD2"
                            size={30}
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('LandPostScreen')}
                        />
                        <Text style={styles.buttonText}>Land Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Message')}>
                        <IconButton
                            icon="message"
                            color="#F0EAD2"
                            size={30}
                            style={styles.iconButton}
                            onPress={() => navigation.replace('Message')}
                        />
                        <Text style={styles.buttonText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.replace('MapPage')}>
                        <IconButton
                            icon="map"
                            color="#F0EAD2"
                            size={30}
                            style={styles.iconButton}
                            onPress={() => navigation.replace('MapPage')}
                        />
                        <Text style={styles.buttonText}>Message</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: '#F0EAD2',
        marginTop: 5,
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hamburgerIcon: {
        marginLeft: 10,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F0EAD2',
    },
    welcomeText: {
        fontSize: 18,
        color: '#F0EAD2',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        width: '100%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#DDE5B6',
        padding: 10,
        borderRadius: 5,
        width: '30%',
        alignItems: 'center',
    },
    espasyoIcon: {
        width: 50,
        height: 30,
    },
    userName: {
        color: '#F0EAD2',
        marginRight: 10,
    },
});

export default HomePage;
