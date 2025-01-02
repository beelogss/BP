import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const contentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: wp('5%'),
  },
  section: {
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: hp('2.2%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('1.5%'),
  },
  text: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    lineHeight: hp('2.8%'),
  }
}); 