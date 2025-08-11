import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsCard } from '../../components/news/NewsCard';
import { CategoryFilter } from '../../components/news/CategoryFilter';
import { TrendingTopics } from '../../components/news/TrendingTopics';
import { Bell, Bookmark } from 'lucide-react-native';

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Career News</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TrendingTopics />
        
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <View style={styles.newsContainer}>
          <NewsCard 
            category="Job Market"
            title="Tech Hiring Surges 35% This Quarter"
            summary="Major tech companies are ramping up hiring with increased demand for AI and cloud specialists."
            readTime="3 min read"
            imageUrl="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg"
          />
          
          <NewsCard 
            category="Career Tips"
            title="Remote Work Skills That Matter in 2025"
            summary="Essential skills for thriving in remote and hybrid work environments."
            readTime="5 min read"
            imageUrl="https://images.pexels.com/photos/4065158/pexels-photo-4065158.jpeg"
          />
          
          <NewsCard 
            category="Industry Trends"
            title="Green Jobs: The Future of Sustainable Careers"
            summary="Exploring the growing demand for environmentally focused roles across industries."
            readTime="4 min read"
            imageUrl="https://images.pexels.com/photos/4968381/pexels-photo-4968381.jpeg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  newsContainer: {
    padding: 16,
  },
});