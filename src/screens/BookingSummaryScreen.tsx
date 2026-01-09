import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';
import { buildBookingTotals, formatDateTime, formatMinutes, formatPrice } from '@/utils/format';

const depositRate = 0.2;

export const BookingSummaryScreen = ({
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'BookingSummary'>) => {
  const { bookingDraft, operatorProfiles } = useAppStore((state) => ({
    bookingDraft: state.bookingDraft,
    operatorProfiles: state.operatorProfiles
  }));
  const totals = useMemo(() => buildBookingTotals(bookingDraft.items), [bookingDraft.items]);
  const operator = operatorProfiles.find((item) => item.id === bookingDraft.operatorId);
  const operatorName = operator
    ? operator.firstName || operator.lastName
      ? `${operator.firstName} ${operator.lastName}`.trim()
      : dataSources.users.find((user) => user.id === operator.userId)?.name
    : 'Assegnazione automatica';
  const scheduledLabel = bookingDraft.scheduledAt ? formatDateTime(bookingDraft.scheduledAt) : 'Non impostato';
  const address = bookingDraft.address;
  const deposit = totals.totalPrice * depositRate;
  const balance = totals.totalPrice - deposit;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Riepilogo prenotazione</Text>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Servizi</Text>
          {bookingDraft.items.map((item) => {
            const treatment = dataSources.treatments.find((t) => t.id === item.treatmentId);
            return (
              <View key={item.treatmentId} style={styles.rowBetween}>
                <Text style={styles.text}>{treatment?.name ?? 'Service'}</Text>
                <Text style={styles.text}>x{item.quantity}</Text>
              </View>
            );
          })}
          <Text style={styles.meta}>Durata · {formatMinutes(totals.totalDurationMinutes)}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Operatore</Text>
          <Text style={styles.text}>{operatorName ?? 'Auto-assign'}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Data e ora</Text>
          <Text style={styles.text}>{scheduledLabel}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Indirizzo</Text>
          {address ? (
            <Text style={styles.text}>
              {address.street} {address.number}, {address.zip} {address.city}
            </Text>
          ) : (
            <Text style={styles.text}>Non impostato</Text>
          )}
        </Card>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Pagamento</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Totale</Text>
            <Text style={styles.text}>{formatPrice(totals.totalPrice)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Caparra</Text>
            <Text style={styles.text}>{formatPrice(deposit)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Saldo</Text>
            <Text style={styles.text}>{formatPrice(balance)}</Text>
          </View>
        </Card>
        <PrimaryButton label="VAI AL PAGAMENTO" onPress={() => navigation.navigate('Payment')} />
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
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.md
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
