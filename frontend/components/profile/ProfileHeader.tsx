import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera, MapPin, Mail, Phone } from 'lucide-react-native';

interface ProfileHeaderProps {
  isEditing: boolean;
}

export function ProfileHeader({ isEditing }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' }}
          style={styles.avatar}
        />
        {isEditing && (
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.name}>Sarah Johnson</Text>
        <Text style={styles.title}>Senior Frontend Developer</Text>
        
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.contactText}>San Francisco, CA</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={16} color="#6B7280" />
            <Text style={styles.contactText}>sarah.johnson@email.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={16} color="#6B7280" />
            <Text style={styles.contactText}>+1 (555) 123-4567</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});