import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Bookmark,
  Share,
} from 'lucide-react-native';
import { Job } from '../../types';

export default function JobsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Mock job data - in real app, this would come from API
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior React Native Developer',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 80000, max: 120000, currency: 'USD' },
      description: 'We are looking for an experienced React Native developer to join our mobile team...',
      requirements: ['React Native', 'TypeScript', '3+ years experience'],
      responsibilities: ['Develop mobile apps', 'Code review', 'Mentor junior developers'],
      benefits: ['Health insurance', 'Remote work', 'Stock options'],
      skills: ['React Native', 'TypeScript', 'JavaScript', 'Mobile Development'],
      experience: '3-5 years',
      education: 'Bachelor\'s degree',
      postedDate: '2024-01-15',
      isActive: true,
      applications: 45,
      views: 120,
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 90000, max: 140000, currency: 'USD' },
      description: 'Join our fast-growing startup and help build the next big thing...',
      requirements: ['Node.js', 'React', 'MongoDB', '2+ years experience'],
      responsibilities: ['Full stack development', 'Database design', 'API development'],
      benefits: ['Flexible hours', 'Unlimited PTO', 'Learning budget'],
      skills: ['Node.js', 'React', 'MongoDB', 'JavaScript'],
      experience: '2-4 years',
      education: 'Bachelor\'s degree',
      postedDate: '2024-01-14',
      isActive: true,
      applications: 32,
      views: 89,
    },
    {
      id: '3',
      title: 'UI/UX Designer',
      company: 'Design Studio Pro',
      location: 'Remote',
      type: 'contract',
      salary: { min: 60000, max: 90000, currency: 'USD' },
      description: 'Create beautiful and intuitive user experiences for web and mobile applications...',
      requirements: ['Figma', 'Adobe Creative Suite', 'Portfolio', '2+ years experience'],
      responsibilities: ['Design interfaces', 'User research', 'Prototyping'],
      benefits: ['Remote work', 'Flexible schedule', 'Creative freedom'],
      skills: ['Figma', 'Adobe Creative Suite', 'UI/UX Design', 'Prototyping'],
      experience: '2-3 years',
      education: 'Design degree preferred',
      postedDate: '2024-01-13',
      isActive: true,
      applications: 28,
      views: 76,
    },
    {
      id: '4',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Austin, TX',
      type: 'full-time',
      salary: { min: 100000, max: 150010, currency: 'USD' },
      description: 'Lead product strategy and development for our flagship products...',
      requirements: ['Product management', 'Agile methodology', '5+ years experience'],
      responsibilities: ['Product strategy', 'Team leadership', 'Stakeholder management'],
      benefits: ['Competitive salary', 'Health benefits', 'Stock options'],
      skills: ['Product Management', 'Agile', 'Leadership', 'Analytics'],
      experience: '5-7 years',
      education: 'MBA preferred',
      postedDate: '2024-01-12',
      isActive: true,
      applications: 56,
      views: 145,
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'Cloud Solutions',
      location: 'Seattle, WA',
      type: 'full-time',
      salary: { min: 85001, max: 130000, currency: 'USD' },
      description: 'Build and maintain our cloud infrastructure and deployment pipelines...',
      requirements: ['AWS/Azure', 'Docker', 'Kubernetes', '3+ years experience'],
      responsibilities: ['Infrastructure management', 'CI/CD pipelines', 'Monitoring'],
      benefits: ['Remote work', 'Learning budget', 'Health insurance'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
      experience: '3-5 years',
      education: 'Computer Science degree',
      postedDate: '2024-01-11',
      isActive: true,
      applications: 38,
      views: 98,
    },
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry', 'Mid-level', 'Senior', 'Lead', 'Executive'];

  const formatSalary = (salary: any) => {
    if (!salary) return 'Salary not specified';
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
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

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return '#10B981';
      case 'part-time': return '#3B82F6';
      case 'contract': return '#F59E0B';
      case 'internship': return '#8B5CF6';
      case 'remote': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => router.push(`/jobs/${item.id}`)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.companyInfo}>
          <View style={styles.companyLogo}>
            <Building size={20} color="#6B7280" />
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.companyName}>{item.company}</Text>
          </View>
        </View>
        <View style={[styles.jobType, { backgroundColor: getJobTypeColor(item.type) + '20' }]}>
          <Text style={[styles.jobTypeText, { color: getJobTypeColor(item.type) }]}>
            {item.type.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          {item.salary && (
            <View style={styles.detailItem}>
              <DollarSign size={14} color="#6B7280" />
              <Text style={styles.detailText}>{formatSalary(item.salary)}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.detailText}>{formatDate(item.postedDate)}</Text>
          </View>
          
          <Text style={styles.applicationsText}>
            {item.applications} applications
          </Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.skillsContainer}>
          {item.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies, or keywords"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {jobTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedFilters.includes(type) && styles.filterChipActive
            ]}
            onPress={() => {
              if (selectedFilters.includes(type)) {
                setSelectedFilters(selectedFilters.filter(f => f !== type));
              } else {
                setSelectedFilters([...selectedFilters, type]);
              }
            }}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilters.includes(type) && styles.filterChipTextActive
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Job List */}
      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        style={styles.jobsList}
        contentContainerStyle={styles.jobsContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  jobsList: {
    flex: 1,
  },
  jobsContent: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
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
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
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
    color: '#111827',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  applicationsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  skillText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});