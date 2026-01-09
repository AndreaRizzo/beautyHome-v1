import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';
import { countServicesOffered } from '@/utils/booking';

export const OperatorProfileScreen = ({
  route,
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'OperatorProfile'>) => {
  const { operatorId } = route.params;
  const setDraftOperator = useAppStore((state) => state.setDraftOperator);
  const operator = useAppStore((state) => state.operatorProfiles.find((item) => item.id === operatorId));
  const operatorUser = operator
    ? dataSources.users.find((user) => user.id === operator.userId)
    : undefined;

  const categoryNames = useMemo(() => {
    if (!operator) return [];
    return operator.categories
      .map((categoryId) => dataSources.categories.find((cat) => cat.id === categoryId)?.name)
      .filter((name): name is string => !!name);
  }, [operator]);

  if (!operator) {
    return (
      <ScreenContainer>
        <EmptyState title="Operatore non trovato" subtitle="Torna all'elenco e riprova." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: operator.photo }} style={styles.photo} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {operator.firstName || operator.lastName
                ? `${operator.firstName} ${operator.lastName}`.trim()
                : operatorUser?.name ?? 'Operatore'}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.accent} />
              <Text style={styles.rating}>{operator.rating.toFixed(1)}</Text>
              {operator.verified ? (
                <View style={styles.badge}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.badgeText}>Verificato</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.meta}>
              Offre: {countServicesOffered(operator, dataSources.treatments)} servizi
            </Text>
          </View>
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Specializzazioni</Text>
          <Text style={styles.text}>{categoryNames.join(' · ') || '—'}</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Esperienza</Text>
          <Text style={styles.text}>Professionista certificato con disponibilita su richiesta.</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Recensioni</Text>
          <Text style={styles.text}>"Servizio impeccabile e puntuale."</Text>
          <Text style={styles.meta}>— Cliente verificato</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Servizi offerti</Text>
          <Text style={styles.text}>
            {operator.offeredTreatmentIds
              .map((id) => dataSources.treatments.find((item) => item.id === id)?.name)
              .filter((name): name is string => !!name)
              .join(' · ') || '—'}
          </Text>
        </Card>

        <PrimaryButton
          label="SELEZIONA OPERATORE"
          onPress={() => {
            setDraftOperator(operator.id, false);
            navigation.navigate('DateTime');
          }}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md
  },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center'
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 24
  },
  headerInfo: {
    flex: 1,
    gap: spacing.xs
  },
  name: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.lg
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  rating: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999
  },
  badgeText: {
    color: colors.success,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.xs
  },
  card: {
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm,
    letterSpacing: 1.1
  },
  text: {
    color: colors.text,
    fontFamily: typography.bodyFont
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  }
});
