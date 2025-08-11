import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Trash2, ExternalLink } from 'lucide-react-native';

export function SavedJobs() {
  const savedJobs = [
    {
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'Remote',
      type: 'Full-time',
      salary: '$85k - $110k',
      saved: '3 days ago',
      deadline: '5 days left',
      logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    },
    {
      title: 'Backend Developer',
      company: 'DataTech',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100k - $130k',
      saved: '1 week ago',
      deadline: '2 weeks left',
      logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Jobs ({savedJobs.length})</Text>
      
      <View style={styles.jobsList}>
        {savedJobs.map((job, index) => (
          <View key={index} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Image source={{ uri: job.logo }} style={styles.companyLogo} />
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>
              </View>
              <TouchableOpacity style={styles.removeButton}>
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.jobDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{job.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{job.type}</Text>
                </View>
              </View>
              
              <Text style={styles.salaryText}>{job.salary}</Text>
            </View>
            
            <View style={styles.jobFooter}>
              <View style={styles.timeInfo}>
                <Text style={styles.savedText}>Saved {job.saved}</Text>
                <Text style={styles.deadlineText}>Application {job.deadline}</Text>
              </View>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyText}>Apply</Text>
                <ExternalLink size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  jobsList: {
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
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
  },
  removeButton: {
    padding: 8,
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
  salaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  timeInfo: {
    flex: 1,
  },
  savedText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  deadlineText: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '500',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 4,
  },
});