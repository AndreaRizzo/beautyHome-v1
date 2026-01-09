import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OperatorStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';

const buildDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
};

export const OperatorAvailabilityScreen = ({
  navigation
}: NativeStackScreenProps<OperatorStackParamList, 'OperatorAvailability'>) => {
  const { user, updateAvailability, operatorProfiles } = useAppStore((state) => ({
    user: state.user,
    updateAvailability: state.updateAvailability,
    operatorProfiles: state.operatorProfiles
  }));
  const profile = operatorProfiles.find((item) => item.userId === user.id);
  const [selectedDay, setSelectedDay] = useState(buildDays()[0]);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('18:00');

  if (!profile) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <Text style={styles.title}>Profilo mancante</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleSave = () => {
    updateAvailability(profile.id, selectedDay, start, end);
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Disponibilita</Text>
        <FlatList
          horizontal
          data={buildDays()}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.days}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedDay(item)}>
              <Card style={[styles.dayCard, selectedDay === item && styles.dayCardActive]}>
                <Text style={styles.dayText}>{item}</Text>
              </Card>
            </Pressable>
          )}
        />
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Ora inizio</Text>
          <TextInput value={start} onChangeText={setStart} style={styles.input} />
          <Text style={styles.sectionTitle}>Ora fine</Text>
          <TextInput value={end} onChangeText={setEnd} style={styles.input} />
        </Card>
        <PrimaryButton label="SALVA DISPONIBILITA" onPress={handleSave} />
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
  dayText: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  card: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontFamily: typography.bodyFont,
    borderWidth: 1,
    borderColor: colors.border
  }
});
