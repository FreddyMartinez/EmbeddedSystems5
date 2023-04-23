import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Práctica 5 - SEU</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0ad',
    paddingVertical: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});
