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
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ResumeModal from '../../../components/ResumeModel';
import { useAuth } from '../../../contexts/AuthContext';



export default function ProfileScreen() {
  const { user ,logout,updateAvatar,updateProfile,updateContact} = useAuth();
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
            router.replace('/auth/login');
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
    </TouchableOpacity>
  );

  // Profile Information Renderer
  const renderProfileInfo = () => {
    if (isEditingProfile) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <User size={20} color="#6B7280" />
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
              <X size={16} color="#6B7280" />
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
            <User size={20} color="#6B7280" />
          </View>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
            <Edit size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfoDisplay}>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Name:</Text>
            <Text style={styles.profileInfoValue}>{user?.name || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Headline:</Text>
            <Text style={styles.profileInfoValue}>{user?.profile?.headline || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Email:</Text>
            <Text style={styles.profileInfoValue}>{user?.email || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Phone:</Text>
            <Text style={styles.profileInfoValue}>{user?.phone || 'Not set'}</Text>
          </View>
          <View style={styles.profileInfoRow}>
            <Text style={styles.profileInfoLabel}>Location:</Text>
            <Text style={styles.profileInfoValue}>{user?.profile?.location || 'Not set'}</Text>
          </View>
          {user?.profile?.url && (
            <View style={styles.profileInfoRow}>
              <Text style={styles.profileInfoLabel}>URL:</Text>
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
              <User size={20} color="#6B7280" />
            </View>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={() => {
              setIsAddingAbout(false);
              setIsEditingAbout(false);
              setAboutDraft(user?.profile?.bio || '');
            }}>
              <X size={16} color="#6B7280" />
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
              <User size={20} color="#6B7280" />
            </View>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={() => {
              setIsEditingAbout(true);
              setAboutDraft(user?.profile?.bio || '');
            }}>
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          <Text style={styles.bioText}>{user.profile.bio}</Text>
        </View>
      );
    }

    return renderEmptySection(
      'Add About',
      <User size={24} color="#6B7280" />,
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
              <Briefcase size={20} color="#6B7280" />
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
              <X size={16} color="#6B7280" />
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
              <Briefcase size={20} color="#6B7280" />
            </View>
            <Text style={styles.sectionTitle}>Experience</Text>
            <TouchableOpacity onPress={() => setIsAddingExperience(true)}>
              <Plus size={16} color="#3B82F6" />
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
                    <Trash2 size={16} color="#EF4444" />
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
      <Briefcase size={24} color="#6B7280" />,
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
              <GraduationCap size={20} color="#6B7280" />
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
              <X size={16} color="#6B7280" />
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
              <GraduationCap size={20} color="#6B7280" />
            </View>
            <Text style={styles.sectionTitle}>Education</Text>
            <TouchableOpacity onPress={() => setIsAddingEducation(true)}>
              <Plus size={16} color="#3B82F6" />
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
                    <Trash2 size={16} color="#EF4444" />
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
      <GraduationCap size={24} color="#6B7280" />,
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
              <Award size={20} color="#6B7280" />
            </View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity onPress={() => {
              setIsAddingSkills(false);
              setSkillsDraft('');
            }}>
              <X size={16} color="#6B7280" />
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
              <Award size={20} color="#6B7280" />
            </View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity onPress={() => setIsAddingSkills(true)}>
              <Plus size={16} color="#3B82F6" />
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
                  <X size={12} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return renderEmptySection(
      'Add Skills',
      <Award size={24} color="#6B7280" />,
      () => setIsAddingSkills(true)
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarContainer} onPress={showImageOptions}>
          {user?.profile?.avatar ? (
            <Image source={{ uri: user.profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={32} color="#6B7280" />
            </View>
          )}
          <View style={styles.cameraButton}>
            <Camera size={12} color="white" />
          </View>
        </TouchableOpacity>
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
          <LogOut size={20} color="#EF4444" />
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
    backgroundColor: '#F9FAFB',
  },
  avatarSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  profileInfoDisplay: {
    gap: 8,
  },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  profileInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  profileInfoValue: {
    fontSize: 14,
    color: '#374151',
    flex: 2,
    textAlign: 'right',
  },
  formContainer: {
    gap: 12,
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  aboutInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
    marginBottom: 12,
  },
  aboutActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  experienceList: {
    gap: 12,
  },
  experienceItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  educationList: {
    gap: 12,
  },
  educationItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  educationInstitution: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  educationDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  educationGpa: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  skillDeleteButton: {
    padding: 2,
  },
  emptySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 24,
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
  emptySectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emptySectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  resumePreviewContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  resumePreviewButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  resumePreviewText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 12,
    fontWeight: '500',
  },
});