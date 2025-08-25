import {
  Edit3,
  Filter,
  PlusCircle,
  Search,
  Trash2,
  X,
  Save,
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
} from 'react-native';
import { createNews, getNews } from '../../utils/api';

const { width: screenWidth } = Dimensions.get('window');

interface NewsItem {
  id: number;
  title: string;
  views: number;
  isActive: boolean;
  description: string;
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

  useEffect(() => {
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
        setNewsList([]); // fallback
      } finally {
        setLoading(false);
      }
    };

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

    // Prepare data for submission
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

    // Here you would typically send the data to your backend
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
          {newsList.map((news) => (
            <View key={news.id} style={styles.newsCard}>
              <View style={styles.newsCardHeader}>
                <Text style={styles.newsCardTitle}>{news.title}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity>
                    <Edit3 color="#87CEEB" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton}>
                    <Trash2 color="#ff4757" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.newsCardMeta}>
                <Text style={styles.newsCardDate}>{news.description}</Text>
              </View>
              <View style={styles.newsCardFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        news.isActive ? '#E8F5E8' : '#FFF3E0',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          news.isActive ? '#388E3C' : '#F57C00',
                      },
                    ]}
                  >
                    {news.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <Text style={styles.newsCardViews}>{news.views} views</Text>
              </View>
            </View>
          ))}
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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
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
  },
  addButton: {
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 12,
  },
  newsGrid: {
    gap: 16,
    padding: 8,
  },
  newsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  newsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  newsCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  newsCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  newsCardDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  newsCardViews: {
    fontSize: 12,
    color: '#87CEEB',
  },
  newsCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },

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
});
