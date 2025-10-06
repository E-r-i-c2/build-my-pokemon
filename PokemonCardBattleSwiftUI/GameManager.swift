import Foundation
import SwiftUI

class GameManager: ObservableObject {
    @Published var gameState: GameState
    @Published var customCards: [PokemonCard] = []
    @Published var playerProfile: PlayerProfile
    @Published var currencies: [GameCurrency]
    
    init() {
        self.gameState = GameState(
            player1: Player(name: ""),
            player2: Player(name: "")
        )
        self.playerProfile = PlayerProfile(
            username: "Trainer",
            level: 1,
            experience: 0,
            totalBattles: 0,
            wins: 0,
            losses: 0
        )
        self.currencies = [
            GameCurrency(type: .coins, amount: 1000),
            GameCurrency(type: .gems, amount: 50),
            GameCurrency(type: .energy, amount: 100),
            GameCurrency(type: .tickets, amount: 5)
        ]
    }
    
    // MARK: - Game Control
    func startGame(player1Name: String, player2Name: String) {
        let shuffledDeck1 = PokemonCard.starterDeck.shuffled()
        let shuffledDeck2 = PokemonCard.starterDeck.shuffled()
        
        gameState.player1 = Player(
            name: player1Name,
            deck: shuffledDeck1,
            hand: Array(shuffledDeck1.prefix(3)),
            energy: 1,
            maxEnergy: 1,
            isTurn: true
        )
        
        gameState.player2 = Player(
            name: player2Name,
            deck: shuffledDeck2,
            hand: Array(shuffledDeck2.prefix(3)),
            energy: 1,
            maxEnergy: 1,
            isTurn: false
        )
        
        gameState.currentTurn = 1
        gameState.gamePhase = .main
        gameState.winner = nil
    }
    
    func playCard(_ card: PokemonCard, for player: Player) {
        guard player.energy >= card.cost && player.activeCard == nil else { return }
        
        if let index = player.hand.firstIndex(where: { $0.id == card.id }) {
            player.hand.remove(at: index)
            player.activeCard = card
            player.energy -= card.cost
        }
    }
    
    func useAbility(_ ability: Ability, from player: Player, on target: Player?) {
        guard let activeCard = player.activeCard,
              player.energy >= ability.cost,
              let abilityIndex = activeCard.abilities.firstIndex(where: { $0.id == ability.id }) else { return }
        
        player.energy -= ability.cost
        
        // Apply damage to target if specified
        if let target = target, let targetCard = target.activeCard, ability.damage > 0 {
            let newHp = max(0, targetCard.hp - ability.damage)
            target.activeCard?.hp = newHp
            
            // Check if target Pokemon is defeated
            if newHp <= 0 {
                target.activeCard = nil
                checkForWinner()
            }
        }
    }
    
    func endTurn() {
        let newTurn = gameState.currentTurn + 1
        let isPlayer1Turn = newTurn % 2 == 1
        
        // Update turn status
        gameState.player1.isTurn = isPlayer1Turn
        gameState.player2.isTurn = !isPlayer1Turn
        
        // Draw card and gain energy for the active player
        let activePlayer = isPlayer1Turn ? gameState.player1 : gameState.player2
        
        // Draw a card
        if !activePlayer.deck.isEmpty {
            let drawnCard = activePlayer.deck.removeFirst()
            activePlayer.hand.append(drawnCard)
        }
        
        // Gain energy (max 10)
        activePlayer.maxEnergy = min(activePlayer.maxEnergy + 1, 10)
        activePlayer.energy = activePlayer.maxEnergy
        
        gameState.currentTurn = newTurn
    }
    
    private func checkForWinner() {
        // Simple win condition: opponent has no active Pokemon and no cards in hand
        if gameState.player1.activeCard == nil && gameState.player1.hand.isEmpty {
            gameState.winner = gameState.player2.name
            gameState.gamePhase = .end
        } else if gameState.player2.activeCard == nil && gameState.player2.hand.isEmpty {
            gameState.winner = gameState.player1.name
            gameState.gamePhase = .end
        }
    }
    
    // MARK: - Card Management
    func addCustomCard(_ card: PokemonCard) {
        customCards.append(card)
    }
    
    func removeCustomCard(_ card: PokemonCard) {
        customCards.removeAll { $0.id == card.id }
    }
    
    // MARK: - Utility
    func resetGame() {
        gameState = GameState(
            player1: Player(name: ""),
            player2: Player(name: "")
        )
    }
    
    func canPlayCard(_ card: PokemonCard, for player: Player) -> Bool {
        return player.energy >= card.cost && player.activeCard == nil
    }
    
    func canUseAbility(_ ability: Ability, for player: Player) -> Bool {
        return player.energy >= ability.cost && player.activeCard != nil
    }
}
