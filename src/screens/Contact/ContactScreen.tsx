import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { hp, normalize, wp } from '@utils/responsive';
import { Spacer } from '@components/index';


export const ContactScreen: React.FC = () => {
    const { theme } = useTheme();
  
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Contact Us
          </Text>
          
          <Spacer size="lg" />
          
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            We're here to help! Reach out to us through any of the following channels:
          </Text>
          
          <Spacer size="xl" />
          
          <View style={styles.contactList}>
            <TouchableOpacity style={[styles.contactItem, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.contactIcon, { color: theme.colors.primary }]}>📞</Text>
              <View style={styles.contactContent}>
                <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Phone</Text>
                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                  +92 300 1234567
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactItem, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.contactIcon, { color: theme.colors.primary }]}>✉️</Text>
              <View style={styles.contactContent}>
                <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Email</Text>
                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                  support@mobilemechanic.com
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactItem, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.contactIcon, { color: theme.colors.primary }]}>📍</Text>
              <View style={styles.contactContent}>
                <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Address</Text>
                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                  Rawalpindi, Punjab, Pakistan
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactItem, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.contactIcon, { color: theme.colors.primary }]}>🕒</Text>
              <View style={styles.contactContent}>
                <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Hours</Text>
                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                  24/7 Emergency Service
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: wp(6),
    },
    
    // Chat Screen Styles
    listContainer: {
      padding: wp(4),
    },
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp(4),
      borderRadius: wp(3),
      position: 'relative',
    },
    avatar: {
      width: wp(12),
      height: wp(12),
      borderRadius: wp(6),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: wp(3),
    },
    avatarText: {
      fontSize: normalize(16),
      fontWeight: 'bold',
    },
    chatContent: {
      flex: 1,
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(0.5),
    },
    mechanicName: {
      fontSize: normalize(16),
      fontWeight: '600',
    },
    timestamp: {
      fontSize: normalize(12),
    },
    lastMessage: {
      fontSize: normalize(14),
    },
    unreadIndicator: {
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: wp(1.25),
      position: 'absolute',
      right: wp(4),
      top: wp(4),
    },
    
    // About & Contact Screen Styles
    title: {
      fontSize: normalize(24),
      fontWeight: 'bold',
      textAlign: 'center',
    },
    description: {
      fontSize: normalize(16),
      lineHeight: normalize(24),
      textAlign: 'center',
    },
    featureList: {
      gap: hp(2),
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
    },
    featureIcon: {
      fontSize: normalize(20),
      marginRight: wp(3),
    },
    featureText: {
      fontSize: normalize(16),
      fontWeight: '500',
    },
    version: {
      fontSize: normalize(14),
      textAlign: 'center',
    },
    
    // Contact Screen Styles
    contactList: {
      gap: hp(2),
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: wp(4),
      borderRadius: wp(3),
    },
    contactIcon: {
      fontSize: normalize(20),
      marginRight: wp(3),
    },
    contactContent: {
      flex: 1,
    },
    contactLabel: {
      fontSize: normalize(16),
      fontWeight: '600',
      marginBottom: hp(0.5),
    },
    contactValue: {
      fontSize: normalize(14),
    },
  });