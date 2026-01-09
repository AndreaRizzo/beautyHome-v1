import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';
import { CountryCode } from '@/models/types';

export const OnboardingLocationScreen = ({
  navigation
}: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) => {
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('IT');
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const setLocation = useAppStore((state) => state.setLocation);
  const role = useAppStore((state) => state.role);

  const cities = dataSources.cities.filter((city) => city.countryCode === selectedCountry);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (selectedCity) {
      setLocation(selectedCountry, selectedCity);
      navigation.replace(role === 'operator' ? 'Operator' : 'User');
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Dove vuoi ricevere il servizio?</Text>
      {step === 1 ? (
        <FlatList
          data={dataSources.countries}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedCountry(item.code)}>
              <Card style={[styles.card, selectedCountry === item.code && styles.cardSelected]}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </Card>
            </Pressable>
          )}
        />
      ) : (
        cities.length === 0 ? (
          <EmptyState title="Citta in arrivo" subtitle="Stiamo lanciando presto questa zona." />
        ) : (
          <FlatList
            data={cities}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelectedCity(item.id)}>
                <Card style={[styles.card, selectedCity === item.id && styles.cardSelected]}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </Card>
              </Pressable>
            )}
          />
        )
      )}
      <PrimaryButton
        label={step === 1 ? 'CONTINUA' : 'CONFERMA POSIZIONE'}
        onPress={handleContinue}
        disabled={step === 2 && !selectedCity}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl,
    marginBottom: spacing.lg
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.lg
  },
  card: {
    backgroundColor: colors.surfaceAlt
  },
  cardSelected: {
    borderColor: colors.primary
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.lg
  }
});
