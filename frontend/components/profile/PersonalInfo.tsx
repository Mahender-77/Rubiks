import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface PersonalInfoProps {
  isEditing: boolean;
}

export function PersonalInfo({ isEditing }: PersonalInfoProps) {
  const personalData = {
    about: 'Passionate frontend developer with 5+ years of experience building scalable web applications. Specializing in React, TypeScript, and modern web technologies.',
    experience: '5+ years',
    education: 'BS Computer Science, Stanford University',
    languages: 'English (Native), Spanish (Fluent), French (Conversational)',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>About</Text>
        {isEditing ? (
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            defaultValue={personalData.about}
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.fieldValue}>{personalData.about}</Text>
        )}
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Experience</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              defaultValue={personalData.experience}
            />
          ) : (
            <Text style={styles.fieldValue}>{personalData.experience}</Text>
          )}
        </View>
        
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Education</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              defaultValue={personalData.education}
            />
          ) : (
            <Text style={styles.fieldValue}>{personalData.education}</Text>
          )}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Languages</Text>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            defaultValue={personalData.languages}
          />
        ) : (
          <Text style={styles.fieldValue}>{personalData.languages}</Text>
        )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
  },
});