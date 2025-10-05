import SwiftUI

struct HomeView: View {
    @EnvironmentObject var gameManager: GameManager
    @Binding var currentView: ContentView.AppView
    @State private var player1Name = "Player 1"
    @State private var player2Name = "Player 2"
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        VStack(spacing: 30) {
            Spacer()
            
            // Title
            VStack(spacing: 10) {
                Text("Pokemon Card Battle")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text("Create your cards and battle!")
                    .font(.headline)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            // Player Name Inputs
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
            
            // Action Buttons
            VStack(spacing: 15) {
                Button(action: startGame) {
                    HStack {
                        Image(systemName: "gamecontroller.fill")
                        Text("Start Battle")
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
                
                Button(action: { currentView = .cardCreator }) {
                    HStack {
                        Image(systemName: "plus.circle.fill")
                        Text("Create Card")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(
                            colors: [Color(red: 0.31, green: 0.80, blue: 0.77), Color(red: 0.27, green: 0.63, blue: 0.55)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(15)
                }
            }
            
            Spacer()
        }
        .padding()
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
        currentView = .game
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
