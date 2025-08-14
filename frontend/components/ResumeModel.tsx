import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type ResumeTemplateProps = {
  user: any; // Replace 'any' with a more specific type if available
  onClose: () => void;
};

const ResumeTemplate = ({ user, onClose }: ResumeTemplateProps) => (
  <View style={styles.container}>
    {/* Close Icon */}
    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
      <Ionicons name="close" size={28} color="#111827" />
    </TouchableOpacity>

    <ScrollView>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.headline}>{user?.profile?.headline}</Text>
          </View>
          {user?.profile?.avatar ? (
            <Image source={{ uri: user.profile.avatar }} style={styles.profileImage} />
          ) : null}
        </View>
      </View>

      {/* MAIN CONTENT TWO COLUMNS */}
      <View style={styles.contentRow}>
        {/* LEFT COLUMN */}
        <View style={styles.leftColumn}>
          <View style={styles.contactSection}>
            <View style={styles.iconRow}>
              <Ionicons name="call" size={16} color="#000" />
              <Text style={styles.contactText}>{user?.phone}</Text>
            </View>
            <View style={styles.iconRow}>
              <Ionicons name="mail" size={16} color="#000" />
              <Text style={styles.contactText}>{user?.email}</Text>
            </View>
            <View style={styles.iconRow}>
              <Ionicons name="location" size={16} color="#000" />
              <Text style={styles.contactText}>{user?.profile?.location}</Text>
            </View>
            {user?.profile?.url && (
              <View style={styles.iconRow}>
                <Ionicons name="globe" size={16} color="#000" />
                <Text style={styles.contactText}>{user.profile.url}</Text>
              </View>
            )}
          </View>

          {/* <Text style={styles.leftSectionTitle}>PROFILE</Text> */}
          {/* <Text style={styles.profileContent}>{user?.profile?.bio}</Text> */}

          <Text style={styles.leftSectionTitle}>SKILLS</Text>
            {user?.profile?.skills?.map((skill: string, index: number) => (
              <View key={index} style={styles.skillsSection}>
                <Text style={styles.skillItem}>• {skill}</Text>
                </View>

            ))}
          
          <Text style={styles.leftSectionTitle}>EDUCATION</Text>
          {user?.profile?.education?.map((edu: {
            degree: string;
            institution: string;
            startDate: string;
            endDate?: string;
            current?: boolean;
            field?: string;
          }, idx: number) => (
            <View key={idx} style={styles.educationItem}>
              <Text style={styles.educationDegree}>{edu.degree}</Text>
              <Text style={styles.educationSchool}>{edu.institution}</Text>
              <Text style={styles.educationDate}>
                {edu.startDate} - {edu.current ? "Present" : edu.endDate}
              </Text>
            </View>
          ))}
        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.rightColumn}>
          <Text style={styles.rightSectionTitle}>PROFILE</Text>
          <Text style={styles.profileContent}>{user?.profile?.bio}</Text>

          <Text style={styles.rightSectionTitle}>EXPERIENCE</Text>
          {user?.profile?.experience?.map((exp: Experience, idx: number) => (
            <View key={idx} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{exp.title}</Text>
              <Text style={styles.companyName}>{exp.company}</Text>
              <Text style={styles.jobDate}>
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </Text>
              {exp.description && (
                <Text style={styles.jobDescription}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  </View>
);

type Experience = {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  description?: string;
};

type ResumeModalProps = {
  showResume: boolean;
  setShowResume: (show: boolean) => void;
  user: any; // Replace 'any' with a more specific type if available
};

export default function ResumeModal({ showResume, setShowResume, user }: ResumeModalProps) {
  return (
    <Modal
      visible={showResume}
      transparent
      animationType="fade"
      onRequestClose={() => setShowResume(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ResumeTemplate user={user} onClose={() => setShowResume(false)} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "60%",
    backgroundColor: "#fff",
    // borderRadius: 12,
    overflow: "hidden",
  },
  container: { 
    flex: 1,
    backgroundColor: "#fff"
  },
  closeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
    padding: 4,
  },
  header: { 
    backgroundColor: "#E5E7EB",
    paddingVertical: 16
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "#fff",
  },
  nameSection: {
    flex: 1,
  },
  name: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#000",
    marginBottom: 4
  },
  headline: { 
    fontSize: 14, 
    color: "#6B7280",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  contentRow: { 
    flexDirection: "row", 
    flex: 1
  },
  leftColumn: { 
    flex: 0.35, 
    height: "100%",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  rightColumn: { 
    flex: 0.65, 
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff"
  },
  contactSection: {
    marginBottom: 20
  },
  iconRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  contactText: { 
    fontSize: 12, 
    color: "#000", 
    marginLeft: 8
  },
  leftSectionTitle: { 
    fontSize: 14, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "#000",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  profileContent: { 
    fontSize: 12, 
    color: "#374151", 
    marginBottom: 20,
    lineHeight: 18
  },
  skillsSection: {
    marginBottom: 16
  },
  skillItem: {
    fontSize: 12,
    color: "#374151",
    // marginBottom: 4,
    // lineHeight: 16
  },
  educationItem: {
    marginBottom: 16
  },
  educationDegree: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
    marginBottom: 2
  },
  educationSchool: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 2
  },
  educationDate: {
    fontSize: 12,
    color: "#6B7280"
  },
  rightSectionTitle: { 
    fontSize: 14, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#000",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB"
  },
  jobTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
    marginBottom: 2
  },
  companyName: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 2
  },
  jobDate: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8
  },
  jobDescription: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16
  }
});