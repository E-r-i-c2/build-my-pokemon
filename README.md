# Pokemon Card Battle - iPhone App

A turn-based Pokemon-style PvP card battle game built with React Native and Expo. Create your own Pokemon cards and battle against other players in portrait mode!

## Features

- 🎮 **Turn-based PvP battles** - Strategic card combat system
- 🃏 **Custom card creation** - Design your own Pokemon cards with unique abilities
- 📱 **Portrait mode optimized** - Perfect for iPhone gameplay
- ⚡ **Real-time combat** - Use abilities and manage energy resources
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 🔥 **Multiple Pokemon types** - Fire, Water, Grass, Electric, and more!

## Game Mechanics

### Card System
- Each Pokemon card has HP, Attack, Defense, Speed, and Energy Cost
- Cards have unique abilities with different damage and energy costs
- Rarity system: Common, Uncommon, Rare, Epic, Legendary

### Battle System
- Turn-based combat with energy management
- Play Pokemon cards to the battlefield
- Use abilities to attack opponents
- Strategic resource management

### Card Creator
- Design custom Pokemon cards
- Set stats, abilities, and rarity
- Create unique combinations for your deck

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for testing) or physical iPhone

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd build-my-pokemon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on iOS**
   - Press `i` in the terminal to open iOS Simulator
   - Or scan the QR code with Expo Go app on your iPhone

### Building for Production

1. **Build for iOS**
   ```bash
   expo build:ios
   ```

2. **Build for Android**
   ```bash
   expo build:android
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CardComponent.tsx    # Pokemon card display
│   └── BattleField.tsx      # Battle arena UI
├── context/             # React Context for state management
│   └── GameContext.tsx      # Game state and actions
├── data/                # Game data and sample cards
│   └── sampleCards.ts       # Default Pokemon cards
├── screens/             # Main app screens
│   ├── HomeScreen.tsx       # Main menu
│   ├── GameScreen.tsx       # Battle interface
│   └── CardCreatorScreen.tsx # Card creation tool
└── types/               # TypeScript type definitions
    └── Card.ts              # Card and game types
```

## How to Play

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

## Technologies Used

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Screen navigation
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **React Context** - State management

## Future Enhancements

- [ ] Online multiplayer support
- [ ] Card collection and trading
- [ ] Tournament mode
- [ ] More Pokemon types and abilities
- [ ] Sound effects and animations
- [ ] Card image uploads
- [ ] Deck building interface
- [ ] Achievement system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Happy Battling!** 🎮⚡🔥