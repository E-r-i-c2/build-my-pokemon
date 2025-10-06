import SwiftUI

struct HomeView: View {
    @EnvironmentObject var gameManager: GameManager
    @Binding var currentView: ContentView.AppView
    @State private var showingPlayerSetup = false
    @State private var player1Name = "Player 1"
    @State private var player2Name = "Player 2"
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [
                        Color(red: 0.1, green: 0.1, blue: 0.2),
                        Color(red: 0.05, green: 0.05, blue: 0.15)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Top section with profile and currencies
                    HStack {
                        // Player Profile (Top Left)
                        PlayerProfileView()
                            .environmentObject(gameManager)
                        
                        Spacer()
                        
                        // Currencies (Top Right)
                        HStack(spacing: 12) {
                            ForEach(gameManager.currencies) { currency in
                                CurrencyView(currency: currency)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                    
                    Spacer()
                    
                    // Center content
                    VStack(spacing: 30) {
                        // Game title with icon
                        VStack(spacing: 15) {
                            Image(systemName: "gamecontroller.fill")
                                .font(.system(size: 60))
                                .foregroundColor(.white)
                                .shadow(color: .white.opacity(0.3), radius: 10)
                            
                            Text("Pokemon Card Battle")
                                .font(.system(size: 32, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                                .shadow(color: .black.opacity(0.3), radius: 2)
                            
                            Text("Ready to battle?")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundColor(.white.opacity(0.8))
                        }
                        
                        // Battle button (Center Lower Half)
                        Button(action: { showingPlayerSetup = true }) {
                            HStack(spacing: 15) {
                                Image(systemName: "sword.fill")
                                    .font(.system(size: 24))
                                Text("BATTLE")
                                    .font(.system(size: 24, weight: .bold, design: .rounded))
                            }
                            .foregroundColor(.white)
                            .frame(width: 200, height: 60)
                            .background(
                                LinearGradient(
                                    colors: [
                                        Color(red: 1.0, green: 0.42, blue: 0.42),
                                        Color(red: 0.93, green: 0.35, blue: 0.14)
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(30)
                            .shadow(color: Color(red: 1.0, green: 0.42, blue: 0.42).opacity(0.4), radius: 15, x: 0, y: 8)
                        }
                        .scaleEffect(1.0)
                        .animation(.easeInOut(duration: 0.1), value: showingPlayerSetup)
                    }
                    
                    Spacer()
                    
                    // Bottom menu buttons
                    HStack(spacing: 20) {
                        MenuButton(
                            icon: "plus.circle.fill",
                            title: "Create Card",
                            color: Color(red: 0.31, green: 0.80, blue: 0.77)
                        ) {
                            currentView = .cardCreator
                        }
                        
                        MenuButton(
                            icon: "list.bullet",
                            title: "Collection",
                            color: Color(red: 0.61, green: 0.35, blue: 0.71)
                        ) {
                            // TODO: Navigate to collection
                        }
                        
                        MenuButton(
                            icon: "gear",
                            title: "Settings",
                            color: Color(red: 0.64, green: 0.69, blue: 0.75)
                        ) {
                            // TODO: Navigate to settings
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 30)
                }
            }
        }
        .sheet(isPresented: $showingPlayerSetup) {
            PlayerSetupView(
                player1Name: $player1Name,
                player2Name: $player2Name,
                onStart: startGame,
                onCancel: { showingPlayerSetup = false }
            )
        }
        .alert("Error", isPresented: $showingAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }
    
    private func startGame() {
        guard !player1Name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
              !player2Name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            alertMessage = "Please enter names for both players"
            showingAlert = true
            return
        }
        
        gameManager.startGame(
            player1Name: player1Name.trimmingCharacters(in: .whitespacesAndNewlines),
            player2Name: player2Name.trimmingCharacters(in: .whitespacesAndNewlines)
        )
        showingPlayerSetup = false
        currentView = .game
    }
}

// MARK: - Player Profile View
struct PlayerProfileView: View {
    @EnvironmentObject var gameManager: GameManager
    
    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(red: 0.31, green: 0.80, blue: 0.77), Color(red: 0.27, green: 0.63, blue: 0.55)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 50, height: 50)
                
                Image(systemName: "person.fill")
                    .font(.system(size: 24))
                    .foregroundColor(.white)
            }
            
            // Player info
            VStack(alignment: .leading, spacing: 2) {
                Text(gameManager.playerProfile.username)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                
                Text("Level \(gameManager.playerProfile.level)")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white.opacity(0.8))
                
                // XP bar
                ProgressView(value: Double(gameManager.playerProfile.experience), total: Double(gameManager.playerProfile.level * 100))
                    .progressViewStyle(LinearProgressViewStyle(tint: Color(red: 0.31, green: 0.80, blue: 0.77)))
                    .frame(width: 80, height: 4)
            }
        }
    }
}

// MARK: - Currency View
struct CurrencyView: View {
    let currency: GameCurrency
    
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: currency.type.icon)
                .font(.system(size: 16))
                .foregroundColor(currency.type.color)
            
            Text("\(currency.amount)")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.3))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(currency.type.color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

// MARK: - Menu Button
struct MenuButton: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(.white)
                
                Text(title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.white.opacity(0.9))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 15)
            .background(
                RoundedRectangle(cornerRadius: 15)
                    .fill(color.opacity(0.8))
                    .overlay(
                        RoundedRectangle(cornerRadius: 15)
                            .stroke(color.opacity(0.5), lineWidth: 1)
                    )
            )
        }
    }
}

// MARK: - Player Setup View
struct PlayerSetupView: View {
    @Binding var player1Name: String
    @Binding var player2Name: String
    let onStart: () -> Void
    let onCancel: () -> Void
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                Spacer()
                
                Text("Setup Players")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.white)
                
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Player 1 Name:")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        TextField("Enter Player 1 name", text: $player1Name)
                            .textFieldStyle(CustomTextFieldStyle())
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Player 2 Name:")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        TextField("Enter Player 2 name", text: $player2Name)
                            .textFieldStyle(CustomTextFieldStyle())
                    }
                }
                
                Spacer()
                
                HStack(spacing: 20) {
                    Button("Cancel") {
                        onCancel()
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.gray.opacity(0.3))
                    .cornerRadius(15)
                    
                    Button("Start Battle") {
                        onStart()
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(
                            colors: [Color(red: 1.0, green: 0.42, blue: 0.42), Color(red: 0.93, green: 0.35, blue: 0.14)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(15)
                }
            }
            .padding()
            .background(
                LinearGradient(
                    colors: [
                        Color(red: 0.1, green: 0.1, blue: 0.2),
                        Color(red: 0.05, green: 0.05, blue: 0.15)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .navigationBarHidden(true)
        }
    }
}

struct CustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(Color(red: 0.16, green: 0.16, blue: 0.24))
            .cornerRadius(10)
            .foregroundColor(.white)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
            )
    }
}

#Preview {
    HomeView(currentView: .constant(.home))
        .environmentObject(GameManager())
}
