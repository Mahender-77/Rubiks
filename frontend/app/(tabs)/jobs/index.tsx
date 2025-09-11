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
  useColorScheme,
  View,
} from 'react-native';
import { fetchJobsAPI, jobFilter } from '../../../utils/api';
import Colors from '../../../constants/Colors';

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
  const colorScheme = useColorScheme() ?? 'light';

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
    <View
      style={[
        {
          height: 40,
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={{
          height: 6,
          backgroundColor: Colors[colorScheme].background,
          borderRadius: 3,
          position: 'relative',
        }}
        onPress={handlePress}
        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        activeOpacity={1}
      >
        <View
          style={{
            height: 6,
            backgroundColor: Colors[colorScheme].lightBackground,
            borderRadius: 3,
          }}
        />
        <View
          style={[
            {
              height: 6,
              backgroundColor: Colors[colorScheme].text,
              borderRadius: 3,
              position: 'absolute',
            },
            { width: `${percentage}%` },
          ]}
        />
        <View
          style={[
            {
              width: 20,
              height: 20,
              backgroundColor: Colors[colorScheme].lightBackground,
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
            { left: `${percentage}%` },
          ]}
        />
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
  const colorScheme = useColorScheme() ?? 'light';

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
    <View
      style={{
        marginBottom: 24,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: Colors[colorScheme].text,
          marginBottom: 12,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: Colors[colorScheme].lightBackground,
                borderRadius: 8,
                marginRight: 8,
                marginBottom: 8,
              },
              (tempFilters[category] as string[]).includes(option) && {
                backgroundColor: Colors[colorScheme].text,
              },
            ]}
            onPress={() => toggleFilter(category, option)}
          >
            <Text
              style={[
                {
                  fontSize: 14,
                  color: Colors[colorScheme].text,
                  marginRight: 4,
                },
                (tempFilters[category] as string[]).includes(option) && {
                  color: Colors[colorScheme].darkText,
                },
              ]}
            >
              {option}
            </Text>
            {(tempFilters[category] as string[]).includes(option) && (
              <Check size={16} color={Colors[colorScheme].background} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSalaryRange = () => (
    <View
      style={{
        marginBottom: 24,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: Colors[colorScheme].text,
          marginBottom: 12,
        }}
      >
        Salary Range
      </Text>
      <View
        style={{
          backgroundColor: Colors[colorScheme].background,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: Colors[colorScheme].text,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          ${tempFilters.minSalary.toLocaleString()} - $
          {tempFilters.maxSalary.toLocaleString()}
        </Text>
        <View
          style={{
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme].text,
              marginBottom: 8,
            }}
          >
            Min: ${tempFilters.minSalary.toLocaleString()}
          </Text>
          <CustomSlider
            style={{ height: 40 }}
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
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme].text,
              marginBottom: 8,
            }}
          >
            Max: ${tempFilters.maxSalary.toLocaleString()}
          </Text>
          <CustomSlider
            style={{ height: 40 }}
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
      <View
        style={{
          flex: 1,
          backgroundColor: Colors[colorScheme].background,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors[colorScheme].borderColor,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: Colors[colorScheme].text,
            }}
          >
            Filter Jobs
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              backgroundColor: Colors[colorScheme].errorText,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <X size={24} color={Colors[colorScheme].darkText} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{
            flex: 1,
            padding: 16,
          }}
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

        <View
          style={{
            flexDirection: 'row',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: Colors[colorScheme].background,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: Colors[colorScheme].lightBackground,
              marginRight: 8,
              alignItems: 'center',
            }}
            onPress={onClearFilters}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme].text,
                fontWeight: '600',
              }}
            >
              Clear All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: Colors[colorScheme].text,
              alignItems: 'center',
            }}
            onPress={() => onApplyFilters(tempFilters)}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme].darkText,
                fontWeight: '600',
              }}
            >
              Apply Filters
            </Text>
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
  const colorScheme = useColorScheme() ?? 'light';

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
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: Colors[colorScheme].background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 32,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: Colors[colorScheme].background,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors[colorScheme].text,
              }}
            >
              Sort Jobs
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors[colorScheme].errorText} />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors[colorScheme].text,
                marginBottom: 12,
              }}
            >
              Sort By
            </Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: Colors[colorScheme].lightBackground,
                    borderRadius: 12,
                    marginBottom: 8,
                  },
                  tempSortBy === option.key && {
                    backgroundColor: Colors[colorScheme].text,
                  },
                ]}
                onPress={() => setTempSortBy(option.key)}
              >
                <Text
                  style={[
                    {
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                    },
                    tempSortBy === option.key && {
                      color: Colors[colorScheme].darkText,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {option.label}
                </Text>
                {tempSortBy === option.key && (
                  <Check size={16} color={Colors[colorScheme].darkText} />
                )}
              </TouchableOpacity>
            ))}

            <Text
              style={[
                {
                  fontSize: 16,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                  marginBottom: 12,
                  marginTop: 20,
                },
              ]}
            >
              Order
            </Text>
            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  borderRadius: 12,
                  marginBottom: 8,
                },
                tempSortOrder === 'desc' && {
                  backgroundColor: Colors[colorScheme].text,
                },
              ]}
              onPress={() => setTempSortOrder('desc')}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    color: Colors[colorScheme].text,
                  },
                  tempSortOrder === 'desc' && {
                    color: Colors[colorScheme].darkText,
                    fontWeight: '600',
                  },
                ]}
              >
                Newest First
              </Text>
              {tempSortOrder === 'desc' && (
                <Check size={16} color={Colors[colorScheme].darkText} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: Colors[colorScheme].lightBackground,
                  borderRadius: 12,
                  marginBottom: 8,
                },
                tempSortOrder === 'asc' && {
                  backgroundColor: Colors[colorScheme].text,
                },
              ]}
              onPress={() => setTempSortOrder('asc')}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    color: Colors[colorScheme].text,
                  },
                  tempSortOrder === 'asc' && {
                    color: Colors[colorScheme].darkText,
                    fontWeight: '600',
                  },
                ]}
              >
                Oldest First
              </Text>
              {tempSortOrder === 'asc' && (
                <Check size={16} color={Colors[colorScheme].darkText} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              marginHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: Colors[colorScheme].text,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={handleApply}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors[colorScheme].darkText,
                fontWeight: '600',
              }}
            >
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main Component
export default function JobsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
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
      style={{
        backgroundColor: Colors[colorScheme].background,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors[colorScheme].borderColor,
      }}
      onPress={() => router.push(`/jobs/${item._id}`)} // This will navigate to job details
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              backgroundColor: Colors[colorScheme].text,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Building size={20} color={Colors[colorScheme].darkText} />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors[colorScheme].text,
                lineHeight: 24,
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors[colorScheme].text,
              }}
            >
              {item.company}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              marginLeft: 12,
              backgroundColor: getJobTypeColor(item.type) + '20',
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: 12,
                fontWeight: '600',
                color: getJobTypeColor(item.type),
              },
            ]}
          >
            {item.type.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <MapPin size={14} color={Colors[colorScheme].text} />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 14,
                color: Colors[colorScheme].text,
                flex: 1,
              }}
            >
              {item.location}
            </Text>
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
              <Text
                style={[
                  {
                    color: Colors[colorScheme].text,
                  },
                ]}
              >
                {formatSalary(item.salary)}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Clock size={14} color={Colors[colorScheme].text} />
            <Text
              style={{
                marginLeft: 6,
                fontSize: 14,
                color: Colors[colorScheme].text,
                flex: 1,
              }}
            >
              {formatDate(item.postedDate)}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme].text,
              fontWeight: '500',
            }}
          >
            {item.applications} applications
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {item.skills.slice(0, 3).map((skill, index) => (
            <View
              key={index}
              style={{
                backgroundColor: Colors[colorScheme].lightBackground,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginRight: 6,
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].text,
                  fontWeight: '500',
                }}
              >
                {skill}
              </Text>
            </View>
          ))}
          {item.skills.length > 3 && (
            <Text style={{ fontSize: 12, color: Colors[colorScheme].text }}>
              +{item.skills.length - 3} more
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: 100,
            alignSelf: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: Colors[colorScheme].text,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: Colors[colorScheme].darkText,
                fontSize: 14,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: Colors[colorScheme].text,
          fontWeight: '500',
        }}
      >
        {searchLoading ? 'Searching...' : `${totalJobs} jobs found`}
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: Colors[colorScheme].background,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Colors[colorScheme].borderColor,
        }}
        onPress={() => setShowSortModal(true)}
      >
        <SlidersHorizontal size={16} color={Colors[colorScheme].text} />
        <Text
          style={{
            marginLeft: 8,
            marginRight: 4,
            fontSize: 14,
            color: Colors[colorScheme].text,
          }}
        >
          Sort
        </Text>
        <ChevronDown size={16} color={Colors[colorScheme].text} />
      </TouchableOpacity>
    </View>
  );

  // New Pagination Component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 10; // only show 10 at once
    let startPage =
      Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    const pages: JSX.Element[] = [];

    // Left indicator
    if (startPage > 1) {
      pages.push(
        <TouchableOpacity
          key="left"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginHorizontal: 4,
          }}
          onPress={() => handlePageChange(startPage - 1)}
        >
          <Text
            style={{
              fontSize: 16,
              color: Colors[colorScheme].text,
              fontWeight: 'bold',
            }}
          >
            ‹
          </Text>
        </TouchableOpacity>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            {
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginHorizontal: 2,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: Colors[colorScheme].text,
            },
            i === currentPage && {
              backgroundColor: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].text,
            },
          ]}
          onPress={() => handlePageChange(i)}
        >
          <Text
            style={[
              {
                fontSize: 14,
                color: Colors[colorScheme].text,
              },
              i === currentPage && {
                color: Colors[colorScheme].darkText,
                backgroundColor: Colors[colorScheme].text,
              },
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
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginHorizontal: 4,
          }}
          onPress={() => handlePageChange(endPage + 1)}
        >
          <Text
            style={{
              fontSize: 16,
              color: Colors[colorScheme].text,
              fontWeight: 'bold',
            }}
          >
            ›
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          flexWrap: 'nowrap',
        }}
      >
        {pages}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 64,
      }}
    >
      <View
        style={{
          width: 96,
          height: 96,
          backgroundColor: Colors[colorScheme].background,
          borderRadius: 48,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Briefcase size={64} color={Colors[colorScheme].darkText} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: Colors[colorScheme].text,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {error ? 'Oops! Something went wrong' : 'No jobs available'}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: Colors[colorScheme].text,
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 24,
        }}
      >
        {error
          ? error
          : searchQuery || getActiveFilterCount() > 0
          ? 'Try adjusting your search criteria or filters'
          : 'New job opportunities will appear here soon'}
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: Colors[colorScheme].background,
          borderRadius: 12,
        }}
        onPress={handleRefresh}
      >
        <RefreshCw size={16} color={Colors[colorScheme].text} />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 16,
            color: Colors[colorScheme].text,
            fontWeight: '600',
          }}
        >
          {error ? 'Try Again' : 'Refresh'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing && !searchLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors[colorScheme].background,
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: Colors[colorScheme].text,
            textAlign: 'center',
          }}
        >
          Finding the best jobs for you...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
      }}
    >
      {/* Search Header - Fixed, won't reload */}
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          backgroundColor: Colors[colorScheme].background,
          borderBottomWidth: 0,
          borderBottomColor: Colors[colorScheme].borderColor,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors[colorScheme].lightBackground,
            borderRadius: 10,
            paddingHorizontal: 12,
            marginRight: 12,
          }}
        >
          <Search
            size={20}
            color={Colors[colorScheme].text}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 12,
              fontSize: 16,
              color: Colors[colorScheme].text,
            }}
            placeholder="Search jobs, companies, or keywords"
            placeholderTextColor={Colors[colorScheme].text}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={Colors[colorScheme].text} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            {
              width: 48,
              height: 48,
              backgroundColor: Colors[colorScheme].text,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            },
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color={Colors[colorScheme].darkText} />
          {getActiveFilterCount() > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: Colors[colorScheme].errorText,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors[colorScheme].darkText,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {getActiveFilterCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Job List Content Area - Only this part refreshes */}
      <View
        style={{
          flex: 1,
        }}
      >
        {searchLoading && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 12,
              backgroundColor: Colors[colorScheme].background,
              marginHorizontal: 16,
              marginTop: 8,
              borderRadius: 8,
            }}
          >
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 14,
                color: Colors[colorScheme].text,
                fontWeight: '500',
              }}
            >
              Searching jobs...
            </Text>
          </View>
        )}

        <FlatList
          data={jobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item._id}
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 32,
          }}
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
