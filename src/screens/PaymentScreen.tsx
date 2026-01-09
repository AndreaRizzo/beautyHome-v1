import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useAppStore } from '@/store/useAppStore';
import { buildBookingTotals, formatPrice, generateId } from '@/utils/format';
import { PaymentMode } from '@/models/types';

const depositRate = 0.2;

const options: { mode: PaymentMode; title: string; subtitle: string }[] = [
  {
    mode: 'deposit_balance_app',
    title: 'Caparra ora, saldo in app',
    subtitle: 'Paga il saldo dopo il servizio.'
  },
  {
    mode: 'deposit_balance_cash',
    title: 'Caparra ora, saldo in contanti',
    subtitle: "Paga il saldo direttamente all'operatore."
  },
  {
    mode: 'full_app',
    title: 'Pagamento completo in app',
    subtitle: 'Completa il pagamento ora.'
  }
];

export const PaymentScreen = ({
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'Payment'>) => {
  const { bookingDraft, createBookingFromDraft, recordPayment, resetDraft, setDraftPaymentMode } = useAppStore(
    (state) => ({
      bookingDraft: state.bookingDraft,
      createBookingFromDraft: state.createBookingFromDraft,
      recordPayment: state.recordPayment,
      resetDraft: state.resetDraft,
      setDraftPaymentMode: state.setDraftPaymentMode
    })
  );
  const totals = useMemo(() => buildBookingTotals(bookingDraft.items), [bookingDraft.items]);
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('deposit_balance_app');

  const deposit = totals.totalPrice * depositRate;
  const balance = totals.totalPrice - deposit;

  const handlePayment = () => {
    const booking = createBookingFromDraft();
    if (!booking) return;
    const payment = {
      id: generateId('payment'),
      mode: selectedMode,
      depositAmount: selectedMode === 'full_app' ? totals.totalPrice : deposit,
      balanceAmount: selectedMode === 'full_app' ? 0 : balance,
      status: 'paid' as const
    };
    recordPayment(booking.id, payment);
    resetDraft();
    navigation.navigate('Confirmation', { bookingId: booking.id });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Pagamento</Text>
        {options.map((option) => (
          <Pressable
            key={option.mode}
            onPress={() => {
              setSelectedMode(option.mode);
              setDraftPaymentMode(option.mode);
            }}
          >
            <Card style={[styles.card, selectedMode === option.mode && styles.cardActive]}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
            </Card>
          </Pressable>
        ))}
        <Card style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Totale</Text>
            <Text style={styles.text}>{formatPrice(totals.totalPrice)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Caparra ora</Text>
            <Text style={styles.text}>
              {formatPrice(selectedMode === 'full_app' ? totals.totalPrice : deposit)}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>Saldo</Text>
            <Text style={styles.text}>
              {formatPrice(selectedMode === 'full_app' ? 0 : balance)}
            </Text>
          </View>
        </Card>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="PAGA E CONFERMA" onPress={handlePayment} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 120
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl
  },
  card: {
    gap: spacing.sm
  },
  cardActive: {
    borderColor: colors.primary
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md
  },
  cardSubtitle: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  footer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg
  }
});
