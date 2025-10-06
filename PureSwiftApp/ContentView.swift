import SwiftUI

struct ContentView: View {
    @EnvironmentObject var gameManager: GameManager
    @State private var currentView: AppView = .home
    
    enum AppView {
        case home
        case game
        case cardCreator
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [Color(red: 0.06, green: 0.06, blue: 0.14), 
                            Color(red: 0.10, green: 0.10, blue: 0.18),
                            Color(red: 0.09, green: 0.13, blue: 0.24)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                // Main content
                switch currentView {
                case .home:
                    HomeView(currentView: $currentView)
                case .game:
                    GameView(currentView: $currentView)
                case .cardCreator:
                    CardCreatorView(currentView: $currentView)
                }
            }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(GameManager())
}
