import {
    Briefcase,
    ChevronDown,
    Edit3,
    Eye,
    Filter,
    PlusCircle,
    Search,
    Trash2,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { JobDetails } from '../../components/modals/jobDetails';
import { useAuth } from '../../contexts/AuthContext';

export default function JobsAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobDetails, setJobDetails] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const { getJobs, addJob } = useAuth();

  // Dropdown states
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showSalaryPeriodDropdown, setShowSalaryPeriodDropdown] =
    useState(false);

  // Job form state
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    salaryPeriod: 'yearly', // This will map to 'salaryType' in backend
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    skills: '',
    experience: '',
    education: '',
    isActive: true,
  });

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

  const handleChange = (key: string, value: string | boolean) => {
    setJob({ ...job, [key]: value });
    // Close dropdowns when selection is made
    if (key === 'type') setShowJobTypeDropdown(false);
    if (key === 'currency') setShowCurrencyDropdown(false);
    if (key === 'salaryPeriod') setShowSalaryPeriodDropdown(false);
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getJobs();
      const data = res.jobs || [];
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobPress = (id: string) => {
    setJobId(id);
    setJobDetails(true);
  };

  const handleSaveJob = async () => {
    try {
      // Prepare payload in the same structure backend expects
      const jobPayload = {
        ...job,
        salary: {
          min: Number(job.salaryMin),
          max: Number(job.salaryMax),
          currency: job.currency,
          salaryType: job.salaryPeriod, // Map to backend field
        },
        requirements: job.requirements
          .split(',')
          .map((r) => r.trim())
          .filter((r) => r),
        responsibilities: job.responsibilities
          .split(',')
          .map((r) => r.trim())
          .filter((r) => r),
        benefits: job.benefits
          .split(',')
          .map((b) => b.trim())
          .filter((b) => b),
        skills: job.skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
      };

      const res = await addJob(jobPayload);

      if (res.success) {
        // ✅ Close modal & reset form
        setShowAddModal(false);
        setJob({
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
        });

        // ✅ Refresh job list
        fetchJobs();
      } else {
        console.error('Failed to add job:', res.message);
      }
    } catch (err) {
      console.error('Save job error:', err);
    }
  };

  // Custom Dropdown Component
  const CustomDropdown = ({
    value,
    options,
    onSelect,
    placeholder,
    isVisible,
    setVisible,
  }) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(!isVisible)}
      >
        <Text style={styles.dropdownButtonText}>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </Text>
        <ChevronDown color="#666" size={20} />
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.dropdownOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownOption,
                value === option.value && styles.selectedOption,
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  value === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 🔍 Search + Add */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search color="#666" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#87CEEB" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <PlusCircle color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        {/* 📋 Job List */}
        {loading ? (
          <ActivityIndicator size="large" color="#87CEEB" />
        ) : jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Briefcase size={40} color="#999" />
            <Text style={styles.emptyText}>No jobs added yet</Text>
          </View>
        ) : (
          <View style={styles.jobsGrid}>
            {jobs
              .filter((j) =>
                j.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((job) => (
                <Pressable
                  key={job._id}
                  style={styles.jobCard}
                  onPress={() => handleJobPress(job._id)} // 👈 function to open details
                >
                  <View style={styles.jobCardHeader}>
                    <Text style={styles.jobCardTitle}>{job.title}</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity
                      //    onPress={() => handleEdit(job)}
                      >
                        <Edit3 color="#87CEEB" size={18} />
                      </TouchableOpacity>
                      <TouchableOpacity
                      //   onPress={() => handleDelete(job._id)}
                      >
                        <Trash2 color="red" size={18} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.jobCardCompany}>{job.company}</Text>
                  <Text style={styles.jobCardSalary}>
                    {job.salary?.currency} {job.salary?.min} - {job.salary?.max}{' '}
                    / {job.salary?.salaryType || job.salary?.period}
                  </Text>

                  <View style={styles.jobCardFooter}>
                    <Text style={styles.jobCardApplications}>
                      {job.applications || 0} applications
                    </Text>
                    <View style={styles.viewsContainer}>
                      <Eye color="#666" size={14} />
                      <Text style={styles.viewsText}>{job.views || 0}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: job.isActive ? '#E8F5E8' : '#FFF3E0',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: job.isActive ? '#388E3C' : '#F57C00' },
                        ]}
                      >
                        {job.isActive ? 'active' : 'inactive'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
          </View>
        )}
      </View>

      {/* ➕ Add Job Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Job</Text>

            <ScrollView
              style={{ maxHeight: '80%' }}
              showsVerticalScrollIndicator={false}
            >
              {/* Basic Info */}
              <TextInput
                style={styles.input}
                placeholder="Job Title *"
                value={job.title}
                onChangeText={(val) => handleChange('title', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Company *"
                value={job.company}
                onChangeText={(val) => handleChange('company', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Location *"
                value={job.location}
                onChangeText={(val) => handleChange('location', val)}
              />

              {/* Job Type Dropdown */}
              <Text style={styles.fieldLabel}>Job Type *</Text>
              <CustomDropdown
                value={job.type}
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
                  value={job.salaryMin}
                  onChangeText={(val) => handleChange('salaryMin', val)}
                />
                <TextInput
                  style={[styles.input, styles.salaryInput]}
                  placeholder="Max Salary *"
                  keyboardType="numeric"
                  value={job.salaryMax}
                  onChangeText={(val) => handleChange('salaryMax', val)}
                />
              </View>

              <View style={styles.salaryRow}>
                {/* Currency Dropdown */}
                <View style={styles.halfWidth}>
                  <Text style={styles.fieldLabel}>Currency</Text>
                  <CustomDropdown
                    value={job.currency}
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
                    value={job.salaryPeriod}
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
                value={job.description}
                multiline
                numberOfLines={4}
                onChangeText={(val) => handleChange('description', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Requirements (comma separated)"
                value={job.requirements}
                onChangeText={(val) => handleChange('requirements', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Responsibilities (comma separated)"
                value={job.responsibilities}
                onChangeText={(val) => handleChange('responsibilities', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Benefits (comma separated)"
                value={job.benefits}
                onChangeText={(val) => handleChange('benefits', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Skills Required (comma separated)"
                value={job.skills}
                onChangeText={(val) => handleChange('skills', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Experience Required"
                value={job.experience}
                onChangeText={(val) => handleChange('experience', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="Education Required"
                value={job.education}
                onChangeText={(val) => handleChange('education', val)}
              />
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveJob}
              >
                <Text style={styles.saveButtonText}>Save Job</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {
       jobDetails && (
        <JobDetails
          jobDetails={jobDetails}
          jobId={jobId}
          setJobDetails={setJobDetails}
          />
        )
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  filterButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 10,
  },
  addButton: { backgroundColor: '#87CEEB', padding: 12, borderRadius: 12 },
  jobsGrid: { gap: 16 },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  jobCardCompany: { fontSize: 14, color: '#6c757d', marginBottom: 4 },
  jobCardSalary: {
    fontSize: 14,
    color: '#87CEEB',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobCardApplications: { fontSize: 12, color: '#6c757d' },
  viewsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewsText: { fontSize: 12, color: '#6c757d' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: { fontSize: 12, fontWeight: 'bold' },

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

  // Form Styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '500',
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

  // Dropdown Styles
  dropdownContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#495057',
  },
  dropdownOptions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#495057',
  },
  selectedOptionText: {
    color: '#1976d2',
    fontWeight: '500',
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

  // Empty State
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
});
