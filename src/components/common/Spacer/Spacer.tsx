import React from 'react';
import { View } from 'react-native';
import { hp, wp } from '@utils/responsive';

interface SpacerProps {
  height?: number;
  width?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const sizeMap = {
  xs: hp(1),   // 4px equivalent
  sm: hp(2),   // 8px equivalent
  md: hp(3),   // 12px equivalent
  lg: hp(4),   // 16px equivalent
  xl: hp(6),   // 24px equivalent
  xxl: hp(8),  // 32px equivalent
};

export const Spacer: React.FC<SpacerProps> = ({
  height,
  width,
  size = 'md',
}) => {
  const defaultSize = sizeMap[size];
  
  return (
    <View
      style={{
        height: height ?? defaultSize,
        width: width ?? (width === undefined ? undefined : wp(width)),
      }}
    />
  );
};