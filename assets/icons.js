import { Feather, Ionicons } from '@expo/vector-icons';

export const icons = {
    Home: {
      regular: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />, // Outlined or regular version
      solid: ({ color }) => <Ionicons name="home" size={24} color={color} />, // Solid version
    },
    Rewards: {
        regular: ({ color }) => <Ionicons name="gift-outline" size={24} color={color} />, // Outlined or regular version
        solid: ({ color }) => <Ionicons name="gift" size={24} color={color} />, // Solid version
      },
    Profile: {
        regular: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />, // Outlined or regular version
        solid: ({ color }) => <Ionicons name="person" size={24} color={color} />, // Solid version
    },
    // Add for other icons
  };
  
