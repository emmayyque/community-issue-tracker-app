# Mobile Mechanic App

A React Native mobile application for connecting vehicle owners with professional mechanics for on-demand automotive services.

## 🚗 Features

- **User Authentication** - Secure login and registration system
- **Service Booking** - Book mechanic services at your location
- **Real-time Tracking** - Track mechanic location and service status
- **Dark/Light Theme** - Customizable theme preferences
- **Profile Management** - Manage user profiles and service history
- **Multi-platform** - Works on both iOS and Android

## 📱 Screenshots

*Coming soon...*

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation and routing
- **Context API** - State management
- **AsyncStorage** - Local data persistence
- **React Native Vector Icons** - Icon library

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mobile-mechanic-app.git
   cd mobile-mechanic-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies (iOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npx react-native start
   ```

5. **Run the app**
   
   For Android:
   ```bash
   npx react-native run-android
   ```
   
   For iOS:
   ```bash
   npx react-native run-ios
   ```

## 📁 Project Structure

```
mobile-mechanic-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation configuration
│   ├── context/           # Context providers
│   ├── styles/            # Theme and styling
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── android/               # Android-specific files
├── ios/                   # iOS-specific files
└── README.md
```

## 🎨 Theming

The app supports both light and dark themes with customizable colors:

- **Light Theme** - Clean, modern light interface
- **Dark Theme** - Eye-friendly dark mode
- **Custom Colors** - Brand-specific color palette
- **Responsive Design** - Adapts to different screen sizes

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-url.com
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Theme Customization

Modify `src/styles/colors.ts` to customize app colors:

```typescript
export const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  // ... other colors
};
```

## 📚 Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run build` - Build for production

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Android

1. **Generate signed APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Build AAB for Play Store**
   ```bash
   ./gradlew bundleRelease
   ```

### iOS

1. **Open in Xcode**
   ```bash
   open ios/MobileMechanicApp.xcworkspace
   ```

2. **Archive and upload to App Store**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Use meaningful component and variable names
- Add comments for complex logic
- Keep components small and focused

## 📋 TODO

- [ ] Add real-time chat functionality
- [ ] Implement push notifications
- [ ] Add payment integration
- [ ] Create admin panel
- [ ] Add service ratings and reviews
- [ ] Implement offline mode
- [ ] Add unit tests

## 🐛 Known Issues

- Theme loading may take a moment on first launch
- Some navigation animations may lag on older devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer** - [Your Name](https://github.com/yourusername)
- **UI/UX Designer** - [Designer Name]
- **Backend Developer** - [Backend Dev Name]

## 📞 Support

For support, email support@mobilemechanicapp.com or join our Slack channel.

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Contributors who helped improve the app
- Beta testers for valuable feedback

---

**Made with ❤️ by [ASAD KABIR]**