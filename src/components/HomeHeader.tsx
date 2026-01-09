import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

type Props = {
  locationLabel: string;
  onLocationPress: () => void;
  onBookingsPress: () => void;
  onProfilePress: () => void;
};

export const HomeHeader = ({
  locationLabel,
  onLocationPress,
  onBookingsPress,
  onProfilePress
}: Props) => {
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.location} onPress={onLocationPress}>
        <Ionicons name="location" size={18} color={colors.accent} />
        <Text style={styles.locationText}>{locationLabel}</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={styles.iconButton} onPress={onBookingsPress}>
          <Ionicons name="calendar" size={20} color={colors.text} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onProfilePress}>
          <Ionicons name="person" size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border
  },
  locationText: {
    marginLeft: spacing.xs,
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm,
    letterSpacing: 0.4
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border
  }
});
