import {
  Edit3,
  Filter,
  PlusCircle,
  Search,
  Trash2,
  X,
  Save,
  Calendar,
  Eye,
  Tag,
  User,
  Globe,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
  Image,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { createNews, deleteNews, getNews } from '../../utils/api';
import { LinearGradient } from 'expo-linear-gradient'; // You'll need to install this: expo install expo-linear-gradient

const { width: screenWidth } = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: {
    name: string;
    email: string;
  };
  publishedDate: string;
  isActive: boolean;
  views: number;
  tags: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'technology',
  'sports',
  'politics',
  'entertainment',
  'business',
  'health',
  'science',
  'world',
  'other',
];

export default function News() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getNews();

        if (data) {
          setNewsList(data);
        } else {
          setNewsList([]);
        }
      } catch (error) {
        console.error('❌ Error fetching news:', error);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchNews();
  }, []);



  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    category: 'technology',
    authorName: '',
    authorEmail: '',
    tags: '',
    source: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      image: '',
      category: 'technology',
      authorName: '',
      authorEmail: '',
      tags: '',
      source: '',
      isActive: true,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { title, description, content, image, authorName } = formData;

    if (!title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return false;
    }
    if (title.length > 200) {
      Alert.alert('Validation Error', 'Title cannot exceed 200 characters');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return false;
    }
    if (description.length > 1000) {
      Alert.alert(
        'Validation Error',
        'Description cannot exceed 1000 characters'
      );
      return false;
    }
    if (!content.trim()) {
      Alert.alert('Validation Error', 'Content is required');
      return false;
    }
    if (!image.trim()) {
      Alert.alert('Validation Error', 'Image URL is required');
      return false;
    }
    if (!authorName.trim()) {
      Alert.alert('Validation Error', 'Author name is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newsData = {
      ...formData,
      author: {
        name: formData.authorName,
        email: formData.authorEmail,
      },
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      publishedDate: new Date(),
      views: 0,
    };

    const response = await createNews(newsData);

    if (!response) {
      Alert.alert('Error', 'Failed to create news article. Please try again.');
      return;
    }
    Alert.alert('Success', 'News article created successfully!', [
      {
        text: 'OK',
        onPress: () => {
          resetForm();
          setShowAddModal(false);
        },
      },
    ]);
     fetchNews();
  };

  const closeModal = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to close? All changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            resetForm();
            setShowAddModal(false);
          },
        },
      ]
    );
  };

  const toggleCardExpansion = (cardId: string) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: '#3B82F6',
      sports: '#EF4444',
      politics: '#8B5CF6',
      entertainment: '#F59E0B',
      business: '#10B981',
      health: '#06B6D4',
      science: '#6366F1',
      world: '#84CC16',
      other: '#6B7280',
    };
    return colors[category] || colors.other;
  };

  const handleDelete = async(newsId: string) => {
    
 const res = await deleteNews(newsId);
    if (res) {
      Alert.alert('Success', 'News article deleted successfully!');
      fetchNews();
    } else {
      Alert.alert('Error', 'Failed to delete news article. Please try again.');
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search color="#666" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search news..."
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

        <View style={styles.newsGrid}>
          {newsList.filter((news) =>news.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((news) => {
            const isExpanded = expandedCards.has(news._id);

            return (
              <TouchableOpacity
                key={news._id}
                style={[styles.newsCard, isExpanded && styles.newsCardExpanded]}
                onPress={() => toggleCardExpansion(news._id)}
                activeOpacity={0.9}
              >
                {/* Image with Overlay and Action Icons */}
                <View style={styles.imageContainer}>
                  {news.image ? (
                    <Image
                      source={{ uri: news.image }}
                      style={styles.newsImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.newsImage, styles.noImagePlaceholder]}>
                      <Text style={styles.noImageText}>No Image</Text>
                    </View>
                  )}

                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={[
                      'transparent',
                      'rgba(255,255,255,0.4)',
                      'rgba(255,255,255,0.8)',
                      '#FFFFFF',
                    ]}
                    style={styles.gradientOverlay}
                  />

                  {/* Title Overlay */}
                  <View style={styles.titleOverlay}>
                    <Text
                      style={styles.overlayTitle}
                      numberOfLines={isExpanded ? undefined : 2}
                    >
                      {news.title}
                    </Text>
                  </View>

                  {/* Action Icons */}
                  <View style={styles.actionIcons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                       
                      }}
                    >
                      <Edit3 color="#fff" size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteActionButton]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(news._id);
                      }}
                    >
                      <Trash2 color="#fff" size={18} />
                    </TouchableOpacity>
                  </View>

                  {/* Category Badge */}
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(news.category) },
                    ]}
                  >
                    <Text style={styles.categoryBadgeText}>
                      {news.category.charAt(0).toUpperCase() +
                        news.category.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  {/* Basic Info */}
                  <View style={styles.basicInfo}>
                    <View style={styles.metaRow}>
                      <User color="#6c757d" size={14} />
                      <Text style={styles.metaText}>
                        {news.author?.name || 'Unknown Author'}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Calendar color="#6c757d" size={14} />
                      <Text style={styles.metaText}>
                        {formatDate(news.publishedDate)}
                      </Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Eye color="#6c757d" size={14} />
                      <Text style={styles.metaText}>{news.views} views</Text>
                    </View>
                  </View>

                  {/* Description */}
                  <Text
                    style={styles.newsDescription}
                    numberOfLines={isExpanded ? undefined : 3}
                  >
                    {news.description}
                  </Text>

                  {/* Status Badge */}
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: news.isActive
                            ? '#E8F5E8'
                            : '#FFF3E0',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: news.isActive ? '#388E3C' : '#F57C00',
                          },
                        ]}
                      >
                        {news.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      {/* Full Content */}
                      <View style={styles.expandedSection}>
                        <Text style={styles.sectionTitle}>Full Content</Text>
                        <Text style={styles.fullContent}>{news.content}</Text>
                      </View>

                      {/* Tags */}
                      {news.tags && news.tags.length > 0 && (
                        <View style={styles.expandedSection}>
                          <View style={styles.sectionHeader}>
                            <Tag color="#6c757d" size={16} />
                            <Text style={styles.sectionTitle}>Tags</Text>
                          </View>
                          <View style={styles.tagsContainer}>
                            {news.tags.map((tag, index) => (
                              <View key={index} style={styles.tagChip}>
                                <Text style={styles.tagText}>{tag}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Source */}
                      {news.source && (
                        <View style={styles.expandedSection}>
                          <View style={styles.sectionHeader}>
                            <Globe color="#6c757d" size={16} />
                            <Text style={styles.sectionTitle}>Source</Text>
                          </View>
                          <Text style={styles.sourceText}>{news.source}</Text>
                        </View>
                      )}

                      {/* Author Email */}
                      {news.author?.email && (
                        <View style={styles.expandedSection}>
                          <Text style={styles.sectionTitle}>Author Email</Text>
                          <Text style={styles.emailText}>
                            {news.author.email}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Add News Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add News Article</Text>

            <ScrollView
              style={{ maxHeight: '80%' }}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <TextInput
                style={styles.input}
                placeholder="Enter news title *"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                maxLength={200}
              />
              <Text style={styles.charCount}>{formData.title.length}/200</Text>

              {/* Description */}
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter news description *"
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange('description', value)
                }
                multiline
                numberOfLines={3}
                maxLength={1000}
              />
              <Text style={styles.charCount}>
                {formData.description.length}/1000
              </Text>

              {/* Content */}
              <TextInput
                style={[styles.input, styles.textAreaLarge]}
                placeholder="Enter full news content *"
                value={formData.content}
                onChangeText={(value) => handleInputChange('content', value)}
                multiline
                numberOfLines={4}
              />

              {/* Image URL */}
              <TextInput
                style={styles.input}
                placeholder="Image URL *"
                value={formData.image}
                onChangeText={(value) => handleInputChange('image', value)}
                keyboardType="url"
              />

              {/* Category */}
              <Text style={styles.fieldLabel}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      formData.category === category &&
                        styles.categoryChipSelected,
                    ]}
                    onPress={() => handleInputChange('category', category)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.category === category &&
                          styles.categoryChipTextSelected,
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Author Name */}
              <TextInput
                style={styles.input}
                placeholder="Author name *"
                value={formData.authorName}
                onChangeText={(value) => handleInputChange('authorName', value)}
              />

              {/* Author Email */}
              <TextInput
                style={styles.input}
                placeholder="Author email"
                value={formData.authorEmail}
                onChangeText={(value) =>
                  handleInputChange('authorEmail', value)
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Tags */}
              <TextInput
                style={styles.input}
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChangeText={(value) => handleInputChange('tags', value)}
              />

              {/* Source */}
              <TextInput
                style={styles.input}
                placeholder="News source"
                value={formData.source}
                onChangeText={(value) => handleInputChange('source', value)}
              />
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>Save Article</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  newsGrid: {
    gap: 16,
  },

  // Enhanced News Card Styles
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
  },
  newsCardExpanded: {
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },

  // Image Container Styles
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  noImagePlaceholder: {
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
  },

  // Action Icons Styles
  actionIcons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 20,
  },
  deleteActionButton: {
    backgroundColor: 'rgba(255,71,87,0.8)',
  },

  // Category Badge
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Card Content Styles
  cardContent: {
    padding: 16,
    paddingTop: 12,
  },
  // Basic Info Styles
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },

  // Description
  newsDescription: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 12,
  },

  // Status Container
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Expanded Content Styles
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  expandedSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  fullContent: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 22,
  },

  // Tags Styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '500',
  },

  // Source and Email Styles
  sourceText: {
    fontSize: 14,
    color: '#4a5568',
    fontStyle: 'italic',
  },
  emailText: {
    fontSize: 14,
    color: '#3182ce',
  },

  // Modal Styles (keeping existing)
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

  // Form Styles (keeping existing)
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
    height: 80,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 12,
  },

  // Action Buttons (keeping existing)
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
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryChipSelected: {
    backgroundColor: '#87CEEB',
    borderColor: '#87CEEB',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6c757d',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  // Title Overlay Styles
  titleOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    lineHeight: 24,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
