import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { hp, normalize, wp } from '@utils/responsive';
import { Spacer } from '@components/index';
import { useRoute, RouteProp } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
}

interface ChatDetailScreenProps {
  mechanicName: string;
  mechanicId: string;
}

// Mock AI responses for mechanic chat
const getAIResponse = (userMessage: string): string => {
  const responses = [
    "I'll check your car thoroughly and get back to you with a detailed diagnosis.",
    "The issue you described sounds like it could be related to the engine. Let me investigate further.",
    "I can come to your location within the next 30 minutes. Would that work for you?",
    "Based on your description, this might be a quick fix. I'll bring the necessary tools.",
    "Thank you for choosing our service. I'll make sure your car is running perfectly.",
    "I've seen this problem before. It's usually a straightforward repair.",
    "Let me send you a quote for the repair. It should be very reasonable.",
    "Your car will be ready soon. I'm just finishing up the final checks.",
  ];
  
  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
    return "I understand the issue. Let me diagnose it properly and provide you with the best solution.";
  }
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "I'll provide you with a fair and transparent quote. Quality service at reasonable prices is my priority.";
  }
  if (lowerMessage.includes('time') || lowerMessage.includes('when')) {
    return "I can be there within 20-30 minutes. I'll keep you updated on my arrival time.";
  }
  
  // Return random response
  return responses[Math.floor(Math.random() * responses.length)];
};

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
//   mechanicName,
  mechanicId,
}) => {
  const { theme } = useTheme();
  type ChatDetailScreenRouteParams = {
    ChatDetailScreen: {
      mechanicName: string;
      mechanicId: string;
    };
  };
  
  const route = useRoute<RouteProp<ChatDetailScreenRouteParams, 'ChatDetailScreen'>>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${mechanicName}. How can I help you with your car today?`,
      isUser: false,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const typingOpacity = useRef(new Animated.Value(0)).current;

let mechanicName =  route?.params?.mechanicName

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Animate typing indicator
  useEffect(() => {
    if (isAITyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingOpacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingOpacity.setValue(0);
    }
  }, [isAITyping]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Mark as sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    // Show AI typing indicator
    setIsAITyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      setIsAITyping(false);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!item.isUser && (
        <View style={[styles.aiAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.aiAvatarText, { color: theme.colors.background }]}>
            {mechanicName?.charAt(0)}
          </Text>
        </View>
      )}
      
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: item.isUser 
              ? theme.colors.primary 
              : theme.colors.surface,
          },
          item.isUser && styles.userBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: item.isUser 
                ? theme.colors.background 
                : theme.colors.text,
            },
          ]}
        >
          {item.text}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTime,
              {
                color: item.isUser 
                  ? theme.colors.background + '80'
                  : theme.colors.textSecondary,
              },
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
          
          {item.isUser && (
            <Text
              style={[
                styles.messageStatus,
                {
                  color: item.status === 'failed' 
                    ? theme.colors.error 
                    : theme.colors.background + '80',
                },
              ]}
            >
              {item.status === 'sending' ? '⏳' : 
               item.status === 'sent' ? '✓' : 
               item.status === 'failed' ? '✗' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderTypingIndicator = () => {
    if (!isAITyping) return null;
    
    return (
      <Animated.View 
        style={[
          styles.typingContainer,
          { opacity: typingOpacity }
        ]}
      >
        <View style={[styles.aiAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.aiAvatarText, { color: theme.colors.background }]}>
            {mechanicName?.charAt(0)}
          </Text>
        </View>
        
        <View style={[styles.typingBubble, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.headerAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.headerAvatarText, { color: theme.colors.background }]}>
            {mechanicName?.charAt(0)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: theme.colors.text }]}>
            {mechanicName}
          </Text>
          <Text style={[styles.headerStatus, { color: theme.colors.success }]}>
            🟢 Online
          </Text>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background }]}>
          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() 
                  ? theme.colors.primary 
                  : theme.colors.secondary,
              },
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  headerAvatarText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: normalize(16),
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: normalize(12),
    marginTop: hp(0.2),
  },
  messagesList: {
    padding: wp(4),
    paddingBottom: hp(2),
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: hp(1),
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
    marginBottom: hp(0.5),
  },
  aiAvatarText: {
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: wp(70),
    padding: wp(3),
    paddingBottom: wp(2),
    borderRadius: wp(4),
    borderBottomLeftRadius: wp(1),
  },
  userBubble: {
    borderBottomRightRadius: wp(1),
    borderBottomLeftRadius: wp(4),
  },
  messageText: {
    fontSize: normalize(14),
    lineHeight: normalize(18),
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  messageTime: {
    fontSize: normalize(10),
  },
  messageStatus: {
    fontSize: normalize(10),
    marginLeft: wp(2),
  },
  typingContainer: {
    flexDirection: 'row',
    marginVertical: hp(1),
    alignItems: 'flex-end',
  },
  typingBubble: {
    padding: wp(3),
    borderRadius: wp(4),
    borderBottomLeftRadius: wp(1),
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    marginHorizontal: wp(0.5),
  },
  inputContainer: {
    padding: wp(4),
    paddingTop: wp(2),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: wp(6),
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    minHeight: hp(6),
    maxHeight: hp(20),
  },
  textInput: {
    flex: 1,
    fontSize: normalize(14),
    paddingVertical: wp(2),
    paddingRight: wp(2),
    textAlignVertical: 'top',
  },
  sendButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  sendButtonText: {
    color: 'white',
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
});