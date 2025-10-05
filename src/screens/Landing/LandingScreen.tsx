import { Button, Spacer } from '@components/index';
import { hp, normalize, wp } from '@utils/responsive';
import { useTheme } from 'context/ThemeContext';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

const { width, height } = Dimensions.get('window');

export const LandingScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<LandingScreenNavigationProp>();

  const handleLogin = () => navigation.navigate('Login');
  const handleSignup = () => navigation.navigate('Signup');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header / Hero Section */}
      <View style={[styles.heroSection, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.heroContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logoIcon, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.logoText, { color: theme.colors.primary }]}>🏙️</Text>
            </View>
            <Text style={[styles.brandName, { color: theme.colors.background }]}>
              TownTweak
            </Text>
          </View>

          {/* Headline */}
          <View style={styles.headlineContainer}>
            <Text style={[styles.headline, { color: theme.colors.background }]}>
              Report Problems.
            </Text>
            <Text style={[styles.headline, { color: theme.colors.background }]}>
              <Text style={styles.highlightText}>Get Them Fixed.</Text>
            </Text>
          </View>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: theme.colors.background, opacity: 0.9 }]}>
            Connect directly with IESCO, WASA & Municipality — quick reporting and real updates.
          </Text>
        </View>

        {/* Decorative circles */}
        <View style={styles.decorativeElements}>
          <View style={[styles.circle, styles.circle1, { backgroundColor: theme.colors.background, opacity: 0.1 }]} />
          <View style={[styles.circle, styles.circle2, { backgroundColor: theme.colors.background, opacity: 0.05 }]} />
          <View style={[styles.circle, styles.circle3, { backgroundColor: theme.colors.background, opacity: 0.08 }]} />
        </View>
      </View>

      {/* Features Section */}
      <View style={[styles.featuresSection, { backgroundColor: theme.colors.background }]}>
        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>
            Why Choose Us?
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: theme.colors.primary }]}>⚡</Text>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Quick Report
              </Text>
              <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>
                Instantly log community issues
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: theme.colors.primary }]}>🏛️</Text>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Official Departments
              </Text>
              <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>
                Connected with IESCO, WASA, and more
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: theme.colors.primary }]}>✅</Text>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                Track Status
              </Text>
              <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>
                Stay updated in real time
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionSection, { backgroundColor: theme.colors.background }]}>
        <View style={styles.actionContainer}>
          <Button
            title="Get Started"
            onPress={handleSignup}
            variant="primary"
            size="large"
            fullWidth
          />
          <Spacer size="xs" />
          <Button
            title="I Already Have Account"
            onPress={handleLogin}
            variant="outline"
            size="large"
            fullWidth
          />
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  heroSection: {
    flex: 0.55,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingTop: hp(8),
    justifyContent: 'center',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  logoIcon: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  logoText: { fontSize: normalize(26) },
  brandName: {
    fontSize: normalize(22),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headline: {
    fontSize: normalize(30),
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: normalize(38),
  },
  highlightText: {
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255,255,255,0.8)',
  },
  subtitle: {
    fontSize: normalize(15),
    textAlign: 'center',
    lineHeight: normalize(22),
    paddingHorizontal: wp(4),
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  circle1: {
    width: wp(40),
    height: wp(40),
    top: -wp(10),
    right: -wp(10),
  },
  circle2: {
    width: wp(60),
    height: wp(60),
    bottom: -wp(20),
    left: -wp(20),
  },
  circle3: {
    width: wp(30),
    height: wp(30),
    top: hp(15),
    left: -wp(8),
  },
  featuresSection: {
    flex: 0.25,
    paddingTop: hp(3),
  },
  featuresContainer: {
    paddingHorizontal: wp(6),
  },
  featuresTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  featureItem: {
    alignItems: 'center',
    width: wp(25),
  },
  featureIcon: {
    fontSize: normalize(26),
    marginBottom: hp(1),
  },
  featureTitle: {
    fontSize: normalize(12),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  featureDesc: {
    fontSize: normalize(10),
    textAlign: 'center',
  },
  actionSection: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: hp(4),
  },
  actionContainer: {
    paddingHorizontal: wp(6),
  },
  termsText: {
    fontSize: normalize(11),
    textAlign: 'center',
    lineHeight: normalize(16),
    paddingHorizontal: wp(4),
  },
});