import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PokemonCard } from '../types/Card';

interface CardComponentProps {
  card: PokemonCard;
  isActive: boolean;
  isOpponent: boolean;
  onPress: () => void;
}

const { width } = Dimensions.get('window');

export default function CardComponent({ card, isActive, isOpponent, onPress }: CardComponentProps) {
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string[] } = {
      fire: ['#ff6b6b', '#ee5a24'],
      water: ['#4ecdc4', '#44a08d'],
      grass: ['#45b7d1', '#96ceb4'],
      electric: ['#f9ca24', '#f0932b'],
      psychic: ['#f0932b', '#eb4d4b'],
      fighting: ['#eb4d4b', '#6c5ce7'],
      dark: ['#6c5ce7', '#a4b0be'],
      steel: ['#a4b0be', '#ddd'],
      fairy: ['#fd79a8', '#fdcb6e'],
      normal: ['#ddd', '#bbb'],
    };
    return colors[type] || ['#ddd', '#bbb'];
  };

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      common: '#999',
      uncommon: '#4ecdc4',
      rare: '#4ecdc4',
      epic: '#9b59b6',
      legendary: '#f39c12',
    };
    return colors[rarity] || '#999';
  };

  const cardWidth = isActive ? width * 0.3 : width * 0.25;
  const cardHeight = isActive ? cardWidth * 1.4 : cardWidth * 1.3;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          width: cardWidth,
          height: cardHeight,
          borderColor: getRarityColor(card.rarity),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getTypeColor(card.type)}
        style={styles.cardGradient}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardName} numberOfLines={1}>
            {card.name}
          </Text>
          <View style={styles.typeContainer}>
            <Text style={styles.typeText}>{card.type.toUpperCase()}</Text>
          </View>
        </View>

        {/* HP Bar */}
        <View style={styles.hpContainer}>
          <View style={styles.hpBar}>
            <View 
              style={[
                styles.hpFill,
                { 
                  width: `${(card.hp / card.maxHp) * 100}%`,
                  backgroundColor: card.hp > card.maxHp * 0.5 ? '#4ecdc4' : 
                                 card.hp > card.maxHp * 0.25 ? '#f9ca24' : '#ff6b6b'
                }
              ]} 
            />
          </View>
          <Text style={styles.hpText}>{card.hp}/{card.maxHp}</Text>
        </View>

        {/* Pokemon Image Placeholder */}
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>{card.name.charAt(0)}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>ATK</Text>
            <Text style={styles.statValue}>{card.attack}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>DEF</Text>
            <Text style={styles.statValue}>{card.defense}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>SPD</Text>
            <Text style={styles.statValue}>{card.speed}</Text>
          </View>
        </View>

        {/* Cost */}
        <View style={styles.costContainer}>
          <Text style={styles.costText}>Cost: {card.cost}</Text>
        </View>

        {/* Abilities (only show if active) */}
        {isActive && card.abilities.length > 0 && (
          <View style={styles.abilitiesPreview}>
            <Text style={styles.abilitiesTitle}>Abilities:</Text>
            {card.abilities.slice(0, 2).map((ability, index) => (
              <Text key={ability.id} style={styles.abilityPreview} numberOfLines={1}>
                {ability.name} ({ability.cost})
              </Text>
            ))}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    padding: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  typeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  hpContainer: {
    marginBottom: 5,
  },
  hpBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    borderRadius: 2,
  },
  hpText: {
    fontSize: 8,
    color: '#fff',
    textAlign: 'center',
    marginTop: 2,
  },
  imageContainer: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  imagePlaceholder: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statRow: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  costContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  costText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  abilitiesPreview: {
    marginTop: 5,
  },
  abilitiesTitle: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  abilityPreview: {
    fontSize: 7,
    color: '#fff',
    marginBottom: 1,
  },
});
