import SwiftUI

struct HomeView: View {
    @EnvironmentObject var gameManager: GameManager
    @Binding var currentView: ContentView.AppView
    
    // Mock player data - in a real app, this would come from user profile/context
    private let playerData = PlayerData(
        name: "Trainer Ash",
        level: 25,
        avatar: "👨‍🎓",
        coins: 1250,
        gems: 45,
        energy: 120
    )
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [
                        Color(red: 0.1, green: 0.1, blue: 0.14), // #1a1a2e
                        Color(red: 0.09, green: 0.13, blue: 0.24), // #16213e
                        Color(red: 0.06, green: 0.06, blue: 0.14) // #0f0f23
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Top Header with Profile and Currencies
                    HStack {
                        // Player Profile
                        Button(action: {}) {
                            HStack(spacing: 10) {
                                // Avatar
                                ZStack {
                                    Circle()
                                        .fill(Color.white.opacity(0.2))
                                        .frame(width: 40, height: 40)
                                    
                                    Text(playerData.avatar)
                                        .font(.system(size: 20))
                                }
                                
                                // Profile Info
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(playerData.name)
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.white)
                                    
                                    Text("Lv. \(playerData.level)")
                                        .font(.system(size: 12, weight: .semibold))
                                        .foregroundColor(.yellow)
                                }
                            }
                            .padding(.horizontal, 15)
                            .padding(.vertical, 8)
                            .background(
                                RoundedRectangle(cornerRadius: 25)
                                    .fill(Color.white.opacity(0.1))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 25)
                                            .stroke(Color.white.opacity(0.2), lineWidth: 1)
                                    )
                            )
                        }
                        
                        Spacer()
                        
                        // Currencies
                        HStack(spacing: 8) {
                            CurrencyItem(icon: "🪙", amount: playerData.coins)
                            CurrencyItem(icon: "💎", amount: playerData.gems)
                            CurrencyItem(icon: "⚡", amount: playerData.energy)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                    .padding(.bottom, 20)
                    
                    // Main Content Area
                    VStack(spacing: 0) {
                        // Game Title
                        VStack(spacing: 0) {
                            Text("Pokemon Card")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(.white)
                            
                            Text("Battle")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(Color(red: 1.0, green: 0.42, blue: 0.42))
                                .offset(y: -5)
                            
                            // Debug indicator
                            Text("🎮 NEW VERSION LOADED")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.green)
                                .padding(.top, 5)
                        }
                        .padding(.top, 20)
                        
                        Spacer()
                        
                        // Battle Arena Visual
                        ZStack {
                            Circle()
                                .fill(Color(red: 1.0, green: 0.42, blue: 0.42).opacity(0.2))
                                .frame(width: 200, height: 200)
                                .overlay(
                                    Circle()
                                        .stroke(Color(red: 1.0, green: 0.42, blue: 0.42).opacity(0.5), lineWidth: 3)
                                )
                                .shadow(color: Color(red: 1.0, green: 0.42, blue: 0.42), radius: 20, x: 0, y: 0)
                            
                            Text("⚔️")
                                .font(.system(size: 60))
                        }
                        
                        Spacer()
                        
                        // Action Buttons
                        VStack(spacing: 20) {
                            // Main Battle Button
                            Button(action: startGame) {
                                VStack(spacing: 4) {
                                    Text("⚔️")
                                        .font(.system(size: 24))
                                    
                                    Text("BATTLE")
                                        .font(.system(size: 24, weight: .bold))
                                        .kerning(2)
                                    
                                    Text("Start New Game")
                                        .font(.system(size: 12, weight: .medium))
                                        .opacity(0.8)
                                }
                                .foregroundColor(.white)
                                .frame(width: geometry.size.width * 0.8, height: 80)
                                .background(
                                    LinearGradient(
                                        colors: [
                                            Color(red: 1.0, green: 0.42, blue: 0.42),
                                            Color(red: 0.93, green: 0.35, blue: 0.14),
                                            Color(red: 0.77, green: 0.27, blue: 0.41)
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .cornerRadius(20)
                                .shadow(color: Color(red: 1.0, green: 0.42, blue: 0.42), radius: 8, x: 0, y: 4)
                            }
                            
                            // Secondary Buttons
                            HStack(spacing: 15) {
                                // Create Card Button
                                Button(action: { currentView = .cardCreator }) {
                                    VStack(spacing: 2) {
                                        Text("✨")
                                            .font(.system(size: 18))
                                        
                                        Text("Create Card")
                                            .font(.system(size: 14, weight: .bold))
                                    }
                                    .foregroundColor(.white)
                                    .frame(width: (geometry.size.width * 0.8 - 15) / 2, height: 60)
                                    .background(
                                        LinearGradient(
                                            colors: [
                                                Color(red: 0.31, green: 0.80, blue: 0.77),
                                                Color(red: 0.27, green: 0.63, blue: 0.55)
                                            ],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .cornerRadius(15)
                                }
                                
                                // Collection Button
                                Button(action: {}) {
                                    VStack(spacing: 2) {
                                        Text("📚")
                                            .font(.system(size: 18))
                                        
                                        Text("Collection")
                                            .font(.system(size: 14, weight: .bold))
                                    }
                                    .foregroundColor(.white)
                                    .frame(width: (geometry.size.width * 0.8 - 15) / 2, height: 60)
                                    .background(
                                        LinearGradient(
                                            colors: [
                                                Color(red: 0.66, green: 0.90, blue: 0.81),
                                                Color(red: 0.50, green: 0.80, blue: 0.80)
                                            ],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .cornerRadius(15)
                                }
                            }
                        }
                        .padding(.bottom, 40)
                    }
                    .padding(.horizontal, 20)
                }
            }
        }
    }
    
    private func startGame() {
        // Use default player names for quick start
        gameManager.startGame(
            player1Name: "Player 1",
            player2Name: "Player 2"
        )
        currentView = .game
    }
}

// Supporting structures
struct PlayerData {
    let name: String
    let level: Int
    let avatar: String
    let coins: Int
    let gems: Int
    let energy: Int
}

struct CurrencyItem: View {
    let icon: String
    let amount: Int
    
    var body: some View {
        HStack(spacing: 4) {
            Text(icon)
                .font(.system(size: 14))
            
            Text(amount.formatted())
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.white)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 15)
                .fill(Color.white.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 15)
                        .stroke(Color.white.opacity(0.2), lineWidth: 1)
                )
        )
    }
}

#Preview {
    HomeView(currentView: .constant(.home))
        .environmentObject(GameManager())
}
