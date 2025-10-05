import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '../context/GameContext';
import { PokemonCard } from '../types/Card';
import { starterDeck } from '../data/sampleCards';
import CardComponent from '../components/CardComponent';
import BattleField from '../components/BattleField';

export default function GameScreen() {
  const { gameState, playCard, useAbility, endTurn } = useGame();
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);

  // Initialize decks if empty
  useEffect(() => {
    if (gameState.player1.deck.length === 0) {
      // This would normally be handled by the game context
      // For now, we'll use starter decks
    }
  }, [gameState]);

  const currentPlayer = gameState.player1.isTurn ? gameState.player1 : gameState.player2;
  const opponent = gameState.player1.isTurn ? gameState.player2 : gameState.player1;

  const handleCardSelect = (card: PokemonCard) => {
    if (currentPlayer.energy >= card.cost && !currentPlayer.activeCard) {
      setSelectedCard(card);
    }
  };

  const handlePlayCard = () => {
    if (selectedCard) {
      playCard(selectedCard.id, currentPlayer.id);
      setSelectedCard(null);
    }
  };

  const handleAbilitySelect = (abilityId: string) => {
    if (currentPlayer.activeCard) {
      setSelectedAbility(abilityId);
    }
  };

  const handleUseAbility = () => {
    if (selectedAbility && currentPlayer.activeCard) {
      const ability = currentPlayer.activeCard.abilities.find(a => a.id === selectedAbility);
      if (ability && currentPlayer.energy >= ability.cost) {
        useAbility(selectedAbility, opponent.activeCard?.id);
        setSelectedAbility(null);
      }
    }
  };

  const handleEndTurn = () => {
    endTurn();
    setSelectedCard(null);
    setSelectedAbility(null);
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      fire: '#ff6b6b',
      water: '#4ecdc4',
      grass: '#45b7d1',
      electric: '#f9ca24',
      psychic: '#f0932b',
      fighting: '#eb4d4b',
      dark: '#6c5ce7',
      steel: '#a4b0be',
      fairy: '#fd79a8',
      normal: '#ddd',
    };
    return colors[type] || '#ddd';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        {/* Opponent's Area */}
        <View style={styles.opponentArea}>
          <Text style={styles.playerName}>{opponent.name}</Text>
          <Text style={styles.energyText}>Energy: {opponent.energy}/{opponent.maxEnergy}</Text>
          
          {opponent.activeCard ? (
            <View style={styles.activeCardContainer}>
              <CardComponent 
                card={opponent.activeCard} 
                isActive={true}
                isOpponent={true}
                onPress={() => {}}
              />
            </View>
          ) : (
            <View style={styles.emptyField}>
              <Text style={styles.emptyText}>No Pokemon Active</Text>
            </View>
          )}
        </View>

        {/* Battle Field */}
        <BattleField 
          player1Card={gameState.player1.activeCard}
          player2Card={gameState.player2.activeCard}
        />

        {/* Current Player's Area */}
        <View style={styles.playerArea}>
          <Text style={styles.playerName}>{currentPlayer.name}</Text>
          <Text style={styles.energyText}>Energy: {currentPlayer.energy}/{currentPlayer.maxEnergy}</Text>
          
          {currentPlayer.activeCard ? (
            <View style={styles.activeCardContainer}>
              <CardComponent 
                card={currentPlayer.activeCard} 
                isActive={true}
                isOpponent={false}
                onPress={() => {}}
              />
              
              {/* Abilities */}
              <ScrollView horizontal style={styles.abilitiesContainer}>
                {currentPlayer.activeCard.abilities.map((ability) => (
                  <TouchableOpacity
                    key={ability.id}
                    style={[
                      styles.abilityButton,
                      selectedAbility === ability.id && styles.selectedAbility,
                      currentPlayer.energy < ability.cost && styles.disabledAbility,
                    ]}
                    onPress={() => handleAbilitySelect(ability.id)}
                    disabled={currentPlayer.energy < ability.cost}
                  >
                    <Text style={styles.abilityName}>{ability.name}</Text>
                    <Text style={styles.abilityCost}>Cost: {ability.cost}</Text>
                    <Text style={styles.abilityDamage}>DMG: {ability.damage}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {selectedAbility && (
                <TouchableOpacity style={styles.useAbilityButton} onPress={handleUseAbility}>
                  <Text style={styles.useAbilityText}>Use Ability</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.emptyField}>
              <Text style={styles.emptyText}>No Pokemon Active</Text>
            </View>
          )}
        </View>

        {/* Hand */}
        <View style={styles.handContainer}>
          <Text style={styles.handTitle}>Your Hand</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentPlayer.hand.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.handCard,
                  selectedCard?.id === card.id && styles.selectedHandCard,
                  currentPlayer.energy < card.cost && styles.disabledHandCard,
                ]}
                onPress={() => handleCardSelect(card)}
                disabled={currentPlayer.energy < card.cost}
              >
                <CardComponent 
                  card={card} 
                  isActive={false}
                  isOpponent={false}
                  onPress={() => handleCardSelect(card)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {selectedCard && !currentPlayer.activeCard && (
            <TouchableOpacity style={styles.playCardButton} onPress={handlePlayCard}>
              <Text style={styles.playCardText}>Play Card</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Turn Controls */}
        <View style={styles.turnControls}>
          <TouchableOpacity style={styles.endTurnButton} onPress={handleEndTurn}>
            <LinearGradient
              colors={['#ff6b6b', '#ee5a24']}
              style={styles.endTurnGradient}
            >
              <Text style={styles.endTurnText}>End Turn</Text>
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
  opponentArea: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  playerArea: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  energyText: {
    fontSize: 14,
    color: '#4ecdc4',
    marginBottom: 10,
  },
  activeCardContainer: {
    alignItems: 'center',
  },
  emptyField: {
    width: 120,
    height: 160,
    backgroundColor: '#2a2a3e',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  abilitiesContainer: {
    marginTop: 10,
    maxHeight: 100,
  },
  abilityButton: {
    backgroundColor: '#2a2a3e',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedAbility: {
    backgroundColor: '#4ecdc4',
  },
  disabledAbility: {
    opacity: 0.5,
  },
  abilityName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  abilityCost: {
    color: '#4ecdc4',
    fontSize: 10,
  },
  abilityDamage: {
    color: '#ff6b6b',
    fontSize: 10,
  },
  useAbilityButton: {
    backgroundColor: '#4ecdc4',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  useAbilityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  handContainer: {
    height: 200,
    padding: 10,
  },
  handTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  handCard: {
    marginRight: 10,
  },
  selectedHandCard: {
    transform: [{ scale: 1.1 }],
  },
  disabledHandCard: {
    opacity: 0.5,
  },
  playCardButton: {
    backgroundColor: '#4ecdc4',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  playCardText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  turnControls: {
    padding: 10,
    alignItems: 'center',
  },
  endTurnButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  endTurnGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  endTurnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
