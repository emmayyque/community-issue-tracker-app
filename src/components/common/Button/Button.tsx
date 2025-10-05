import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { useTheme } from '@context/ThemeContext';
// import { wp, hp, normalize } from '@utils/responsive';
import { useTheme } from 'context/ThemeContext';
import { hp, normalize, wp } from '@utils/responsive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      ...styles.button,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.medium,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      ...styles.text,
      color: variant === 'outline' ? theme.colors.primary : theme.colors.background,
      fontSize: normalize(theme.fontSize.medium),
    };

    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          fontSize: normalize(theme.fontSize.small),
        };
      case 'large':
        return {
          ...baseStyle,
          fontSize: normalize(theme.fontSize.large),
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: wp(4),
          paddingVertical: hp(1),
        };
      case 'large':
        return {
          paddingHorizontal: wp(8),
          paddingVertical: hp(2),
        };
      default:
        return {
          paddingHorizontal: wp(6),
          paddingVertical: hp(1.5),
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? theme.colors.primary : theme.colors.background} 
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
