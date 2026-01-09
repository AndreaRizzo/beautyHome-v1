import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export const QuantitySelector = ({ value, onChange }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => onChange(Math.max(1, value - 1))}
      >
        <Ionicons name="remove" size={18} color={colors.text} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable style={styles.button} onPress={() => onChange(value + 1)}>
        <Ionicons name="add" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  value: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.lg
  }
});
