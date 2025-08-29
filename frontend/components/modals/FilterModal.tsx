// components/FilterModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import Slider from '@react-native-community/slider'; // You'll need to install this

interface FilterOptions {
  jobTypes: string[];
  experienceLevels: string[];
  locations: string[];
  companies: string[];
  skills: string[];
  salaryRange: {
    min: number;
    max: number;
  };
}

interface Filters {
  jobTypes: string[];
  experienceLevels: string[];
  locations: string[];
  minSalary: number;
  maxSalary: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterOptions: FilterOptions | null;
  activeFilters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filterOptions,
  activeFilters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [tempFilters, setTempFilters] = useState<Filters>(activeFilters);

  useEffect(() => {
    setTempFilters(activeFilters);
  }, [activeFilters, visible]);

  const toggleArrayFilter = (type: keyof Pick<Filters, 'jobTypes' | 'experienceLevels' | 'locations'>, value: string) => {
    setTempFilters(prev => {
      const currentArray = prev[type];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [type]: newArray };
    });
  };

  const renderCheckboxSection = (
    title: string,
    options: string[],
    selectedValues: string[],
    filterType: keyof Pick<Filters, 'jobTypes' | 'experienceLevels' | 'locations'>
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.checkboxContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.checkboxItem}
            onPress={() => toggleArrayFilter(filterType, option)}
          >
            <View style={[
              styles.checkbox,
              selectedValues.includes(option) && styles.checkboxSelected
            ]}>
              {selectedValues.includes(option) && (
                <Check size={14} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (tempFilters.jobTypes.length > 0) count += tempFilters.jobTypes.length;
    if (tempFilters.experienceLevels.length > 0) count += tempFilters.experienceLevels.length;
    if (tempFilters.locations.length > 0) count += tempFilters.locations.length;
    if (filterOptions && tempFilters.minSalary > filterOptions.salaryRange.min) count++;
    if (filterOptions && tempFilters.maxSalary < filterOptions.salaryRange.max) count++;
    return count;
  };

  if (!filterOptions) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={onClearFilters}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Job Types */}
          {renderCheckboxSection(
            'Job Type',
            filterOptions.jobTypes,
            tempFilters.jobTypes,
            'jobTypes'
          )}

          {/* Experience Levels */}
          {renderCheckboxSection(
            'Experience Level',
            filterOptions.experienceLevels,
            tempFilters.experienceLevels,
            'experienceLevels'
          )}

          {/* Locations */}
          {renderCheckboxSection(
            'Location',
            filterOptions.locations,
            tempFilters.locations,
            'locations'
          )}

          {/* Salary Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Salary Range</Text>
            <View style={styles.salaryContainer}>
              <Text style={styles.salaryLabel}>
                ${tempFilters.minSalary.toLocaleString()} - ${tempFilters.maxSalary.toLocaleString()}
              </Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Min Salary</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.salaryRange.min}
                  maximumValue={filterOptions.salaryRange.max}
                  value={tempFilters.minSalary}
                  onValueChange={(value) => 
                    setTempFilters(prev => ({ ...prev, minSalary: Math.round(value) }))
                  }
                  minimumTrackTintColor="#3B82F6"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#3B82F6"

                />
                <Text style={styles.sliderLabel}>Max Salary</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={filterOptions.salaryRange.min}
                  maximumValue={filterOptions.salaryRange.max}
                  value={tempFilters.maxSalary}
                  onValueChange={(value) => 
                    setTempFilters(prev => ({ ...prev, maxSalary: Math.round(value) }))
                  }
                  minimumTrackTintColor="#3B82F6"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#3B82F6"

                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => onApplyFilters(tempFilters)}
          >
            <Text style={styles.applyButtonText}>
              Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// components/SortModal.tsx
interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: string;
  sortOrder: string;
  onApplySort: (sortBy: string, sortOrder: string) => void;
}

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  sortBy,
  sortOrder,
  onApplySort,
}) => {
  const sortOptions = [
    { key: 'postedDate', label: 'Date Posted', orders: ['desc', 'asc'] },
    { key: 'salary', label: 'Salary', orders: ['desc', 'asc'] },
    { key: 'experience', label: 'Experience Level', orders: ['asc', 'desc'] },
  ];

  const orderLabels = {
    desc: { postedDate: 'Newest First', salary: 'Highest First', experience: 'Senior First' },
    asc: { postedDate: 'Oldest First', salary: 'Lowest First', experience: 'Entry First' },
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      transparent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sortContainer}>
          {/* Header */}
          <View style={styles.sortHeader}>
            <Text style={styles.sortHeaderTitle}>Sort Jobs</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View style={styles.sortContent}>
            {sortOptions.map((option) => (
              <View key={option.key} style={styles.sortOptionGroup}>
                <Text style={styles.sortOptionTitle}>{option.label}</Text>
                {option.orders.map((order) => (
                  <TouchableOpacity
                    key={`${option.key}-${order}`}
                    style={styles.sortOption}
                    onPress={() => onApplySort(option.key, order)}
                  >
                    <View style={[
                      styles.sortRadio,
                      sortBy === option.key && sortOrder === order && styles.sortRadioSelected
                    ]}>
                      {sortBy === option.key && sortOrder === order && (
                        <View style={styles.sortRadioInner} />
                      )}
                    </View>
                    <Text style={[
                      styles.sortOptionText,
                      sortBy === option.key && sortOrder === order && styles.sortOptionTextSelected
                    ]}>
                      {orderLabels[order as 'asc' | 'desc'][option.key as keyof typeof orderLabels.asc]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Filter Modal Styles
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearButton: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minWidth: '45%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  salaryContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  sliderThumb: {
    backgroundColor: '#3B82F6',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Sort Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sortContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  sortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sortHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sortContent: {
    padding: 20,
  },
  sortOptionGroup: {
    marginBottom: 24,
  },
  sortOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sortRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortRadioSelected: {
    borderColor: '#3B82F6',
  },
  sortRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  sortOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
});

// Add to the main JobsScreen styles
const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  searchHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    marginHorizontal: 6,
  },
  jobsList: {
    flex: 1,
  },
  jobsContent: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  applicationsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  skillText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  refreshButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export { FilterModal, SortModal, mainStyles as styles };