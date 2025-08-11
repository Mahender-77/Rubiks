import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, X } from 'lucide-react-native';

interface SkillsSectionProps {
  isEditing: boolean;
}

export function SkillsSection({ isEditing }: SkillsSectionProps) {
  const skills = [
    { name: 'React', level: 'Expert' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'GraphQL', level: 'Intermediate' },
    { name: 'AWS', level: 'Beginner' },
    { name: 'Python', level: 'Intermediate' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return '#10B981';
      case 'Advanced':
        return '#3B82F6';
      case 'Intermediate':
        return '#F97316';
      case 'Beginner':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Skills & Technologies</Text>
        {isEditing && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={16} color="#3B82F6" />
            <Text style={styles.addText}>Add Skill</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.skillsGrid}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillCard}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={styles.skillLevel}>
                <View 
                  style={[
                    styles.levelDot, 
                    { backgroundColor: getLevelColor(skill.level) }
                  ]} 
                />
                <Text style={[styles.levelText, { color: getLevelColor(skill.level) }]}>
                  {skill.level}
                </Text>
              </View>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.removeButton}>
                <X size={16} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
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
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillInfo: {
    alignItems: 'center',
  },
  skillName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  skillLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
});