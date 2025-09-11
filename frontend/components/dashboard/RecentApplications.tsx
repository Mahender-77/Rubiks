import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
} from 'lucide-react-native';
import { JobApplication } from '../../types/job';
import Colors from '../../constants/Colors';

export function RecentApplications() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  // Mock application data - in real app, this would come from API
  const recentApplications: JobApplication[] = [
    {
      id: '1',
      jobId: '1',
      userId: 'user1',
      status: 'reviewing',
      appliedDate: '2024-01-15',
      coverLetter: 'I am excited to apply for this position...',
      job: {
        id: '1',
        title: 'Senior React Native Developer',
        company: 'TechCorp Inc.',
        location: 'New York, NY',
        type: 'full-time',
        salary: { min: 80000, max: 120000, currency: 'USD' },
        description:
          'We are looking for an experienced React Native developer...',
        requirements: ['React Native', 'TypeScript', '3+ years experience'],
        responsibilities: [
          'Develop mobile apps',
          'Code review',
          'Mentor junior developers',
        ],
        benefits: ['Health insurance', 'Remote work', 'Stock options'],
        skills: [
          'React Native',
          'TypeScript',
          'JavaScript',
          'Mobile Development',
        ],
        experience: '3-5 years',
        education: "Bachelor's degree",
        postedDate: '2024-01-15',
        isActive: true,
        applications: 45,
        views: 120,
      },
    },
    {
      id: '2',
      jobId: '2',
      userId: 'user1',
      status: 'shortlisted',
      appliedDate: '2024-01-14',
      coverLetter: 'I believe my experience aligns perfectly...',
      job: {
        id: '2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        type: 'full-time',
        salary: { min: 90000, max: 140000, currency: 'USD' },
        description: 'Join our fast-growing startup...',
        requirements: ['Node.js', 'React', 'MongoDB', '2+ years experience'],
        responsibilities: [
          'Full stack development',
          'Database design',
          'API development',
        ],
        benefits: ['Flexible hours', 'Unlimited PTO', 'Learning budget'],
        skills: ['Node.js', 'React', 'MongoDB', 'JavaScript'],
        experience: '2-4 years',
        education: "Bachelor's degree",
        postedDate: '2024-01-14',
        isActive: true,
        applications: 32,
        views: 89,
      },
    },
    {
      id: '3',
      jobId: '3',
      userId: 'user1',
      status: 'rejected',
      appliedDate: '2024-01-13',
      coverLetter: 'I am passionate about design...',
      job: {
        id: '3',
        title: 'UI/UX Designer',
        company: 'Design Studio Pro',
        location: 'Remote',
        type: 'contract',
        salary: { min: 60000, max: 90000, currency: 'USD' },
        description: 'Create beautiful and intuitive user experiences...',
        requirements: [
          'Figma',
          'Adobe Creative Suite',
          'Portfolio',
          '2+ years experience',
        ],
        responsibilities: ['Design interfaces', 'User research', 'Prototyping'],
        benefits: ['Remote work', 'Flexible schedule', 'Creative freedom'],
        skills: [
          'Figma',
          'Adobe Creative Suite',
          'UI/UX Design',
          'Prototyping',
        ],
        experience: '2-3 years',
        education: 'Design degree preferred',
        postedDate: '2024-01-13',
        isActive: true,
        applications: 28,
        views: 76,
      },
    },
  ];

  const getStatusIcon = (status: string) => {
    const colorMap = {
      applied: '#3B82F6',
      reviewing: '#F59E0B',
      shortlisted: '#10B981',
      interview: '#8B5CF6',
      rejected: '#EF4444',
      accepted: '#10B981',
    };
    const iconColor = colorMap[status] || '#6B7280';

    switch (status) {
      case 'applied':
        return <Clock size={16} color={iconColor} />;
      case 'reviewing':
        return <AlertCircle size={16} color={iconColor} />;
      case 'shortlisted':
        return <CheckCircle size={16} color={iconColor} />;
      case 'interview':
        return <AlertCircle size={16} color={iconColor} />;
      case 'rejected':
        return <XCircle size={16} color={iconColor} />;
      case 'accepted':
        return <CheckCircle size={16} color={iconColor} />;
      default:
        return <Clock size={16} color={iconColor} />;
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      applied: '#3B82F6',
      reviewing: '#F59E0B',
      shortlisted: '#10B981',
      interview: '#8B5CF6',
      rejected: '#EF4444',
      accepted: '#10B981',
    };
    return colorMap[status] || '#6B7280';
  };

  const getStatusText = (status: string) => {
    const textMap = {
      applied: 'Applied',
      reviewing: 'Under Review',
      shortlisted: 'Shortlisted',
      interview: 'Interview',
      rejected: 'Not Selected',
      accepted: 'Accepted',
    };
    return textMap[status] || 'Applied';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Recent Applications
        </Text>
        <TouchableOpacity onPress={() => router.push('/applications')}>
          <Text
            style={[styles.seeAllText, { color: Colors[colorScheme].text }]}
          >
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.applicationsList}>
        {recentApplications.map((application) => (
          <TouchableOpacity
            key={application.id}
            style={[
              styles.applicationCard,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: Colors[colorScheme].borderColor,
              },
            ]}
            onPress={() => router.push(`/applications/${application.id}`)}
          >
            <View style={styles.applicationHeader}>
              <View style={styles.companyInfo}>
                <View
                  style={[
                    styles.companyLogo,
                    {
                      backgroundColor: Colors[colorScheme].text,
                    },
                  ]}
                >
                  <Building size={16} color={Colors[colorScheme].darkText} />
                </View>
                <View style={styles.jobInfo}>
                  <Text
                    style={[
                      styles.jobTitle,
                      { color: Colors[colorScheme].text },
                    ]}
                  >
                    {application.job.title}
                  </Text>
                  <Text
                    style={[
                      styles.companyName,
                      {
                        color: Colors[colorScheme].text,
                      },
                    ]}
                  >
                    {application.job.company}
                  </Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                {getStatusIcon(application.status)}
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(application.status) },
                  ]}
                >
                  {getStatusText(application.status)}
                </Text>
              </View>
            </View>

            <View style={styles.applicationFooter}>
              <Text
                style={[
                  styles.appliedDate,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Applied {formatDate(application.appliedDate)}
              </Text>
              <TouchableOpacity
                style={[
                  styles.viewButton,
                  {
                    backgroundColor: Colors[colorScheme].text,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.viewButtonText,
                    { color: Colors[colorScheme].darkText },
                  ]}
                >
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applicationsList: {
    paddingHorizontal: 20,
  },
  applicationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  applicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedDate: {
    fontSize: 12,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
