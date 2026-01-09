import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

export const LoadingSkeleton = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.block} />
      <View style={styles.block} />
      <View style={styles.block} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 12
  },
  block: {
    height: 100,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    opacity: 0.7
  }
});
