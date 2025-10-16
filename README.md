# 💰 Offline Expense Tracker

A comprehensive React Native expense tracking application built with TypeScript, featuring offline-first architecture, budget management, and beautiful analytics.

## ✨ Features

### 📱 Core Functionality
- **Add, Edit & Delete Expenses** - Full CRUD operations for expense management
- **Category-based Organization** - Organize expenses by categories (Food, Transportation, etc.)
- **Date Tracking** - Track expenses with custom dates
- **Notes Support** - Add optional notes to expenses
- **Sorting & Filtering** - Sort expenses by date, amount, or category

### 💾 Data Management
- **Offline-First Architecture** - Works completely offline with local data storage
- **Persistent Storage** - All data saved using AsyncStorage (survives app restarts)
- **State Management** - Zustand for global state management
- **React Query Integration** - Optimistic updates and caching
- **Data Synchronization** - Seamless sync between Zustand and React Query

### 💰 Budget Management
- **Set Spending Limits** - Create budgets for different categories
- **Multiple Time Periods** - Daily, Weekly, Monthly, or Yearly budgets
- **Real-time Notifications** - Get warned when approaching or exceeding budgets
- **Visual Progress Tracking** - Color-coded progress bars and percentage indicators
- **Budget Alerts** - Smart notifications with detailed spending information

### 📊 Analytics & Insights
- **Category Breakdown** - Visual breakdown of spending by category
- **Monthly Trends** - Track spending patterns over time
- **Summary Statistics** - Total spent, transaction count, averages
- **Interactive Charts** - Beautiful SVG-based charts (Pie, Bar, Line)
- **Spending Insights** - Detailed analysis of your spending habits

### 🎨 User Experience
- **Dark/Light Mode** - Beautiful theme switching with system preference support
- **Drawer Navigation** - Intuitive navigation with drawer menu
- **Responsive Design** - Optimized for all screen sizes
- **Smooth Animations** - React Native Reanimated for fluid interactions
- **Performance Optimized** - React.memo, useMemo for optimal rendering

### 🔧 Technical Features
- **TypeScript** - Full type safety throughout the application
- **Modern React Patterns** - Hooks, Context, and modern React practices
- **Error Handling** - Comprehensive error handling and validation
- **Code Organization** - Clean architecture with feature-based structure
- **Linting & Formatting** - ESLint and Prettier for code quality

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OfflineExpenseTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run the app**
   
   **For iOS:**
   ```bash
   npm run ios
   # or
   yarn ios
   ```
   
   **For Android:**
   ```bash
   npm run android
   # or
   yarn android
   ```

## 📱 App Structure

### Navigation
- **Drawer Navigator** - Main navigation with drawer menu
- **Stack Navigation** - Nested navigation for forms and details
- **Screen Organization** - Feature-based screen organization

### Features
```
src/
├── features/
│   ├── expenses/          # Expense management
│   │   ├── components/    # Expense-related components
│   │   ├── screens/       # Expense screens
│   │   ├── hooks.ts       # Expense hooks
│   │   ├── store.ts       # Expense store
│   │   └── types.ts       # Expense types
│   ├── budget/            # Budget management
│   │   ├── components/    # Budget components
│   │   ├── screens/       # Budget screens
│   │   ├── utils/         # Budget utilities
│   │   ├── hooks.ts       # Budget hooks
│   │   └── store.ts       # Budget store
│   ├── analytics/         # Analytics & charts
│   │   ├── components/    # Chart components
│   │   ├── screens/       # Analytics screens
│   │   └── utils/         # Chart utilities
│   └── settings/          # App settings
├── shared/                # Shared components
├── navigation/            # Navigation configuration
└── app/                   # App providers and configuration
```

## 🎯 Usage Guide

### Adding Expenses
1. Tap the **"+"** button on the main screen
2. Fill in the expense details:
   - **Title**: Description of the expense
   - **Category**: Select or type a category
   - **Amount**: Enter the expense amount
   - **Date**: Choose the expense date
   - **Note**: Optional additional information
3. Tap **"Save"** to add the expense

### Setting Up Budgets
1. Open the **drawer menu** and tap **"Budget Settings"**
2. Tap **"+ Add Budget"**
3. Configure your budget:
   - **Category**: Select the expense category
   - **Amount**: Set your spending limit
   - **Period**: Choose Daily, Weekly, Monthly, or Yearly
4. Tap **"Create Budget"**

### Viewing Analytics
1. Open the **drawer menu** and tap **"Analytics"**
2. View your spending insights:
   - **Category Distribution**: Pie chart of spending by category
   - **Monthly Trends**: Line chart showing spending over time
   - **Top Categories**: Bar chart of highest spending categories
   - **Summary Statistics**: Key metrics and totals

### Budget Notifications
- **Real-time Warnings**: Get notified when adding expenses that exceed budgets
- **Progress Tracking**: Visual progress bars show how close you are to limits
- **Alert Levels**:
  - 🟢 **Safe (0-74%)**: Green progress bar
  - 🟡 **Warning (75-89%)**: Yellow progress bar with warning
  - 🔴 **Danger (90-99%)**: Red progress bar with danger alert
  - 🚨 **Exceeded (100%+)**: Dark red with exceeded notification

## 🛠️ Technical Stack

### Core Technologies
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **React Native Reanimated** - Smooth animations

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management and caching
- **AsyncStorage** - Local data persistence

### UI & Styling
- **React Native StyleSheet** - Native styling
- **Custom Theme System** - Dark/Light mode support
- **SVG Charts** - Custom chart components

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📊 Data Flow

### Expense Management
1. **User Input** → Expense Form
2. **Validation** → Form validation and budget checking
3. **State Update** → Zustand store update
4. **Persistence** → AsyncStorage save
5. **UI Update** → React Query cache update
6. **Re-render** → Component updates

### Budget System
1. **Budget Creation** → Budget store update
2. **Expense Addition** → Budget validation
3. **Alert Generation** → Budget violation detection
4. **Notification Display** → User warning system

## 🎨 Design Principles

### User Experience
- **Offline-First** - Works without internet connection
- **Intuitive Navigation** - Easy-to-use drawer navigation
- **Visual Feedback** - Clear progress indicators and status
- **Responsive Design** - Adapts to different screen sizes

### Performance
- **Optimized Rendering** - React.memo and useMemo usage
- **Efficient State Management** - Minimal re-renders
- **Lazy Loading** - Components loaded as needed
- **Memory Management** - Proper cleanup and optimization

## 🔧 Configuration

### Environment Setup
- **Metro Config** - Bundler configuration
- **TypeScript Config** - Type checking configuration
- **ESLint Config** - Code quality rules
- **Prettier Config** - Code formatting rules

### Build Configuration
- **iOS** - Xcode project configuration
- **Android** - Gradle build configuration
- **CocoaPods** - iOS dependency management

## 🚀 Deployment

### Development
```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Production Build
```bash
# iOS
cd ios
xcodebuild -workspace ExpenseTracker.xcworkspace -scheme ExpenseTracker -configuration Release

# Android
cd android
./gradlew assembleRelease
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Zustand for lightweight state management
- React Query for powerful data fetching
- All contributors who helped build this project

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Follow the issue template for better support

---

**Built with ❤️ using React Native and TypeScript**