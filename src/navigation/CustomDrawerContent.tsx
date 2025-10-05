// navigation/CustomDrawerContent.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { hp, normalize, wp } from '@utils/responsive';
import { Button, Spacer } from '@components/index';

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* User Profile Section */}
      <View style={[styles.userSection, { backgroundColor: theme.colors.primary }]}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.background }]}>
            {user?.name || 'User Name'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.background, opacity: 0.9 }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity 
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          <Text style={[styles.themeIcon, { color: theme.colors.background }]}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Items */}
      <DrawerContentScrollView 
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomSection, { borderTopColor: theme.colors.border }]}>
        <Spacer size="sm" />
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>

        <Spacer size="sm" />

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            size="medium"
            fullWidth
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
        </View>

        <Spacer size="sm" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // User Section
  userSection: {
    paddingTop: hp(2),
    paddingBottom: hp(3),
    paddingHorizontal: wp(4),
    position: 'relative',
  },
  avatarContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  avatarText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
  },
  userInfo: {
    marginBottom: hp(1),
  },
  userName: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  userEmail: {
    fontSize: normalize(14),
  },
  themeToggle: {
    position: 'absolute',
    top: hp(2),
    right: wp(4),
    padding: wp(2),
  },
  themeIcon: {
    fontSize: normalize(20),
  },

  // Scroll Content
  scrollContent: {
    flexGrow: 1,
  },
  drawerItemsContainer: {
    paddingTop: hp(1),
  },

  // Bottom Section
  bottomSection: {
    borderTopWidth: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: normalize(12),
  },
  logoutContainer: {
    paddingHorizontal: wp(2),
  },
  logoutButton: {
    backgroundColor: 'transparent',
  },
});