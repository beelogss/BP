import { View, StyleSheet } from 'react-native';
import React from 'react';
import TabBarButton from './TabBarButton'; // Custom TabBarButton with animation
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.shadowContainer}>
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const isFocused = state.index === index;

          return (
            <TabBarButton
              key={route.name}
              onPress={() => {
                if (!isFocused) {
                  navigation.navigate(route.name);
                }
              }}
              isFocused={isFocused}
              label={label}
              routeName={route.name}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    position: 'absolute',
    bottom: hp('2%'),
    left: wp('4%'),
    right: wp('4%'),
    backgroundColor: 'white',
    borderRadius: wp('7%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  tabbar: {
    flexDirection: 'row',
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp('2%'),
  },
});

export default TabBar;