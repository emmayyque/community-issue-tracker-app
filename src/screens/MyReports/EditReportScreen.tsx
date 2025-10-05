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
import { Button } from '@components/index';
import { hp, normalize, wp } from '@utils/responsive';
import axiosInstance from '@services/axiosInstance';


interface StatusUpdates {
  statusType: 'Pending' | 'Forwarded' | 'In-Progress' | 'Resolved';
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface RouteParams {
  report: {
    _id: string;
    title: string;
    description: string;
    category: string;
    subCategory: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    currentStatus: 'Pending' | 'Forwarded' | 'In-Progress' | 'Resolved';
    status: StatusUpdates[];
    createdAt: string;
    updatedAt: string;
    completedPercentage: number;
    canEdit: boolean;
    assignedTo?: string;
    estimatedCompletion?: string;
  };
}

export const EditReportScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { report } = route.params as RouteParams;
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    title: report.title,
    description: report.description,
    subCategory: report.subCategory,
    priority: report.priority,
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Subcategories based on report category
  const getSubcategories = () => {
    switch (report.category) {
      case 'WASA':
        return ['Water Supply', 'Sewerage', 'Drainage', 'Water Quality', 'Billing Issue'];
      case 'IESCO':
        return ['Power Outage', 'Billing Issue', 'Meter Problem', 'Line Fault', 'Load Shedding'];
      case 'Municipality':
        return ['Road Maintenance', 'Street Lights', 'Garbage Collection', 'Park Maintenance', 'Traffic Signal'];
      case 'Others':
        return ['General Complaint', 'Public Safety', 'Environment', 'Noise Pollution', 'Other'];
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

  const handleSave = async () => {
    if (!validateForm()) return;

    // Check if anything changed
    const hasChanges = 
      formData.title !== report.title ||
      formData.description !== report.description ||
      formData.subCategory !== report.subCategory ||
      formData.priority !== report.priority;

    if (!hasChanges) {
      Alert.alert('No Changes', 'No changes were made to the report.');
      return;
    }

    setLoading(true);
    try {
      // Here you would normally send the updated data to your API
      const response = await axiosInstance.put(`/api/report/update/${ report._id }`, JSON.stringify(formData));
      
      Alert.alert(
        'Success',
        'Report updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    const hasChanges = 
      formData.title !== report.title ||
      formData.description !== report.description ||
      formData.subCategory !== report.subCategory ||
      formData.priority !== report.priority;

    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Continue Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'WASA': return '💧';
      case 'IESCO': return '⚡';
      case 'Municipality': return '🏛️';
      case 'Others': return '📋';
      default: return '📋';
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
          <View style={[styles.categoryBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(report.category)}</Text>
            <Text style={[styles.categoryName, { color: theme.colors.text }]}>{report.category}</Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Edit Report</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Update your report details below
          </Text>
          <View style={styles.reportIdContainer}>
            <Text style={[styles.reportId, { color: theme.colors.textSecondary }]}>
              Report ID: #{report._id}
            </Text>
          </View>
        </View>

        {/* Notice */}
        {report.currentStatus !== 'Pending' && (
          <View style={[styles.noticeCard, { backgroundColor: '#FF9500' + '20', borderColor: '#FF9500' }]}>
            <Text style={[styles.noticeText, { color: '#FF9500' }]}>
              ⚠️ This report is currently {report.currentStatus.toLowerCase()}. Changes may be subject to review.
            </Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Issue Title */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Issue Title *</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: errors.title ? '#FF3B30' : theme.colors.border,
                  color: theme.colors.text,
                }
              ]}
              placeholder="Enter a brief title for your issue"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.title}
              onChangeText={(text) => updateFormData('title', text)}
              maxLength={100}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Subcategory */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Subcategory *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {getSubcategories().map((sub, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: formData.subCategory === sub 
                          ? theme.colors.primary 
                          : theme.colors.surface,
                        borderColor: formData.subCategory === sub 
                          ? theme.colors.primary 
                          : theme.colors.border,
                      }
                    ]}
                    onPress={() => updateFormData('subcategory', sub)}
                  >
                    <Text style={[
                      styles.chipText,
                      {
                        color: formData.subCategory === sub 
                          ? '#FFFFFF' 
                          : theme.colors.text,
                      }
                    ]}>
                      {sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.subcategory && <Text style={styles.errorText}>{errors.subcategory}</Text>}
          </View>

          {/* Priority */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityChip,
                    {
                      backgroundColor: formData.priority === priority 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                      borderColor: formData.priority === priority 
                        ? theme.colors.primary 
                        : theme.colors.border,
                    }
                  ]}
                  onPress={() => updateFormData('priority', priority)}
                >
                  <Text style={[
                    styles.priorityText,
                    {
                      color: formData.priority === priority 
                        ? '#FFFFFF' 
                        : theme.colors.text,
                    }
                  ]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description *</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: errors.description ? '#FF3B30' : theme.colors.border,
                  color: theme.colors.text,
                }
              ]}
              placeholder="Describe your issue in detail..."
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
              {formData.description.length}/500
            </Text>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title={loading ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          />
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            size="medium"
            fullWidth
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
    marginBottom: hp(1),
  },
  reportIdContainer: {
    marginTop: hp(1),
  },
  reportId: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  noticeCard: {
    padding: wp(3),
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: hp(3),
  },
  noticeText: {
    fontSize: normalize(14),
    fontWeight: '500',
    textAlign: 'center',
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
  actionButtons: {
    gap: hp(2),
    paddingBottom: hp(3),
  },
});