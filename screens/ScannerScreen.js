import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, BackHandler, LogBox } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from '@react-navigation/native';

// Ignore specific warning
LogBox.ignoreLogs(['BarCodeScanner has been deprecated and will be removed in a future SDK version.']);

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        torchMode={torchOn ? 'on' : 'off'}
        zoom={zoom}
      />
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.description}>Align the barcode within the frame to scan</Text>
        </View>
        <View style={styles.middleOverlay}>
          <View style={styles.leftAndRightOverlay} />
          <View style={styles.focused}>
            <View style={styles.focusedFrame} />
          </View>
          <View style={styles.leftAndRightOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          {/* <TouchableOpacity
            style={styles.flashButton}
            onPress={() => setTorchOn(!torchOn)}
          >
            <Text style={styles.flashButtonText}>{torchOn ? 'Flash Off' : 'Flash On'}</Text>
          </TouchableOpacity>
          {scanned && (
            <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
          )}
          <View style={styles.zoomControls}>
            <Button title="Zoom In" onPress={() => setZoom(Math.min(zoom + 0.1, 1))} />
            <Button title="Zoom Out" onPress={() => setZoom(Math.max(zoom - 0.1, 0))} />
          </View> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleOverlay: {
    flexDirection: 'row',
    flex: 2,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftAndRightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  focused: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 10,
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});