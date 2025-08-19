import { X, Building2 } from "lucide-react-native";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Jobs } from "../../types/job";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type JobDetailsProps = {
  jobDetails: boolean;
  jobId: string | null;
  setJobDetails: (visible: boolean) => void;
};

export function JobDetails({ jobDetails, jobId, setJobDetails }: JobDetailsProps) {
  const [jobData, setJobData] = useState<Jobs | null>(null);
  const [loading, setLoading] = useState(true);
  const { getJobDetails } = useAuth();

  const fetchJobDetails = async (id: string) => {
    setLoading(true);
    const response = await getJobDetails(id);

    if (response) {
      setJobData(response);
    } else {
      console.error("Failed to fetch job details");
    }
    setLoading(false);
  };

  // Utility function
  const normalizeToArray = (val: string | string[] | undefined) => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={jobDetails}
      onRequestClose={() => setJobDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setJobDetails(false)}
            style={styles.closeButton}
          >
            <X size={22} color="#333" />
          </TouchableOpacity>

          {/* Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={{ marginTop: 10, color: "#555" }}>
                Loading job details...
              </Text>
            </View>
          ) : jobData ? (
            <View>
              {/* Title */}
              <Text style={styles.title}>{jobData.title}</Text>

              {/* Company with icon */}
              <View style={styles.companyRow}>
                <Building2 size={18} color="#007bff" style={{ marginRight: 6 }} />
                <Text style={styles.company}>{jobData.company}</Text>
              </View>

              {/* Type & Location */}
              <Text style={styles.typeLocation}>
                {jobData.type} • {jobData.location}
              </Text>

              {/* Salary */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>💰 Salary</Text>
                <Text style={styles.text}>
                  {jobData.salaryMin} - {jobData.salaryMax} {jobData.currency} /{" "}
                  {jobData.type}
                </Text>
              </View>

              {/* Experience & Education */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>📌 Requirements</Text>
                <Text style={styles.text}>Experience: {jobData.experience} years</Text>
                <Text style={styles.text}>Education: {jobData.education}</Text>
              </View>

              {/* Skills */}
              {normalizeToArray(jobData.skills).length > 0 && (
                <View style={styles.sectionBox}>
                  <Text style={styles.sectionTitle}>🛠 Skills</Text>
                  <Text style={styles.text}>
                    {normalizeToArray(jobData.skills).join(", ")}
                  </Text>
                </View>
              )}

              {/* Responsibilities */}
              {normalizeToArray(jobData.responsibilities).length > 0 && (
                <View style={styles.sectionBox}>
                  <Text style={styles.sectionTitle}>📝 Responsibilities</Text>
                  <Text style={styles.text}>
                    {normalizeToArray(jobData.responsibilities).join(", ")}
                  </Text>
                </View>
              )}

              {/* Benefits */}
              {normalizeToArray(jobData.benefits).length > 0 && (
                <View style={styles.sectionBox}>
                  <Text style={styles.sectionTitle}>🎁 Benefits</Text>
                  <Text style={styles.text}>
                    {normalizeToArray(jobData.benefits).join(", ")}
                  </Text>
                </View>
              )}

              {/* Description */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionTitle}>📖 Description</Text>
                <Text style={styles.text}>{jobData.description}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={{ color: "red" }}>No job details found</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    minHeight: "50%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    padding: 5,
    zIndex: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  companyRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  company: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    textAlign: "center",
  },
  typeLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
});
