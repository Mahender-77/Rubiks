import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import { useAuth } from '../../contexts/AuthContext';

type JobEditProps = {
  editJob: any;
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
};

// Dropdown options
const jobTypes = [
  { label: 'Full Time', value: 'full-time' },
  { label: 'Part Time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
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
}: JobEditProps) {
  const { updateJob } = useAuth();

  // Early return if editJob is not available
  if (!editJob) {
    return null;
  }

  const handleChange = (key: string, value: string | boolean) => {
    if (setEditJob) {
      setEditJob({ ...editJob, [key]: value });
    }
    // Close dropdowns when selection is made
    if (key === 'type') setShowJobTypeDropdown?.(false);
    if (key === 'currency') setShowCurrencyDropdown?.(false);
    if (key === 'salaryPeriod') setShowSalaryPeriodDropdown?.(false);
  };

  const handleUpdateJob = () => {
    const res = updateJob(editJob);
    res.then((response) => {
      if (response.success) {
        console.log("Job updated successfully:", response.success);
        setShowEditModel(false); // Close modal on success
      } else {
        console.error("Failed to update job:", response.message);
      }
    }).catch((error) => {
      console.error("Error updating job:", error);
    });
  };

  return (
    <Modal
      visible={showEditModel}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit</Text>

          <ScrollView
            style={{ maxHeight: '80%' }}
            showsVerticalScrollIndicator={false}
          >
            {/* Basic Info */}
            <TextInput
              style={styles.input}
              placeholder="Job Title *"
              value={editJob?.title || ''}
              onChangeText={(val) => handleChange('title', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Company *"
              value={editJob?.company || ''}
              onChangeText={(val) => handleChange('company', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Location *"
              value={editJob?.location || ''}
              onChangeText={(val) => handleChange('location', val)}
            />

            {/* Job Type Dropdown */}
            <Text style={styles.fieldLabel}>Job Type *</Text>
            <CustomDropdown
              value={editJob?.type || ''}
              options={jobTypes}
              onSelect={(value) => handleChange('type', value)}
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
                value={editJob?.salaryMin?.toString() || ""}
                onChangeText={(val) => handleChange('salaryMin', val)}
              />
              <TextInput
                style={[styles.input, styles.salaryInput]}
                placeholder="Max Salary *"
                keyboardType="numeric"
                value={editJob?.salaryMax?.toString() || ""}
                onChangeText={(val) => handleChange('salaryMax', val)}
              />
            </View>

            <View style={styles.salaryRow}>
              {/* Currency Dropdown */}
              <View style={styles.halfWidth}>
                <Text style={styles.fieldLabel}>Currency</Text>
                <CustomDropdown
                  value={editJob?.currency || ''}
                  options={currencies}
                  onSelect={(value) => handleChange('currency', value)}
                  placeholder="Currency"
                  isVisible={showCurrencyDropdown}
                  setVisible={setShowCurrencyDropdown}
                />
              </View>

              {/* Salary Period Dropdown */}
              <View style={styles.halfWidth}>
                <Text style={styles.fieldLabel}>Period</Text>
                <CustomDropdown
                  value={editJob?.salaryPeriod || ''}
                  options={salaryPeriods}
                  onSelect={(value) => handleChange('salaryPeriod', value)}
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
              value={editJob?.description || ''}
              multiline
              numberOfLines={4}
              onChangeText={(val) => handleChange('description', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Requirements (comma separated)"
              value={editJob?.requirements || ''}
              onChangeText={(val) => handleChange('requirements', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Responsibilities (comma separated)"
              value={editJob?.responsibilities || ''}
              onChangeText={(val) => handleChange('responsibilities', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Benefits (comma separated)"
              value={editJob?.benefits || ''}
              onChangeText={(val) => handleChange('benefits', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Skills Required (comma separated)"
              value={editJob?.skills || ''}
              onChangeText={(val) => handleChange('skills', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Experience Required"
              value={editJob?.experience || ''}
              onChangeText={(val) => handleChange('experience', val)}
            />

            <TextInput
              style={styles.input}
              placeholder="Education Required"
              value={editJob?.education || ''}
              onChangeText={(val) => handleChange('education', val)}
            />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.saveButton} onPress={() => handleUpdateJob()}>
              <Text style={styles.saveButtonText}>Edit Job</Text>
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
  // Modal Styles
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
  
  // Form Styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 12,
  },
  // Salary Section
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
  // Action Buttons
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