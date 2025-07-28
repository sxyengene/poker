import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Platform} from 'react-native';

export const useTabBarHeight = () => {
  // 基础tabBar高度
  const BASE_TAB_BAR_HEIGHT = 60;

  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    // 如果SafeAreaProvider不可用，使用默认值
    console.warn('SafeAreaProvider not found, using default values');
    insets = {bottom: 0, top: 0, left: 0, right: 0};
  }

  // 计算实际tabBar高度（包含安全区域）
  const actualTabBarHeight = BASE_TAB_BAR_HEIGHT + (insets?.bottom || 0);

  // 为不同平台提供优化
  const optimalMargin = Platform.select({
    ios: 15,
    android: 15,
    default: 15,
  });

  return {
    tabBarHeight: actualTabBarHeight,
    baseHeight: BASE_TAB_BAR_HEIGHT,
    safeAreaBottom: insets?.bottom || 0,
    optimalMargin,
  };
};
