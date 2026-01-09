import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useAppStore } from '@/store/useAppStore';
import { generateId } from '@/utils/format';

export const AddressScreen = ({
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'Address'>) => {
  const { user, addAddress, setDraftAddress } = useAppStore((state) => ({
    user: state.user,
    addAddress: state.addAddress,
    setDraftAddress: state.setDraftAddress
  }));

  const [form, setForm] = useState({
    street: '',
    number: '',
    zip: '',
    city: '',
    notes: ''
  });

  const handleSelectAddress = (addressId: string) => {
    const address = user.addresses.find((item) => item.id === addressId);
    if (address) {
      setDraftAddress(address);
      navigation.navigate('BookingSummary');
    }
  };

  const handleAddAddress = () => {
    if (!form.street || !form.number || !form.zip || !form.city) return;
    const address = { id: generateId('addr'), ...form };
    addAddress(address);
    setDraftAddress(address);
    navigation.navigate('BookingSummary');
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Seleziona indirizzo</Text>
        {user.addresses.map((address) => (
          <Pressable key={address.id} onPress={() => handleSelectAddress(address.id)}>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>
                {address.street} {address.number}
              </Text>
              <Text style={styles.cardSub}>
                {address.zip} · {address.city}
              </Text>
              {address.notes ? <Text style={styles.cardNotes}>{address.notes}</Text> : null}
            </Card>
          </Pressable>
        ))}
        <Text style={styles.subtitle}>Aggiungi nuovo indirizzo</Text>
        {(['street', 'number', 'zip', 'city', 'notes'] as const).map((field) => (
          <TextInput
            key={field}
            placeholder={
              field === 'street'
                ? 'VIA'
                : field === 'number'
                  ? 'NUMERO'
                  : field === 'zip'
                    ? 'CAP'
                    : field === 'city'
                      ? 'CITTA'
                      : 'NOTE'
            }
            placeholderTextColor={colors.textSubtle}
            value={form[field]}
            onChangeText={(value) => setForm((prev) => ({ ...prev, [field]: value }))}
            style={styles.input}
            multiline={field === 'notes'}
          />
        ))}
        <PrimaryButton label="SALVA INDIRIZZO" onPress={handleAddAddress} />
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
  subtitle: {
    color: colors.textSubtle,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md,
    marginTop: spacing.md
  },
  card: {
    backgroundColor: colors.surfaceAlt
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md
  },
  cardSub: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  },
  cardNotes: {
    color: colors.text,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: spacing.md,
    color: colors.text,
    fontFamily: typography.bodyFont,
    borderWidth: 1,
    borderColor: colors.border
  }
});
