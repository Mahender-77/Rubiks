import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Briefcase, MapPin, DollarSign, Clock, Building } from 'lucide-react-native';
import {Job} from "../../types/job"
export function JobSuggestions() {
  const router = useRouter();

  // Mock job data - in real app, this would come from API
  const recommendedJobs: Job[] = [
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
  ];

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended for You</Text>
        <TouchableOpacity onPress={() => router.push('/jobs')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.jobsContainer}
      >
        {recommendedJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => router.push(`/jobs/${job.id}`)}
          >
            <View style={styles.jobHeader}>
              <View style={styles.companyInfo}>
                <View style={styles.companyLogo}>
                  <Building size={20} color="#6B7280" />
                </View>
                <View style={styles.companyText}>
                  <Text style={styles.companyName}>{job.company}</Text>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                </View>
              </View>
              <View style={[styles.jobType, { backgroundColor: getJobTypeColor(job.type) + '20' }]}>
                <Text style={[styles.jobTypeText, { color: getJobTypeColor(job.type) }]}>
                  {job.type.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.jobDetails}>
              <View style={styles.detailItem}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.detailText}>{job.location}</Text>
              </View>
              
              {job.salary && (
                <View style={styles.detailItem}>
                  <DollarSign size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{formatSalary(job.salary)}</Text>
                </View>
              )}

              <View style={styles.detailItem}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.detailText}>{formatDate(job.postedDate)}</Text>
              </View>
            </View>

            <View style={styles.jobFooter}>
              <Text style={styles.applicationsText}>
                {job.applications} applications
              </Text>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  jobsContainer: {
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 280,
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
  companyText: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
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
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});