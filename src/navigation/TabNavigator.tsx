import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import SessionsScreen from '../screens/SessionsScreen';
import AddSessionScreen from '../screens/AddSessionScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');

const TabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newSessionVisible, setNewSessionVisible] = useState(false);

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleOptionPress = (option: string) => {
    setModalVisible(false);
    if (option === 'Add Completed Session') {
      setNewSessionVisible(true);
    }
    console.log(`Selected: ${option}`);
  };

  const handleSaveSession = () => {
    setNewSessionVisible(false);
    console.log('Session saved');
  };

  const handleCancelSession = () => {
    setNewSessionVisible(false);
  };

  const CustomTabButton = ({children, onPress}: any) => (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <View style={styles.addButton}>{children}</View>
    </TouchableOpacity>
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#6B7280',
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Sessions"
          component={SessionsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="list" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddSessionScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="add" size={24} color="#6B7280" />
            ),
            tabBarButton: props => (
              <CustomTabButton {...props} onPress={handleAddPress} />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="bar-chart" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      {modalVisible && (
        <>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleOptionPress('Start a Live Session')}>
                <Text style={styles.optionText}>Start a Live Session</Text>
                <View style={styles.optionIcon}>
                  <Icon name="schedule" size={20} color="#374151" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalOption, styles.modalOptionLast]}
                onPress={() => handleOptionPress('Add Completed Session')}>
                <Text style={styles.optionText}>Add Completed Session</Text>
                <View style={styles.optionIcon}>
                  <Icon name="event" size={20} color="#374151" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {newSessionVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={newSessionVisible}
          onRequestClose={() => setNewSessionVisible(false)}>
          <View style={styles.newSessionOverlay}>
            <Pressable
              style={styles.newSessionBackdrop}
              onPress={() => setNewSessionVisible(false)}
            />
            <View style={styles.newSessionContainer}>
              {/* 拖拽指示器 */}
              <View style={styles.dragIndicator} />

              {/* 标题 */}
              <Text style={styles.newSessionTitle}>New Session</Text>

              <ScrollView
                style={styles.newSessionScrollView}
                showsVerticalScrollIndicator={false}>
                {/* Session */}
                <View style={styles.formRow}>
                  <Icon
                    name="person"
                    size={24}
                    color="#9CA3AF"
                    style={styles.formIcon}
                  />
                  <View style={styles.formContent}>
                    <Text style={styles.formLabel}>Session</Text>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectText}>Please select</Text>
                      <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.formRow}>
                  <Icon
                    name="location-on"
                    size={24}
                    color="#9CA3AF"
                    style={styles.formIcon}
                  />
                  <View style={styles.formContent}>
                    <Text style={styles.formLabel}>Location</Text>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectText}>Please select</Text>
                      <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Game */}
                <View style={styles.formRow}>
                  <Icon
                    name="casino"
                    size={24}
                    color="#9CA3AF"
                    style={styles.formIcon}
                  />
                  <View style={styles.formContent}>
                    <Text style={styles.formLabel}>Game</Text>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectText}>Please select</Text>
                      <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Stakes */}
                <View style={styles.formRow}>
                  <Icon
                    name="attach-money"
                    size={24}
                    color="#9CA3AF"
                    style={styles.formIcon}
                  />
                  <View style={styles.formContent}>
                    <Text style={styles.formLabel}>Stakes</Text>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectText}>Please select</Text>
                      <Icon name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Start */}
                <View style={styles.formRow}>
                  <Icon
                    name="schedule"
                    size={24}
                    color="#9CA3AF"
                    style={styles.formIcon}
                  />
                  <View style={styles.formContent}>
                    <Text style={styles.formLabel}>Start</Text>
                    <View style={styles.dateTimeRow}>
                      <TouchableOpacity style={styles.dateButton}>
                        <Text style={styles.dateText}>Jun 24, 2025</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.timeButton}>
                        <Text style={styles.dateText}>06:40</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* End */}
                <View style={styles.formRow}>
                  <Icon
                    name="schedule"
                    size={24}
                    color="#9CA3AF"
                    style={styles.formIcon}
                  />
                  <View style={styles.formContent}>
                    <Text style={styles.formLabel}>End</Text>
                    <View style={styles.dateTimeRow}>
                      <TouchableOpacity style={styles.dateButton}>
                        <Text style={styles.dateText}>Jun 24, 2025</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.timeButton}>
                        <Text style={styles.dateText}>11:40</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Buy In & Cash Out */}
                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <TouchableOpacity style={styles.inputButton}>
                      <Text style={styles.inputLabel}>$ Buy In</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputHalf}>
                    <TouchableOpacity style={styles.inputButton}>
                      <Text style={styles.inputLabel}>$ Cash Out</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Rebuys / Top Offs */}
                <TouchableOpacity style={styles.fullWidthInput}>
                  <Text style={styles.inputLabel}>$ Rebuys / Top Offs</Text>
                </TouchableOpacity>

                {/* Table Expenses */}
                <TouchableOpacity style={styles.fullWidthInput}>
                  <Text style={styles.inputLabel}>
                    $ Table Expenses (Rake, tips)
                  </Text>
                </TouchableOpacity>

                {/* Notes */}
                <TouchableOpacity style={styles.notesInput}>
                  <Text style={styles.inputLabel}>Notes (Optional)</Text>
                </TouchableOpacity>

                {/* High Hand Bonus */}
                <TouchableOpacity style={styles.fullWidthInput}>
                  <Text style={styles.inputLabel}>
                    $ High Hand Bonus (Optional)
                  </Text>
                </TouchableOpacity>

                {/* Tags */}
                <View style={styles.tagsRow}>
                  <TouchableOpacity style={styles.tagsInput}>
                    <Text style={styles.inputLabel}>🏷️ Tags (Optional)</Text>
                    <Icon name="lock" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveSession}>
                    <Text style={styles.saveButtonText}>Save Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelSession}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingBottom: 0,
  },
  customButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 65,
    left: 40,
    right: 40,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 0,
    marginBottom: 0,
    minHeight: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  modalOptionLast: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  newSessionOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  newSessionBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  newSessionContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  newSessionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  newSessionScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 4,
  },
  formIcon: {
    marginRight: 16,
    width: 24,
  },
  formContent: {
    flex: 1,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  inputLabel: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  fullWidthInput: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  notesInput: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 16,
    minHeight: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tagsRow: {
    marginBottom: 32,
  },
  tagsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    minHeight: 56,
  },
  buttonContainer: {
    marginBottom: 40,
    gap: 16,
  },
  saveButton: {
    paddingVertical: 16,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default TabNavigator;
