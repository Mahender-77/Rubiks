import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useState, useEffect } from 'react';

import { useAuth } from '../../contexts/AuthContext';

// Define the interface for the job edit form data
interface JobEditData {
  id?: string;
  _id?: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryMin: string | number;
  salaryMax: string | number;
  currency: string;
  salaryPeriod: string;
  description: string;
  requirements: string | string[];
  responsibilities: string | string[];
  benefits: string | string[];
  skills: string | string[];
  experience: string;
  education: string;
  isActive: boolean;
}

type JobEditProps = {
  editJob: JobEditData;
  CustomDropdown: any;
  setEditJob?: (job: any) => void;
  setShowJobTypeDropdown?: (visible: boolean) => void | undefined;
  setShowCurrencyDropdown?: (visible: boolean) => void | undefined;
  setShowSalaryPeriodDropdown?: (visible: boolean) => void | undefined;
  showJobTypeDropdown?: boolean;
  showCurrencyDropdown?: boolean;
  showSalaryPeriodDropdown?: boolean;
  showEditModel: boolean;
  setShowEditModel: (visible: boolean) => void;
  fetchJobs?: () => void;
  jobId?: string;
};

// Dropdown options
const jobTypes = [
  { label: 'Full Time', value: 'full-time' as const },
  { label: 'Part Time', value: 'part-time' as const },
  { label: 'Contract', value: 'contract' as const },
  { label: 'Internship', value: 'internship' as const },
];

const currencies = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'INR (₹)', value: 'INR' },
  { label: 'CAD (C$)', value: 'CAD' },
];

const salaryPeriods = [
  { label: 'Per Year', value: 'yearly' },
  { label: 'Per Month', value: 'monthly' },
];

// Default job data
const defaultJobData: JobEditData = {
  title: '',
  company: '',
  location: '',
  type: 'full-time',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  salaryPeriod: 'yearly',
  description: '',
  requirements: '',
  responsibilities: '',
  benefits: '',
  skills: '',
  experience: '',
  education: '',
  isActive: true,
};

