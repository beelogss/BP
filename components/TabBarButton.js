import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { icons } from '../assets/icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const TabBarButton = ({ isFocused, label, routeName, color, onPress, backgroundColor }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 250 });
  }, [isFocused]);

  // Animate the icon
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3]);
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
    <Pressable
      onPress={onPress}
      style={styles.container}
      android_ripple={{ color: '#e5eeda', borderless: true, radius: hp('3.5%') }}
    >
      {isFocused && (
        <View style={[styles.circularBackground, { backgroundColor }]} />
      )}
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
      <Animated.Text style={[{ color, fontSize: wp('2.6%') }, animatedTextStyle]}>
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
    borderRadius: hp('10%'),
  },
  circularBackground: {
    position: 'absolute',
    width: wp('13%'),
    height: hp('6.4%'),
    borderRadius: wp('7%'),
  },
});

export default TabBarButton;