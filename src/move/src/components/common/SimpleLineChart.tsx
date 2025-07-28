import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Path, Line, Circle} from 'react-native-svg';

interface SimpleLineChartProps {
  data: number[];
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
}

export default function SimpleLineChart({
  data,
  width,
  height,
  color = '#22C55E',
  strokeWidth = 3,
}: SimpleLineChartProps) {
  if (data.length === 0) {
    return null;
  }

  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // 计算最大值和最小值
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const valueRange = maxValue - minValue || 1;

  // 生成路径点
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
    return {x, y};
  });

  // 生成SVG路径
  const pathData = points
    .map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* 网格线 */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = padding + ratio * chartHeight;
          return (
            <Line
              key={ratio}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          );
        })}

        {/* 折线 */}
        <Path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {points.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill={color} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
