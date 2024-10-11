import { Feather, Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export const icons = {
    Home: {
      regular: ({ color }) => <Ionicons name="home" size={hp('3.3%')} color={color} />, // Outlined or regular version
      solid: ({ color }) => <Ionicons name="home-outline" size={hp('3.2%')} color={color} />, // Solid version
    },
    Rewards: {
        regular: ({ color }) => <Ionicons name="gift" size={hp('3.3%')} color={color} />, // Outlined or regular version
        solid: ({ color }) => <Ionicons name="gift-outline" size={hp('3.3%')} color={color} />, // Solid version
      },
    Profile: {
        regular: ({ color }) => <Ionicons name="person" size={hp('3.3%')} color={color} />, // Outlined or regular version
        solid: ({ color }) => <Ionicons name="person-outline" size={hp('3.3%')} color={color} />, // Solid version
    },
    // Add for other icons
  };
  
