import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { icons } from '../assets/icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TabBarButton = ({ isFocused, label, routeName, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  
  useEffect(() => {
    // Smoother animation config
    const springConfig = {
      mass: 1,
      damping: 15,
      stiffness: 120,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    };

    if (isFocused) {
      scale.value = withSpring(1.15, springConfig);
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(-hp('0.5%'), springConfig);
    } else {
      scale.value = withSpring(1, springConfig);
      opacity.value = withTiming(0.8, { duration: 200 });
      translateY.value = withSpring(0, springConfig);
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      android_ripple={{ 
        color: '#e5eeda', 
        borderless: true, 
        radius: wp('5%') 
      }}
    >
      <Animated.View style={[styles.buttonContent, animatedStyle]}>
        <View style={[
          styles.iconContainer,
          isFocused && styles.focusedIconContainer
        ]}>
          {isFocused
            ? icons[routeName].solid({ color: '#ffffff' })
            : icons[routeName].regular({ color: '#83951c' })}
        </View>
        <Text style={[
          styles.label,
          isFocused && styles.focusedLabel
        ]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    transform: [{ scale: 0.9 }],
  },
  focusedIconContainer: {
    backgroundColor: '#83951c',
    elevation: 4,
    shadowColor: '#83951c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    transform: [{ scale: 1 }],
  },
  label: {
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
    color: '#83951c',
    fontFamily: 'Poppins-Medium',
  },
  focusedLabel: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
});

export default TabBarButton;