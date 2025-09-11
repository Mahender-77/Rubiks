import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Building,
  Clock,
  IndianRupee,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  useColorScheme,
} from 'react-native';
import { getJobDetails, getJobProposals } from '../../../utils/api';
import Colors from '../../../constants/Colors';

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
  const colorScheme = useColorScheme() ?? 'light';

  const [job, setJob] = useState<JobDetails | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'proposals'>(
    'details'
  );

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
      // handle quietly for now
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
        job.type === 'freelance'
          ? 'Proposal Submitted!'
          : 'Application Submitted!',
        job.type === 'freelance'
          ? 'Your proposal has been submitted successfully. You will be notified about the status.'
          : 'Your application has been submitted successfully. You will be notified about the status.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        job.type === 'freelance' || job.type === 'contract'
          ? 'Proposal Failed'
          : 'Application Failed',
        job.type === 'freelance' || job.type === 'contract'
          ? 'Failed to submit proposal. Please try again.'
          : 'Failed to submit application. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setApplying(false);
    }
  };
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
      <View
        style={{
          backgroundColor: Colors[colorScheme].background,
          marginBottom: 16,
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          {icon}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: Colors[colorScheme].text,
              marginLeft: 8,
            }}
          >
            {title}
          </Text>
        </View>
        <View style={{ marginTop: 12 }}>
          {items.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#3B82F6',
                  marginTop: 8,
                  marginRight: 12,
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  lineHeight: 24,
                }}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderProposalCard = (proposal: Proposal) => (
    <View
      key={proposal._id}
      style={{
        backgroundColor: Colors[colorScheme].background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: Colors[colorScheme].lightBackground,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            {proposal.freelancerAvatar ? (
              <Image
                source={{ uri: proposal.freelancerAvatar }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
            ) : (
              <Users size={24} color={Colors[colorScheme].text} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                  marginRight: 8,
                }}
              >
                {proposal.freelancerName}
              </Text>
              {proposal.isVerified && <CheckCircle size={16} color="#10B981" />}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors[colorScheme].text,
                    marginLeft: 4,
                  }}
                >
                  {proposal.rating}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors[colorScheme].text,
                  marginRight: 12,
                }}
              >
                {proposal.completedJobs} jobs
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors[colorScheme].text,
                  marginRight: 12,
                }}
              >
                {proposal.successRate}%
              </Text>
              <Text style={{ fontSize: 14, color: Colors[colorScheme].text }}>
                {proposal.country}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors[colorScheme].text,
            }}
          >
            ₹{proposal.bidAmount.toLocaleString()} INR
          </Text>
          <Text style={{ fontSize: 14, color: Colors[colorScheme].text }}>
            in {proposal.deliveryTime}
          </Text>
        </View>
      </View>

      {proposal.badges.length > 0 && (
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}
        >
          {proposal.badges.map((badge, index) => (
            <Text
              key={index}
              style={{
                fontSize: 12,
                color: Colors[colorScheme].text,
                backgroundColor: Colors[colorScheme].lightBackground,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                marginRight: 8,
                marginBottom: 4,
              }}
            >
              {badge}
            </Text>
          ))}
        </View>
      )}

      <Text
        style={{
          fontSize: 14,
          color: Colors[colorScheme].text,
          lineHeight: 20,
          marginBottom: 12,
        }}
      >
        {proposal.coverLetter}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: Colors[colorScheme].text,
          marginBottom: 12,
        }}
      >
        Replies within {proposal.responseTime}
      </Text>

      <TouchableOpacity>
        <Text
          style={{
            fontSize: 14,
            color: Colors[colorScheme].text,
            fontWeight: '500',
          }}
        >
          Report Bid
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'details') {
      return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Job Stats */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors[colorScheme].background,
              marginBottom: 16,
              paddingVertical: 16,
              justifyContent: 'space-around',
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <IndianRupee size={16} color={Colors[colorScheme].text} />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].text,
                  marginBottom: 4,
                }}
              >
                {' '}
                {job?.type === 'freelance' ? 'Budget' : 'Salary'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                {job?.type === 'freelance'
                  ? formatBudget(job.budget)
                  : formatSalary(job?.salary)}
              </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Users size={16} color={Colors[colorScheme].text} />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].text,
                  marginBottom: 4,
                }}
              >
                {job?.type === 'freelance' ? 'Proposals' : 'Applications'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                {job?.type === 'freelance'
                  ? job.proposals || 0
                  : job?.applications || 0}
              </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Clock size={16} color="#8B5CF6" />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].text,
                  marginBottom: 4,
                }}
              >
                Posted
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                {formatDate(job?.postedDate)}
              </Text>
            </View>
          </View>
          {/* Job Description */}
          <View
            style={{
              backgroundColor: Colors[colorScheme].background,
              marginBottom: 16,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors[colorScheme].text,
                marginBottom: 12,
              }}
            >
              Job Description
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme].text,
                lineHeight: 24,
              }}
            >
              {job?.description}
            </Text>
          </View>
          {/* Sections */}
          {renderSection(
            'Requirements',
            job?.requirements || [],
            <CheckCircle size={20} color="#10B981" />
          )}
          {renderSection(
            'Responsibilities',
            job?.responsibilities || [],
            <Users size={20} color="#3B82F6" />
          )}
          {renderSection(
            'Benefits',
            job?.benefits || [],
            <CheckCircle size={20} color="#F59E0B" />
          )}
          {/* Skills Required */}
          {job?.skills && job.skills.length > 0 && (
            <View
              style={{
                backgroundColor: Colors[colorScheme].background,
                marginBottom: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                Skills Required
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 12,
                }}
              >
                {job.skills.map((skill, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: Colors[colorScheme].lightBackground,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors[colorScheme].text,
                        fontWeight: '500',
                      }}
                    >
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {/* Additional Info */}
          <View
            style={{
              backgroundColor: Colors[colorScheme].background,
              marginBottom: 32,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors[colorScheme].text,
                marginBottom: 12,
              }}
            >
              Additional Information
            </Text>
            <View style={{ marginTop: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors[colorScheme].lightBackground,
                }}
              >
                <Text style={{ fontSize: 14, color: Colors[colorScheme].text }}>
                  Experience Required:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: Colors[colorScheme].text,
                  }}
                >
                  {job?.experience}
                </Text>
              </View>

              {job?.type === 'freelance' && job.duration && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 14, color: Colors[colorScheme].text }}
                  >
                    Project Duration:
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: Colors[colorScheme].text,
                    }}
                  >
                    {job.duration}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* Freelance Proposal Form only when activeTab==='details' */}
          {activeTab === 'details' && job?.type === 'freelance' && (
            <>
              <View style={{ marginBottom: 16, paddingHorizontal: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: Colors[colorScheme].text,
                    marginBottom: 8,
                  }}
                >
                  Hourly Rate *
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: Colors[colorScheme].borderColor,
                    borderRadius: 8,
                    backgroundColor: Colors[colorScheme].background,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      backgroundColor: Colors[colorScheme].lightBackground,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    }}
                  >
                    $
                  </Text>
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                    }}
                    placeholder="0"
                    placeholderTextColor={Colors[colorScheme].borderColor}
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                    keyboardType="numeric"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      paddingHorizontal: 12,
                    }}
                  >
                    USD per hr.
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 16, paddingHorizontal: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: Colors[colorScheme].text,
                    marginBottom: 8,
                  }}
                >
                  Address (Only your city and country will be shown publicly)
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors[colorScheme].borderColor,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: Colors[colorScheme].text,
                    backgroundColor: Colors[colorScheme].background,
                  }}
                  placeholder="Enter your address"
                  placeholderTextColor={Colors[colorScheme].borderColor}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </>
          )}
          <View style={{ height: 100 }} /> {/* Bottom spacing */}
        </ScrollView>
      );
    } else {
      // proposals tab
      return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {proposalsLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 32,
                paddingVertical: 64,
              }}
            >
              <ActivityIndicator
                size="large"
                color={Colors[colorScheme].text}
              />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  textAlign: 'center',
                }}
              >
                Loading proposals...
              </Text>
            </View>
          ) : (
            <View
              style={{
                padding: 16,
                backgroundColor: Colors[colorScheme].background,
              }}
            >
              {proposals.map(renderProposalCard)}
              {proposals.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 32,
                    paddingVertical: 60,
                    backgroundColor: Colors[colorScheme].background,
                    borderRadius: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '600',
                      color: Colors[colorScheme].text,
                      textAlign: 'center',
                      marginBottom: 12,
                    }}
                  >
                    No proposals yet
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors[colorScheme].borderColor,
                      fontStyle: 'italic',
                      textAlign: 'center',
                    }}
                  >
                    Be the first to propose for this job.
                  </Text>
                </View>
              )}
            </View>
          )}
          <View style={{ height: 100 }} /> {/* Bottom spacing */}
        </ScrollView>
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={Colors[colorScheme].background}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: Colors[colorScheme].background,
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme].borderColor,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              borderRadius: 12,
              backgroundColor: Colors[colorScheme].lightBackground,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 22,
              marginLeft: 12,
              fontWeight: '800',
              color: Colors[colorScheme].text,
            }}
          >
            Job Details
          </Text>
          <View />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
          }}
        >
          <ActivityIndicator size="large" color={Colors[colorScheme].text} />
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              color: Colors[colorScheme].text,
              textAlign: 'center',
            }}
          >
            Loading job details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={Colors[colorScheme].background}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: Colors[colorScheme].background,
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme].borderColor,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              borderRadius: 12,
              backgroundColor: Colors[colorScheme].lightBackground,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={Colors[colorScheme].text} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 22,
              marginLeft: 12,
              fontWeight: '800',
              color: Colors[colorScheme].text,
            }}
          >
            Job Details
          </Text>
          <View />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              backgroundColor: Colors[colorScheme].errorText,
              borderRadius: 48,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <AlertCircle size={64} color={Colors[colorScheme].errorText} />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: Colors[colorScheme].text,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Job not found
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: Colors[colorScheme].text,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 24,
            }}
          >
            {error ||
              'This job may have been removed or is no longer available.'}
          </Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: Colors[colorScheme].text,
              borderRadius: 12,
            }}
            onPress={fetchJobDetails}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme].text,
                fontWeight: '600',
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors[colorScheme].background}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: Colors[colorScheme].background,
          borderBottomWidth: 1,
          borderBottomColor: Colors[colorScheme].borderColor,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            borderRadius: 12,
            backgroundColor: Colors[colorScheme].lightBackground,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 22,
            marginLeft: 12,
            fontWeight: '800',
            color: Colors[colorScheme].text,
          }}
        >
          {job.title}
        </Text>
      </View>

      {/* Job Header */}
      <View
        style={{
          flexDirection: 'row',
          padding: 20,
          backgroundColor: Colors[colorScheme].background,
          borderBottomWidth: 1,
          borderBottomColor: Colors[colorScheme].borderColor,
          borderRadius: 12,
          marginHorizontal: 16,
          marginTop: 16,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            backgroundColor: Colors[colorScheme].lightBackground,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <Building size={32} color={Colors[colorScheme].text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: Colors[colorScheme].text,
              lineHeight: 28,
              marginBottom: 4,
            }}
          >
            {job.company}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
              <MapPin size={16} color={Colors[colorScheme].text} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 14,
                  color: Colors[colorScheme].text,
                  flex: 1,
                }}
              >
                {job.location}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: gettypeColor(job.type) + '20',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: gettypeColor(job.type),
                }}
              >
                {job.type.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tabs for freelance jobs */}
      {job.type === 'freelance' && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors[colorScheme].background,
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme].borderColor,
            marginHorizontal: 16,
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 16,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === 'details'
                  ? Colors[colorScheme].text
                  : 'transparent',
            }}
            onPress={() => setActiveTab('details')}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: activeTab === 'details' ? '600' : '500',
                color:
                  activeTab === 'details'
                    ? Colors[colorScheme].text
                    : Colors[colorScheme].text,
              }}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 16,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === 'proposals'
                  ? Colors[colorScheme].text
                  : 'transparent',
            }}
            onPress={() => setActiveTab('proposals')}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: activeTab === 'proposals' ? '600' : '500',
                color:
                  activeTab === 'proposals'
                    ? Colors[colorScheme].text
                    : Colors[colorScheme].text,
              }}
            >
              Proposals
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {job.type === 'freelance' ? (
        renderTabContent()
      ) : (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: Colors[colorScheme].background,
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Job Stats */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors[colorScheme].background,
              marginBottom: 16,
              paddingVertical: 16,
              justifyContent: 'space-around',
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <IndianRupee size={16} color={Colors[colorScheme].text} />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].text,
                  marginBottom: 4,
                }}
              >
                Salary
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                {formatSalary(job.salary)}
              </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Users size={16} color={Colors[colorScheme].text} />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].text,
                  marginBottom: 4,
                }}
              >
                Applications
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                {job.applications}
              </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Clock size={16} color="#8B5CF6" />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].text,
                  marginBottom: 4,
                }}
              >
                Posted
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                {formatDate(job.postedDate)}
              </Text>
            </View>
          </View>

          {/* Job Description */}
          <View
            style={{
              backgroundColor: Colors[colorScheme].background,
              marginBottom: 16,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors[colorScheme].text,
                marginBottom: 12,
              }}
            >
              Job Description
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme].text,
                lineHeight: 24,
              }}
            >
              {job.description}
            </Text>
          </View>

          {/* Sections */}
          {renderSection(
            'Requirements',
            job.requirements,
            <CheckCircle size={20} color="#10B981" />
          )}
          {renderSection(
            'Responsibilities',
            job.responsibilities,
            <Users size={20} color="#3B82F6" />
          )}
          {renderSection(
            'Benefits',
            job.benefits,
            <CheckCircle size={20} color="#F59E0B" />
          )}

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <View
              style={{
                backgroundColor: Colors[colorScheme].background,
                marginBottom: 16,
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                }}
              >
                Skills Required
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 12,
                }}
              >
                {job.skills.map((skill, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: Colors[colorScheme].lightBackground,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors[colorScheme].text,
                        fontWeight: '500',
                      }}
                    >
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Additional Info */}
          <View
            style={{
              backgroundColor: Colors[colorScheme].background,
              marginBottom: 32,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors[colorScheme].text,
                marginBottom: 12,
              }}
            >
              Additional Information
            </Text>
            <View style={{ marginTop: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors[colorScheme].lightBackground,
                }}
              >
                <Text style={{ fontSize: 14, color: Colors[colorScheme].text }}>
                  Experience Required:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: Colors[colorScheme].text,
                  }}
                >
                  {job.experience}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Apply Button */}
      <View
        style={{
          backgroundColor: Colors[colorScheme].background,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme].borderColor,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            backgroundColor: applying
              ? Colors[colorScheme].text
              : Colors[colorScheme].text,
            borderRadius: 12,
            paddingVertical: 16,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: Colors[colorScheme].text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: applying ? 0 : 0.3,
            shadowRadius: 8,
            elevation: applying ? 0 : 8,
          }}
          onPress={handleApply}
          disabled={applying}
        >
          {applying ? (
            <>
              <ActivityIndicator
                size="small"
                color={Colors[colorScheme].text}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: Colors[colorScheme].darkText,
                  marginLeft: 8,
                }}
              >
                {job.type === 'freelance' ? 'Submitting...' : 'Applying...'}
              </Text>
            </>
          ) : activeTab === 'proposals' ? (
            ' '
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: Colors[colorScheme].darkText,
              }}
            >
              {job.type === 'freelance'
                ? 'Submit Proposal'
                : 'Apply for this Job'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