export function JobEdit({
  editJob,
  CustomDropdown,
  setEditJob,
  setShowJobTypeDropdown,
  setShowCurrencyDropdown,
  setShowSalaryPeriodDropdown,
  showJobTypeDropdown,
  showCurrencyDropdown,
  showSalaryPeriodDropdown,
  showEditModel,
  setShowEditModel,
  fetchJobs,
  jobId,
}: JobEditProps) {
  const { updateJob } = useAuth();
  
  // Create local state with proper typing and default values
  const [localJobData, setLocalJobData] = useState<JobEditData>(defaultJobData);

  // Initialize local state when editJob changes
  useEffect(() => {
    if (editJob) {
      setLocalJobData({
        ...defaultJobData, // Start with defaults
        ...editJob, // Override with actual data
        // Ensure we have the job ID
        id: editJob.id || editJob._id || jobId,
        // Convert arrays to strings if they're arrays (for display in text inputs)
        requirements: Array.isArray(editJob.requirements) 
          ? editJob.requirements.join(', ') 
          : editJob.requirements || '',
        responsibilities: Array.isArray(editJob.responsibilities) 
          ? editJob.responsibilities.join(', ') 
          : editJob.responsibilities || '',
        benefits: Array.isArray(editJob.benefits) 
          ? editJob.benefits.join(', ') 
          : editJob.benefits || '',
        skills: Array.isArray(editJob.skills) 
          ? editJob.skills.join(', ') 
          : editJob.skills || '',
      });
    }
  }, [editJob, jobId]);

  // Early return if editJob is not available
  if (!editJob) {
    return null;
  }

  const handleChange = (key: keyof JobEditData, value: string | boolean) => {
    setLocalJobData(prevData => ({
      ...prevData,
      [key]: value
    }));

    // Close dropdowns when selection is made
    if (key === 'type') setShowJobTypeDropdown?.(false);
    if (key === 'currency') setShowCurrencyDropdown?.(false);
    if (key === 'salaryPeriod') setShowSalaryPeriodDropdown?.(false);
  };

  const handleUpdateJob = async () => {
    try {
      // Ensure we have a job ID
      const currentJobId = localJobData.id || localJobData._id || jobId;
      if (!currentJobId) {
        console.error("Job ID is missing");
        return;
      }

      // Prepare the job data in the correct format for the backend
      const jobPayload = {
        ...localJobData,
        id: currentJobId, // Ensure ID is included
        salary: {
          min: Number(localJobData.salaryMin),
          max: Number(localJobData.salaryMax),
          currency: localJobData.currency,
          salaryType: localJobData.salaryPeriod, // Backend expects 'salaryType'
        },
        requirements: typeof localJobData.requirements === 'string' 
          ? localJobData.requirements.split(',').map((r: string) => r.trim()).filter((r: string) => r)
          : localJobData.requirements || [],
        responsibilities: typeof localJobData.responsibilities === 'string'
          ? localJobData.responsibilities.split(',').map((r: string) => r.trim()).filter((r: string) => r)
          : localJobData.responsibilities || [],
        benefits: typeof localJobData.benefits === 'string'
          ? localJobData.benefits.split(',').map((b: string) => b.trim()).filter((b: string) => b)
          : localJobData.benefits || [],
        skills: typeof localJobData.skills === 'string'
          ? localJobData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : localJobData.skills || [],
      };

      console.log("Updating job with ID:", currentJobId);
      console.log("Job payload:", jobPayload);

      const response = await updateJob(jobPayload);
      
      if (response.success) {
        console.log("✅ Job updated successfully");
        // Refresh the jobs list if function is provided
        if (fetchJobs) {
          fetchJobs();
        }
        setShowEditModel(false); // Close modal on success
      } else {
        console.error("❌ Failed to update job:", response.message);
      }
    } catch (error) {
      console.error("❌ Error updating job:", error);
    }
  };

  return (
    <Modal
      visible={showEditModel}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Job</Text>

          <ScrollView
            style={{ maxHeight: '80%' }}
            showsVerticalScrollIndicator={false}
          >
            {/* Basic Info */}
            <TextInput
              style={styles.input}
              placeholder="Job Title *"
              value={localJobData.title}
              onChangeText={(val) => handleChange('title', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Company *"
              value={localJobData.company}
              onChangeText={(val) => handleChange('company', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Location *"
              value={localJobData.location}
              onChangeText={(val) => handleChange('location', val)}
            />

            {/* Job Type Dropdown */}
            <Text style={styles.fieldLabel}>Job Type *</Text>
            <CustomDropdown
              value={localJobData.type}
              options={jobTypes}
              onSelect={(value: string) => handleChange('type', value as JobEditData['type'])}
              placeholder="Select Job Type"
              isVisible={showJobTypeDropdown}
              setVisible={setShowJobTypeDropdown}
            />

            {/* Salary Section */}
            <Text style={styles.sectionTitle}>💰 Salary Information</Text>

            <View style={styles.salaryRow}>
              <TextInput
                style={[styles.input, styles.salaryInput]}
                placeholder="Min Salary *"
                keyboardType="numeric"
                value={localJobData.salaryMin.toString()}
                onChangeText={(val) => handleChange('salaryMin', val)}
              />
              <TextInput
                style={[styles.input, styles.salaryInput]}
                placeholder="Max Salary *"
                keyboardType="numeric"
                value={localJobData.salaryMax.toString()}
                onChangeText={(val) => handleChange('salaryMax', val)}
              />
            </View>

            <View style={styles.salaryRow}>
              {/* Currency Dropdown */}
              <View style={styles.halfWidth}>
                <Text style={styles.fieldLabel}>Currency</Text>
                <CustomDropdown
                  value={localJobData.currency}
                  options={currencies}
                  onSelect={(value: string) => handleChange('currency', value)}
                  placeholder="Currency"
                  isVisible={showCurrencyDropdown}
                  setVisible={setShowCurrencyDropdown}
                />
              </View>

              {/* Salary Period Dropdown */}
              <View style={styles.halfWidth}>
                <Text style={styles.fieldLabel}>Period</Text>
                <CustomDropdown
                  value={localJobData.salaryPeriod}
                  options={salaryPeriods}
                  onSelect={(value: string) => handleChange('salaryPeriod', value)}
                  placeholder="Salary Period"
                  isVisible={showSalaryPeriodDropdown}
                  setVisible={setShowSalaryPeriodDropdown}
                />
              </View>
            </View>

            {/* Job Details */}
            <Text style={styles.sectionTitle}>📋 Job Details</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Job Description *"
              value={localJobData.description}
              multiline
              numberOfLines={4}
              onChangeText={(val) => handleChange('description', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Requirements (comma separated)"
              value={typeof localJobData.requirements === 'string' ? localJobData.requirements : ''}
              onChangeText={(val) => handleChange('requirements', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Responsibilities (comma separated)"
              value={typeof localJobData.responsibilities === 'string' ? localJobData.responsibilities : ''}
              onChangeText={(val) => handleChange('responsibilities', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Benefits (comma separated)"
              value={typeof localJobData.benefits === 'string' ? localJobData.benefits : ''}
              onChangeText={(val) => handleChange('benefits', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Skills Required (comma separated)"
              value={typeof localJobData.skills === 'string' ? localJobData.skills : ''}
              onChangeText={(val) => handleChange('skills', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Experience Required"
              value={localJobData.experience}
              onChangeText={(val) => handleChange('experience', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Education Required"
              value={localJobData.education}
              onChangeText={(val) => handleChange('education', val)}
            />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateJob}>
              <Text style={styles.saveButtonText}>Update Job</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditModel(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 12,
  },
  salaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  salaryInput: {
    flex: 1,
  },
  halfWidth: {
    flex: 1,
  },
  modalActions: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#87CEEB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
  },
});