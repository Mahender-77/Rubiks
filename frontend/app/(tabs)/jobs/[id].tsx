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
  Star,
  MessageCircle,
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
  Image,
  TextInput,
} from 'react-native';
import { getJobDetails, getJobProposals } from '../../../utils/api';
// import { getJobProposals } from '../../../utils/api'; // Uncomment when API is ready

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
  // freelance specific fields
  budget?: {
    min: number;
    max: number;
    currency: string;
    type: string;
  };
  duration?: string;
  proposals?: number;
}

interface Proposal {
  _id: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar?: string;
  rating: number;
  completedJobs: number;
  successRate: number;
  country: string;
  bidAmount: number;
  currency: string;
  deliveryTime: string;
  coverLetter: string;
  skills: string[];
  responseTime: string;
  isVerified: boolean;
  badges: string[];
}

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [job, setJob] = useState<JobDetails | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'proposals'>('details');

  // Freelance form states
  const [hourlyRate, setHourlyRate] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  useEffect(() => {
    if (job && job.type === 'freelance' && activeTab === 'proposals') {
      fetchProposals();
    }
  }, [job, activeTab]);

  console.log("🔍 JobDetailsScreen: Rendering with state:", job);

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

  const fetchProposals = async () => {
    if (!id) return;

    setProposalsLoading(true);
    try {
      const data = await getJobProposals(id);
      setProposals(data || []);
    } catch (error) {
      
    } finally {
      setProposalsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;

    setApplying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert(
        job.type === 'freelance' ? 'Proposal Submitted!' : 'Application Submitted!',
        job.type === 'freelance' 
          ? 'Your proposal has been submitted successfully. You will be notified about the status.'
          : 'Your application has been submitted successfully. You will be notified about the status.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        (job.type === 'freelance' || job.type === 'freelance' || job.type === 'contract') ? 'Proposal Failed' : 'Application Failed',
        (job.type === 'freelance' || job.type === 'freelance' || job.type === 'contract')
          ? 'Failed to submit proposal. Please try again.'
          : 'Failed to submit application. Please try again.',
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

  const formatBudget = (budget?: JobDetails['budget']) => {
    if (!budget) return 'Budget not disclosed';
    return `₹${budget.min.toLocaleString()} - ₹${budget.max.toLocaleString()} ${
      budget.type
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

  const gettypeColor = (type: string) => {
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

  const renderProposalCard = (proposal: Proposal) => (
    <View key={proposal._id} style={styles.proposalCard}>
      <View style={styles.proposalHeader}>
        <View style={styles.freelancerInfo}>
          <View style={styles.freelancerAvatar}>
            {proposal.freelancerAvatar ? (
              <Image source={{ uri: proposal.freelancerAvatar }} style={styles.avatarImage} />
            ) : (
              <Users size={24} color="#6B7280" />
            )}
          </View>
          <View style={styles.freelancerDetails}>
            <View style={styles.freelancerNameRow}>
              <Text style={styles.freelancerName}>{proposal.freelancerName}</Text>
              {proposal.isVerified && (
                <CheckCircle size={16} color="#10B981" />
              )}
            </View>
            <View style={styles.freelancerStats}>
              <View style={styles.statRow}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.statText}>{proposal.rating}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statText}>{proposal.completedJobs}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statText}>{proposal.successRate}%</Text>
              </View>
              <Text style={styles.countryText}>{proposal.country}</Text>
            </View>
          </View>
        </View>
        <View style={styles.proposalAmount}>
          <Text style={styles.bidAmount}>₹{proposal.bidAmount.toLocaleString()} INR</Text>
          <Text style={styles.deliveryTime}>in {proposal.deliveryTime}</Text>
        </View>
      </View>

      {proposal.badges.length > 0 && (
        <View style={styles.badgesContainer}>
          {proposal.badges.map((badge, index) => (
            <Text key={index} style={styles.badge}>{badge}</Text>
          ))}
        </View>
      )}

      <Text style={styles.coverLetter}>{proposal.coverLetter}</Text>
      
      <Text style={styles.responseTime}>Replies within {proposal.responseTime}</Text>
      
      <TouchableOpacity style={styles.reportButton}>
        <Text style={styles.reportButtonText}>Report Bid</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'details') {
      return (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {/* Job Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <IndianRupee size={16} color="#3B82F6" />
              </View>
              <Text style={styles.statLabel}>
                {job?.type === 'freelance' ? 'Budget' : 'Salary'}
              </Text>
              <Text style={styles.statValue}>
                {job?.type === 'freelance' ? formatBudget(job.budget) : formatSalary(job?.salary)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Users size={16} color="#10B981" />
              </View>
              <Text style={styles.statLabel}>
                {job?.type === 'freelance' ? 'Proposals' : 'Applications'}
              </Text>
              <Text style={styles.statValue}>
                {job?.type === 'freelance' ? (job.proposals || 0) : (job?.applications || 0)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Clock size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.statLabel}>Posted</Text>
              <Text style={styles.statValue}>{formatDate(job?.postedDate)}</Text>
            </View>
          </View>

          {/* Job Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.description}>{job?.description}</Text>
          </View>

          {/* Requirements */}
          {renderSection(
            'Requirements',
            job?.requirements || [],
            <CheckCircle size={20} color="#10B981" />
          )}

          {/* Responsibilities */}
          {renderSection(
            'Responsibilities',
            job?.responsibilities || [],
            <Users size={20} color="#3B82F6" />
          )}

          {/* Benefits */}
          {renderSection(
            'Benefits',
            job?.benefits || [],
            <CheckCircle size={20} color="#F59E0B" />
          )}

          {/* Skills Required */}
          {job?.skills && job.skills.length > 0 && (
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

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Experience Required:</Text>
                <Text style={styles.infoValue}>{job?.experience}</Text>
              </View>
              {job?.type === 'freelance' && job.duration && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Project Duration:</Text>
                  <Text style={styles.infoValue}>{job.duration}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Freelance Proposal Form */}
         activeTab === "details" ? <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Hourly Rate *</Text>
            <View style={styles.hourlyRateContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.hourlyRateInput}
                placeholder="0"
                value={hourlyRate}
                onChangeText={setHourlyRate}
                keyboardType="numeric"
              />
              <Text style={styles.rateUnit}>USD per hr.</Text>
            </View>
          (</View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Address (Only your city and country will be shown publicly)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
            />
          </View>):"null"
       
          <View style={styles.bottomSpacing} />
        </ScrollView>
      );
    } else {
      return (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {proposalsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading proposals...</Text>
            </View>
          ) : (
            <View style={styles.proposalsContainer}>
              {proposals.map(renderProposalCard)}
              {proposals.length === 0 && (
                <View style={styles.noProposalsContainer}>
                  <Text>No proposals yet</Text>
                </View>
              )}
            </View>
          )}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      );
    }
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
      </View>

      {/* Job Header */}
      <View style={styles.jobHeader}>
        <View style={styles.companyLogo}>
          <Building size={32} color="#6B7280" />
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.company}</Text>

          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: gettypeColor(job.type) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: gettypeColor(job.type) },
                ]}
              >
                {job.type.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs for freelance Jobs */}
      {job.type === 'freelance' && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'proposals' && styles.activeTab]}
            onPress={() => setActiveTab('proposals')}
          >
            <Text style={[styles.tabText, activeTab === 'proposals' && styles.activeTabText]}>
              Proposals
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {job.type === 'freelance' ? (
        renderTabContent()
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Regular job content (existing code) */}
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

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Experience Required:</Text>
                <Text style={styles.infoValue}>{job.experience}</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}

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
              <Text style={styles.applyButtonText}>
                {job.type === 'freelance' ? 'Submitting...' : 'Applying...'}
              </Text>
            </>
          ) : (
            activeTab === 'proposals' ? " " : (
            <Text style={styles.applyButtonText}>
              {job.type === 'freelance' ? 'Submit Proposal' : 'Apply for this Job'}
            </Text>)
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
  content: {
    flex: 1,
  },
  tabContent: {
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
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Tabs styles
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  // Proposals styles
  proposalsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  proposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  freelancerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  freelancerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  freelancerDetails: {
    flex: 1,
  },
  freelancerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  freelancerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  freelancerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  countryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  proposalAmount: {
    alignItems: 'flex-end',
  },
  bidAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    fontSize: 12,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  coverLetter: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  responseTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  reportButton: {
    alignSelf: 'flex-end',
  },
  reportButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  noProposalsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noProposalsIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noProposalsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  noProposalsSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  noProposalsHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
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
    textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },

   formField: {
    marginBottom: 16,
  },
   fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
    hourlyRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
   currencySymbol: {
    fontSize: 16,
    color: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
    hourlyRateInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  rateUnit: {
    fontSize: 16,
    color: '#6B7280',
    paddingHorizontal: 12,
  },

});