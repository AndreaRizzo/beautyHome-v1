import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OperatorStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, formatStatus } from '@/utils/format';

export const OperatorBookingDetailScreen = ({
  route
}: NativeStackScreenProps<OperatorStackParamList, 'OperatorBookingDetail'>) => {
  const { bookingId } = route.params;
  const booking = useAppStore((state) => state.bookings.find((item) => item.id === bookingId));
  const updateStatus = useAppStore((state) => state.updateBookingStatus);

  if (!booking) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <Text style={styles.title}>Prenotazione non trovata</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Richiesta prenotazione</Text>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Stato</Text>
          <Text style={styles.text}>{formatStatus(booking.status)}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Pagamento</Text>
          <Text style={styles.text}>Totale · {formatPrice(booking.totalPrice)}</Text>
          {booking.payment?.mode === 'deposit_balance_cash' ? (
            <Text style={styles.meta}>Contanti da incassare all'arrivo</Text>
          ) : null}
        </Card>
        <View style={styles.actions}>
          <PrimaryButton label="IN ARRIVO" onPress={() => updateStatus(booking.id, 'confirmed')} />
          <PrimaryButton label="IN CORSO" onPress={() => updateStatus(booking.id, 'in_progress')} />
          <PrimaryButton label="COMPLETATO" onPress={() => updateStatus(booking.id, 'completed')} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl
  },
  card: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm
  },
  text: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont
  },
  actions: {
    gap: spacing.sm
  }
});
