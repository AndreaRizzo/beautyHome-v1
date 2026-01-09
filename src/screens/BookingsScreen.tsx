import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingsStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime, formatPrice, formatStatus } from '@/utils/format';

const tabs = ['Prossime', 'Passate', 'Annullate'] as const;

export const BookingsScreen = ({
  navigation
}: NativeStackScreenProps<BookingsStackParamList, 'Bookings'>) => {
  const bookings = useAppStore((state) => state.bookings);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Prossime');

  const filtered = useMemo(() => {
    const now = new Date();
    return bookings.filter((booking) => {
      const scheduled = booking.scheduledAt ? new Date(booking.scheduledAt) : null;
      if (activeTab === 'Annullate') {
        return booking.status.includes('cancelled');
      }
      if (activeTab === 'Passate') {
        return scheduled ? scheduled < now : false;
      }
      return scheduled ? scheduled >= now : booking.status === 'confirmed';
    });
  }, [activeTab, bookings]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Prenotazioni</Text>
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabActive]}>{tab}</Text>
            </Pressable>
          ))}
        </View>
        {filtered.length === 0 ? (
          <EmptyState title="Nessuna prenotazione" subtitle="Inizia prenotando il tuo primo servizio." />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}>
                <Card style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {item.scheduledAt ? formatDateTime(item.scheduledAt) : 'In programma'}
                  </Text>
                  <Text style={styles.cardMeta}>Totale · {formatPrice(item.totalPrice)}</Text>
                  <Text style={styles.cardStatus}>{formatStatus(item.status)}</Text>
                </Card>
              </Pressable>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg
  },
  tabText: {
    color: colors.textSubtle,
    fontFamily: typography.headingFont
  },
  tabActive: {
    color: colors.primary
  },
  list: {
    gap: spacing.md
  },
  card: {
    gap: spacing.xs
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.headingFont
  },
  cardMeta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont
  },
  cardStatus: {
    color: colors.accent,
    fontFamily: typography.bodyFont
  }
});
