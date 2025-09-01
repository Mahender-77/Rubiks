// app/(tabs)/jobs.tsx - Complete Enhanced Jobs Screen
import { useRouter } from 'expo-router';
import {
  Bookmark,
  Building,
  Check,
  ChevronDown,
  Clock,
  IndianRupee ,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Share,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchJobsAPI, jobFilter } from '../../utils/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    salaryType: string;
  };
  description: string;
  skills: string[];
  experience: string;
  postedDate: string;
  applications: number;
  views: number;
}

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

// Custom Slider Component
const CustomSlider: React.FC<{
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
  style?: any;
}> = ({ value, minimumValue, maximumValue, onValueChange, style }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;
  
  const handlePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const newValue = minimumValue + (locationX / sliderWidth) * (maximumValue - minimumValue);
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
    onValueChange(Math.round(clampedValue));
  };

  return (
    <View style={[styles.customSlider, style]}>
      <TouchableOpacity
        style={styles.sliderTrack}
        onPress={handlePress}
        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        activeOpacity={1}
      >
        <View style={styles.sliderTrackInactive} />
        <View style={[styles.sliderTrackActive, { width: `${percentage}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
      </TouchableOpacity>
    </View>
  );
};

// Filter Modal Component
const FilterModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  filterOptions: FilterOptions | null;
  activeFilters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}> = ({ visible, onClose, filterOptions, activeFilters, onApplyFilters, onClearFilters }) => {
  const [tempFilters, setTempFilters] = useState<Filters>(activeFilters);

  useEffect(() => {
    setTempFilters(activeFilters);
  }, [activeFilters, visible]);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setTempFilters(prev => {
      const categoryFilters = prev[category] as string[];
      const isSelected = categoryFilters.includes(value);
      
      return {
        ...prev,
        [category]: isSelected 
          ? categoryFilters.filter(item => item !== value)
          : [...categoryFilters, value]
      };
    });
  };

  const renderFilterSection = (title: string, options: string[], category: keyof Filters) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map((option,index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterOption,
              (tempFilters[category] as string[]).includes(option) && styles.filterOptionSelected
            ]}
            onPress={() => toggleFilter(category, option)}
          >
            <Text style={[
              styles.filterOptionText,
              (tempFilters[category] as string[]).includes(option) && styles.filterOptionTextSelected
            ]}>
              {option}
            </Text>
            {(tempFilters[category] as string[]).includes(option) && (
              <Check size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSalaryRange = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>Salary Range</Text>
      <View style={styles.salaryRangeContainer}>
        <Text style={styles.salaryLabel}>
          ${tempFilters.minSalary.toLocaleString()} - ${tempFilters.maxSalary.toLocaleString()}
        </Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Min: ${tempFilters.minSalary.toLocaleString()}</Text>
          <CustomSlider
            style={styles.slider}
            minimumValue={filterOptions?.salaryRange.min || 0}
            maximumValue={filterOptions?.salaryRange.max || 200000}
            value={tempFilters.minSalary}
            onValueChange={(value) => setTempFilters(prev => ({ ...prev, minSalary: Math.round(value) }))}
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Max: ${tempFilters.maxSalary.toLocaleString()}</Text>
          <CustomSlider
            style={styles.slider}
            minimumValue={filterOptions?.salaryRange.min || 0}
            maximumValue={filterOptions?.salaryRange.max || 200000}
            value={tempFilters.maxSalary}
            onValueChange={(value) => setTempFilters(prev => ({ ...prev, maxSalary: Math.round(value) }))}
          />
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Jobs</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {filterOptions?.jobTypes && renderFilterSection('Job Type', filterOptions.jobTypes, 'jobTypes')}
          {filterOptions?.experienceLevels && renderFilterSection('Experience Level', filterOptions.experienceLevels, 'experienceLevels')}
          {filterOptions?.locations && renderFilterSection('Location', filterOptions.locations, 'locations')}
          {renderSalaryRange()}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.applyButton} 
            onPress={() => onApplyFilters(tempFilters)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Sort Modal Component
const SortModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  sortBy: string;
  sortOrder: string;
  onApplySort: (sortBy: string, sortOrder: string) => void;
}> = ({ visible, onClose, sortBy, sortOrder, onApplySort }) => {
  const [tempSortBy, setTempSortBy] = useState(sortBy);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);

  const sortOptions = [
    { key: 'postedDate', label: 'Date Posted' },
    { key: 'salary.min', label: 'Salary' },
    { key: 'applications', label: 'Applications' },
    { key: 'company', label: 'Company Name' },
    { key: 'title', label: 'Job Title' },
  ];

  const handleApply = () => {
    onApplySort(tempSortBy, tempSortOrder);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.sortModalOverlay}>
        <View style={styles.sortModalContainer}>
          <View style={styles.sortModalHeader}>
            <Text style={styles.sortModalTitle}>Sort Jobs</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.sortOptions}>
            <Text style={styles.sortSectionTitle}>Sort By</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  tempSortBy === option.key && styles.sortOptionSelected
                ]}
                onPress={() => setTempSortBy(option.key)}
              >
                <Text style={[
                  styles.sortOptionText,
                  tempSortBy === option.key && styles.sortOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {tempSortBy === option.key && (
                  <Check size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}

            <Text style={[styles.sortSectionTitle, { marginTop: 20 }]}>Order</Text>
            <TouchableOpacity
              style={[
                styles.sortOption,
                tempSortOrder === 'desc' && styles.sortOptionSelected
              ]}
              onPress={() => setTempSortOrder('desc')}
            >
              <Text style={[
                styles.sortOptionText,
                tempSortOrder === 'desc' && styles.sortOptionTextSelected
              ]}>
                Newest First
              </Text>
              {tempSortOrder === 'desc' && (
                <Check size={16} color="#3B82F6" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sortOption,
                tempSortOrder === 'asc' && styles.sortOptionSelected
              ]}
              onPress={() => setTempSortOrder('asc')}
            >
              <Text style={[
                styles.sortOptionText,
                tempSortOrder === 'asc' && styles.sortOptionTextSelected
              ]}>
                Oldest First
              </Text>
              {tempSortOrder === 'asc' && (
                <Check size={16} color="#3B82F6" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sortApplyButton} onPress={handleApply}>
            <Text style={styles.sortApplyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main Component
export default function JobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    jobTypes: [],
    experienceLevels: [],
    locations: [],
    minSalary: 0,
    maxSalary: 200000,
  });
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  
  // Sorting States
  const [sortBy, setSortBy] = useState('postedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortModal, setShowSortModal] = useState(false);

 const searchTimeoutRef = useRef<any>(null);


  useEffect(() => {
    fetchFilterOptions();
    fetchJobs(true);
  }, []);

  useEffect(() => {
    // Debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchJobs(true);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeFilters, sortBy, sortOrder]);

  const fetchFilterOptions = async () => {
    try {
      const data = await jobFilter()
     if (data.success) {
        setFilterOptions(data.filterOptions);
        // Set initial salary range
        setActiveFilters(prev => ({
          ...prev,
          minSalary: data.filterOptions.salaryRange.min,
          maxSalary: data.filterOptions.salaryRange.max,
        }));
      }
    } catch (error) {
      console.error('Fetch filter options error:', error);
      // Fallback filter options for development
      setFilterOptions({
        jobTypes: ['full-time', 'part-time', 'contract', 'internship'],
        experienceLevels: ['entry', 'mid', 'senior', 'lead'],
        locations: ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Remote'],
        companies: [],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Java'],
        salaryRange: { min: 0, max: 200000 }
      });
    }
  };

  const fetchJobs = async (reset = false, page = 1) => {
    if (reset) {
      setLoading(true);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5',
        sortBy,
        sortOrder,
      });

      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (activeFilters.jobTypes.length > 0) params.append('jobTypes', activeFilters.jobTypes.join(','));
      if (activeFilters.experienceLevels.length > 0) params.append('experienceLevels', activeFilters.experienceLevels.join(','));
      if (activeFilters.locations.length > 0) params.append('locations', activeFilters.locations.join(','));
      if (activeFilters.minSalary > 0) params.append('minSalary', activeFilters.minSalary.toString());
      if (activeFilters.maxSalary < 200000) params.append('maxSalary', activeFilters.maxSalary.toString());

      // const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/jobs?${params.toString()}`);
     
      const data = await fetchJobsAPI(params);
      
      if (data.success) {
        if (reset) {
          setJobs(data.jobs);
        } else {
          setJobs(prev => [...prev, ...data.jobs]);
        }
        
        setCurrentPage(data.pagination.current);
        setTotalPages(data.pagination.pages);
        setTotalJobs(data.pagination.total);
      } else {
        Alert.alert('Error', 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Fetch jobs error:', error);
      Alert.alert('Error', 'Network error occurred');
      // Fallback mock data for development
      if (reset) {
        setJobs(mockJobs);
        setTotalJobs(mockJobs.length);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs(true);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchJobs(false, currentPage + 1);
    }
  };

  const applyFilters = (newFilters: Filters) => {
    setActiveFilters(newFilters);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      jobTypes: [],
      experienceLevels: [],
      locations: [],
      minSalary: filterOptions?.salaryRange.min || 0,
      maxSalary: filterOptions?.salaryRange.max || 200000,
    };
    setActiveFilters(clearedFilters);
    setShowFilterModal(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.jobTypes.length > 0) count += activeFilters.jobTypes.length;
    if (activeFilters.experienceLevels.length > 0) count += activeFilters.experienceLevels.length;
    if (activeFilters.locations.length > 0) count += activeFilters.locations.length;
    if (activeFilters.minSalary > (filterOptions?.salaryRange.min || 0)) count++;
    if (activeFilters.maxSalary < (filterOptions?.salaryRange.max || 200000)) count++;
    return count;
  };

  const formatSalary = (salary: any) => {
    if (!salary) return 'Salary not specified';
    return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return '#10B981';
      case 'part-time': return '#3B82F6';
      case 'contract': return '#F59E0B';
      case 'internship': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => router.push(`/jobs/${item._id}`)}
    >
      <View style={styles.jobHeader}>
        <View style={styles.companyInfo}>
          <View style={styles.companyLogo}>
            <Building size={20} color="#6B7280" />
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.companyName}>{item.company}</Text>
          </View>
        </View>
        <View style={[styles.jobType, { backgroundColor: getJobTypeColor(item.type) + '20' }]}>
          <Text style={[styles.jobTypeText, { color: getJobTypeColor(item.type) }]}>
            {item.type.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          {item.salary && (
            <View style={styles.detailItem}>
              <IndianRupee size={14} color="#6B7280" />
              <Text style={styles.detailText}>{formatSalary(item.salary)}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.detailText}>{formatDate(item.postedDate)}</Text>
          </View>
          
          <Text style={styles.applicationsText}>
            {item.applications} applications
          </Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.skillsContainer}>
          {item.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {item.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{item.skills.length - 3} more</Text>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.resultsText}>
        {totalJobs} jobs found
      </Text>
      
      <TouchableOpacity 
        style={styles.sortButton}
        onPress={() => setShowSortModal(true)}
      >
        <SlidersHorizontal size={16} color="#6B7280" />
        <Text style={styles.sortButtonText}>Sort</Text>
        <ChevronDown size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  const renderListFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text style={styles.loadingMoreText}>Loading more jobs...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Finding the best jobs for you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies, or keywords"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, getActiveFilterCount() > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color={getActiveFilterCount() > 0 ? "#FFFFFF" : "#6B7280"} />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Job List */}
      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item._id}
        style={styles.jobsList}
        contentContainerStyle={styles.jobsContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search criteria or filters
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <RefreshCw size={16} color="#3B82F6" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onApplySort={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
          setShowSortModal(false);
        }}
      />
    </View>
  );
}

// Mock data for development
const mockJobs: Job[] = [
  {
    _id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD',
      salaryType: 'annual'
    },
    description: 'We are looking for a senior frontend developer...',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    experience: 'senior',
    postedDate: '2024-01-15',
    applications: 45,
    views: 234
  },
  {
    _id: '2',
    title: 'Backend Engineer',
    company: 'StartupCo',
    location: 'Remote',
    type: 'contract',
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD',
      salaryType: 'annual'
    },
    description: 'Join our backend team...',
    skills: ['Node.js', 'Python', 'MongoDB', 'AWS'],
    experience: 'mid',
    postedDate: '2024-01-12',
    applications: 23,
    views: 156
  }
];

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },

  // Search Header
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  // List Header
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Job List
  jobsList: {
    flex: 1,
  },
  jobsContent: {
    paddingBottom: 20,
  },

  // Job Card
  jobCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
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
    marginBottom: 4,
    lineHeight: 20,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  jobType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  jobTypeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  jobDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  applicationsText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  skillText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  // Filter Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  filterOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  salaryRangeContainer: {
    paddingVertical: 8,
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    marginVertical: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },

  // Custom Slider Styles
  customSlider: {
    height: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    position: 'relative',
  },
  sliderTrackInactive: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  sliderTrackActive: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    top: -7,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Sort Modal Styles
  sortModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sortModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  sortModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sortOptions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sortSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortOptionSelected: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    marginHorizontal: -12,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  sortOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  sortApplyButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sortApplyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});