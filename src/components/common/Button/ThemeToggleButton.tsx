import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { normalize, wp } from '@utils/responsive';
import { isIOS } from '@utils/helpers';

export const ThemeToggleButton = () => {
  const { toggleTheme, theme, isDarkMode } = useTheme();
  const [pressed, setPressed] = useState(false)
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={1}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surface,
          opacity: pressed ? 1 : 0.4,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* <Icon
        name={isDarkMode? 'sun' : 'moon'}
        type="Feather"
        size={20}
        color={theme.colors.text}
      /> */}

      <Text style={[styles.themeIcon, { color: theme.colors.background }]}>
        {isDarkMode ? '☀️' : '🌙'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: isIOS()? 50 : 30,
    right: 20,
    borderRadius: 30,
    padding: wp(4),
    borderWidth: 1,
    zIndex: 999,
  },
  themeIcon: {
    fontSize: normalize(16),
  },
});
