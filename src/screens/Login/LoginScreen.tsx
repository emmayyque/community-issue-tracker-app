import { Button, Icon, Input } from '@components/index';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '@services/axiosInstance';
import { storageService } from '@services/storage/storageService';
import { hp, normalize, wp } from '@utils/responsive';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

export const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { navigate } :any = useNavigation()
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const payload={email: email,password:password}
      const resp = await axiosInstance.post("/api/auth/login", JSON.stringify(payload))
      storageService.setItem("AUTH_TOKEN", resp.data)
      // navigate('MainApp')
      
      // // Mock user data
      // const user = {
      //   id: '1',
      //   name: 'John Doe',
      //   email: email,
      // };
      await login(resp.data);
      
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Sign in to your account
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter your email"
            error={errors.email}
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}  
            placeholder="Enter your password"
            error={errors.password}
            rightIcon={ <Text style={{ color: theme.colors.primary }}>{!secureTextEntry ? 'Hide' : 'Show'}</Text>}
            rightIconPress={() => setSecureTextEntry(!secureTextEntry)}
          />

          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
            <TouchableOpacity onPress={()=>{
              navigate('Signup')
            }}>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Sign up
            </Text>
            </TouchableOpacity>
          </Text>
        </View>
        
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: wp(6),
    justifyContent: 'center',
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
  },
  form: {
    gap: hp(2),
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