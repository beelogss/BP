import { View, StyleSheet } from 'react-native';
import React from 'react';
import TabBarButton from './TabBarButton'; // Custom TabBarButton with animation
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = 'floralwhite';
  const greyColor = '#dddddd';
  const selectedBackgroundColor = '#7a9b57'; // Background color for selected tab

  return (
    <View style={styles.shadowContainer}>
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              isFocused={isFocused}
              label={label}
              routeName={route.name}
              color={isFocused ? primaryColor : greyColor}
              backgroundColor={isFocused ? selectedBackgroundColor : 'transparent'}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: 'black',
    elevation: hp('1.2%'),
    position: 'absolute',
    bottom: hp('2.2%'),
    left: hp('7%'),
    right: hp('7%'),
    borderRadius: wp('15%'),
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: hp('1.3%'),
    borderRadius: wp('7%'),
    padding: hp('1%'),
  },
});

export default TabBar;