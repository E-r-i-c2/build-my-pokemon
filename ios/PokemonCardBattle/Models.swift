import Foundation
import SwiftUI

// MARK: - Pokemon Types
enum PokemonType: String, CaseIterable, Codable {
    case fire = "fire"
    case water = "water"
    case grass = "grass"
    case electric = "electric"
    case psychic = "psychic"
    case fighting = "fighting"
    case dark = "dark"
    case steel = "steel"
    case fairy = "fairy"
    case normal = "normal"
    
    var color: Color {
        switch self {
        case .fire: return Color(red: 1.0, green: 0.42, blue: 0.42)
        case .water: return Color(red: 0.31, green: 0.80, blue: 0.77)
        case .grass: return Color(red: 0.27, green: 0.72, blue: 0.82)
        case .electric: return Color(red: 0.98, green: 0.79, blue: 0.14)
        case .psychic: return Color(red: 0.94, green: 0.58, blue: 0.17)
        case .fighting: return Color(red: 0.92, green: 0.30, blue: 0.29)
        case .dark: return Color(red: 0.42, green: 0.36, blue: 0.91)
        case .steel: return Color(red: 0.64, green: 0.69, blue: 0.75)
        case .fairy: return Color(red: 0.99, green: 0.47, blue: 0.66)
        case .normal: return Color(red: 0.87, green: 0.87, blue: 0.87)
        }
    }
    
    var gradientColors: [Color] {
        switch self {
        case .fire: return [Color(red: 1.0, green: 0.42, blue: 0.42), Color(red: 0.93, green: 0.35, blue: 0.14)]
        case .water: return [Color(red: 0.31, green: 0.80, blue: 0.77), Color(red: 0.27, green: 0.63, blue: 0.55)]
        case .grass: return [Color(red: 0.27, green: 0.72, blue: 0.82), Color(red: 0.59, green: 0.81, blue: 0.71)]
        case .electric: return [Color(red: 0.98, green: 0.79, blue: 0.14), Color(red: 0.94, green: 0.58, blue: 0.17)]
        case .psychic: return [Color(red: 0.94, green: 0.58, blue: 0.17), Color(red: 0.92, green: 0.30, blue: 0.29)]
        case .fighting: return [Color(red: 0.92, green: 0.30, blue: 0.29), Color(red: 0.42, green: 0.36, blue: 0.91)]
        case .dark: return [Color(red: 0.42, green: 0.36, blue: 0.91), Color(red: 0.64, green: 0.69, blue: 0.75)]
        case .steel: return [Color(red: 0.64, green: 0.69, blue: 0.75), Color(red: 0.87, green: 0.87, blue: 0.87)]
        case .fairy: return [Color(red: 0.99, green: 0.47, blue: 0.66), Color(red: 0.99, green: 0.81, blue: 0.43)]
        case .normal: return [Color(red: 0.87, green: 0.87, blue: 0.87), Color(red: 0.73, green: 0.73, blue: 0.73)]
        }
    }
}

enum AbilityType: String, CaseIterable, Codable {
    case physical = "physical"
    case special = "special"
    case status = "status"
}

enum CardRarity: String, CaseIterable, Codable {
    case common = "common"
    case uncommon = "uncommon"
    case rare = "rare"
    case epic = "epic"
    case legendary = "legendary"
    
    var color: Color {
        switch self {
        case .common: return Color.gray
        case .uncommon: return Color(red: 0.31, green: 0.80, blue: 0.77)
        case .rare: return Color(red: 0.31, green: 0.80, blue: 0.77)
        case .epic: return Color(red: 0.61, green: 0.35, blue: 0.71)
        case .legendary: return Color(red: 0.95, green: 0.61, blue: 0.07)
        }
    }
}

// MARK: - Ability Model
struct Ability: Identifiable, Codable {
    let id = UUID()
    var name: String
    var description: String
    var damage: Int
    var cost: Int
    var type: AbilityType
    var cooldown: Int?
    
