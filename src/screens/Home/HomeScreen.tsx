import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'context/ThemeContext';
import { useAuth } from 'context/AuthContext';
import { Button } from '@components/index';
import { hp, normalize, wp } from '@utils/responsive';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const issueCategories = [
    { id: 1, name: 'WASA', icon: '💧', description: 'Water & Sanitation Issues' },
    { id: 2, name: 'IESCO', icon: '⚡', description: 'Electricity Issues' },
    { id: 3, name: 'Municipality', icon: '🏛️', description: 'Municipal Services' },
    { id: 4, name: 'Others', icon: '📋', description: 'Other Issues' },
  ];

  const handleCategoryPress = (category: any) => {
    navigation.navigate('ReportIssueScreen' as never, { category } as never);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
          Welcome back, {user?.name}!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Report an issue to the relevant authority
        </Text>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Report Issue To
        </Text>
        <View style={styles.categoriesGrid}>
          {issueCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
              activeOpacity={0.7}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                {category.name}
              </Text>
              <Text style={[styles.categoryDescription, { color: theme.colors.textSecondary }]}>
                {category.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.quickActions}>
        <Button
          title="View My Reports"
          onPress={() => navigation.navigate('MyReportsScreen' as never)}
          variant="primary"
          size="large"
          fullWidth
        />
        <Button
          title="View Profile"
          onPress={() => navigation.navigate('Profile' as never)}
          variant="outline"
          size="medium"
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
    marginBottom: hp(3),
  },
  welcomeText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: normalize(16),
  },
  categoriesContainer: {
    marginBottom: hp(4),
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: wp(4),
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: hp(2),
    minHeight: hp(12),
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: normalize(32),
    marginBottom: hp(1),
  },
  categoryName: {
    fontSize: normalize(16),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  categoryDescription: {
    fontSize: normalize(12),
    textAlign: 'center',
  },
  quickActions: {
    gap: hp(2),
  },
});