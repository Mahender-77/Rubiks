// app/(tabs)/jobs.tsx - Updated with Fixed Search & Pagination
import { useRouter } from 'expo-router';
import {
  Bookmark,
  Building,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  IndianRupee,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Share,
  SlidersHorizontal,
  X,
  Briefcase,
  AlertCircle,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState, useCallback, JSX } from 'react';
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
import { fetchJobsAPI, jobFilter } from '../../../utils/api';


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

  const percentage =
    ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  const handlePress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const newValue =
      minimumValue + (locationX / sliderWidth) * (maximumValue - minimumValue);
    const clampedValue = Math.max(
      minimumValue,
      Math.min(maximumValue, newValue)
    );
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

// Filter Modal Component (keeping the same as before)
const FilterModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  filterOptions: FilterOptions | null;
  activeFilters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}> = ({
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

  const toggleFilter = (category: keyof Filters, value: string) => {
    setTempFilters((prev) => {
      const categoryFilters = prev[category] as string[];
      const isSelected = categoryFilters.includes(value);

      return {
        ...prev,
        [category]: isSelected
          ? categoryFilters.filter((item) => item !== value)
          : [...categoryFilters, value],
      };
    });
  };

  const renderFilterSection = (
    title: string,
    options: string[],
    category: keyof Filters
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterOption,
              (tempFilters[category] as string[]).includes(option) &&
                styles.filterOptionSelected,
            ]}
            onPress={() => toggleFilter(category, option)}
          >
            <Text
              style={[
                styles.filterOptionText,
                (tempFilters[category] as string[]).includes(option) &&
                  styles.filterOptionTextSelected,
              ]}
            >
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
          ${tempFilters.minSalary.toLocaleString()} - $
          {tempFilters.maxSalary.toLocaleString()}
        </Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Min: ${tempFilters.minSalary.toLocaleString()}
          </Text>
          <CustomSlider
            style={styles.slider}
            minimumValue={filterOptions?.salaryRange.min || 0}
            maximumValue={filterOptions?.salaryRange.max || 200000}
            value={tempFilters.minSalary}
            onValueChange={(value) =>
              setTempFilters((prev) => ({
                ...prev,
                minSalary: Math.round(value),
              }))
            }
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Max: ${tempFilters.maxSalary.toLocaleString()}
          </Text>
          <CustomSlider
            style={styles.slider}
            minimumValue={filterOptions?.salaryRange.min || 0}
            maximumValue={filterOptions?.salaryRange.max || 200000}
            value={tempFilters.maxSalary}
            onValueChange={(value) =>
              setTempFilters((prev) => ({
                ...prev,
                maxSalary: Math.round(value),
              }))
            }
          />
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter Jobs</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {filterOptions?.jobTypes &&
            renderFilterSection('Job Type', filterOptions.jobTypes, 'jobTypes')}
          {filterOptions?.experienceLevels &&
            renderFilterSection(
              'Experience Level',
              filterOptions.experienceLevels,
              'experienceLevels'
            )}
          {filterOptions?.locations &&
            renderFilterSection(
              'Location',
              filterOptions.locations,
              'locations'
            )}
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

// Sort Modal Component (keeping the same as before)
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
                  tempSortBy === option.key && styles.sortOptionSelected,
                ]}
                onPress={() => setTempSortBy(option.key)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    tempSortBy === option.key && styles.sortOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {tempSortBy === option.key && (
                  <Check size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}

            <Text style={[styles.sortSectionTitle, { marginTop: 20 }]}>
              Order
            </Text>
            <TouchableOpacity
              style={[
                styles.sortOption,
                tempSortOrder === 'desc' && styles.sortOptionSelected,
              ]}
              onPress={() => setTempSortOrder('desc')}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  tempSortOrder === 'desc' && styles.sortOptionTextSelected,
                ]}
              >
                Newest First
              </Text>
              {tempSortOrder === 'desc' && <Check size={16} color="#3B82F6" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                tempSortOrder === 'asc' && styles.sortOptionSelected,
              ]}
              onPress={() => setTempSortOrder('asc')}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  tempSortOrder === 'asc' && styles.sortOptionTextSelected,
                ]}
              >
                Oldest First
              </Text>
              {tempSortOrder === 'asc' && <Check size={16} color="#3B82F6" />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sortApplyButton}
            onPress={handleApply}
          >
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
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [activeFilters, setActiveFilters] = useState<Filters>({
    jobTypes: [],
    experienceLevels: [],
    locations: [],
    minSalary: 0,
    maxSalary: 200000,
  });

  // Pagination States (Changed from infinite scroll to pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const JOBS_PER_PAGE = 6; // Changed to 5 jobs per page

  // Sorting States
  const [sortBy, setSortBy] = useState('postedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortModal, setShowSortModal] = useState(false);

  const searchTimeoutRef = useRef<any>(null);
  const initialLoadRef = useRef(false);

  // Initialize component - only run once
  useEffect(() => {
    const initialize = async () => {
      if (initialLoadRef.current) return;
      initialLoadRef.current = true;

      setLoading(true);
      setError(null);

      try {
        await fetchFilterOptions();
        await fetchJobs(true, 1);
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Handle search with debounce (Fixed - no page reload)
  useEffect(() => {
    if (!initialLoadRef.current) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set search loading when user is typing
    if (searchQuery.length > 0) {
      setSearchLoading(true);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchJobs(true, 1);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle filter and sort changes
  useEffect(() => {
    if (!initialLoadRef.current) return;
    setCurrentPage(1); // Reset to first page when filters change
    fetchJobs(true, 1);
  }, [activeFilters, sortBy, sortOrder]);

  const fetchFilterOptions = async () => {
    try {
      const data = await jobFilter();
      if (data.success) {
        setFilterOptions(data.filterOptions);
        setActiveFilters((prev) => ({
          ...prev,
          minSalary: data.filterOptions.salaryRange.min,
          maxSalary: data.filterOptions.salaryRange.max,
        }));
      }
    } catch (error) {
      console.error('Fetch filter options error:', error);
      setFilterOptions({
        jobTypes: ['full-time', 'part-time', 'contract', 'internship'],
        experienceLevels: ['entry', 'mid', 'senior', 'lead'],
        locations: [
          'New York',
          'San Francisco',
          'Los Angeles',
          'Chicago',
          'Remote',
        ],
        companies: [],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Java'],
        salaryRange: { min: 0, max: 200000 },
      });
    }
  };

  const fetchJobs = async (reset = false, page = 1) => {
    try {
      if (reset && !loading) {
        setSearchLoading(true);
      }

      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: JOBS_PER_PAGE.toString(), // Changed to 5
        sortBy,
        sortOrder,
      });

      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (activeFilters.jobTypes.length > 0)
        params.append('jobTypes', activeFilters.jobTypes.join(','));
      if (activeFilters.experienceLevels.length > 0)
        params.append(
          'experienceLevels',
          activeFilters.experienceLevels.join(',')
        );
      if (activeFilters.locations.length > 0)
        params.append('locations', activeFilters.locations.join(','));
      if (activeFilters.minSalary > 0)
        params.append('minSalary', activeFilters.minSalary.toString());
      if (activeFilters.maxSalary < 200000)
        params.append('maxSalary', activeFilters.maxSalary.toString());

      const data = await fetchJobsAPI(params);

      if (data.success) {
        setJobs(data.jobs || []);
        setCurrentPage(data.pagination?.current || page);
        setTotalPages(data.pagination?.pages || 1);
        setTotalJobs(data.pagination?.total || 0);
      } else {
        setError(data.message || 'Failed to fetch jobs');
        setJobs([]);
      }
    } catch (error) {
      console.error('Fetch jobs error:', error);
      setError('Network error occurred. Please check your connection.');
      setJobs([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    setCurrentPage(1);
    fetchJobs(true, 1);
  }, [searchQuery, activeFilters, sortBy, sortOrder]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchJobs(true, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchJobs(true, newPage);
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchJobs(true, page);
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
    if (activeFilters.jobTypes.length > 0)
      count += activeFilters.jobTypes.length;
    if (activeFilters.experienceLevels.length > 0)
      count += activeFilters.experienceLevels.length;
    if (activeFilters.locations.length > 0)
      count += activeFilters.locations.length;
    if (activeFilters.minSalary > (filterOptions?.salaryRange.min || 0))
      count++;
    if (activeFilters.maxSalary < (filterOptions?.salaryRange.max || 200000))
      count++;
    return count;
  };

  const formatSalary = (salary: any) => {
    if (!salary) return 'Salary not specified';
    return `₹${salary.min.toLocaleString()} - ₹${salary.max.toLocaleString()}`;
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
      case 'full-time':
        return '#10B981';
      case 'part-time':
        return '#3B82F6';
      case 'contract':
        return '#F59E0B';
      case 'internship':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => router.push(`/jobs/${item._id}`)} // This will navigate to job details
    >
      <View style={styles.jobHeader}>
        <View style={styles.companyInfo}>
          <View style={styles.companyLogo}>
            <Building size={20} color="#6B7280" />
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.companyName}>{item.company}</Text>
          </View>
        </View>
        <View
          style={[
            styles.jobType,
            { backgroundColor: getJobTypeColor(item.type) + '20' },
          ]}
        >
          <Text
            style={[styles.jobTypeText, { color: getJobTypeColor(item.type) }]}
          >
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
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Text style={[styles.detailText, { flex: 0 }]}>
                {formatSalary(item.salary)}
              </Text>
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
            <Text style={styles.moreSkills}>
              +{item.skills.length - 3} more
            </Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.resultsText}>
        {searchLoading ? 'Searching...' : `${totalJobs} jobs found`}
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

  // New Pagination Component
 const renderPagination = () => {
  if (totalPages <= 1) return null;

  const maxVisiblePages = 10; // only show 10 at once
  let startPage = Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  const pages: JSX.Element[] = [];

  // Left indicator
  if (startPage > 1) {
    pages.push(
      <TouchableOpacity
        key="left"
        style={styles.pageIndicator}
        onPress={() => handlePageChange(startPage - 1)}
      >
        <Text style={styles.pageIndicatorText}>‹</Text>
      </TouchableOpacity>
    );
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <TouchableOpacity
        key={i}
        style={[
          styles.pageNumber,
          i === currentPage && styles.pageNumberActive,
        ]}
        onPress={() => handlePageChange(i)}
      >
        <Text
          style={[
            styles.pageNumberText,
            i === currentPage && styles.pageNumberTextActive,
          ]}
        >
          {i}
        </Text>
      </TouchableOpacity>
    );
  }

  // Right indicator
  if (endPage < totalPages) {
    pages.push(
      <TouchableOpacity
        key="right"
        style={styles.pageIndicator}
        onPress={() => handlePageChange(endPage + 1)}
      >
        <Text style={styles.pageIndicatorText}>›</Text>
      </TouchableOpacity>
    );
  }

  return <View style={styles.pageNumbersContainer}>{pages}</View>;
};


  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Briefcase size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>
        {error ? 'Oops! Something went wrong' : 'No jobs available'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {error
          ? error
          : searchQuery || getActiveFilterCount() > 0
          ? 'Try adjusting your search criteria or filters'
          : 'New job opportunities will appear here soon'}
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <RefreshCw size={16} color="#3B82F6" />
        <Text style={styles.refreshButtonText}>
          {error ? 'Try Again' : 'Refresh'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing && !searchLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Finding the best jobs for you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header - Fixed, won't reload */}
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
          style={[
            styles.filterButton,
            getActiveFilterCount() > 0 && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter
            size={20}
            color={getActiveFilterCount() > 0 ? '#FFFFFF' : '#6B7280'}
          />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {getActiveFilterCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Job List Content Area - Only this part refreshes */}
      <View style={styles.contentContainer}>
        {searchLoading && (
          <View style={styles.searchLoadingContainer}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.searchLoadingText}>Searching jobs...</Text>
          </View>
        )}

        <FlatList
          data={jobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item._id}
          style={styles.jobsList}
          contentContainerStyle={styles.jobsContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={jobs.length > 0 ? renderListHeader : null}
          ListFooterComponent={renderPagination}
          ListEmptyComponent={renderEmptyState}
        />
      </View>

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

// Updated Styles with Pagination
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
    textAlign: 'center',
  },
  searchHeader: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
  },
  searchLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  searchLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  jobsList: {
    flex: 1,
  },
  jobsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonText: {
    marginLeft: 8,
    marginRight: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  companyLogo: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  applicationsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 100,
    alignSelf: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  applyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // New Pagination Styles
pageNumbersContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 10,
  flexWrap: 'nowrap',
},
  paginationContainer: {
    backgroundColor: '#FFFFFF',

    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paginationInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  paginationText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginHorizontal: 4,
  },
  paginationButtonTextDisabled: {
    color: '#D1D5DB',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
pageNumber: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  marginHorizontal: 2,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#ccc',
},
pageNumberActive: {
  backgroundColor: '#2563EB',
  borderColor: '#2563EB',
},
pageNumberText: {
  fontSize: 14,
  color: '#333',
},
pageNumberTextActive: {
  color: '#fff',
  fontWeight: 'bold',
},
pageIndicator: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  marginHorizontal: 4,
},
pageIndicatorText: {
  fontSize: 16,
  color: '#2563EB',
  fontWeight: 'bold',
},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#F3F4F6',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  refreshButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },

  // Modal Styles (keeping existing ones)
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  salaryRangeContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  slider: {
    height: 40,
  },
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
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  sliderTrackActive: {
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
    position: 'absolute',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    position: 'absolute',
    top: -7,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6B7280',
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  sortModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sortOptions: {
    padding: 16,
  },
  sortSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  sortOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  sortOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  sortApplyButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  sortApplyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