    init(name: String = "", description: String = "", damage: Int = 0, cost: Int = 0, type: AbilityType = .physical, cooldown: Int? = nil) {
        self.name = name
        self.description = description
        self.damage = damage
        self.cost = cost
        self.type = type
        self.cooldown = cooldown
    }
}

// MARK: - Pokemon Card Model
struct PokemonCard: Identifiable, Codable {
    let id = UUID()
    var name: String
    var type: PokemonType
    var hp: Int
    var maxHp: Int
    var attack: Int
    var defense: Int
    var speed: Int
    var abilities: [Ability]
    var rarity: CardRarity
    var cost: Int
    var imageName: String?
    
    init(name: String, type: PokemonType, hp: Int, attack: Int, defense: Int, speed: Int, abilities: [Ability], rarity: CardRarity, cost: Int, imageName: String? = nil) {
        self.name = name
        self.type = type
        self.hp = hp
        self.maxHp = hp
        self.attack = attack
        self.defense = defense
        self.speed = speed
        self.abilities = abilities
        self.rarity = rarity
        self.cost = cost
        self.imageName = imageName
    }
    
    var hpPercentage: Double {
        return Double(hp) / Double(maxHp)
    }
}

// MARK: - Player Model
class Player: ObservableObject, Codable {
    let id = UUID()
    @Published var name: String
    @Published var deck: [PokemonCard]
    @Published var hand: [PokemonCard]
    @Published var activeCard: PokemonCard?
    @Published var energy: Int
    @Published var maxEnergy: Int
    @Published var isTurn: Bool
    
    init(name: String, deck: [PokemonCard] = [], hand: [PokemonCard] = [], activeCard: PokemonCard? = nil, energy: Int = 0, maxEnergy: Int = 0, isTurn: Bool = false) {
        self.name = name
        self.deck = deck
        self.hand = hand
        self.activeCard = activeCard
        self.energy = energy
        self.maxEnergy = maxEnergy
        self.isTurn = isTurn
    }
    
    // Codable conformance
    enum CodingKeys: String, CodingKey {
        case name, deck, hand, activeCard, energy, maxEnergy, isTurn
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        name = try container.decode(String.self, forKey: .name)
        deck = try container.decode([PokemonCard].self, forKey: .deck)
        hand = try container.decode([PokemonCard].self, forKey: .hand)
        activeCard = try container.decodeIfPresent(PokemonCard.self, forKey: .activeCard)
        energy = try container.decode(Int.self, forKey: .energy)
        maxEnergy = try container.decode(Int.self, forKey: .maxEnergy)
        isTurn = try container.decode(Bool.self, forKey: .isTurn)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(name, forKey: .name)
        try container.encode(deck, forKey: .deck)
        try container.encode(hand, forKey: .hand)
        try container.encodeIfPresent(activeCard, forKey: .activeCard)
        try container.encode(energy, forKey: .energy)
        try container.encode(maxEnergy, forKey: .maxEnergy)
        try container.encode(isTurn, forKey: .isTurn)
    }
}

// MARK: - Game State Model
enum GamePhase: String, CaseIterable {
    case setup = "setup"
    case draw = "draw"
    case main = "main"
    case battle = "battle"
    case end = "end"
}

class GameState: ObservableObject {
    @Published var player1: Player
    @Published var player2: Player
    @Published var currentTurn: Int
    @Published var gamePhase: GamePhase
    @Published var winner: String?
    
    init(player1: Player, player2: Player, currentTurn: Int = 1, gamePhase: GamePhase = .setup, winner: String? = nil) {
        self.player1 = player1
        self.player2 = player2
        self.currentTurn = currentTurn
        self.gamePhase = gamePhase
        self.winner = winner
    }
    
    var currentPlayer: Player {
        return currentTurn % 2 == 1 ? player1 : player2
    }
    
    var opponent: Player {
        return currentTurn % 2 == 1 ? player2 : player1
    }
}

// MARK: - Player Profile Model
class PlayerProfile: ObservableObject, Codable {
    @Published var username: String
    @Published var level: Int
    @Published var experience: Int
    @Published var avatarImage: String?
    @Published var totalBattles: Int
    @Published var wins: Int
    @Published var losses: Int
    
