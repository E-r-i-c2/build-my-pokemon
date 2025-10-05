import SwiftUI

struct BattleFieldView: View {
    let player1Card: PokemonCard?
    let player2Card: PokemonCard?
    
    var body: some View {
        VStack(spacing: 15) {
            // Battle Arena Title
            Text("BATTLE ARENA")
                .font(.headline)
                .fontWeight(.bold)
                .foregroundColor(Color(red: 0.31, green: 0.80, blue: 0.77))
                .letterSpacing(2)
            
            // VS Indicator
            HStack {
                Rectangle()
                    .fill(Color(red: 0.31, green: 0.80, blue: 0.77))
                    .frame(height: 2)
                
                ZStack {
                    Circle()
                        .fill(Color(red: 1.0, green: 0.42, blue: 0.42))
                        .frame(width: 40, height: 40)
                        .shadow(color: .black.opacity(0.25), radius: 3.84, x: 0, y: 2)
                    
                    Text("VS")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                }
                
                Rectangle()
                    .fill(Color(red: 0.31, green: 0.80, blue: 0.77))
                    .frame(height: 2)
            }
            .padding(.horizontal, 15)
            
            // Battle Status
            if player1Card != nil && player2Card != nil {
                Text("BATTLE IN PROGRESS")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(Color(red: 1.0, green: 0.42, blue: 0.42))
            } else {
                Text("WAITING FOR POKEMON")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.gray)
            }
        }
        .padding(15)
        .background(
            LinearGradient(
                colors: [
                    Color(red: 0.16, green: 0.16, blue: 0.24),
                    Color(red: 0.10, green: 0.10, blue: 0.18),
                    Color(red: 0.09, green: 0.13, blue: 0.24)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(15)
    }
}

#Preview {
    VStack {
        BattleFieldView(player1Card: PokemonCard.sampleCards[0], player2Card: PokemonCard.sampleCards[1])
        BattleFieldView(player1Card: nil, player2Card: nil)
    }
    .padding()
    .background(Color.black)
}
