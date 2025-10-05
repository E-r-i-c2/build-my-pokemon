import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Player, PokemonCard, GamePhase } from '../types/Card';
import { starterDeck } from '../data/sampleCards';

interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (player1Name: string, player2Name: string) => void;
  playCard: (cardId: string, playerId: string) => void;
  useAbility: (abilityId: string, targetId?: string) => void;
  endTurn: () => void;
}

type GameAction = 
  | { type: 'START_GAME'; payload: { player1Name: string; player2Name: string } }
  | { type: 'PLAY_CARD'; payload: { cardId: string; playerId: string } }
  | { type: 'USE_ABILITY'; payload: { abilityId: string; targetId?: string } }
  | { type: 'END_TURN' }
  | { type: 'DRAW_CARD'; payload: { playerId: string } }
  | { type: 'DAMAGE_CARD'; payload: { cardId: string; damage: number } }
  | { type: 'SET_ACTIVE_CARD'; payload: { cardId: string; playerId: string } };

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  player1: {
    id: 'player1',
    name: '',
    deck: [],
    hand: [],
    energy: 0,
    maxEnergy: 0,
    isTurn: false,
  },
  player2: {
    id: 'player2',
    name: '',
    deck: [],
    hand: [],
    energy: 0,
    maxEnergy: 0,
    isTurn: false,
  },
  currentTurn: 1,
  gamePhase: 'setup',
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { player1Name, player2Name } = action.payload;
      // Shuffle and deal initial hands
      const shuffledDeck1 = [...starterDeck].sort(() => Math.random() - 0.5);
      const shuffledDeck2 = [...starterDeck].sort(() => Math.random() - 0.5);
      
      return {
        ...state,
        player1: {
          ...state.player1,
          name: player1Name,
          deck: shuffledDeck1,
          hand: shuffledDeck1.slice(0, 3), // Deal 3 cards
          isTurn: true,
          energy: 1,
          maxEnergy: 1,
        },
        player2: {
          ...state.player2,
          name: player2Name,
          deck: shuffledDeck2,
          hand: shuffledDeck2.slice(0, 3), // Deal 3 cards
          energy: 1,
          maxEnergy: 1,
        },
        gamePhase: 'main',
      };
    }
    
    case 'END_TURN': {
      const newTurn = state.currentTurn + 1;
      const isPlayer1Turn = newTurn % 2 === 1;
      
      // Draw a card for the player whose turn it is
      const activePlayer = isPlayer1Turn ? state.player1 : state.player2;
      const newHand = activePlayer.deck.length > 0 
        ? [...activePlayer.hand, activePlayer.deck[0]]
        : activePlayer.hand;
      const newDeck = activePlayer.deck.slice(1);
      
      return {
        ...state,
        currentTurn: newTurn,
        player1: {
          ...state.player1,
          isTurn: isPlayer1Turn,
          energy: isPlayer1Turn ? Math.min(state.player1.maxEnergy + 1, 10) : state.player1.energy,
          hand: isPlayer1Turn ? newHand : state.player1.hand,
          deck: isPlayer1Turn ? newDeck : state.player1.deck,
        },
        player2: {
          ...state.player2,
          isTurn: !isPlayer1Turn,
          energy: !isPlayer1Turn ? Math.min(state.player2.maxEnergy + 1, 10) : state.player2.energy,
          hand: !isPlayer1Turn ? newHand : state.player2.hand,
          deck: !isPlayer1Turn ? newDeck : state.player2.deck,
        },
      };
    }
    
    case 'PLAY_CARD': {
      const { cardId, playerId } = action.payload;
      const player = playerId === 'player1' ? state.player1 : state.player2;
      const card = player.hand.find(c => c.id === cardId);
      
      if (!card || player.energy < card.cost) {
        return state;
      }
      
      const updatedHand = player.hand.filter(c => c.id !== cardId);
      const updatedPlayer = {
        ...player,
        hand: updatedHand,
        energy: player.energy - card.cost,
        activeCard: card,
      };
      
      return {
        ...state,
        [playerId]: updatedPlayer,
      };
    }
    
    case 'USE_ABILITY': {
      const { abilityId, targetId } = action.payload;
      const currentPlayer = state.player1.isTurn ? state.player1 : state.player2;
      const opponent = state.player1.isTurn ? state.player2 : state.player1;
      
      if (!currentPlayer.activeCard) return state;
      
      const ability = currentPlayer.activeCard.abilities.find(a => a.id === abilityId);
      if (!ability || currentPlayer.energy < ability.cost) return state;
      
      // Apply damage to target
      let updatedOpponent = opponent;
      if (targetId && ability.damage > 0) {
        const targetCard = opponent.activeCard;
        if (targetCard) {
          const newHp = Math.max(0, targetCard.hp - ability.damage);
          const updatedTargetCard = { ...targetCard, hp: newHp };
          updatedOpponent = {
            ...opponent,
            activeCard: updatedTargetCard,
          };
        }
      }
      
      const updatedCurrentPlayer = {
        ...currentPlayer,
        energy: currentPlayer.energy - ability.cost,
      };
      
      return {
        ...state,
        player1: state.player1.isTurn ? updatedCurrentPlayer : updatedOpponent,
        player2: state.player1.isTurn ? updatedOpponent : updatedCurrentPlayer,
      };
    }
    
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  
  const startGame = (player1Name: string, player2Name: string) => {
    dispatch({ type: 'START_GAME', payload: { player1Name, player2Name } });
  };
  
  const playCard = (cardId: string, playerId: string) => {
    dispatch({ type: 'PLAY_CARD', payload: { cardId, playerId } });
  };
  
  const useAbility = (abilityId: string, targetId?: string) => {
    dispatch({ type: 'USE_ABILITY', payload: { abilityId, targetId } });
  };
  
  const endTurn = () => {
    dispatch({ type: 'END_TURN' });
  };
  
  return (
    <GameContext.Provider value={{
      gameState,
      dispatch,
      startGame,
      playCard,
      useAbility,
      endTurn,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
