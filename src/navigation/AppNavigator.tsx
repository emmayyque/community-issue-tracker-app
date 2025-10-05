// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Loading } from 'components/index';
// import { useAuth } from 'context/AuthContext';
// import {
//   HomeScreen,
//   LandingScreen,
//   LoginScreen,
//   ProfileScreen,
//   SignupScreen,
// } from '@screens/index';
// import { useTheme } from 'context/ThemeContext';

// export type RootStackParamList = {
//   Home: undefined;
//   Profile: undefined;
//   Login: undefined;
//   Signup: undefined;
//   Landing: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export const AppNavigator: React.FC = () => {
//   const { isAuthenticated, loading } = useAuth();
//   const { theme } = useTheme();

//   if (loading) {
//     return <Loading message="App loading..." />;
//   }

//   return (
//     <NavigationContainer
//       theme={{
//         dark: false,
//         colors: {
//           primary: theme.colors.primary,
//           background: theme.colors.background,
//           card: theme.colors.surface,
//           text: theme.colors.text,
//           border: theme.colors.border,
//           notification: theme.colors.primary,
//         },
//         fonts: theme.fonts as any,
//       }}
//     >
//       <Stack.Navigator
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: theme.colors.surface,
//           },
//           headerTintColor: theme.colors.text,
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       >
//         {isAuthenticated ? (
//           <>
//             <Stack.Screen
//               name="Home"
//               component={HomeScreen}
//               options={{ title: 'Mobile Mechanic' }}
//             />
//             <Stack.Screen
//               name="Profile"
//               component={ProfileScreen}
//               options={{ title: 'Profile' }}
//             />
//           </>
//         ) : (
//           <>
//             <Stack.Screen
//               name="Landing"
//               component={LandingScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={LoginScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Signup"
//               component={SignupScreen}
//               options={{ headerShown: false }}
//             />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };



// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
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
  AboutScreen,
  ContactScreen,
  ReportIssueScreen,
  ReportDetailsScreen,
  MyReportsScreen,
  EditReportScreen,
  ChatDetailScreen
} from '@screens/index';
import { CustomDrawerContent } from './CustomDrawerContent';
// import { CustomDrawerContent } from './CustomDrawerContent';
// import { AboutScreen } from '@screens/About/AboutScreen';
// import { ContactScreen } from '@screens/Contact/ContactScreen';

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
const Drawer = createDrawerNavigator<DrawerParamList>();

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

// Drawer Navigator
const DrawerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 280,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
          marginLeft: -16,
        },
      }}
    >
      {/* <Drawer.Screen 
        name="HomeTab" 
        component={BottomTabNavigator}
        options={{ 
          title: 'Mobile Mechanic',
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      /> */}
      <Drawer.Screen 
        name="About" 
        component={AboutScreen}
        options={{ 
          title: 'About Us',
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>ℹ️</Text>
          ),
        }}
      />
      <Drawer.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{ 
          title: 'Contact Us',
          drawerIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📞</Text>
          ),
        }}
      />
    </Drawer.Navigator>
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
          <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};