import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/FontAwesome6';

export const SpacePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
            <Icon2 name="landmark" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon2 name="envelope" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon2 name="user" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
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
    marginTop: 20,
  },
  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  espasyoIcon: {
    width: 30,
    height: 30,
  },
});

export default SpacePage;
