# Pokemon Card Battle - Native Swift iOS App

A native iOS app built with SwiftUI for turn-based Pokemon-style PvP card battles. Create your own Pokemon cards and battle against other players in portrait mode!

## 🎮 Features

- **Native Swift/SwiftUI** - Built specifically for iOS with optimal performance
- **Turn-based PvP battles** - Strategic card combat system
- **Custom card creation** - Design your own Pokemon cards with unique abilities
- **Portrait mode optimized** - Perfect for iPhone gameplay
- **Beautiful animations** - Smooth SwiftUI transitions and effects
- **Multiple Pokemon types** - Fire, Water, Grass, Electric, and more!

## 🚀 Getting Started

### Prerequisites
- **Xcode 15.0+** (for iOS 17.0+)
- **macOS 14.0+** (Sonoma or later)
- **iOS Simulator** or physical iPhone

### Installation

1. **Open the project in Xcode:**
   ```bash
   open PokemonCardBattle.xcodeproj
   ```

2. **Select your target device:**
   - Choose iPhone Simulator or your connected iPhone
   - Make sure the deployment target is set to iOS 17.0+

3. **Build and Run:**
   - Press `Cmd + R` or click the Play button
   - The app will build and launch on your device/simulator

## 📱 App Structure

```
PokemonCardBattle/
├── PokemonCardBattleApp.swift      # Main app entry point
├── ContentView.swift               # Root navigation view
├── Models/
│   └── Models.swift                # Data models (Card, Player, GameState)
├── Managers/
│   └── GameManager.swift           # Game logic and state management
├── Views/
│   ├── HomeView.swift              # Main menu screen
│   ├── GameView.swift              # Battle interface
│   ├── CardCreatorView.swift       # Card creation tool
│   ├── CardView.swift              # Pokemon card component
│   └── BattleFieldView.swift       # Battle arena display
└── Assets.xcassets/                # App icons and assets
```

## 🎯 Game Mechanics

### Card System
- Each Pokemon card has HP, Attack, Defense, Speed, and Energy Cost
- Cards have unique abilities with different damage and energy costs
- Rarity system: Common, Uncommon, Rare, Epic, Legendary
- Type-based color coding and visual effects

### Battle System
- Turn-based combat with energy management
- Play Pokemon cards to the battlefield (costs energy)
- Use abilities to attack opponents
- Strategic resource management and timing

### Card Creator
- Design custom Pokemon cards with full stat control
- Create multiple abilities per card
- Set rarity and energy costs
- Real-time preview of card appearance

## 🎨 SwiftUI Features

- **Dark theme** optimized for gaming
- **Gradient backgrounds** with Pokemon type colors
- **Smooth animations** and transitions
- **Responsive design** for different iPhone sizes
- **Native iOS controls** and interactions

## 🔧 Technical Details

### Architecture
- **MVVM Pattern** with SwiftUI
- **ObservableObject** for state management
- **Combine** for reactive programming
- **Codable** for data persistence

### Key Technologies
- **SwiftUI** - Modern declarative UI framework
- **Combine** - Reactive programming
- **Foundation** - Core data structures
- **UIKit** - Integration with iOS system

### Performance
- **Native compilation** for optimal performance
- **Efficient state management** with @Published properties
- **Lazy loading** for large card collections
- **Memory efficient** with proper lifecycle management

## 🎮 How to Play

1. **Start a Game**
   - Enter player names on the home screen
   - Tap "Start Battle" to begin

2. **Battle Phase**
   - Each player starts with 3 cards and 1 energy
   - Play Pokemon cards to the battlefield (costs energy)
   - Use abilities to attack opponents
   - End your turn to draw a card and gain energy

3. **Create Cards**
   - Tap "Create Card" from the home screen
   - Design your Pokemon with custom stats and abilities
   - Save your creations for future battles

## 🛠 Development

### Building for Different Devices
- **iPhone**: Optimized for portrait mode
- **iPad**: Universal app with adaptive layout
- **Simulator**: Full feature testing

### Code Organization
- **Models**: Data structures and business logic
- **Views**: SwiftUI user interface components
- **Managers**: Game state and business logic
- **Assets**: Images, colors, and app icons

### Testing
- **SwiftUI Previews** for rapid UI development
- **Simulator testing** for different device sizes
- **Real device testing** for performance validation

## 🚀 Deployment

### App Store Preparation
1. **Update version numbers** in project settings
2. **Add app icons** to Assets.xcassets
3. **Configure signing** with your Apple Developer account
4. **Archive and upload** to App Store Connect

### Distribution Options
- **App Store** - Public distribution
- **TestFlight** - Beta testing
- **Ad Hoc** - Limited device distribution
- **Development** - Local testing

## 🔮 Future Enhancements

- [ ] **Online multiplayer** with Game Center
- [ ] **Card collection** and trading system
- [ ] **Tournament mode** with brackets
- [ ] **More Pokemon types** and abilities
- [ ] **Sound effects** and background music
- [ ] **Card image uploads** and customization
- [ ] **Achievement system** and progress tracking
- [ ] **Cloud save** with iCloud integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the Xcode console for error messages
- Ensure you're using the latest Xcode version
- Verify iOS deployment target compatibility

---

**Ready to battle?** Open the project in Xcode and start your Pokemon card adventure! 🎮⚡🔥
