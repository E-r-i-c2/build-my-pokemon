import SwiftUI

struct CardCreatorView: View {
    @EnvironmentObject var gameManager: GameManager
    @Binding var currentView: ContentView.AppView
    
    @State private var cardName = ""
    @State private var selectedType: PokemonType = .normal
    @State private var hp = "100"
    @State private var attack = "50"
    @State private var defense = "50"
    @State private var speed = "50"
    @State private var cost = "1"
    @State private var selectedRarity: CardRarity = .common
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 30) {
                    // Title
                    Text("Create Your Pokemon Card")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding(.top)
                    
                    // Basic Information Section
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Basic Information")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(Color(red: 0.31, green: 0.80, blue: 0.77))
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Card Name:")
                                .font(.headline)
                                .foregroundColor(.white)
                            
                            TextField("Enter Pokemon name", text: $cardName)
                                .textFieldStyle(CustomTextFieldStyle())
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Type:")
                                .font(.headline)
                                .foregroundColor(.white)
                            
                            Picker("Type", selection: $selectedType) {
                                ForEach(PokemonType.allCases, id: \.self) { type in
                                    Text(type.rawValue.uppercased()).tag(type)
                                }
                            }
                            .pickerStyle(MenuPickerStyle())
                            .padding()
                            .background(Color(red: 0.16, green: 0.16, blue: 0.24))
                            .cornerRadius(10)
                            .foregroundColor(.white)
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Rarity:")
                                .font(.headline)
                                .foregroundColor(.white)
                            
                            Picker("Rarity", selection: $selectedRarity) {
                                ForEach(CardRarity.allCases, id: \.self) { rarity in
                                    Text(rarity.rawValue.uppercased()).tag(rarity)
                                }
                            }
                            .pickerStyle(MenuPickerStyle())
                            .padding()
                            .background(Color(red: 0.16, green: 0.16, blue: 0.24))
                            .cornerRadius(10)
                            .foregroundColor(.white)
                        }
                    }
                    
                    // Stats Section
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Stats")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(Color(red: 0.31, green: 0.80, blue: 0.77))
                        
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 15) {
                            StatInputField(label: "HP", value: $hp)
                            StatInputField(label: "Attack", value: $attack)
                            StatInputField(label: "Defense", value: $defense)
                            StatInputField(label: "Speed", value: $speed)
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Energy Cost:")
                                .font(.headline)
                                .foregroundColor(.white)
                            
                            TextField("1", text: $cost)
                                .textFieldStyle(CustomTextFieldStyle())
                                .keyboardType(.numberPad)
                        }
                    }
                    
                    // Save Button
                    Button("Create Card") {
                        saveCard()
                    }
                    .buttonStyle(ActionButtonStyle(colors: [Color(red: 0.31, green: 0.80, blue: 0.77), Color(red: 0.27, green: 0.63, blue: 0.55)]))
                    .padding(.bottom, 40)
                }
                .padding()
            }
            .background(
                LinearGradient(
                    colors: [Color(red: 0.06, green: 0.06, blue: 0.14), 
                            Color(red: 0.10, green: 0.10, blue: 0.18),
                            Color(red: 0.09, green: 0.13, blue: 0.24)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
            )
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Back") {
                        currentView = .home
                    }
                    .foregroundColor(.white)
                }
            }
        }
        .alert("Error", isPresented: $showingAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
    }
    
    private func saveCard() {
        guard !cardName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            alertMessage = "Please enter a card name"
            showingAlert = true
            return
        }
        
        let newCard = PokemonCard(
            name: cardName.trimmingCharacters(in: .whitespacesAndNewlines),
            type: selectedType,
            hp: Int(hp) ?? 100,
            attack: Int(attack) ?? 50,
            defense: Int(defense) ?? 50,
            speed: Int(speed) ?? 50,
            abilities: [Ability(name: "Basic Attack", description: "Deal 20 damage", damage: 20, cost: 1, type: .physical)],
            rarity: selectedRarity,
            cost: Int(cost) ?? 1
        )
        
        gameManager.addCustomCard(newCard)
        
        // Reset form
        cardName = ""
        hp = "100"
        attack = "50"
        defense = "50"
        speed = "50"
        cost = "1"
        selectedRarity = .common
        
        alertMessage = "Card \"\(newCard.name)\" created successfully!"
        showingAlert = true
    }
}

struct StatInputField: View {
    let label: String
    @Binding var value: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("\(label):")
                .font(.headline)
                .foregroundColor(.white)
            
            TextField("50", text: $value)
                .textFieldStyle(CustomTextFieldStyle())
                .keyboardType(.numberPad)
        }
    }
}

#Preview {
    CardCreatorView(currentView: .constant(.cardCreator))
        .environmentObject(GameManager())
}
