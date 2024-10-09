import { View, StyleSheet } from 'react-native';
import React from 'react';
import TabBarButton from './TabBarButton'; // Custom TabBarButton with animation

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = '#83951c';
  const greyColor = '#dddddd';

  return (
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
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 15,
    position: 'absolute',
    bottom: 25,
    shadowColor: 'black',
    elevation: 1.5,
  },
});

export default TabBar;
