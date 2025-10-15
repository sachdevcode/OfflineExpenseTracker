// src/features/expenses/components/SwipeToDeleteRow.tsx
import React from 'react';
import { Dimensions, StyleSheet, LayoutChangeEvent } from 'react-native';
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
  /** Optional fallback height before first layout measurement */
  fallbackHeight?: number; // default: 72
};

const SCREEN_WIDTH = Dimensions.get('window').width;
// how far the user must swipe left to delete (35% screen)
const SWIPE_DELETE_THRESHOLD = -SCREEN_WIDTH * 0.35;
// max left drag (for rubber band feel)
const MAX_LEFT_DRAG = -SCREEN_WIDTH;

export const SwipeToDeleteRow: React.FC<Props> = ({
  id,
  onDelete,
  children,
  fallbackHeight = 72,
}) => {
  // Horizontal translation of the foreground card
  const translateX = useSharedValue(0);

  // Animated container height & opacity (collapse + fade on delete)
  // rowHeight = -1 means "not measured yet" — we'll use fallbackHeight until measured.
  const rowHeight = useSharedValue<number>(-1);
  const rowOpacity = useSharedValue(1);

  /** Capture the real height of the row content to avoid overlap */
  const onCardLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height || fallbackHeight;
    if (h > 0) rowHeight.value = h;
  };

  /** Pan (left-only) to dismiss */
  const fling = Gesture.Pan()
    .activeOffsetX([-5, 5]) // ignore tiny moves
    .onUpdate(e => {
      // allow only left swipe; clamp to MAX_LEFT_DRAG
      const next = Math.max(MAX_LEFT_DRAG, Math.min(0, e.translationX));
      translateX.value = next;
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_DELETE_THRESHOLD) {
        // Dismiss: slide out, fade & collapse
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 180 });
        rowOpacity.value = withTiming(0, { duration: 140 });
        rowHeight.value = withTiming(0, { duration: 180 }, finished => {
          if (finished) runOnJS(onDelete)(id);
        });
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  /** Animate container height/opacity */
  const containerStyle = useAnimatedStyle(() => {
    const h = rowHeight.value > 0 ? rowHeight.value : fallbackHeight;
    return {
      height: h,
      opacity: rowOpacity.value,
    };
  });

  /** Animate card translation */
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <GestureDetector gesture={fling}>
        <Animated.View style={[styles.card, cardStyle]} onLayout={onCardLayout}>
          {children}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
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
