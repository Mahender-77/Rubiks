import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';

import { useRouter } from 'expo-router';
import {
  User,
  Edit,
  Camera,
  Plus,
  Briefcase,
  GraduationCap,
  Award,
  LogOut,
  X,
  Save,
  Trash2,
  CheckCircle,
  Circle,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ResumeModal from '../../../components/ResumeModel';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout, updateAvatar, updateProfile, updateContact } = useAuth();
  const router = useRouter();

  // Resume Modal State
  const [showResume, setShowResume] = useState(false);

  // Profile Information State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    headline: user?.profile?.headline || '',
    location: user?.profile?.location || '',
    url: user?.profile?.url || ''
  });

  // About Section State
  const [isAddingAbout, setIsAddingAbout] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(user?.profile?.bio || '');

  // Experience Section State
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [experienceDraft, setExperienceDraft] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Education Section State
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [educationDraft, setEducationDraft] = useState({
    degree: '',
    institution: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: ''
  });

  // Skills Section State
  const [isAddingSkills, setIsAddingSkills] = useState(false);
  const [skillsDraft, setSkillsDraft] = useState('');

  // Calculate Profile Strength
  const calculateProfileStrength = () => {
    let completedSections = 0;
    const totalSections = 7;

    // Check each section
    if (user?.profile?.avatar) completedSections += 1;
    if (user?.name && user?.email && user?.phone) completedSections += 1;
    if (user?.profile?.headline) completedSections += 1;
    if (user?.profile?.bio) completedSections += 1;
    if (user?.profile?.experience && user.profile.experience.length > 0) completedSections += 1;
    if (user?.profile?.education && user.profile.education.length > 0) completedSections += 1;
    if (user?.profile?.skills && user.profile.skills.length > 0) completedSections += 1;

    return Math.round((completedSections / totalSections) * 100);
  };

  const profileStrength = calculateProfileStrength();

  // Helper to check if profile is complete for resume preview
  const isProfileComplete =
    !!user?.name &&
    !!user?.email &&
    !!user?.phone &&
    !!user?.profile?.headline &&
    !!user?.profile?.location &&
    !!user?.profile?.bio &&
    user?.profile?.experience?.length > 0 &&
    user?.profile?.education?.length > 0 &&
    user?.profile?.skills?.length > 0;

  // Image handling functions
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const resp = await updateAvatar(base64Image);
      if (resp.success) {
        Alert.alert('Success', 'Profile photo updated!');
      } else {
        Alert.alert('Error', resp.message || 'Failed to update avatar');
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const resp = await updateAvatar(base64Image);
      if (resp.success) {
        Alert.alert('Success', 'Profile photo updated!');
      } else {
        Alert.alert('Error', resp.message || 'Failed to update avatar');
      }
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
      ]
    );
  };

  // Delete functions
  const deleteExperience = async (index) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedExperience = [...(user?.profile?.experience || [])];
            updatedExperience.splice(index, 1);
            const resp = await updateProfile({ experience: updatedExperience });
            if (resp.success) {
              Alert.alert('Success', 'Experience deleted');
            } else {
              Alert.alert('Error', resp.message || 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  const deleteEducation = async (index) => {
    Alert.alert(
      'Delete Education',
      'Are you sure you want to delete this education?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedEducation = [...(user?.profile?.education || [])];
            updatedEducation.splice(index, 1);
            const resp = await updateProfile({ education: updatedEducation });
            if (resp.success) {
              Alert.alert('Success', 'Education deleted');
            } else {
              Alert.alert('Error', resp.message || 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  const deleteSkill = async (skillToDelete) => {
    Alert.alert(
      'Delete Skill',
      `Are you sure you want to delete "${skillToDelete}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedSkills = (user?.profile?.skills || []).filter(
              skill => skill !== skillToDelete
            );
            const resp = await updateProfile({ skills: updatedSkills });
            if (resp.success) {
              Alert.alert('Success', 'Skill deleted');
            } else {
              Alert.alert('Error', resp.message || 'Failed to delete');
            }
          },
        },
      ]
    );
  };

  // Utility renderer functions
  const renderEmptySection = (title, icon, onPress) => (
    <TouchableOpacity style={styles.emptySection} onPress={onPress}>
      <View style={styles.emptySectionIcon}>
        {icon}
      </View>
      <Text style={styles.emptySectionTitle}>{title}</Text>
      <Text style={styles.emptySectionSubtitle}>Tap to add</Text>
      <View style={styles.addButton}>
        <Plus size={16} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );

  // Profile Information Renderer
  const renderProfileInfo = () => {
    if (isEditingProfile) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <User size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <TouchableOpacity onPress={() => {
              setIsEditingProfile(false);
              setProfileDraft({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                headline: user?.profile?.headline || '',
                location: user?.profile?.location || '',
                url: user?.profile?.url || ''
              });
            }}>
              <X size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={profileDraft.name}
                onChangeText={(text) => setProfileDraft({...profileDraft, name: text})}
                placeholder="Enter your full name"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Professional Headline</Text>
              <TextInput
                style={styles.input}
                value={profileDraft.headline}
                onChangeText={(text) => setProfileDraft({...profileDraft, headline: text})}
                placeholder="e.g. Software Engineer at Google"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={profileDraft.email}
                onChangeText={(text) => setProfileDraft({...profileDraft, email: text})}
                placeholder="Enter email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={profileDraft.phone}
                onChangeText={(text) => setProfileDraft({...profileDraft, phone: text})}
                placeholder="Enter phone number"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={profileDraft.location}
                onChangeText={(text) => setProfileDraft({...profileDraft, location: text})}
                placeholder="Enter location"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>URL (Portfolio/LinkedIn/GitHub/etc.)</Text>
              <TextInput
                style={styles.input}
                value={profileDraft.url}
                onChangeText={(text) => setProfileDraft({...profileDraft, url: text})}
                placeholder="https://your-portfolio.com"
                keyboardType="url"
              />
            </View>
          </View>
          <View style={styles.aboutActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsEditingProfile(false);
                setProfileDraft({
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  headline: user?.profile?.headline || '',
                  location: user?.profile?.location || '',
                  url: user?.profile?.url || ''
                });
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={async () => {
                const resp = await updateContact({
                  name: profileDraft.name,
                  phone: profileDraft.phone,
                  headline: profileDraft.headline,
                  location: profileDraft.location,
                  url: profileDraft.url
                });
                if (resp.success) {
                  setIsEditingProfile(false);
                  Alert.alert('Success', 'Profile information updated');
                } else {
                  Alert.alert('Error', resp.message || 'Failed to save');
                }
              }}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <User size={20} color="#000000" />
          </View>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingProfile(true)}>
            <Edit size={16} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfoDisplay}>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Name</Text>
            <Text style={styles.profileInfoValue}>{user?.name || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Headline</Text>
            <Text style={styles.profileInfoValue}>{user?.profile?.headline || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Email</Text>
            <Text style={styles.profileInfoValue}>{user?.email || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Phone</Text>
            <Text style={styles.profileInfoValue}>{user?.phone || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Location</Text>
            <Text style={styles.profileInfoValue}>{user?.profile?.location || 'Not set'}</Text>
          </View>
          {user?.profile?.url && (
            <View style={styles.profileInfoRow}>
              <Text style={styles.profileInfoLabel}>URL</Text>
              <Text style={styles.profileInfoValue}>{user.profile.url}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // About Section Renderer
  const renderAbout = () => {
    if (isAddingAbout || isEditingAbout) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <User size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={() => {
              setIsAddingAbout(false);
              setIsEditingAbout(false);
              setAboutDraft(user?.profile?.bio || '');
            }}>
              <X size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.aboutInput}
            value={aboutDraft}
            onChangeText={setAboutDraft}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <View style={styles.aboutActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsAddingAbout(false);
                setIsEditingAbout(false);
                setAboutDraft(user?.profile?.bio || '');
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={async () => {
                const text = aboutDraft.trim();
                if (!text) {
                  Alert.alert('Error', 'Please enter some text');
                  return;
                }
                const resp = await updateProfile({ bio: text });
                if (resp.success) {
                  setIsAddingAbout(false);
                  setIsEditingAbout(false);
                  Alert.alert('Success', isEditingAbout ? 'About updated' : 'About added');
                } else {
                  Alert.alert('Error', resp.message || 'Failed to save');
                }
              }}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>{isEditingAbout ? 'Update' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (user?.profile?.bio) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <User size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => {
              setIsEditingAbout(true);
              setAboutDraft(user?.profile?.bio || '');
            }}>
              <Edit size={16} color="#000000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.bioText}>{user.profile.bio}</Text>
        </View>
      );
    }

    return renderEmptySection(
      'Add About',
      <User size={24} color="#000000" />,
      () => {
        setIsAddingAbout(true);
        setAboutDraft('');
      }
    );
  };

  // Experience Section Renderer
  const renderExperience = () => {
    if (isAddingExperience) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Briefcase size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>Experience</Text>
            <TouchableOpacity onPress={() => {
              setIsAddingExperience(false);
              setExperienceDraft({
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
              });
            }}>
              <X size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Job Title</Text>
              <TextInput
                style={styles.input}
                value={experienceDraft.title}
                onChangeText={(text) => setExperienceDraft({...experienceDraft, title: text})}
                placeholder="e.g. Software Engineer"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company</Text>
              <TextInput
                style={styles.input}
                value={experienceDraft.company}
                onChangeText={(text) => setExperienceDraft({...experienceDraft, company: text})}
                placeholder="e.g. Google"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={experienceDraft.location}
                onChangeText={(text) => setExperienceDraft({...experienceDraft, location: text})}
                placeholder="e.g. San Francisco, CA"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  value={experienceDraft.startDate}
                  onChangeText={(text) => setExperienceDraft({...experienceDraft, startDate: text})}
                  placeholder="MM/YYYY"
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={experienceDraft.endDate}
                  onChangeText={(text) => setExperienceDraft({...experienceDraft, endDate: text})}
                  placeholder="MM/YYYY"
                  editable={!experienceDraft.current}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, {minHeight: 80}]}
                value={experienceDraft.description}
                onChangeText={(text) => setExperienceDraft({...experienceDraft, description: text})}
                placeholder="Describe your role and achievements..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          <View style={styles.aboutActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsAddingExperience(false);
                setExperienceDraft({
                  title: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: ''
                });
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={async () => {
                if (!experienceDraft.title || !experienceDraft.company) {
                  Alert.alert('Error', 'Please fill in required fields');
                  return;
                }
                const newExperience = {
                  ...experienceDraft,
                  current: experienceDraft.current || !experienceDraft.endDate
                };
                const resp = await updateProfile({ 
                  experience: [...(user?.profile?.experience || []), newExperience]
                });
                if (resp.success) {
                  setIsAddingExperience(false);
                  setExperienceDraft({
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: ''
                  });
                  Alert.alert('Success', 'Experience added');
                } else {
                  Alert.alert('Error', resp.message || 'Failed to save');
                }
              }}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (user?.profile?.experience && user.profile.experience.length > 0) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Briefcase size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>Experience</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingExperience(true)}>
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.experienceList}>
            {user.profile.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.experienceTitle}>{exp.title}</Text>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    <Text style={styles.experienceDuration}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteExperience(index)}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                {exp.description && (
                  <Text style={styles.experienceDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      );
    }

    return renderEmptySection(
      'Add Experience',
      <Briefcase size={24} color="#000000" />,
      () => setIsAddingExperience(true)
    );
  };

  // Education Section Renderer
  const renderEducation = () => {
    if (isAddingEducation) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <GraduationCap size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>Education</Text>
            <TouchableOpacity onPress={() => {
              setIsAddingEducation(false);
              setEducationDraft({
                degree: '',
                institution: '',
                field: '',
                startDate: '',
                endDate: '',
                current: false,
                gpa: ''
              });
            }}>
              <X size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Degree</Text>
              <TextInput
                style={styles.input}
                value={educationDraft.degree}
                onChangeText={(text) => setEducationDraft({...educationDraft, degree: text})}
                placeholder="e.g. Bachelor of Science"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Institution</Text>
              <TextInput
                style={styles.input}
                value={educationDraft.institution}
                onChangeText={(text) => setEducationDraft({...educationDraft, institution: text})}
                placeholder="e.g. Stanford University"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Field of Study</Text>
              <TextInput
                style={styles.input}
                value={educationDraft.field}
                onChangeText={(text) => setEducationDraft({...educationDraft, field: text})}
                placeholder="e.g. Computer Science"
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  value={educationDraft.startDate}
                  onChangeText={(text) => setEducationDraft({...educationDraft, startDate: text})}
                  placeholder="MM/YYYY"
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={educationDraft.endDate}
                  onChangeText={(text) => setEducationDraft({...educationDraft, endDate: text})}
                  placeholder="MM/YYYY"
                  editable={!educationDraft.current}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GPA (Optional)</Text>
              <TextInput
                style={styles.input}
                value={educationDraft.gpa}
                onChangeText={(text) => setEducationDraft({...educationDraft, gpa: text})}
                placeholder="e.g. 3.8"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.aboutActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsAddingEducation(false);
                setEducationDraft({
                  degree: '',
                  institution: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  gpa: ''
                });
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={async () => {
                if (!educationDraft.degree || !educationDraft.institution) {
                  Alert.alert('Error', 'Please fill in required fields');
                  return;
                }
                const newEducation = {
                  ...educationDraft,
                  current: educationDraft.current || !educationDraft.endDate
                };
                const resp = await updateProfile({ 
                  education: [...(user?.profile?.education || []), newEducation]
                });
                if (resp.success) {
                  setIsAddingEducation(false);
                  setEducationDraft({
                    degree: '',
                    institution: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    gpa: ''
                  });
                  Alert.alert('Success', 'Education added');
                } else {
                  Alert.alert('Error', resp.message || 'Failed to save');
                }
              }}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (user?.profile?.education && user.profile.education.length > 0) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <GraduationCap size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>Education</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingEducation(true)}>
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.educationList}>
            {user.profile.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.educationDegree}>{edu.degree}</Text>
                    <Text style={styles.educationInstitution}>{edu.institution}</Text>
                    <Text style={styles.educationDuration}>
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </Text>
                    {edu.gpa && (
                      <Text style={styles.educationGpa}>GPA: {edu.gpa}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteEducation(index)}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return renderEmptySection(
      'Add Education',
      <GraduationCap size={24} color="#000000" />,
      () => setIsAddingEducation(true)
    );
  };

  // Skills Section Renderer
  const renderSkills = () => {
    if (isAddingSkills) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Award size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity onPress={() => {
              setIsAddingSkills(false);
              setSkillsDraft('');
            }}>
              <X size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Add Skills (comma separated)</Text>
            <TextInput
              style={styles.aboutInput}
              value={skillsDraft}
              onChangeText={setSkillsDraft}
              placeholder="e.g. JavaScript, React, Node.js, Python"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.aboutActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsAddingSkills(false);
                setSkillsDraft('');
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={async () => {
                const skills = skillsDraft.split(',').map(s => s.trim()).filter(s => s);
                if (skills.length === 0) {
                  Alert.alert('Error', 'Please enter at least one skill');
                  return;
                }
                const resp = await updateProfile({ 
                  skills: [...(user?.profile?.skills || []), ...skills]
                });
                if (resp.success) {
                  setIsAddingSkills(false);
                  setSkillsDraft('');
                  Alert.alert('Success', 'Skills added');
                } else {
                  Alert.alert('Error', resp.message || 'Failed to save');
                }
              }}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (user?.profile?.skills && user.profile.skills.length > 0) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Award size={20} color="#000000" />
            </View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingSkills(true)}>
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.skillsList}>
            {user.profile.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
                <TouchableOpacity
                  style={styles.skillDeleteButton}
                  onPress={() => deleteSkill(skill)}
                >
                  <X size={12} color="#000000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return renderEmptySection(
      'Add Skills',
      <Award size={24} color="#000000" />,
      () => setIsAddingSkills(true)
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with Profile Strength */}
      <View style={styles.headerSection}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={showImageOptions}>
            {user?.profile?.avatar ? (
              <Image source={{ uri: user.profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color="#CCCCCC" />
              </View>
            )}
            <View style={styles.cameraButton}>
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Strength Indicator */}
        <View style={styles.profileStrengthContainer}>
          <View style={styles.profileStrengthHeader}>
            <Text style={styles.profileStrengthTitle}>Profile Strength</Text>
            <Text style={styles.profileStrengthPercentage}>{profileStrength}%</Text>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${profileStrength}%` }
                ]} 
              />
            </View>
          </View>

          {/* Profile Completion Checklist */}
          {/* <View style={styles.completionChecklist}>
            <View style={styles.checklistItem}>
              {user?.profile?.avatar ? (
                <CheckCircle size={16} color="#000000" />
              ) : (
                <Circle size={16} color="#CCCCCC" />
              )}
              <Text style={[
                styles.checklistText,
                user?.profile?.avatar && styles.checklistTextCompleted
              ]}>
                Profile Photo
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {(user?.name && user?.email && user?.phone) ? (
                <CheckCircle size={16} color="#000000" />
              ) : (
                <Circle size={16} color="#CCCCCC" />
              )}
              <Text style={[
                styles.checklistText,
                (user?.name && user?.email && user?.phone) && styles.checklistTextCompleted
              ]}>
                Basic Information
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {user?.profile?.headline ? (
                <CheckCircle size={16} color="#000000" />
              ) : (
                <Circle size={16} color="#CCCCCC" />
              )}
              <Text style={[
                styles.checklistText,
                user?.profile?.headline && styles.checklistTextCompleted
              ]}>
                Professional Headline
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {user?.profile?.bio ? (
                <CheckCircle size={16} color="#000000" />
              ) : (
                <Circle size={16} color="#CCCCCC" />
              )}
              <Text style={[
                styles.checklistText,
                user?.profile?.bio && styles.checklistTextCompleted
              ]}>
                About Section
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {(user?.profile?.experience && user.profile.experience.length > 0) ? (
                <CheckCircle size={16} color="#000000" />
              ) : (
                <Circle size={16} color="#CCCCCC" />
              )}
              <Text style={[
                styles.checklistText,
                (user?.profile?.experience && user.profile.experience.length > 0) && styles.checklistTextCompleted
              ]}>
                Work Experience
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {(user?.profile?.education && user.profile.education.length > 0) ? (
                <CheckCircle size={16} color="#000000" />
              ) : (
                <Circle size={16} color="#CCCCCC" />
              )}
              <Text style={[
                styles.checklistText,
                (user?.profile?.education && user.profile.education.length > 0) && styles.checklistTextCompleted
              ]}>
                Education
              </Text>
            </View>
            <View style={styles.checklistItem}>
              {(user?.profile?.skills && user.profile.skills.length > 0) ? (
                <CheckCircle size={16} color="#000000" />
              ) : (
                <Circle size={16} color="#CCCCCC" />
              )}
              <Text style={[
                styles.checklistText,
                (user?.profile?.skills && user.profile.skills.length > 0) && styles.checklistTextCompleted
              ]}>
                Skills
              </Text>
            </View>
          </View> */}
        </View>
      </View>

      {/* Profile Information */}
      {renderProfileInfo()}

      {/* About */}
      {renderAbout()}

      {/* Experience */}
      {renderExperience()}

      {/* Education */}
      {renderEducation()}

      {/* Skills */}
      {renderSkills()}

      {/* Resume Preview Button */}
      {isProfileComplete && (
        <View style={styles.resumePreviewContainer}>
          <TouchableOpacity
            style={styles.resumePreviewButton}
            onPress={() => setShowResume(true)}
          >
            <Text style={styles.resumePreviewText}>Resume Preview</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Logout */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#000000" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Resume Preview Modal */}
      <ResumeModal setShowResume={setShowResume} showResume={showResume} user={user} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header Section
  headerSection: {
    backgroundColor: '#FFFFFF',
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#1E293B', // soft black-gray
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#334155', // medium dark gray
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E293B', // dark gray
    width: 32,
    height: 32,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Strength Section
  profileStrengthContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  profileStrengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileStrengthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A', // very dark slate
  },
  profileStrengthPercentage: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 4,
  },
  completionChecklist: {
    gap: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checklistText: {
    fontSize: 14,
    color: '#64748B', // gray
    fontWeight: '500',
  },
  checklistTextCompleted: {
    color: '#1E293B',
    fontWeight: '600',
  },

  // Section Styles
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Info Display
  profileInfoDisplay: {
    gap: 12,
  },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    minWidth: 80,
  },
  profileInfoValue: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },

  // Form Elements
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  aboutInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    minHeight: 120,
    fontWeight: '500',
  },
  aboutActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 14,
  },
  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Content Display
  bioText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    fontWeight: '400',
  },

  // Experience Section
  experienceList: {
    gap: 16,
  },
  experienceItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 4,
    fontWeight: '600',
  },
  experienceDuration: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  experienceDescription: {
    fontSize: 15,
    color: '#475569',
    marginTop: 8,
    lineHeight: 22,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  // Education Section
  educationList: {
    gap: 16,
  },
  educationItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  educationDegree: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  educationInstitution: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 4,
    fontWeight: '600',
  },
  educationDuration: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  educationGpa: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },

  // Skills Section
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillTag: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  skillDeleteButton: {
    padding: 4,
  },

  // Empty Section
  emptySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    position: 'relative',
  },
  emptySectionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },

  // Resume Preview
  resumePreviewContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  resumePreviewButton: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  resumePreviewText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },

  // Actions
  actionsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
    fontWeight: '700',
  },
});
