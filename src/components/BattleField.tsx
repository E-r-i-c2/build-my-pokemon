import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PokemonCard } from '../types/Card';

interface BattleFieldProps {
  player1Card?: PokemonCard;
  player2Card?: PokemonCard;
}

const { width } = Dimensions.get('window');

export default function BattleField({ player1Card, player2Card }: BattleFieldProps) {
  return (
    <View style={styles.battleField}>
      <LinearGradient
        colors={['#2a2a3e', '#1a1a2e', '#16213e']}
        style={styles.fieldGradient}
      >
        {/* Battle Arena Title */}
        <View style={styles.arenaTitle}>
          <Text style={styles.arenaText}>BATTLE ARENA</Text>
        </View>

        {/* VS Indicator */}
        <View style={styles.vsContainer}>
          <View style={styles.vsLine} />
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={styles.vsLine} />
        </View>

        {/* Battle Status */}
        <View style={styles.battleStatus}>
          {player1Card && player2Card ? (
            <Text style={styles.battleActive}>BATTLE IN PROGRESS</Text>
          ) : (
            <Text style={styles.battleWaiting}>WAITING FOR POKEMON</Text>
          )}
        </View>

        {/* Battle Effects Area */}
        <View style={styles.effectsArea}>
          {player1Card && player2Card && (
            <View style={styles.battleEffects}>
              <Text style={styles.effectText}>⚡ Battle Effects Active ⚡</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  battleField: {
    height: 120,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  fieldGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  arenaTitle: {
    marginBottom: 10,
  },
  arenaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecdc4',
    letterSpacing: 2,
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vsLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#4ecdc4',
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  vsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  battleStatus: {
    marginBottom: 5,
  },
  battleActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
  },
  battleWaiting: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  effectsArea: {
    minHeight: 20,
  },
  battleEffects: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  effectText: {
    fontSize: 10,
    color: '#4ecdc4',
    fontWeight: 'bold',
  },
});
