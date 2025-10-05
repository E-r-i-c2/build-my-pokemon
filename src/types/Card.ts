export interface PokemonCard {
  id: string;
  name: string;
  type: PokemonType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  abilities: Ability[];
  image?: string;
  rarity: CardRarity;
  cost: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  damage: number;
  cost: number;
  type: AbilityType;
  cooldown?: number;
}

export type PokemonType = 
  | 'fire' 
  | 'water' 
  | 'grass' 
  | 'electric' 
  | 'psychic' 
  | 'fighting' 
  | 'dark' 
  | 'steel' 
  | 'fairy' 
  | 'normal';

export type AbilityType = 'physical' | 'special' | 'status';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Player {
  id: string;
  name: string;
  deck: PokemonCard[];
  hand: PokemonCard[];
  activeCard?: PokemonCard;
  energy: number;
  maxEnergy: number;
  isTurn: boolean;
}

export interface GameState {
  player1: Player;
  player2: Player;
  currentTurn: number;
  gamePhase: GamePhase;
  winner?: string;
}

export type GamePhase = 'setup' | 'draw' | 'main' | 'battle' | 'end';
