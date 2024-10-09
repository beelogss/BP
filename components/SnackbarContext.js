import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {snackbarVisible && (
        <View style={styles.snackbarContainer}>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={hideSnackbar}
            duration={Snackbar.DURATION_SHORT}
            style={{ backgroundColor: snackbarColor }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      )}
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    top: 100, 
    left: 0,
    right: 0,
    alignItems: 'center', 
    zIndex: 9999, 
  },
});
