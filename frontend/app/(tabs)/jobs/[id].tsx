import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Building,
  Clock,
  IndianRupee,
  MapPin,
  Share,
  Users,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { getJobDetails } from '../../../utils/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface JobDetails {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    salaryType: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  postedDate: string;
  applications: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getJobDetails(id);

      if (data && data._id) {
        setJob(data);
      } else {
        setError('Invalid job data received');
      }
    } catch (error) {
      console.error('Fetch job details error:', error);
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;

    setApplying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert(
        'Application Submitted!',
        'Your application has been submitted successfully. You will be notified about the status.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Application Failed',
        'Failed to submit application. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = () => setIsBookmarked(!isBookmarked);
  const handleShare = () =>
    Alert.alert('Share Job', 'Share functionality to be implemented');

  const formatSalary = (salary?: JobDetails['salary']) => {
    if (!salary) return 'Salary not disclosed';
    return `₹${salary.min.toLocaleString()} - ₹${salary.max.toLocaleString()} ${
      salary.salaryType
    }`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return '#10B981';
      case 'part-time':
        return '#3B82F6';
      case 'contract':
        return '#F59E0B';
      case 'internship':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const renderSection = (
    title: string,
    items: string[],
    icon?: React.ReactNode
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
          {items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={styles.headerActions} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={styles.headerActions} />
        </View>

        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <AlertCircle size={64} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Job not found</Text>
          <Text style={styles.errorSubtitle}>
            {error ||
              'This job may have been removed or is no longer available.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchJobDetails}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
            <Text>{id}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{job.title}</Text>
        {/* <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBookmark}
          >
            <Bookmark
              size={20}
              color={isBookmarked ? '#3B82F6' : '#6B7280'}
              fill={isBookmarked ? '#3B82F6' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Share size={20} color="#6B7280" />
          </TouchableOpacity>
        </View> */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.companyLogo}>
            <Building size={32} color="#6B7280" />
          </View>
          <View style={styles.jobInfo}>
            {/* <Text style={styles.}>{job.title}</Text> */}
            <Text style={styles.jobTitle}>{job.company}</Text>

            <View style={styles.jobMeta}>
              <View style={styles.metaItem}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.metaText}>{job.location}</Text>
              </View>
              <View
                style={[
                  styles.jobTypeBadge,
                  { backgroundColor: getJobTypeColor(job.type) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.jobTypeText,
                    { color: getJobTypeColor(job.type) },
                  ]}
                >
                  {job.type.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Job Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <IndianRupee size={16} color="#3B82F6" />
            </View>
            <Text style={styles.statLabel}>Salary</Text>
            <Text style={styles.statValue}>{formatSalary(job.salary)}</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Users size={16} color="#10B981" />
            </View>
            <Text style={styles.statLabel}>Applications</Text>
            <Text style={styles.statValue}>{job.applications}</Text>
          </View>

          {/* <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Eye size={16} color="#F59E0B" />
            </View>
            <Text style={styles.statLabel}>Views</Text>
            <Text style={styles.statValue}>{job.views}</Text>
          </View> */}

          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Clock size={16} color="#8B5CF6" />
            </View>
            <Text style={styles.statLabel}>Posted</Text>
            <Text style={styles.statValue}>{formatDate(job.postedDate)}</Text>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Requirements */}
        {renderSection(
          'Requirements',
          job.requirements,
          <CheckCircle size={20} color="#10B981" />
        )}

        {/* Responsibilities */}
        {renderSection(
          'Responsibilities',
          job.responsibilities,
          <Users size={20} color="#3B82F6" />
        )}

        {/* Benefits */}
        {renderSection(
          'Benefits',
          job.benefits,
          <CheckCircle size={20} color="#F59E0B" />
        )}

        {/* Skills Required */}
        {job.skills && job.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills Required</Text>
            <View style={styles.skillsContainer}>
              {job.skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Company Information */}
        {/* {job.companyInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Company</Text>
            <View style={styles.companyInfoCard}>
              <View style={styles.companyHeader}>
                <View style={styles.companyLogo}>
                  <Building size={24} color="#6B7280" />
                </View>
                <View style={styles.companyDetails}>
                  <Text style={styles.companyTitle}>{job.companyInfo.name}</Text>
                  <Text style={styles.companySubtitle}>{job.companyInfo.industry}</Text>
                </View>
                {job.companyInfo.website && (
                  <TouchableOpacity style={styles.websiteButton}>
                    <ExternalLink size={16} color="#3B82F6" />
                  </TouchableOpacity>
                )}
              </View>
              
              <Text style={styles.companyDescription}>{job.companyInfo.description}</Text>
              
              <View style={styles.companyMeta}>
                <Text style={styles.companyMetaText}>Company Size: {job.companyInfo.size}</Text>
              </View>
            </View>
          </View>
        )} */}

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience Required:</Text>
              <Text style={styles.infoValue}>{job.experience}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Application Deadline:</Text>
              {/* <Text style={styles.infoValue}>{formatDate(job.expiryDate)}</Text> */}
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.applyContainer}>
        <TouchableOpacity
          style={[styles.applyButton, applying && styles.applyButtonDisabled]}
          onPress={handleApply}
          disabled={applying}
        >
          {applying ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.applyButtonText}>Applying...</Text>
            </>
          ) : (
            <Text style={styles.applyButtonText}>Apply for this Job</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    marginLeft: 12,
    fontWeight: '800',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#FEE2E2',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  jobHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  companyLogo: {
    width: 64,
    height: 64,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  jobTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  sectionContent: {
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 8,
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  skillTag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  companyInfoCard: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyDetails: {
    flex: 1,
    marginLeft: 12,
  },
  companyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  companySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  websiteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  companyMeta: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  companyMetaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  additionalInfo: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  bottomSpacing: {
    height: 100,
  },
  applyContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
