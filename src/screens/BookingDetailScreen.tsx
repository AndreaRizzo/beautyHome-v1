import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingsStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';
import { formatDateTime, formatMinutes, formatPrice, formatStatus } from '@/utils/format';

const cutoffHours = 24;

export const BookingDetailScreen = ({
  route,
  navigation
}: NativeStackScreenProps<BookingsStackParamList, 'BookingDetail'>) => {
  const { bookingId } = route.params;
  const booking = useAppStore((state) => state.bookings.find((item) => item.id === bookingId));
  const { updateBookingStatus, setDraftFromBooking } = useAppStore((state) => ({
    updateBookingStatus: state.updateBookingStatus,
    setDraftFromBooking: state.setDraftFromBooking
  }));

  if (!booking) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <Text style={styles.title}>Prenotazione non trovata</Text>
        </View>
      </ScreenContainer>
    );
  }

  const scheduled = booking.scheduledAt ? new Date(booking.scheduledAt) : null;
  const canModify = scheduled ? scheduled.getTime() - Date.now() > cutoffHours * 3600 * 1000 : false;
  const paymentLabel =
    booking.payment?.status === 'paid'
      ? 'pagato'
      : booking.payment?.status === 'failed'
        ? 'fallito'
        : 'in attesa';

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dettagli prenotazione</Text>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Stato</Text>
          <Text style={styles.text}>{formatStatus(booking.status)}</Text>
          {booking.scheduledAt ? (
            <Text style={styles.meta}>
              {formatDateTime(booking.scheduledAt)}
            </Text>
          ) : null}
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Servizi</Text>
          {booking.items.map((item) => {
            const treatment = dataSources.treatments.find((t) => t.id === item.treatmentId);
            return (
              <View key={item.treatmentId} style={styles.rowBetween}>
                <Text style={styles.text}>{treatment?.name ?? 'Servizio'}</Text>
                <Text style={styles.text}>x{item.quantity}</Text>
              </View>
            );
          })}
          <Text style={styles.meta}>Durata · {formatMinutes(booking.totalDurationMinutes)}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Pagamento</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Totale</Text>
            <Text style={styles.text}>{formatPrice(booking.totalPrice)}</Text>
          </View>
          <Text style={styles.meta}>Stato pagamento · {paymentLabel}</Text>
        </Card>
        <View style={styles.actions}>
          <PrimaryButton
            label={canModify ? 'MODIFICA PRENOTAZIONE' : 'MODIFICA NON DISPONIBILE'}
            onPress={() => {
              if (!canModify) {
                Alert.alert('Finestra di modifica chiusa', 'Le prenotazioni sono modificabili fino a 24h prima.');
                return;
              }
              setDraftFromBooking(booking.id);
              navigation.getParent()?.navigate('Home', { screen: 'DateTime' } as never);
            }}
            variant="secondary"
            disabled={!canModify}
          />
          <PrimaryButton
            label="AGGIUNGI SERVIZI"
            onPress={() => navigation.getParent()?.navigate('Home')}
            variant="secondary"
          />
          <PrimaryButton
            label="ANNULLA PRENOTAZIONE"
            onPress={() => updateBookingStatus(booking.id, 'cancelled_by_user')}
            variant="ghost"
          />
          <PrimaryButton
            label="LASCIA RECENSIONE"
            onPress={() => Alert.alert('Recensione inviata', 'Grazie per il tuo feedback.')}
            variant="secondary"
          />
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
    fontSize: typography.sizes.sm,
    letterSpacing: 1.2
  },
  text: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actions: {
    gap: spacing.sm
  }
});
