import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useAppStore } from '@/store/useAppStore';
import { generateId, nowISO } from '@/utils/format';

const presets = [30, 50, 80, 120];

export const GiftCardScreen = () => {
  const addGiftCard = useAppStore((state) => state.addGiftCard);
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleGenerate = () => {
    const finalAmount = custom ? Number(custom) : amount;
    if (!email || !finalAmount) return;
    const code = `GIFT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    addGiftCard({
      id: generateId('gift'),
      amount: finalAmount,
      recipientEmail: email,
      message: message || undefined,
      code,
      createdAt: nowISO()
    });
    Alert.alert('Gift card generata', `Codice: ${code}`);
    setEmail('');
    setMessage('');
    setCustom('');
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Regala un servizio</Text>
        <Text style={styles.subtitle}>Scegli un importo e invia subito.</Text>
        <View style={styles.row}>
          {presets.map((value) => (
            <Pressable key={value} onPress={() => setAmount(value)}>
              <Card style={[styles.amountCard, amount === value && styles.amountCardActive]}>
                <Text style={styles.amountText}>€{value}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
        <TextInput
          placeholder="Importo personalizzato"
          placeholderTextColor={colors.textSubtle}
          keyboardType="numeric"
          value={custom}
          onChangeText={setCustom}
          style={styles.input}
        />
        <TextInput
          placeholder="Email destinatario"
          placeholderTextColor={colors.textSubtle}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Messaggio opzionale"
          placeholderTextColor={colors.textSubtle}
          value={message}
          onChangeText={setMessage}
          style={[styles.input, styles.message]}
          multiline
        />
        <PrimaryButton label="GENERA CODICE REGALO" onPress={handleGenerate} />
      </View>
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
  subtitle: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  amountCard: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md
  },
  amountCardActive: {
    borderColor: colors.primary
  },
  amountText: {
    color: colors.text,
    fontFamily: typography.headingFont
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: spacing.md,
    color: colors.text,
    fontFamily: typography.bodyFont,
    borderWidth: 1,
    borderColor: colors.border
  },
  message: {
    minHeight: 80
  }
});
