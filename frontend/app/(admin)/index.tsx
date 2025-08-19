import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import {
  BarChart3,
  Users,
  Briefcase,
  Newspaper,
  Settings,
  Plus,
  Search,
  Bell,
  TrendingUp,
  Eye,
  Edit3,
  Trash2,
  Upload,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function AdminIndex() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalType, setModalType] = useState(''); // 'news' or 'job'

  const { logout } = useAuth();

  // Sample data
  const dashboardStats = {
    totalJobs: 1247,
    activeJobs: 892,
    totalUsers: 5634,
    newApplications: 234,
    totalNews: 89,
    monthlyViews: 45600,
  };

  const recentJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Google',
      applications: 45,
      status: 'active',
      salary: '$120k-150k',
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'Apple',
      applications: 32,
      status: 'pending',
      salary: '$80k-100k',
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Microsoft',
      applications: 67,
      status: 'active',
      salary: '$130k-160k',
    },
  ];

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

  const handleAddItem = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Briefcase color="#1976D2" size={24} />
            <Text style={styles.statNumber}>{dashboardStats.totalJobs}</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
            <Users color="#388E3C" size={24} />
            <Text style={styles.statNumber}>{dashboardStats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
            <TrendingUp color="#F57C00" size={24} />
            <Text style={styles.statNumber}>
              {dashboardStats.newApplications}
            </Text>
            <Text style={styles.statLabel}>New Applications</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}>
            <Eye color="#C2185B" size={24} />
            <Text style={styles.statNumber}>{dashboardStats.monthlyViews}</Text>
            <Text style={styles.statLabel}>Monthly Views</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      {/* <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#87CEEB' }]}
            onPress={() => handleAddItem('job')}
          >
            <Plus color="#fff" size={20} />
            <Text style={styles.actionButtonText}>Add Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#98D8C8' }]}
            onPress={() => handleAddItem('news')}
          >
            <Plus color="#fff" size={20} />
            <Text style={styles.actionButtonText}>Add News</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Jobs</Text>
        {recentJobs.map((job) => (
          <View key={job.id} style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemTitle}>{job.title}</Text>
              <Text style={styles.listItemSubtitle}>
                {job.company} • {job.salary}
              </Text>
              <Text style={styles.listItemMeta}>
                {job.applications} applications
              </Text>
            </View>
            <View style={styles.listItemRight}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      job.status === 'active' ? '#E8F5E8' : '#FFF3E0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: job.status === 'active' ? '#388E3C' : '#F57C00' },
                  ]}
                >
                  {job.status}
                </Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical color="#666" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
        <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
    </ScrollView>
  );




  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const renderSettings = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>App Configuration</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell color="#87CEEB" size={20} />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Text style={styles.settingValue}>Enabled</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Users color="#87CEEB" size={20} />
            <Text style={styles.settingText}>User Management</Text>
          </View>
          <Text style={styles.settingValue}>Configure</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Upload color="#87CEEB" size={20} />
            <Text style={styles.settingText}>Backup Data</Text>
          </View>
          <Text style={styles.settingValue}>Export</Text>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.topHeader}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your job portal</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell color="#87CEEB" size={24} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>3</Text>
          </View>
        </TouchableOpacity>
      </View> */}

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}

     
        {activeTab === 'settings' && renderSettings()}
      </View>

    
    

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add New {modalType === 'job' ? 'Job' : 'News'}
            </Text>
            <Text style={styles.modalText}>
              {modalType === 'job'
                ? 'Job creation form would go here with fields for title, company, description, salary, etc.'
                : 'News creation form would go here with fields for title, content, category, image upload, etc.'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={() => {
                  setShowAddModal(false);
                  Alert.alert(
                    'Success',
                    `${
                      modalType === 'job' ? 'Job' : 'News'
                    } added successfully!`
                  );
                }}
              >
                <Text style={styles.modalConfirmText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  listItemLeft: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  listItemMeta: {
    fontSize: 12,
    color: '#87CEEB',
    marginTop: 4,
  },
  listItemRight: {
    alignItems: 'flex-end',
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
  moreButton: {
    padding: 4,
  },
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
  jobsGrid: {
    gap: 16,
  },
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
  jobCardCompany: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
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
  jobCardApplications: {
    fontSize: 12,
    color: '#6c757d',
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
  deleteButton: {
    padding: 4,
  },
  analyticsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  chartText: {
    color: '#6c757d',
    marginTop: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#87CEEB',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  categoryList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    color: '#2c3e50',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#87CEEB',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#87CEEB',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingBottom: 20,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#f0f8ff',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#87CEEB',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalConfirmButton: {
    backgroundColor: '#87CEEB',
  },
  modalCancelText: {
    color: '#6c757d',
    fontWeight: 'bold',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  actionsContainer: {
    marginHorizontal: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 12,
    fontWeight: '500',
  },
});
