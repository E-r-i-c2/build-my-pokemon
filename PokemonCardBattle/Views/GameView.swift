import SwiftUI

struct GameView: View {
    @EnvironmentObject var gameManager: GameManager
    @Binding var currentView: ContentView.AppView
    @State private var selectedCard: PokemonCard?
    
    var body: some View {
        VStack(spacing: 20) {
            // Opponent's Area
            VStack(spacing: 10) {
                HStack {
                    Text(gameManager.gameState.opponent.name)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    Text("Energy: \(gameManager.gameState.opponent.energy)/\(gameManager.gameState.opponent.maxEnergy)")
                        .font(.subheadline)
                        .foregroundColor(Color(red: 0.31, green: 0.80, blue: 0.77))
                }
                .padding(.horizontal)
                
                if let activeCard = gameManager.gameState.opponent.activeCard {
                    CardView(card: activeCard, isActive: true, isOpponent: true)
                } else {
                    EmptyFieldView()
                }
            }
            .padding(.vertical)
            
            // Battle Field
            BattleFieldView(
                player1Card: gameManager.gameState.player1.activeCard,
                player2Card: gameManager.gameState.player2.activeCard
            )
            .padding(.horizontal)
            
            // Current Player's Area
            VStack(spacing: 10) {
                HStack {
                    Text(gameManager.gameState.currentPlayer.name)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    Text("Energy: \(gameManager.gameState.currentPlayer.energy)/\(gameManager.gameState.currentPlayer.maxEnergy)")
                        .font(.subheadline)
                        .foregroundColor(Color(red: 0.31, green: 0.80, blue: 0.77))
                }
                .padding(.horizontal)
                
                if let activeCard = gameManager.gameState.currentPlayer.activeCard {
                    CardView(card: activeCard, isActive: true, isOpponent: false)
                } else {
                    EmptyFieldView()
                }
            }
            .padding(.vertical)
            
            // Hand
            VStack(alignment: .leading, spacing: 10) {
                Text("Your Hand")
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.horizontal)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(gameManager.gameState.currentPlayer.hand) { card in
                            CardView(
                                card: card,
                                isActive: false,
                                isOpponent: false
                            ) {
                                if gameManager.canPlayCard(card, for: gameManager.gameState.currentPlayer) {
                                    selectedCard = card
                                }
                            }
                            .opacity(gameManager.canPlayCard(card, for: gameManager.gameState.currentPlayer) ? 1.0 : 0.5)
                        }
                    }
                    .padding(.horizontal)
                }
                
                if selectedCard != nil && gameManager.gameState.currentPlayer.activeCard == nil {
                    Button("Play Card") {
                        if let card = selectedCard {
                            gameManager.playCard(card, for: gameManager.gameState.currentPlayer)
                            selectedCard = nil
                        }
                    }
                    .buttonStyle(ActionButtonStyle(colors: [Color(red: 0.31, green: 0.80, blue: 0.77), Color(red: 0.27, green: 0.63, blue: 0.55)]))
                    .padding(.horizontal)
                }
            }
            .frame(maxHeight: 200)
            
            // Turn Controls
            VStack(spacing: 10) {
                Button("End Turn") {
                    gameManager.endTurn()
                    selectedCard = nil
                }
                .buttonStyle(ActionButtonStyle(colors: [Color(red: 1.0, green: 0.42, blue: 0.42), Color(red: 0.93, green: 0.35, blue: 0.14)]))
                
                Button("Back to Menu") {
                    currentView = .home
                }
                .foregroundColor(.gray)
            }
            .padding()
        }
        .navigationBarHidden(true)
    }
}

struct EmptyFieldView: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 10)
                .fill(Color(red: 0.16, green: 0.16, blue: 0.24))
                .frame(width: 120, height: 160)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.gray.opacity(0.3), style: StrokeStyle(lineWidth: 2, dash: [5]))
                )
            
            Text("No Pokemon Active")
                .font(.system(size: 12))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
        }
    }
}

struct ActionButtonStyle: ButtonStyle {
    let colors: [Color]
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundColor(.white)
            .padding()
            .background(
                LinearGradient(
                    colors: colors,
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(12)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

#Preview {
    GameView(currentView: .constant(.game))
        .environmentObject(GameManager())
}
