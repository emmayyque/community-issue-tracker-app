import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'context/ThemeContext';

type IconType =
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Ionicons'
  | 'MaterialIcons'
  | 'Entypo'
  | 'AntDesign'
  | 'Feather';

interface IconProps {
  name: string;
  type: IconType;
  size?: number;
  color?: string; // optional, fallback to theme
  style?: any;
}

const Icon: React.FC<IconProps> = ({ name, type, size = 24, color, style }) => {
  const { theme } = useTheme();
  const finalColor = color || theme.colors.text;

  const getIconComponent = () => {
    switch (type) {
      case 'FontAwesome':
        return <FontAwesome name={name} size={size} color={finalColor} style={style} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={name} size={size} color={finalColor} style={style} />;
      case 'Ionicons':
        return <Ionicons name={name} size={size} color={finalColor} style={style} />;
      case 'MaterialIcons':
        return <MaterialIcons name={name} size={size} color={finalColor} style={style} />;
      case 'Entypo':
        return <Entypo name={name} size={size} color={finalColor} style={style} />;
      case 'AntDesign':
        return <AntDesign name={name} size={size} color={finalColor} style={style} />;
      case 'Feather':
        return <Feather name={name} size={size} color={finalColor} style={style} />;
      default:
        return null;
    }
  };

  return getIconComponent();
};

export  {Icon};
