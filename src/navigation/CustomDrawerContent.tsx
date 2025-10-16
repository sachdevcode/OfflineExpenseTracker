import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useTheme } from '@app/providers/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CustomDrawerContent: React.FC<
  DrawerContentComponentProps
> = props => {
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

  const isActiveRoute = (routeName: string) =>
    state.routeNames[state.index] === routeName;

  const handleNavigation = (routeName: string) =>
    navigation.navigate(routeName as never);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.card,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <View style={[styles.avatar]}>
            <Text style={styles.avatarText}>💸</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Expense Tracker
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: theme.colors.text, opacity: 0.65 },
              ]}
            >
              Manage your finances
            </Text>
          </View>
        </View>

        {/* Section label */}
        <Text
          style={[
            styles.sectionLabel,
            { color: theme.colors.text, opacity: 0.55 },
          ]}
        >
          Navigation
        </Text>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => {
            const active = isActiveRoute(item.route);
            return (
              <Pressable
                key={item.route}
                onPress={() => handleNavigation(item.route)}
                style={() => [
                  styles.menuItem,
                  {
                    borderColor: active
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${item.name}. ${item.description}`}
              >
                {/* Left: icon + text */}
                <View style={styles.menuLeft}>
                  <Text
                    style={[styles.menuIcon, { opacity: active ? 1 : 0.85 }]}
                  >
                    {item.icon}
                  </Text>
                  <View style={styles.menuTextCol}>
                    <Text
                      style={[
                        styles.menuTitle,
                        {
                          color: active
                            ? theme.colors.primary
                            : theme.colors.text,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.menuDesc,
                        { color: theme.colors.text, opacity: 0.55 },
                      ]}
                      numberOfLines={1}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>

                {/* Right: active pill */}
                {active && (
                  <View
                    style={[
                      styles.activePill,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.footerText,
            { color: theme.colors.text, opacity: 0.6 },
          ]}
        >
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 22 },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },

  sectionLabel: {
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  menuContainer: { paddingHorizontal: 12, paddingTop: 4, gap: 8 },
  menuItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuTextCol: { flex: 1, minWidth: 0 },
  menuTitle: { fontSize: 15, fontWeight: '700' },
  menuDesc: { fontSize: 12 },

  activePill: { width: 8, height: 8, borderRadius: 4 },

  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 999,
  },
  chipText: { fontWeight: '700', fontSize: 12 },

  quickToggle: {
    marginLeft: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },

  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: { fontSize: 12, textAlign: 'center' },
});
