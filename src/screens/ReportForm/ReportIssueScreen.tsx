import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'context/ThemeContext';
import { useAuth } from 'context/AuthContext';
import { Button } from '@components/index';
import { hp, normalize, wp } from '@utils/responsive';
import axiosInstance from '@services/axiosInstance';

interface RouteParams {
  category: {
    id: number;
    name: string;
    icon: string;
    description: string;
  };
}

export const ReportIssueScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params as RouteParams;
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: category.name,
    subCategory: '',
    priority: 'Medium',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Subcategories based on selected category
  const getSubcategories = () => {
    switch (category.name) {
      case 'WASA':
        return [
          'Water Supply',
          'Sewerage',
          'Drainage',
          'Water Quality',
          'Billing Issue',
        ];
      case 'IESCO':
        return [
          'Power Outage',
          'Billing Issue',
          'Meter Problem',
          'Line Fault',
          'Load Shedding',
        ];
      case 'Municipality':
        return [
          'Road Maintenance',
          'Street Lights',
          'Garbage Collection',
          'Park Maintenance',
          'Traffic Signal',
        ];
      case 'Others':
        return [
          'General Complaint',
          'Public Safety',
          'Environment',
          'Noise Pollution',
          'Other',
        ];
      default:
        return ['General Issue'];
    }
  };

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    }

    if (!formData.subCategory) {
      newErrors.subCategory = 'Please select a subcategory';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Here you would normally send the data to your API
      const response = await axiosInstance.post(
        '/api/report/add',
        JSON.stringify(formData),
      );

      Alert.alert('Success', 'Your issue has been reported successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[styles.categoryName, { color: theme.colors.text }]}>
              {category.name}
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Report Issue
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Fill out the form below to report your issue
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Issue Title */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Issue Title *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: errors.title ? '#FF3B30' : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Enter a brief title for your issue"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.title}
              onChangeText={text => updateFormData('title', text)}
              maxLength={100}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Subcategory */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Subcategory *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {getSubcategories().map((sub, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          formData.subCategory === sub
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor:
                          formData.subCategory === sub
                            ? theme.colors.primary
                            : theme.colors.border,
                      },
                    ]}
                    onPress={() => updateFormData('subCategory', sub)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color:
                            formData.subCategory === sub
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.subCategory && (
              <Text style={styles.errorText}>{errors.subCategory}</Text>
            )}
          </View>

          {/* Priority */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Priority
            </Text>
            <View style={styles.priorityContainer}>
              {priorities.map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityChip,
                    {
                      backgroundColor:
                        formData.priority === priority
                          ? theme.colors.primary
                          : theme.colors.surface,
                      borderColor:
                        formData.priority === priority
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                  onPress={() => updateFormData('priority', priority)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      {
                        color:
                          formData.priority === priority
                            ? '#FFFFFF'
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Description *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: errors.description
                    ? '#FF3B30'
                    : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Describe your issue in detail..."
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.description}
              onChangeText={text => updateFormData('description', text)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text
              style={[styles.charCount, { color: theme.colors.textSecondary }]}
            >
              {formData.description.length}/500
            </Text>
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title={loading ? 'Submitting...' : 'Submit Report'}
            onPress={handleSubmit}
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  header: {
    marginBottom: hp(3),
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: hp(2),
  },
  categoryIcon: {
    fontSize: normalize(20),
    marginRight: wp(2),
  },
  categoryName: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: normalize(16),
  },
  form: {
    marginBottom: hp(3),
  },
  inputGroup: {
    marginBottom: hp(3),
  },
  label: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: wp(3),
    fontSize: normalize(16),
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: wp(3),
    fontSize: normalize(16),
    minHeight: hp(15),
  },
  chipContainer: {
    flexDirection: 'row',
    paddingVertical: hp(1),
  },
  chip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 20,
    borderWidth: 1,
    marginRight: wp(2),
  },
  chipText: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  priorityChip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 20,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  charCount: {
    textAlign: 'right',
    fontSize: normalize(12),
    marginTop: hp(0.5),
  },
  errorText: {
    color: '#FF3B30',
    fontSize: normalize(12),
    marginTop: hp(0.5),
  },
  submitContainer: {
    paddingBottom: hp(3),
  },
});
