import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { icons } from '../assets/icons';

const TabBarButton = ({ isFocused, label, routeName, color, onPress }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [isFocused]);

  // Animate the icon
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 5]); // Moves up when focused
    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  // Animate the label text opacity
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]); // Fade out when focused
    return {
      opacity,
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.container} android_ripple={{ color: '#e5eeda', borderless: true, radius: 50}}>
      {/* Animated Icon */}
      <Animated.View style={[animatedIconStyle]}>
        {
          // Conditionally render solid or regular icon based on `isFocused`
          isFocused
            ? icons[routeName].solid({ color }) // Render solid icon when focused
            : icons[routeName].regular({ color }) // Render regular icon when not focused
        }
      </Animated.View>

      {/* Animated Text Label */}
      <Animated.Text style={[{ color, fontSize: 11 }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  },
});

export default TabBarButton;
