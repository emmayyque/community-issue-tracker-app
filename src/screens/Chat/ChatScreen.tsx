import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { hp, normalize, wp } from '@utils/responsive';
import { Spacer } from '@components/index';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '@services/axiosInstance';
import { getRelativeTime } from '@utils/helpers';

interface ChatItem {
  id: string;
  mechanicName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface NoticeItem {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// const mockChats: ChatItem[] = [
//   {
//     id: '1',
//     mechanicName: 'Ahmed Khan',
//     lastMessage: 'Your car service is completed!',
//     timestamp: '2m ago',
//     unread: true,
//   },
//   {
//     id: '2',
//     mechanicName: 'Ali Mechanic',
//     lastMessage: 'I will arrive in 15 minutes',
//     timestamp: '1h ago',
//     unread: false,
//   },
//   {
//     id: '3',
//     mechanicName: 'Hassan Auto',
//     lastMessage: 'Thank you for your service',
//     timestamp: '2d ago',
//     unread: false,
//   },
// ];

export const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation : any = useNavigation()
  const [ loading, setLoading ] = useState(true)
  const [ notices, setNotices ] = useState<NoticeItem[]>([])

  useEffect(() => {
    console.log("Hey first")
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      // Replace with actual API call
      const response = await axiosInstance.get('/api/notice/getAllActive');
      setNotices(response.data)

    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('item?.mechanicName', item?.mechanicName);
          navigation.navigate('ChatDetailScreen', {
            mechanicName: item?.mechanicName,
            mechanicId: item?.id
          });
        } }
        style={[styles.chatItem, { backgroundColor: theme.colors.surface }]}
      >
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.avatarText, { color: theme.colors.background }]}>
            {item.mechanicName.charAt(0)}
          </Text>
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.mechanicName, { color: theme.colors.text }]}>
              {item.mechanicName}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {item.timestamp}
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
              { color: item.unread ? theme.colors.text : theme.colors.textSecondary }
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>

        {item.unread && (
          <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderNoticeItem = ({ item }: { item: NoticeItem }) => {
    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: theme.colors.surface }]}
      >
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.avatarText, { color: theme.colors.background }]}>
            {item.title.charAt(0)}
          </Text>
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.mechanicName, { flexShrink: 1, color: theme.colors.text }]} numberOfLines={50}>
              {item.title}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              { getRelativeTime(item.createdAt) }
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
              // { color: item.unread ? theme.colors.text : theme.colors.textSecondary }
            ]}
            numberOfLines={50}
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={notices}
        keyExtractor={(item) => item._id}
        renderItem={renderNoticeItem}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
      alignItems: 'flex-start',
      marginBottom: hp(0.5)    
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