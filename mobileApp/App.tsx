import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import { Header } from './src/header';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={'#0ad'} />
      <Header />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
