import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Download, CreditCard as Edit, Share } from 'lucide-react-native';

export function ResumePreview() {
  return (
    <View style={styles.container}>
      <View style={styles.previewHeader}>
        <Text style={styles.title}>Resume Preview</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.downloadText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.previewContainer}>
        <View style={styles.resumePreview}>
          <View style={styles.resumeHeader}>
            <Text style={styles.resumeName}>Sarah Johnson</Text>
            <Text style={styles.resumeTitle}>Senior Frontend Developer</Text>
            <Text style={styles.resumeContact}>
              sarah.johnson@email.com • +1 (555) 123-4567 • San Francisco, CA
            </Text>
          </View>
          
          <View style={styles.resumeSection}>
            <Text style={styles.resumeSectionTitle}>EXPERIENCE</Text>
            <View style={styles.resumeItem}>
              <Text style={styles.resumeItemTitle}>Senior Frontend Developer</Text>
              <Text style={styles.resumeItemSubtitle}>TechCorp Inc. • 2022 - Present</Text>
              <Text style={styles.resumeItemDescription}>
                Lead development of React applications, mentored junior developers...
              </Text>
            </View>
          </View>
          
          <View style={styles.resumeSection}>
            <Text style={styles.resumeSectionTitle}>SKILLS</Text>
            <Text style={styles.resumeSkills}>
              React • TypeScript • Node.js • GraphQL • AWS • Python
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  resumePreview: {
    backgroundColor: '#FAFAFA',
    padding: 24,
    borderRadius: 8,
    minHeight: 400,
  },
  resumeHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
    marginBottom: 20,
  },
  resumeName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  resumeTitle: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 8,
  },
  resumeContact: {
    fontSize: 12,
    color: '#6B7280',
  },
  resumeSection: {
    marginBottom: 20,
  },
  resumeSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 1,
    marginBottom: 12,
  },
  resumeItem: {
    marginBottom: 12,
  },
  resumeItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  resumeItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  resumeItemDescription: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
  resumeSkills: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
});