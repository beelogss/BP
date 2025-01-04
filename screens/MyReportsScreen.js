import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  BackHandler
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { getUserReports, deleteReports } from '../services/reportService';
import { useFocusEffect } from '@react-navigation/native';

const MyReportsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const userReports = await getUserReports(user.studentNumber);
      setReports(userReports);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    loadReports(true);
  };

  const toggleSelection = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map(report => report.id));
    }
  };

  const handleDelete = () => {
    if (selectedReports.length === 0) return;

    Alert.alert(
      'Delete Reports',
      'Are you sure you want to delete the selected reports?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteReports(selectedReports);
            loadReports();
            setSelectedReports([]);
            setIsSelectionMode(false);
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'in-progress': return '#2196f3';
      case 'resolved': return '#4caf50';
      default: return '#999999';
    }
  };

  const renderReport = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.reportCard,
        selectedReports.includes(item.id) && styles.selectedCard
      ]}
      onPress={() => isSelectionMode 
        ? toggleSelection(item.id)
        : navigation.navigate('ReportDetails', { report: item })
      }
      onLongPress={() => {
        if (!isSelectionMode) {
          setIsSelectionMode(true);
          toggleSelection(item.id);
        }
      }}
    >
      <View style={styles.reportHeader}>
        <View style={styles.leftHeader}>
          {isSelectionMode && (
            <MaterialCommunityIcons 
              name={selectedReports.includes(item.id) ? "checkbox-marked" : "checkbox-blank-outline"}
              size={wp('6%')}
              color="#83951c"
              style={styles.checkbox}
            />
          )}
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      
      {item.adminResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Admin Response:</Text>
          <Text style={styles.response} numberOfLines={2}>
            {item.adminResponse}
          </Text>
        </View>
      )}
      
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  // Custom back handler
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSelectionMode) {
          setIsSelectionMode(false);
          setSelectedReports([]);
          return true; // Prevent default behavior
        }
        navigation.goBack(); // Go back to ProfileScreen
        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [isSelectionMode, navigation])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isSelectionMode ? (
          <>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedReports([]);
              }}
            >
              <MaterialCommunityIcons name="close" size={wp('6%')} color="#455e14" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedReports.length} Selected</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={toggleSelectAll}
              >
                <MaterialCommunityIcons 
                  name={selectedReports.length === reports.length ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={wp('6%')}
                  color="#455e14"
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={selectedReports.length === 0}
              >
                <MaterialCommunityIcons name="delete" size={wp('6%')} color="red" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={wp('6%')} color="#455e14" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Reports</Text>
          </>
        )}
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.actionBarButton, !isSelectionMode && styles.activeActionButton]} 
          onPress={() => setIsSelectionMode(false)}
        >
          <MaterialCommunityIcons name="format-list-bulleted" size={wp('5%')} color={!isSelectionMode ? "#455e14" : "#666666"} />
          <Text style={[styles.actionBarText, !isSelectionMode && styles.activeActionText]}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBarButton, isSelectionMode && styles.activeActionButton]}
          onPress={() => setIsSelectionMode(true)}
        >
          <MaterialCommunityIcons name="delete" size={wp('5%')} color={isSelectionMode ? "#455e14" : "#666666"} />
          <Text style={[styles.actionBarText, isSelectionMode && styles.activeActionText]}>Delete</Text>
        </TouchableOpacity>
      </View>

      {isSelectionMode && (
        <View style={styles.selectionBar}>
          <TouchableOpacity 
            style={styles.selectAllButton} 
            onPress={toggleSelectAll}
          >
            <MaterialCommunityIcons 
              name={selectedReports.length === reports.length ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={wp('5%')} 
              color="#455e14" 
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
          
          {selectedReports.length > 0 && (
            <TouchableOpacity 
              style={styles.deleteSelectedButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteSelectedText}>Delete Selected ({selectedReports.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#83951c" size="large" />
      ) : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={wp('15%')} color="#83951c" />
          <Text style={styles.emptyText}>No reports found</Text>
          <Text style={styles.lastUpdateText}>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={reports}
            renderItem={renderReport}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#83951c']}
                tintColor="#83951c"
              />
            }
          />
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginLeft: wp('2%'),
  },
  listContainer: {
    padding: wp('4%'),
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: wp('3%'),
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  category: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
  },
  status: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
  },
  description: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: hp('1%'),
  },
  responseContainer: {
    backgroundColor: '#f5f5f5',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginTop: hp('1%'),
  },
  responseLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    marginBottom: hp('0.5%'),
  },
  response: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  date: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Regular',
    color: '#999999',
    marginTop: hp('1%'),
    textAlign: 'right',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    color: '#666666',
    marginTop: hp('2%'),
  },
  selectedCard: {
    backgroundColor: '#e5eeda',
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: wp('2%'),
  },
  headerActions: {
    flexDirection: 'row',
    position: 'absolute',
    right: wp('4%'),
  },
  actionButton: {
    padding: wp('2%'),
    marginLeft: wp('2%'),
  },
  deleteButton: {
    opacity: 0.8,
  },
  actionBar: {
    flexDirection: 'row',
    padding: wp('2%'),
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp('2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
  },
  activeActionButton: {
    backgroundColor: '#e5eeda',
  },
  actionBarText: {
    marginLeft: wp('2%'),
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
    color: '#666666',
  },
  activeActionText: {
    color: '#455e14',
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('3%'),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: wp('2%'),
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.8%'),
    color: '#455e14',
  },
  deleteSelectedButton: {
    backgroundColor: '#ffebee',
    paddingVertical: wp('2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
  deleteSelectedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
    color: '#d32f2f',
  },
  lastUpdateContainer: {
    padding: wp('3%'),
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  lastUpdateText: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
  },
});

export default MyReportsScreen; 