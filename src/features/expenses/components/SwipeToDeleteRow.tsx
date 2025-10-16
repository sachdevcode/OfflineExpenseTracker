// src/features/expenses/components/SwipeToDeleteRow.tsx
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  /** Unique id for this row (passed back on delete) */
  id: string;
  /** Called after the row is swiped away */
  onDelete: (id: string) => void;
  /** Children content (your ExpenseItem) */
  children: React.ReactNode;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
// how far the user must swipe left to delete (30% screen)
const SWIPE_DELETE_THRESHOLD = -SCREEN_WIDTH * 0.3;
// max left drag (for rubber band feel)
const MAX_LEFT_DRAG = -SCREEN_WIDTH * 0.8;

export const SwipeToDeleteRow: React.FC<Props> = ({
  id,
  onDelete,
  children,
}) => {
  // Horizontal translation of the foreground card
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  /** Pan (left-only) to dismiss */
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // ignore tiny moves
    .onUpdate(e => {
      // allow only left swipe; clamp to MAX_LEFT_DRAG
      const next = Math.max(MAX_LEFT_DRAG, Math.min(0, e.translationX));
      translateX.value = next;
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_DELETE_THRESHOLD) {
        // Dismiss: slide out and fade
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, finished => {
          if (finished) {
            runOnJS(onDelete)(id);
          }
        });
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  /** Animate card translation and opacity */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  card: {
    // Keep your item’s own styling; this wrapper only translates it
  },
});
