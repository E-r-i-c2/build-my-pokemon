import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import { starterDeck } from '../data/sampleCards';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { startGame } = useGame();
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

  const handleStartGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      Alert.alert('Error', 'Please enter names for both players');
      return;
    }
    
    // Initialize game with starter decks
    startGame(player1Name.trim(), player2Name.trim());
    navigation.navigate('Game' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Pokemon Card Battle</Text>
          <Text style={styles.subtitle}>Create your cards and battle!</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Player 1 Name:</Text>
            <TextInput
              style={styles.input}
              value={player1Name}
              onChangeText={setPlayer1Name}
              placeholder="Enter Player 1 name"
              placeholderTextColor="#666"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Player 2 Name:</Text>
            <TextInput
              style={styles.input}
              value={player2Name}
              onChangeText={setPlayer2Name}
              placeholder="Enter Player 2 name"
              placeholderTextColor="#666"
            />
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <LinearGradient
              colors={['#ff6b6b', '#ee5a24']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start Battle</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={() => navigation.navigate('CardCreator' as never)}
          >
            <LinearGradient
              colors={['#4ecdc4', '#44a08d']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Create Card</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2a2a3e',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  startButton: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  createButton: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
