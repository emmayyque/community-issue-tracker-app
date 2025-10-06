import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Loading } from 'components/index';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { 
  LandingScreen, 
  LoginScreen, 
  SignupScreen, 
  HomeScreen, 
  ChatScreen, 
  ProfileScreen,
  ReportIssueScreen,
  ReportDetailsScreen,
  MyReportsScreen,
  EditReportScreen
} from '@screens/index';

// Navigation Types
export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  MainApp: undefined;
  ReportIssueScreen : undefined;
  ReportDetailsScreen : undefined;
  MyReportsScreen : undefined;
  EditReportScreen : undefined;
  ChatDetailScreen : undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  HomeTab: undefined;
  About: undefined;
  Contact: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          
          if (route.name === 'Home') {
            iconName = focused ? '🏠' : '🏡';
          } else if (route.name === 'Chat') {
            iconName = focused ? '💬' : '💭';
          } else if (route.name === 'Profile') {
            iconName = focused ? '👤' : '👥';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: size, color }}>{iconName}</Text>
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ tabBarLabel: 'Messages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <Loading message="Loading app..." />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
        fonts : theme.fonts as any
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
          <Stack.Screen name="ReportIssueScreen" component={ReportIssueScreen} />
          <Stack.Screen name="MyReportsScreen" component={MyReportsScreen} />
          <Stack.Screen name="ReportDetailsScreen" component={ReportDetailsScreen} />
          <Stack.Screen name="EditReportScreen" component={EditReportScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};