import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  FileText,
  Plus,
  Edit,
  Download,
  Share,
  Eye,
  Star,
  CheckCircle,
} from 'lucide-react-native';
import { ResumeTemplate } from '../../types';

export default function ResumeScreen() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional');

  // Mock resume templates
  const templates: ResumeTemplate[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and traditional design',
      preview: 'Professional template preview',
      category: 'professional',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary and sleek design',
      preview: 'Modern template preview',
      category: 'modern',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Unique and artistic design',
      preview: 'Creative template preview',
      category: 'creative',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and clean design',
      preview: 'Minimal template preview',
      category: 'minimal',
    },
  ];

  // Mock resume data
  const resumeData = {
    title: 'My Professional Resume',
    lastUpdated: '2024-01-15',
    sections: [
      { name: 'Personal Info', completed: true },
      { name: 'Summary', completed: true },
      { name: 'Experience', completed: true },
      { name: 'Education', completed: false },
      { name: 'Skills', completed: true },
      { name: 'Projects', completed: false },
    ],
  };

  const getCompletionPercentage = () => {
    const completed = resumeData.sections.filter(section => section.completed).length;
    return Math.round((completed / resumeData.sections.length) * 100);
  };

  const renderTemplateCard = (template: ResumeTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={[
        styles.templateCard,
        selectedTemplate === template.id && styles.selectedTemplate
      ]}
      onPress={() => setSelectedTemplate(template.id)}
    >
      <View style={styles.templatePreview}>
        <FileText size={32} color={selectedTemplate === template.id ? '#3B82F6' : '#6B7280'} />
      </View>
      <Text style={[
        styles.templateName,
        selectedTemplate === template.id && styles.selectedTemplateName
      ]}>
        {template.name}
      </Text>
      <Text style={styles.templateDescription}>{template.description}</Text>
      {selectedTemplate === template.id && (
        <View style={styles.selectedIndicator}>
          <CheckCircle size={16} color="#3B82F6" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSectionItem = (section: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.sectionItem}
      onPress={() => router.push(`/resume/edit/${section.name.toLowerCase()}`)}
    >
      <View style={styles.sectionInfo}>
        <Text style={styles.sectionName}>{section.name}</Text>
        <View style={styles.sectionStatus}>
          {section.completed ? (
            <CheckCircle size={16} color="#10B981" />
          ) : (
            <View style={styles.incompleteDot} />
          )}
          <Text style={[
            styles.sectionStatusText,
            { color: section.completed ? '#10B981' : '#6B7280' }
          ]}>
            {section.completed ? 'Completed' : 'Incomplete'}
          </Text>
        </View>
      </View>
      <Edit size={16} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Resume Builder</Text>
          <Text style={styles.subtitle}>Create a professional resume</Text>
        </View>
        <TouchableOpacity style={styles.createButton}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Current Resume */}
      <View style={styles.currentResume}>
        <View style={styles.resumeHeader}>
          <View style={styles.resumeInfo}>
            <Text style={styles.resumeTitle}>{resumeData.title}</Text>
            <Text style={styles.resumeDate}>
              Last updated: {new Date(resumeData.lastUpdated).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.resumeActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Eye size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Download size={16} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Completion</Text>
            <Text style={styles.progressPercentage}>{getCompletionPercentage()}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getCompletionPercentage()}%` }
              ]} 
            />
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Resume Sections</Text>
          {resumeData.sections.map(renderSectionItem)}
        </View>
      </View>

      {/* Templates */}
      <View style={styles.templatesContainer}>
        <Text style={styles.templatesTitle}>Choose Template</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templatesList}
        >
          {templates.map(renderTemplateCard)}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <FileText size={20} color="#3B82F6" />
          <Text style={styles.quickActionText}>Import Resume</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Star size={20} color="#F59E0B" />
          <Text style={styles.quickActionText}>AI Suggestions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Download size={20} color="#10B981" />
          <Text style={styles.quickActionText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
  },
  currentResume: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
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
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resumeDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  resumeActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  sectionsContainer: {
    marginBottom: 20,
  },
  sectionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  sectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionStatusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  incompleteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  templatesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  templatesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  templatesList: {
    paddingRight: 20,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedTemplate: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  templatePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedTemplateName: {
    color: '#3B82F6',
  },
  templateDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickActionButton: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    fontWeight: '500',
  },
});