    init(username: String = "Trainer", level: Int = 1, experience: Int = 0, avatarImage: String? = nil, totalBattles: Int = 0, wins: Int = 0, losses: Int = 0) {
        self.username = username
        self.level = level
        self.experience = experience
        self.avatarImage = avatarImage
        self.totalBattles = totalBattles
        self.wins = wins
        self.losses = losses
    }
    
    var winRate: Double {
        guard totalBattles > 0 else { return 0.0 }
        return Double(wins) / Double(totalBattles)
    }
    
    var experienceToNextLevel: Int {
        return (level * 100) - experience
    }
    
    // Codable conformance
    enum CodingKeys: String, CodingKey {
        case username, level, experience, avatarImage, totalBattles, wins, losses
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        username = try container.decode(String.self, forKey: .username)
        level = try container.decode(Int.self, forKey: .level)
        experience = try container.decode(Int.self, forKey: .experience)
        avatarImage = try container.decodeIfPresent(String.self, forKey: .avatarImage)
        totalBattles = try container.decode(Int.self, forKey: .totalBattles)
        wins = try container.decode(Int.self, forKey: .wins)
        losses = try container.decode(Int.self, forKey: .losses)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(username, forKey: .username)
        try container.encode(level, forKey: .level)
        try container.encode(experience, forKey: .experience)
        try container.encodeIfPresent(avatarImage, forKey: .avatarImage)
        try container.encode(totalBattles, forKey: .totalBattles)
        try container.encode(wins, forKey: .wins)
        try container.encode(losses, forKey: .losses)
    }
}

// MARK: - Currency Model
struct GameCurrency: Identifiable, Codable {
    let id = UUID()
    var type: CurrencyType
    var amount: Int
    
    init(type: CurrencyType, amount: Int = 0) {
        self.type = type
        self.amount = amount
    }
}

enum CurrencyType: String, CaseIterable, Codable {
    case coins = "coins"
    case gems = "gems"
    case energy = "energy"
    case tickets = "tickets"
    
    var icon: String {
        switch self {
        case .coins: return "dollarsign.circle.fill"
        case .gems: return "diamond.fill"
        case .energy: return "bolt.fill"
        case .tickets: return "ticket.fill"
        }
    }
    
    var color: Color {
        switch self {
        case .coins: return Color(red: 0.95, green: 0.61, blue: 0.07)
        case .gems: return Color(red: 0.31, green: 0.80, blue: 0.77)
        case .energy: return Color(red: 0.98, green: 0.79, blue: 0.14)
        case .tickets: return Color(red: 0.99, green: 0.47, blue: 0.66)
        }
    }
}

// MARK: - Sample Data
extension PokemonCard {
    static let sampleCards: [PokemonCard] = [
        PokemonCard(
            name: "Charizard",
            type: .fire,
            hp: 120,
            attack: 84,
            defense: 78,
            speed: 100,
            abilities: [
                Ability(name: "Flamethrower", description: "Deal 40 fire damage", damage: 40, cost: 2, type: .special),
                Ability(name: "Dragon Claw", description: "Deal 30 physical damage", damage: 30, cost: 1, type: .physical)
            ],
            rarity: .legendary,
            cost: 3
        ),
        PokemonCard(
            name: "Pikachu",
            type: .electric,
            hp: 60,
            attack: 55,
            defense: 40,
            speed: 90,
            abilities: [
                Ability(name: "Thunderbolt", description: "Deal 30 electric damage", damage: 30, cost: 1, type: .special),
                Ability(name: "Quick Attack", description: "Deal 15 damage, always goes first", damage: 15, cost: 0, type: .physical)
            ],
            rarity: .common,
            cost: 1
        )
    ]
    
    static let starterDeck: [PokemonCard] = [
        sampleCards[1], // Pikachu
        sampleCards[1], // Pikachu
        sampleCards[0]  // Charizard
    ]
}
