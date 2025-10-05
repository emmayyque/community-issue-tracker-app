import { Platform } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
    heavy: string;
    light: string;
  };
  fontWeights: {
    light: string;
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
    display: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// Environment configuration interface
interface EnvConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_VERSION: string;
  GOOGLE_MAPS_API_KEY: string;
  GOOGLE_PLACES_API_KEY: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  STRIPE_PUBLISHABLE_KEY: string;
  FCM_SERVER_KEY: string;
  ONESIGNAL_APP_ID: string;
  APP_NAME: string;
  APP_VERSION: string;
  ENVIRONMENT: 'development' | 'production' | 'staging';
  DEBUG_MODE: boolean;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  MAPBOX_ACCESS_TOKEN: string;
  SENDGRID_API_KEY: string;
  FROM_EMAIL: string;
  FACEBOOK_APP_ID: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_ANALYTICS_ID: string;
  MIXPANEL_TOKEN: string;
}

// Default configuration
const defaultConfig: EnvConfig = {
  API_BASE_URL: 'https://api.mobilemechanicapp.com/api',
  API_TIMEOUT: 10000,
  API_VERSION: 'v1',
  GOOGLE_MAPS_API_KEY: '',
  GOOGLE_PLACES_API_KEY: '',
  FIREBASE_API_KEY: '',
  FIREBASE_AUTH_DOMAIN: '',
  FIREBASE_PROJECT_ID: '',
  FIREBASE_STORAGE_BUCKET: '',
  FIREBASE_MESSAGING_SENDER_ID: '',
  FIREBASE_APP_ID: '',
  STRIPE_PUBLISHABLE_KEY: '',
  FCM_SERVER_KEY: '',
  ONESIGNAL_APP_ID: '',
  APP_NAME: 'Mobile Mechanic',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: 'development',
  DEBUG_MODE: true,
  TWILIO_ACCOUNT_SID: '',
  TWILIO_AUTH_TOKEN: '',
  TWILIO_PHONE_NUMBER: '',
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  MAPBOX_ACCESS_TOKEN: '',
  SENDGRID_API_KEY: '',
  FROM_EMAIL: 'noreply@mobilemechanicapp.com',
  FACEBOOK_APP_ID: '',
  GOOGLE_CLIENT_ID: '',
  GOOGLE_ANALYTICS_ID: '',
  MIXPANEL_TOKEN: '',
};

// Environment-specific configurations
const developmentConfig: Partial<EnvConfig> = {
  API_BASE_URL: 'http://localhost:3000/api',
  DEBUG_MODE: true,
  ENVIRONMENT: 'development',
};

const stagingConfig: Partial<EnvConfig> = {
  API_BASE_URL: 'https://staging-api.mobilemechanicapp.com/api',
  DEBUG_MODE: true,
  ENVIRONMENT: 'staging',
};

const productionConfig: Partial<EnvConfig> = {
  API_BASE_URL: 'https://api.mobilemechanicapp.com/api',
  DEBUG_MODE: false,
  ENVIRONMENT: 'production',
};

// Function to get environment-specific config
const getEnvConfig = (): EnvConfig => {
  // In React Native, you can't directly access process.env
  // You need to use react-native-config or react-native-dotenv
  // For now, we'll use a simple environment detection

  const env: 'development' | 'production' | 'staging' = __DEV__
    ? 'development'
    : process.env.NODE_ENV === 'staging'
    ? 'staging'
    : 'production';

  let envConfig: Partial<EnvConfig> = {};
  switch (env) {
    case 'development':
      envConfig = developmentConfig;
      break;
    case 'staging':
      envConfig = stagingConfig;
      break;
    case 'production':
      envConfig = productionConfig;
      break;
    default:
      envConfig = developmentConfig;
  }

  return {
    ...defaultConfig,
    ...envConfig,
  };
};

// Export the configuration
export const ENV_CONFIG = getEnvConfig();

// Helper functions
export const isProduction = () => ENV_CONFIG.ENVIRONMENT === 'production';
export const isDevelopment = () => ENV_CONFIG.ENVIRONMENT === 'development';
export const isStaging = () => ENV_CONFIG.ENVIRONMENT === 'staging';
export const isDebugMode = () => ENV_CONFIG.DEBUG_MODE;

// API helpers
export const getApiUrl = (endpoint: string) => {
  const baseUrl = ENV_CONFIG.API_BASE_URL;
  const version = ENV_CONFIG.API_VERSION;
  return `${baseUrl}/${version}/${endpoint}`;
};

// Platform-specific configurations
export const getPlatformConfig = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  };
};

// Validate required environment variables
export const validateEnvConfig = (): boolean => {
  const requiredVars = [
    'API_BASE_URL',
    'GOOGLE_MAPS_API_KEY',
    'FIREBASE_API_KEY',
    'FIREBASE_PROJECT_ID',
  ];

  const missing = requiredVars.filter(varName => {
    const value = ENV_CONFIG[varName as keyof EnvConfig];
    return !value || value === '';
  });

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  return true;
};

// Log configuration (only in development)
if (isDevelopment()) {
  console.log('Environment Configuration:', {
    environment: ENV_CONFIG.ENVIRONMENT,
    apiBaseUrl: ENV_CONFIG.API_BASE_URL,
    debugMode: ENV_CONFIG.DEBUG_MODE,
    platform: Platform.OS,
  });
}
