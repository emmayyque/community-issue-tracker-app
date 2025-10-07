import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'context/ThemeContext';
import { useAuth } from 'context/AuthContext';
import { Button } from '@components/index';
import { hp, normalize, wp } from '@utils/responsive';
import axiosInstance from '@services/axiosInstance';

interface StatusUpdates {
  statusType: 'Pending' | 'Forwarded' | 'In-Progress' | 'Resolved';
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AssignedTo {
  _id: string;
  name: string;
}

interface Report {
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
  assignedTo?: AssignedTo;
  estimatedCompletion?: string;
}

export const MyReportsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'>('All');

  const fetchReports = async () => {
    try {
      // Replace with actual API call
      const response = await axiosInstance.get('/api/report/getAllByUser');
      setReports(response.data)
    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  const getStatusColor = (status: Report['currentStatus']) => {
    switch (status) {
      case 'Pending': return '#FF9500';
      case 'Forwarded': return '#007AFF';
      case 'In-Progress': return '#71717b';
      case 'Resolved': return '#34C759';
      default: return theme.colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: Report['priority']) => {
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
    });
  };

  const handleEditReport = (report: Report) => {
    navigation.navigate('EditReportScreen' as never, { report } as never);
  };

  const handleViewDetails = (report: Report) => {
    navigation.navigate('ReportDetailsScreen' as never, { report } as never);
  };

  const filteredReports = filter === 'All' 
    ? reports 
    : reports.filter(report => report.currentStatus === filter);

  const filterOptions = ['All', 'Pending', 'In-Progress', 'Resolved', 'Rejected'];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Reports</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Track your submitted issues
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === option 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: filter === option 
                  ? theme.colors.primary 
                  : theme.colors.border,
              }
            ]}
            onPress={() => setFilter(option as any)}
          >
            <Text style={[
              styles.filterText,
              {
                color: filter === option 
                  ? '#FFFFFF' 
                  : theme.colors.text,
              }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reports List */}
      <ScrollView
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReports.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              {filter === 'All' ? 'No reports found' : `No ${filter.toLowerCase()} reports`}
            </Text>
            <Button
              title="Report New Issue"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="medium"
            />
          </View>
        ) : (
          filteredReports.map((report, index) => (
            <TouchableOpacity
              key={ index }
              style={[
                styles.reportCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => handleViewDetails(report)}
              activeOpacity={0.7}
            >
              {/* Header Row */}
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryIcon}>{getCategoryIcon(report.category)}</Text>
                  <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                    {report.category}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(report.currentStatus) + '20' }
                  ]}>
                    <Text style={[styles.statusText, { color: getStatusColor(report.currentStatus) }]}>
                      {report.currentStatus}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Title and Description */}
              <Text style={[styles.reportTitle, { color: theme.colors.text }]}>
                {report.title}
              </Text>
              <Text style={[styles.reportDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                {report.description}
              </Text>

              {/* Progress Bar (if in progress) */}
              {report.currentStatus === 'In-Progress' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
                      Progress
                    </Text>
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

              {/* Assigned To (if available) */}
              {report.assignedTo && (
                <Text style={[styles.assignedTo, { color: theme.colors.textSecondary }]}>
                  Assigned to: {report.assignedTo.name}
                </Text>
              )}

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.metaInfo}>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(report.priority) + '20' }
                  ]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
                      {report.priority}
                    </Text>
                  </View>
                  <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                    {formatDate(report.createdAt)}
                  </Text>
                </View>
                
                {report.currentStatus == "Pending" && !report.assignedTo && (
                  <TouchableOpacity
                    style={[styles.editButton, { borderColor: theme.colors.primary }]}
                    onPress={() => handleEditReport(report)}
                  >
                    <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: normalize(16),
  },
  header: {
    padding: wp(4),
    paddingBottom: hp(2),
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: normalize(16),
  },
  filterContainer: {
    paddingHorizontal: wp(2),
    marginBottom: hp(2),
    maxHeight: hp(5), // Limit the height
  },
  filterTab: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8), // Reduced padding
    borderRadius: 20,
    borderWidth: 1,
    marginRight: wp(2),
    alignSelf: 'flex-start', // Prevent stretching
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: normalize(14),
    fontWeight: '500',
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  reportCard: {
    padding: wp(4),
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: hp(2),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: normalize(16),
    marginRight: wp(1),
  },
  categoryText: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: 12,
  },
  statusText: {
    fontSize: normalize(12),
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  reportDescription: {
    fontSize: normalize(14),
    lineHeight: 20,
    marginBottom: hp(2),
  },
  progressContainer: {
    marginBottom: hp(2),
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
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  assignedTo: {
    fontSize: normalize(12),
    fontStyle: 'italic',
    marginBottom: hp(2),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  priorityBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: 8,
  },
  priorityText: {
    fontSize: normalize(11),
    fontWeight: '600',
  },
  dateText: {
    fontSize: normalize(12),
  },
  editButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderWidth: 1,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: normalize(12),
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: hp(10),
    gap: hp(2),
  },
  emptyStateText: {
    fontSize: normalize(16),
  },
});