import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Calendar } from 'lucide-react-native';

interface ExperienceSectionProps {
  isEditing: boolean;
}

export function ExperienceSection({ isEditing }: ExperienceSectionProps) {
  const experiences = [
    {
      company: 'TechCorp Inc.',
      position: 'Senior Frontend Developer',
      duration: '2022 - Present',
      description: 'Lead development of React applications, mentored junior developers, and implemented modern CI/CD practices.',
    },
    {
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      duration: '2020 - 2022',
      description: 'Built responsive web applications using React and TypeScript, collaborated with design team.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Work Experience</Text>
        {isEditing && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#3B82F6" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {experiences.map((exp, index) => (
        <View key={index} style={styles.experienceCard}>
          <View style={styles.experienceHeader}>
            <View style={styles.experienceInfo}>
              <Text style={styles.position}>{exp.position}</Text>
              <Text style={styles.company}>{exp.company}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.duration}>{exp.duration}</Text>
            </View>
          </View>
          <Text style={styles.description}>{exp.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  addText: {
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 14,
  },
  experienceCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    paddingLeft: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  experienceInfo: {
    flex: 1,
  },
  position: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});