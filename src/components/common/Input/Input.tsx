import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { hp, normalize, wp } from '@utils/responsive';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  rightIconPress?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  rightIcon,
  leftIcon,
  rightIconPress
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = {
    ...styles.input,
    backgroundColor: theme.colors.surface,
    borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
    color: theme.colors.text,
    borderRadius: theme.borderRadius.medium,
    fontSize: normalize(theme.fontSize.medium),
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            inputStyle,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {rightIcon && (
          <TouchableOpacity onPress={rightIconPress} style={styles.iconContainer}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: normalize(14),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    
  },
  input: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  inputWithLeftIcon: {
    paddingLeft: wp(12),
  },
  inputWithRightIcon: {
    paddingRight: wp(12),
  },
  iconContainer: {
    position: 'absolute',
    padding: wp(2),
    zIndex: 1,
    right: 3
  },
  error: {
    fontSize: normalize(12),
    marginTop: hp(0.5),
  },
});