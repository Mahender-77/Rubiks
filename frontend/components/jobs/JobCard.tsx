import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Bookmark, ExternalLink, DollarSign } from 'lucide-react-native';

export function JobCard() {
  const jobs = [
    {
      title: 'Senior React Developer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$130k - $160k',
      posted: '2 days ago',
      match: '95%',
      logo: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg',
      tags: ['React', 'TypeScript', 'Remote OK'],
    },
    {
      title: 'Frontend Engineer',
      company: 'InnovateCorp',
      location: 'Remote',
      type: 'Full-time',
      salary: '$110k - $140k',
      posted: '1 day ago',
      match: '88%',
      logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      tags: ['Vue.js', 'Node.js', 'GraphQL'],
    },
    {
      title: 'Product Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$90k - $120k',
      posted: '3 days ago',
      match: '82%',
      logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      tags: ['Figma', 'UI/UX', 'Design Systems'],
    },
  ];

  return (
    <View style={styles.container}>
      {jobs.map((job, index) => (
        <TouchableOpacity key={index} style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <Image source={{ uri: job.logo }} style={styles.companyLogo} />
            <View style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
            </View>
            <View style={styles.matchContainer}>
              <Text style={styles.matchText}>{job.match}</Text>
              <Text style={styles.matchLabel}>match</Text>
            </View>
          </View>
          
          <View style={styles.jobDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{job.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailText}>{job.type}</Text>
              </View>
            </View>
            
            <View style={styles.salaryContainer}>
              <DollarSign size={16} color="#10B981" />
              <Text style={styles.salaryText}>{job.salary}</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {job.tags.map((tag, tagIndex) => (
              <View key={tagIndex} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.jobFooter}>
            <Text style={styles.postedText}>Posted {job.posted}</Text>
            <View style={styles.jobActions}>
              <TouchableOpacity style={styles.saveButton}>
                <Bookmark size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyText}>Apply Now</Text>
                <ExternalLink size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
  },
  matchContainer: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  jobDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  jobActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveButton: {
    padding: 8,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },
});