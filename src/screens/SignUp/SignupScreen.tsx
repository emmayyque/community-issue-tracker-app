import { Button, Icon, Input } from '@components/index';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '@services/axiosInstance';
import { hp, normalize, wp } from '@utils/responsive';
import { useTheme } from 'context/ThemeContext';
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation()
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await axiosInstance.post('/api/auth/register', JSON.stringify(formData))
      
      Alert.alert('Success', 'Your account has been registered successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        },
      ]);

    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Join us and find the best mechanics near you
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter your full name"
              error={errors.name}
            //   autoCapitalize="words"
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              placeholder="Enter your email"
              error={errors.email}
            //   autoCapitalize="none"
            />
            
            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              error={errors.phone}
            />
            
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={secureTextEntry}
              placeholder="Create a password"
              error={errors.password}
              rightIcon={
                <Text style={{ color: theme.colors.primary, fontSize: normalize(14) }}>
                  {secureTextEntry ? 'Show' : 'Hide'}
                </Text>
              }
              rightIconPress={() => setSecureTextEntry(!secureTextEntry)}
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={secureConfirmTextEntry}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              rightIcon={
                <Text style={{ color: theme.colors.primary, fontSize: normalize(14) }}>
                  {secureConfirmTextEntry ? 'Show' : 'Hide'}
                </Text>
              }
              rightIconPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
            />

            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                By signing up, you agree to our{' '}
                <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <Button
              title={loading ? 'Creating Account...' : 'Create Account'}
              onPress={handleSignup}
              loading={loading}
              variant="primary"
              size="large"
              fullWidth
              style={styles.signupButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Already have an account?{' '}
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Sign in
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: wp(6),
    justifyContent: 'center',
    minHeight: hp(100) - hp(10), // Ensure minimum height
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  title: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: normalize(16),
    textAlign: 'center',
    lineHeight: normalize(22),
  },
  form: {
    gap: hp(2),
  },
  termsContainer: {
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  termsText: {
    fontSize: normalize(12),
    textAlign: 'center',
    lineHeight: normalize(18),
  },
  signupButton: {
    marginTop: hp(1),
  },
  footer: {
    alignItems: 'center',
    marginTop: hp(4),
  },
  footerText: {
    fontSize: normalize(14),
  },
  linkText: {
    fontWeight: '600',
  },
});