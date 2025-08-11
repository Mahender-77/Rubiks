import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Download, Eye, MoveVertical as MoreVertical } from 'lucide-react-native';

export function ResumeVersions() {
  const versions = [
    {
      name: 'Frontend Developer Resume',
      lastModified: '2 days ago',
      template: 'Modern Professional',
      downloads: 12,
      isActive: true,
    },
    {
      name: 'Full Stack Developer Resume',
      lastModified: '1 week ago',
      template: 'Minimalist Tech',
      downloads: 8,
      isActive: false,
    },
    {
      name: 'Product Manager Resume',
      lastModified: '2 weeks ago',
      template: 'Executive Style',
      downloads: 5,
      isActive: false,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resume Versions</Text>
      <Text style={styles.subtitle}>
        Manage different versions of your resume for various job applications
      </Text>
      
      <View style={styles.versionsList}>
        {versions.map((version, index) => (
          <View key={index} style={styles.versionCard}>
            <View style={styles.versionInfo}>
              <View style={styles.versionHeader}>
                <Text style={styles.versionName}>{version.name}</Text>
                {version.isActive && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.templateName}>{version.template}</Text>
              
              <View style={styles.versionMeta}>
                <View style={styles.metaItem}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.metaText}>Modified {version.lastModified}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Download size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{version.downloads} downloads</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.versionActions}>
              <TouchableOpacity style={styles.actionIcon}>
                <Eye size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <Download size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <MoreVertical size={20} color="#6B7280" />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  versionsList: {
    gap: 16,
  },
  versionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  versionInfo: {
    flex: 1,
  },
  versionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  versionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  templateName: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 12,
  },
  versionMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  versionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    padding: 8,
  },
});