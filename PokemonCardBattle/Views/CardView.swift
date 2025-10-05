import SwiftUI

struct CardView: View {
    let card: PokemonCard
    let isActive: Bool
    let isOpponent: Bool
    let onTap: (() -> Void)?
    
    init(card: PokemonCard, isActive: Bool = false, isOpponent: Bool = false, onTap: (() -> Void)? = nil) {
        self.card = card
        self.isActive = isActive
        self.isOpponent = isOpponent
        self.onTap = onTap
    }
    
    var body: some View {
        let cardWidth: CGFloat = isActive ? 120 : 100
        let cardHeight: CGFloat = isActive ? 168 : 140
        
        Button(action: { onTap?() }) {
            ZStack {
                // Card background with gradient
                RoundedRectangle(cornerRadius: 12)
                    .fill(
                        LinearGradient(
                            colors: card.type.gradientColors,
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(card.rarity.color, lineWidth: 2)
                    )
                    .frame(width: cardWidth, height: cardHeight)
                
                VStack(spacing: 4) {
                    // Card header
                    HStack {
                        Text(card.name)
                            .font(.system(size: isActive ? 12 : 10, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(1)
                        
                        Spacer()
                        
                        Text(card.type.rawValue.uppercased())
                            .font(.system(size: 8, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 4)
                            .padding(.vertical, 2)
                            .background(Color.white.opacity(0.2))
                            .cornerRadius(4)
                    }
                    
                    // HP Bar
                    VStack(spacing: 2) {
                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                Rectangle()
                                    .fill(Color.white.opacity(0.3))
                                    .frame(height: 4)
                                    .cornerRadius(2)
                                
                                Rectangle()
                                    .fill(hpColor)
                                    .frame(width: geometry.size.width * card.hpPercentage, height: 4)
                                    .cornerRadius(2)
                            }
                        }
                        .frame(height: 4)
                        
                        Text("\(card.hp)/\(card.maxHp)")
                            .font(.system(size: 8, weight: .medium))
                            .foregroundColor(.white)
                    }
                    
                    // Pokemon image placeholder
                    ZStack {
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.white.opacity(0.1))
                            .frame(height: isActive ? 40 : 30)
                        
                        Text(String(card.name.prefix(1)))
                            .font(.system(size: isActive ? 20 : 16, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    // Stats
                    HStack(spacing: 8) {
                        StatView(label: "ATK", value: card.attack, size: isActive ? 10 : 8)
                        StatView(label: "DEF", value: card.defense, size: isActive ? 10 : 8)
                        StatView(label: "SPD", value: card.speed, size: isActive ? 10 : 8)
                    }
                    
                    // Cost
                    Text("Cost: \(card.cost)")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(.white)
                }
                .padding(8)
            }
        }
    }
    
    private var hpColor: Color {
        if card.hpPercentage > 0.5 {
            return Color(red: 0.31, green: 0.80, blue: 0.77)
        } else if card.hpPercentage > 0.25 {
            return Color(red: 0.98, green: 0.79, blue: 0.14)
        } else {
            return Color(red: 1.0, green: 0.42, blue: 0.42)
        }
    }
}

struct StatView: View {
    let label: String
    let value: Int
    let size: CGFloat
    
    var body: some View {
        VStack(spacing: 2) {
            Text(label)
                .font(.system(size: size - 2, weight: .bold))
                .foregroundColor(.white)
            Text("\(value)")
                .font(.system(size: size, weight: .bold))
                .foregroundColor(.white)
        }
    }
}

#Preview {
    VStack {
        CardView(card: PokemonCard.sampleCards[0], isActive: true)
        CardView(card: PokemonCard.sampleCards[1], isActive: false)
    }
    .padding()
    .background(Color.black)
}
