import { Button, Input } from '@components/index';
import { hp, normalize, wp } from '@utils/responsive';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
// import { useTheme, useAuth } from '@context';
// import { Button, Input } from '@components';
// import { wp, hp, normalize } from '@utils/responsive';

export const ProfileScreen: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser({ name, email });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.avatarText, { color: theme.colors.background }]}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
          {user?.email}
        </Text>
      </View>

      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Profile Information
        </Text>
        
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          editable={isEditing}
          placeholder="Enter your name"
        />
        
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
          keyboardType="email-address"
          placeholder="Enter your email"
        />

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <Button
                title={loading ? 'Saving...' : 'Save Changes'}
                onPress={handleSave}
                loading={loading}
                variant="primary"
                fullWidth
              />
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="outline"
                fullWidth
              />
            </>
          ) : (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              variant="outline"
              fullWidth
            />
          )}
        </View>
      </View>

      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
        
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={isDarkMode ? theme.colors.background : theme.colors.surface}
          />
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  avatarText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
  },
  userName: {
    fontSize: normalize(20),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  userEmail: {
    fontSize: normalize(14),
  },
  section: {
    borderTopWidth: 1,
    paddingTop: hp(2),
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  buttonContainer: {
    gap: hp(2),
    marginTop: hp(2),
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  settingLabel: {
    fontSize: normalize(16),
  },
  logoutContainer: {
    marginTop: hp(4),
  },
});