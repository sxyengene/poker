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

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleOptionPress = (option: string) => {
    setModalVisible(false);
    console.log(`Selected: ${option}`);
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
          tabBarActiveTintColor: '#6B7280',
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}>
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
        </Pressable>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 65,
    paddingHorizontal: 40,
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
});

export default TabNavigator;
