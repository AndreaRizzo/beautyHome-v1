import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, helper, useAppStore } from '@/store/useAppStore';
import { buildDaySlots, groupSlots } from '@/utils/timeSlots';
import { buildBookingTotals, toDayLabel } from '@/utils/format';

const buildDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
};

export const DateTimeScreen = ({
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'DateTime'>) => {
  const [selectedDay, setSelectedDay] = useState(buildDays()[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { bookingDraft, setDraftScheduledAt } = useAppStore((state) => ({
    bookingDraft: state.bookingDraft,
    setDraftScheduledAt: state.setDraftScheduledAt
  }));

  const totalDuration = buildBookingTotals(bookingDraft.items).totalDurationMinutes;

  const availableSlots = useMemo(() => {
    const slots = buildDaySlots();
    if (bookingDraft.autoAssign || !bookingDraft.operatorId) {
      return slots;
    }
    const availabilitySlots = dataSources.availability.filter(
      (slot) => slot.operatorId === bookingDraft.operatorId && slot.day === selectedDay
    );
    if (!availabilitySlots.length) return [];
    return slots.filter((slot) => {
      const endTime = helper.addMinutesToTime(slot, totalDuration);
      return availabilitySlots.some((avail) => slot >= avail.start && endTime <= avail.end);
    });
  }, [bookingDraft.autoAssign, bookingDraft.operatorId, selectedDay, totalDuration]);

  const grouped = groupSlots(availableSlots);

  const handleContinue = () => {
    if (!selectedSlot) return;
    setDraftScheduledAt(`${selectedDay}T${selectedSlot}:00.000Z`);
    navigation.navigate('Address');
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Scegli data e ora</Text>
        <FlatList
          horizontal
          data={buildDays()}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.days}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedDay(item)}>
              <Card style={[styles.dayCard, selectedDay === item && styles.dayCardActive]}>
                <Text style={styles.dayLabel}>{toDayLabel(item)}</Text>
              </Card>
            </Pressable>
          )}
        />
        {([
          { key: 'morning', label: 'MATTINA' },
          { key: 'afternoon', label: 'POMERIGGIO' },
          { key: 'evening', label: 'SERA' }
        ] as const).map((period) => (
          <View key={period.key} style={styles.group}>
            <Text style={styles.groupTitle}>{period.label}</Text>
            <View style={styles.slotGrid}>
              {grouped[period.key].map((slot) => (
                <Pressable key={slot} onPress={() => setSelectedSlot(slot)}>
                  <Card style={[styles.slot, selectedSlot === slot && styles.slotActive]}>
                    <Text style={styles.slotText}>{slot}</Text>
                  </Card>
                </Pressable>
              ))}
              {grouped[period.key].length === 0 ? (
                <Text style={styles.emptySlots}>Nessuna fascia disponibile</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="CONTINUA" onPress={handleContinue} disabled={!selectedSlot} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: 120
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl
  },
  days: {
    gap: spacing.sm
  },
  dayCard: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md
  },
  dayCardActive: {
    borderColor: colors.primary
  },
  dayLabel: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  group: {
    gap: spacing.sm
  },
  groupTitle: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    letterSpacing: 2,
    fontSize: typography.sizes.xs
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  slot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md
  },
  slotActive: {
    borderColor: colors.primary
  },
  slotText: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  emptySlots: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont
  },
  footer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg
  }
});
