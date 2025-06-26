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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import SessionsScreen from '../screens/SessionsScreen';
import AddSessionScreen from '../screens/AddSessionScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddSessionModal, {Session} from '../components/AddSessionModal';
import OptionModal from '../components/OptionModal';
import {useTabBarHeight} from '../hooks/useTabBarHeight';

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');

const TabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newSessionVisible, setNewSessionVisible] = useState(false);
  const {tabBarHeight, optimalMargin} = useTabBarHeight();

  // 添加选项数据配置
  const addOptionsData = [
    {
      label: 'Start a Live Session',
      value: 'Start a Live Session',
      icon: 'schedule',
      iconColor: '#374151',
    },
    {
      label: 'Add Completed Session',
      value: 'Add Completed Session',
      icon: 'event',
      iconColor: '#374151',
    },
  ];

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

  const handleSaveSession = (session: Session) => {
    setNewSessionVisible(false);
    console.log('Session saved:', session);
    // 这里可以添加保存到本地存储或发送到服务器的逻辑
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

      <OptionModal
        visible={modalVisible}
        options={addOptionsData}
        onSelect={handleOptionPress}
        onClose={() => setModalVisible(false)}
        position="relative"
        relativeToBottom={tabBarHeight}
        marginFromTarget={optimalMargin} // 自动适配的最佳间距
      />

      <AddSessionModal
        visible={newSessionVisible}
        onClose={handleCancelSession}
        onSave={handleSaveSession}
      />
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
});

export default TabNavigator;
