import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
// import { useTheme } from '@context/ThemeContext';
// import { wp, hp, normalize } from '@utils/responsive';
import { hp, normalize } from '@utils/responsive';
import { useTheme } from 'context/ThemeContext';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'large',
  overlay = false,
}) => {
  const { theme } = useTheme();

  const containerStyle = overlay 
    ? [styles.overlay, { backgroundColor: theme.colors.background + '80' }]
    : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator 
        size={size} 
        color={theme.colors.primary} 
        style={styles.spinner}
      />
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  spinner: {
    marginBottom: hp(2),
  },
  message: {
    fontSize: normalize(16),
    textAlign: 'center',
  },
});