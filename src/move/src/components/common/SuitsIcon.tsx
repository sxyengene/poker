import React from 'react';
import Svg, {
  Path,
  Ellipse,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

export type Suit = 'spade' | 'heart' | 'diamond' | 'club';

interface Props {
  suit: Suit;
  size?: number;
}

const SuitsIcon: React.FC<Props> = ({suit, size = 32}) => {
  switch (suit) {
    case 'spade':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48">
          <Path
            d="M24 6C15 19 6 26 13 34c4 4 8 0 8 0s-4 8 3 8 3-8 3-8 4 4 8 0c7-8-2-15-11-28z"
            fill="#000000"
          />
          <Ellipse cx="24" cy="42" rx="5" ry="3" fill="#000000" opacity="0.7" />
        </Svg>
      );
    case 'heart':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48">
          <Path
            d="M24 44C24 44 7 30 7 19a9 9 0 0 1 17-5 9 9 0 0 1 17 5c0 11-17 25-17 25z"
            fill="#B22222"
          />
        </Svg>
      );
    case 'diamond':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48">
          <Path
            d="M24 6L42 24 24 42 6 24z"
            fill="#1E90FF"
            stroke="#1E90FF"
            strokeWidth="2"
          />
        </Svg>
      );
    case 'club':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48">
          <Circle cx="24" cy="16" r="8" fill="#800080" />
          <Circle cx="15" cy="29" r="8" fill="#800080" />
          <Circle cx="33" cy="29" r="8" fill="#800080" />
          <Ellipse
            cx="24"
            cy="43"
            rx="5"
            ry="2.5"
            fill="#800080"
            opacity="0.7"
          />
          <Path d="M22 30h4v8h-4z" fill="#800080" />
        </Svg>
      );
    default:
      return null;
  }
};

export default SuitsIcon;
