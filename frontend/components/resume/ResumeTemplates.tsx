import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export function ResumeTemplates() {
  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      preview: 'https://images.pexels.com/photos/3652097/pexels-photo-3652097.jpeg',
      category: 'Professional',
    },
    {
      id: 2,
      name: 'Creative Designer',
      preview: 'https://images.pexels.com/photos/3652921/pexels-photo-3652921.jpeg',
      category: 'Creative',
    },
    {
      id: 3,
      name: 'Minimalist Tech',
      preview: 'https://images.pexels.com/photos/3653849/pexels-photo-3653849.jpeg',
      category: 'Tech',
    },
    {
      id: 4,
      name: 'Executive Style',
      preview: 'https://images.pexels.com/photos/3654001/pexels-photo-3654001.jpeg',
      category: 'Executive',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Template</Text>
      <Text style={styles.subtitle}>
        Select a professional template that matches your industry
      </Text>
      
      <View style={styles.templatesGrid}>
        {templates.map((template) => (
          <TouchableOpacity key={template.id} style={styles.templateCard}>
            <Image source={{ uri: template.preview }} style={styles.templatePreview} />
            <View style={styles.templateInfo}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateCategory}>{template.category}</Text>
            </View>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectText}>Use Template</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
  templatesGrid: {
    gap: 20,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  templatePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  templateInfo: {
    marginBottom: 16,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});