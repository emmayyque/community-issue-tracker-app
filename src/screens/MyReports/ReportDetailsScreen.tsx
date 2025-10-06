import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
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

export const ReportDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { report } = route.params as RouteParams;
  const { theme } = useTheme();
  const [ statusUpdates, setStatusUpdates ] = useState<StatusUpdates[]>([])
  const [ loading, setLoading ] = useState(true)

  const fetchUpdates = async () => {
    try {
      const response = await axiosInstance.get(`/api/report/getOne/${ report._id }`);

      response.data.status[0].createdAt = response.data.createdAt
      response.data.status[0].updatedAt = response.data.updatedAt

      setStatusUpdates(response.data.status)

    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (report._id) fetchUpdates()
  }, [ report._id ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#FF9500';
      case 'Forwarded': return '#007AFF';
      case 'In-Progress': return '#71717b';
      case 'Resolved': return '#34C759';
      default: return theme.colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return '#34C759';
      case 'Medium': return '#FF9500';
      case 'High': return '#FF6B35';
      case 'Critical': return '#FF3B30';
      default: return theme.colors.textSecondary;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    navigation.navigate('EditReport' as never, { report } as never);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Add delete API call here
            deleteReport(report._id)
          }
        }
      ]
    );
  };

  const deleteReport = async (id: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.put(`/api/report/delete/${ id }`)
      Alert.alert('Success', 'Report deleted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])

    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={[styles.headerCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.categorySection}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(report.category)}</Text>
            <View>
              <Text style={[styles.categoryName, { color: theme.colors.text }]}>{report.category}</Text>
              <Text style={[styles.subcategoryName, { color: theme.colors.textSecondary }]}>
                {report.subCategory}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.currentStatus) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(report.currentStatus) }]}>
              {report.currentStatus}
            </Text>
          </View>
        </View>

        <Text style={[styles.reportTitle, { color: theme.colors.text }]}>{report.title}</Text>
        
        <View style={styles.metaRow}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(report.priority) + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
              {report.priority} Priority
            </Text>
          </View>
          <Text style={[styles.reportId, { color: theme.colors.textSecondary }]}>ID: {report._id}</Text>
        </View>

        {/* Progress Bar */}
        {report.currentStatus === 'In-Progress' && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: theme.colors.text }]}>Progress</Text>
              <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
                {report.completedPercentage}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${report.completedPercentage}%`,
                    backgroundColor: theme.colors.primary
                  }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      {/* Description Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
        <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
          {report.description}
        </Text>
      </View>

      {/* Assignment & Timeline */}
      {(report.assignedTo || report.estimatedCompletion) && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Assignment Details</Text>
          
          {report.assignedTo && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Assigned To:</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{report.assignedTo}</Text>
            </View>
          )}
          
          {report.estimatedCompletion && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Est. Completion:</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {formatDate(report.estimatedCompletion)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Status Updates */}
      {
        statusUpdates && statusUpdates.length > 0 && 
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Status Updates</Text>
          <View style={styles.timeline}>
            {statusUpdates.map((update, index) => (
              <View key={ index } style={styles.timelineItem}>
                <View style={styles.timelineMarker}>
                  <View style={[
                    styles.timelineDot,
                    { 
                      backgroundColor: index === statusUpdates.length - 1 ? theme.colors.primary : theme.colors.border
                    }
                  ]} />
                  {index !== statusUpdates.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: theme.colors.border }]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.updateMessage, { color: theme.colors.text }]}>
                    {update.description}
                  </Text>
                  <Text style={[styles.updateMeta, { color: theme.colors.textSecondary }]}>
                    {formatDate(update.createdAt)} • {update.createdAt}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      }

      {/* Timestamps */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Timestamps</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Created:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {formatDate(report.createdAt)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Last Updated:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {formatDate(report.updatedAt)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {report.canEdit && (
          <Button
            title="Edit Report"
            onPress={handleEdit}
            variant="primary"
            size="large"
            fullWidth
          />
        )}
        
        {report.currentStatus === 'Pending' && (
          <Button
            title="Delete Report"
            onPress={handleDelete}
            variant="outline"
            size="medium"
            fullWidth
            style={{ borderColor: '#FF3B30' }}
            textStyle={{ color: '#FF3B30' }}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  headerCard: {
    padding: wp(4),
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: hp(3),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: normalize(24),
    marginRight: wp(3),
  },
  categoryName: {
    fontSize: normalize(16),
    fontWeight: '600',
  },
  subcategoryName: {
    fontSize: normalize(14),
  },
  statusBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 12,
  },
  statusText: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginBottom: hp(2),
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  priorityBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: 8,
  },
  priorityText: {
    fontSize: normalize(12),
    fontWeight: '600',
  },
  reportId: {
    fontSize: normalize(12),
    fontWeight: '500',
  },
  progressSection: {
    marginTop: hp(1),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  progressLabel: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  section: {
    padding: wp(4),
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: hp(2),
  },
  descriptionText: {
    fontSize: normalize(16),
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  infoLabel: {
    fontSize: normalize(14),
    flex: 1,
  },
  infoValue: {
    fontSize: normalize(14),
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  timeline: {
    paddingLeft: wp(2),
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: hp(3),
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: wp(3),
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: hp(1),
  },
  timelineContent: {
    flex: 1,
    paddingTop: hp(0.5),
  },
  updateMessage: {
    fontSize: normalize(15),
    fontWeight: '500',
    marginBottom: hp(0.5),
  },
  updateMeta: {
    fontSize: normalize(12),
  },
  actionButtons: {
    gap: hp(2),
    paddingBottom: hp(3),
  },
});