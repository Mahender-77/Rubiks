import { Edit3, Filter, Search, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity,StyleSheet } from "react-native";

  const recentNews = [
    {
      id: 1,
      title: 'Tech Industry Growth in 2024',
      views: 1234,
      status: 'published',
      date: '2 hours ago',
    },
    {
      id: 2,
      title: 'Remote Work Trends',
      views: 892,
      status: 'draft',
      date: '1 day ago',
    },
    {
      id: 3,
      title: 'AI Job Market Analysis',
      views: 2456,
      status: 'published',
      date: '3 days ago',
    },
  ];
export default function News() {
   const [searchQuery, setSearchQuery] = useState('');
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
      </View>

      <View style={styles.newsGrid}>
        {recentNews.map((news) => (
          <View key={news.id} style={styles.newsCard}>
            <View style={styles.newsCardHeader}>
              <Text style={styles.newsCardTitle}>{news.title}</Text>
              <TouchableOpacity>
                <Edit3 color="#87CEEB" size={16} />
              </TouchableOpacity>
            </View>
            <View style={styles.newsCardMeta}>
              <Text style={styles.newsCardDate}>{news.date}</Text>
              <Text style={styles.newsCardViews}>{news.views} views</Text>
            </View>
            <View style={styles.newsCardFooter}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      news.status === 'published' ? '#E8F5E8' : '#FFF3E0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        news.status === 'published' ? '#388E3C' : '#F57C00',
                    },
                  ]}
                >
                  {news.status}
                </Text>
              </View>
              <TouchableOpacity style={styles.deleteButton}>
                <Trash2 color="#ff4757" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
   content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
   newsGrid: {
    gap: 16,
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
})