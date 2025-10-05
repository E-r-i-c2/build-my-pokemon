import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Picker,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PokemonCard, PokemonType, CardRarity, Ability } from '../types/Card';

export default function CardCreatorScreen() {
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState<PokemonType>('normal');
  const [hp, setHp] = useState('100');
  const [attack, setAttack] = useState('50');
  const [defense, setDefense] = useState('50');
  const [speed, setSpeed] = useState('50');
  const [cost, setCost] = useState('1');
  const [rarity, setRarity] = useState<CardRarity>('common');
  
  const [abilities, setAbilities] = useState<Ability[]>([
    {
      id: 'ability-1',
      name: '',
      description: '',
      damage: 0,
      cost: 0,
      type: 'physical',
    }
  ]);

  const addAbility = () => {
    const newAbility: Ability = {
      id: `ability-${abilities.length + 1}`,
      name: '',
      description: '',
      damage: 0,
      cost: 0,
      type: 'physical',
    };
    setAbilities([...abilities, newAbility]);
  };

  const updateAbility = (index: number, field: keyof Ability, value: string | number) => {
    const updatedAbilities = [...abilities];
    updatedAbilities[index] = {
      ...updatedAbilities[index],
      [field]: value,
    };
    setAbilities(updatedAbilities);
  };

  const removeAbility = (index: number) => {
    if (abilities.length > 1) {
      setAbilities(abilities.filter((_, i) => i !== index));
    }
  };

  const saveCard = () => {
    if (!cardName.trim()) {
      Alert.alert('Error', 'Please enter a card name');
      return;
    }

    if (abilities.some(ability => !ability.name.trim())) {
      Alert.alert('Error', 'Please fill in all ability names');
      return;
    }

    const newCard: PokemonCard = {
      id: `custom-${Date.now()}`,
      name: cardName.trim(),
      type: cardType,
      hp: parseInt(hp) || 100,
      maxHp: parseInt(hp) || 100,
      attack: parseInt(attack) || 50,
      defense: parseInt(defense) || 50,
      speed: parseInt(speed) || 50,
      cost: parseInt(cost) || 1,
      rarity,
      abilities: abilities.filter(ability => ability.name.trim()),
    };

    // In a real app, you would save this to storage or send to server
    Alert.alert('Success', `Card "${newCard.name}" created successfully!`, [
      { text: 'OK', onPress: () => {
        // Reset form
        setCardName('');
        setHp('100');
        setAttack('50');
        setDefense('50');
        setSpeed('50');
        setCost('1');
        setRarity('common');
        setAbilities([{
          id: 'ability-1',
          name: '',
          description: '',
          damage: 0,
          cost: 0,
          type: 'physical',
        }]);
      }}
    ]);
  };

  const pokemonTypes: PokemonType[] = [
    'normal', 'fire', 'water', 'grass', 'electric', 
    'psychic', 'fighting', 'dark', 'steel', 'fairy'
  ];

  const rarityOptions: CardRarity[] = [
    'common', 'uncommon', 'rare', 'epic', 'legendary'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Create Your Pokemon Card</Text>
          
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Card Name:</Text>
              <TextInput
                style={styles.input}
                value={cardName}
                onChangeText={setCardName}
                placeholder="Enter Pokemon name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={cardType}
                  style={styles.picker}
                  onValueChange={(value) => setCardType(value)}
                >
                  {pokemonTypes.map(type => (
                    <Picker.Item key={type} label={type.toUpperCase()} value={type} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rarity:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={rarity}
                  style={styles.picker}
                  onValueChange={(value) => setRarity(value)}
                >
                  {rarityOptions.map(rarity => (
                    <Picker.Item key={rarity} label={rarity.toUpperCase()} value={rarity} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statInput}>
                <Text style={styles.label}>HP:</Text>
                <TextInput
                  style={styles.input}
                  value={hp}
                  onChangeText={setHp}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor="#666"
                />
              </View>
              
              <View style={styles.statInput}>
                <Text style={styles.label}>Attack:</Text>
                <TextInput
                  style={styles.input}
                  value={attack}
                  onChangeText={setAttack}
                  keyboardType="numeric"
                  placeholder="50"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statInput}>
                <Text style={styles.label}>Defense:</Text>
                <TextInput
                  style={styles.input}
                  value={defense}
                  onChangeText={setDefense}
                  keyboardType="numeric"
                  placeholder="50"
                  placeholderTextColor="#666"
                />
              </View>
              
              <View style={styles.statInput}>
                <Text style={styles.label}>Speed:</Text>
                <TextInput
                  style={styles.input}
                  value={speed}
                  onChangeText={setSpeed}
                  keyboardType="numeric"
                  placeholder="50"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Energy Cost:</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Abilities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Abilities</Text>
              <TouchableOpacity style={styles.addButton} onPress={addAbility}>
                <Text style={styles.addButtonText}>+ Add Ability</Text>
              </TouchableOpacity>
            </View>

            {abilities.map((ability, index) => (
              <View key={ability.id} style={styles.abilityContainer}>
                <View style={styles.abilityHeader}>
                  <Text style={styles.abilityTitle}>Ability {index + 1}</Text>
                  {abilities.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton} 
                      onPress={() => removeAbility(index)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={ability.name}
                    onChangeText={(value) => updateAbility(index, 'name', value)}
                    placeholder="Ability name"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Description:</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={ability.description}
                    onChangeText={(value) => updateAbility(index, 'description', value)}
                    placeholder="Ability description"
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={2}
                  />
                </View>

                <View style={styles.abilityStatsRow}>
                  <View style={styles.abilityStatInput}>
                    <Text style={styles.label}>Damage:</Text>
                    <TextInput
                      style={styles.input}
                      value={ability.damage.toString()}
                      onChangeText={(value) => updateAbility(index, 'damage', parseInt(value) || 0)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                  </View>
                  
                  <View style={styles.abilityStatInput}>
                    <Text style={styles.label}>Cost:</Text>
                    <TextInput
                      style={styles.input}
                      value={ability.cost.toString()}
                      onChangeText={(value) => updateAbility(index, 'cost', parseInt(value) || 0)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Type:</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={ability.type}
                      style={styles.picker}
                      onValueChange={(value) => updateAbility(index, 'type', value)}
                    >
                      <Picker.Item label="Physical" value="physical" />
                      <Picker.Item label="Special" value="special" />
                      <Picker.Item label="Status" value="status" />
                    </Picker>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
            <LinearGradient
              colors={['#4ecdc4', '#44a08d']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Create Card</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ecdc4',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  picker: {
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  abilityContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  abilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  abilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  abilityStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  abilityStatInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
