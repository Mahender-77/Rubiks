import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { User, Briefcase, GraduationCap, FileText, Award } from 'lucide-react-native';

export function ProfileStrength() {
  const { user } = useAuth();
  const router = useRouter();

  const profileCompletion = user?.profile?.profileCompletion || 0;
  const missingSections = getMissingSections(user);

  const getProgressColor = () => {
    if (profileCompletion >= 80) return '#10B981';
    if (profileCompletion >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getProgressText = () => {
    if (profileCompletion >= 80) return 'Excellent';
    if (profileCompletion >= 60) return 'Good';
    if (profileCompletion >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile Strength</Text>
        <Text style={styles.percentage}>{profileCompletion}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${profileCompletion}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: getProgressColor() }]}>
          {getProgressText()}
        </Text>
      </View>

      {missingSections.length > 0 && (
        <View style={styles.missingSection}>
          <Text style={styles.missingTitle}>Complete your profile:</Text>
          {missingSections.map((section, index) => (
            <TouchableOpacity
              key={index}
              style={styles.missingItem}
              onPress={() => router.push('/profile')}
            >
              {section.icon}
              <Text style={styles.missingText}>{section.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function getMissingSections(user: any) {
type Section = {
  title: string;
  icon: React.ReactNode;
};
  const sections: Section[] = [];

  if (!user?.profile?.headline) {
    sections.push({
      title: 'Add a professional headline',
      icon: <User size={16} color="#6B7280" />,
    });
  }

  if (!user?.profile?.experience || user.profile.experience.length === 0) {
    sections.push({
      title: 'Add work experience',
      icon: <Briefcase size={16} color="#6B7280" />,
    });
  }

  if (!user?.profile?.education || user.profile.education.length === 0) {
    sections.push({
      title: 'Add education',
      icon: <GraduationCap size={16} color="#6B7280" />,
    });
  }

  if (!user?.profile?.skills || user.profile.skills.length === 0) {
    sections.push({
      title: 'Add skills',
      icon: <Award size={16} color="#6B7280" />,
    });
  }

  if (!user?.profile?.resume) {
    sections.push({
      title: 'Create your resume',
      icon: <FileText size={16} color="#6B7280" />,
    });
  }

  return sections.slice(0, 3); // Show max 3 missing sections
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  percentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  missingSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  missingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  missingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  missingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});
