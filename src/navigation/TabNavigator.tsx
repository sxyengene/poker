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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import SessionsScreen from '../screens/SessionsScreen';
import AddSessionScreen from '../screens/AddSessionScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddSessionModal from '../components/AddSessionModal';
import OptionModal from '../components/OptionModal';
import {useTabBarHeight} from '../hooks/useTabBarHeight';
import {useSessions} from '../contexts/SessionsContext';
import {NewSession} from '../types/session';

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');

const TabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newSessionVisible, setNewSessionVisible] = useState(false);
  const {tabBarHeight, optimalMargin} = useTabBarHeight();
  const {addSession} = useSessions();

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

  const handleSaveSession = async (session: NewSession) => {
    try {
      await addSession(session);
      setNewSessionVisible(false);
      console.log('Session saved successfully:', session);

      // 显示成功提示
      Alert.alert('保存成功', '会话已成功保存！', [
        {text: '确定', style: 'default'},
      ]);
    } catch (error) {
      console.error('Save session error:', error);
      Alert.alert('保存失败', '保存会话时出现错误，请重试。', [
        {text: '确定', style: 'default'},
      ]);
    }
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
          tabBarIconStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" size={28} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Sessions"
          component={SessionsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="list" size={28} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddSessionScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="add" size={28} color="#6B7280" />
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
              <Icon name="bar-chart" size={28} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="settings" size={28} color={color} />
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
