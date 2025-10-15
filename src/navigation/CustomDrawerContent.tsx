import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '@app/providers/ThemeProvider';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { theme } = useTheme();
  const { navigation, state } = props;

  const menuItems = [
    {
      name: 'Expenses',
      route: 'Expenses',
      icon: '📄',
      description: 'View and manage expenses',
    },
    {
      name: 'Analytics',
      route: 'Analytics',
      icon: '📊',
      description: 'View spending analytics',
    },
    {
      name: 'Settings',
      route: 'Settings',
      icon: '⚙️',
      description: 'App settings and preferences',
    },
  ];

  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  const isActiveRoute = (routeName: string) => {
    return state.routeNames[state.index] === routeName;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Expense Tracker
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text }]}>
            Manage your finances
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const isActive = isActiveRoute(item.route);
            return (
              <TouchableOpacity
                key={item.route}
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: isActive ? theme.colors.primary + '20' : 'transparent',
                    borderLeftColor: isActive ? theme.colors.primary : 'transparent',
                  },
                ]}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <Text style={[styles.menuIcon, { opacity: isActive ? 1 : 0.7 }]}>
                      {item.icon}
                    </Text>
                    <View style={styles.menuTextContainer}>
                      <Text
                        style={[
                          styles.menuTitle,
                          {
                            color: isActive ? theme.colors.primary : theme.colors.text,
                            fontWeight: isActive ? '700' : '600',
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.menuDescription,
                          { color: theme.colors.text, opacity: 0.6 },
                        ]}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  {isActive && (
                    <View
                      style={[
                        styles.activeIndicator,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <Text style={[styles.footerText, { color: theme.colors.text, opacity: 0.6 }]}>
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
