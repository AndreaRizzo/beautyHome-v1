import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { getRequiredTreatmentIds, operatorOffersAll, countServicesOffered } from '@/utils/booking';

export const OperatorListScreen = ({
  route,
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'Operators'>) => {
  const { categoryId } = route.params ?? {};
  const [autoAssign, setAutoAssign] = useState(false);
  const { user, bookingDraft, setDraftOperator, operatorProfiles } = useAppStore((state) => ({
    user: state.user,
    bookingDraft: state.bookingDraft,
    setDraftOperator: state.setDraftOperator,
    operatorProfiles: state.operatorProfiles
  }));

  const requiredTreatmentIds = getRequiredTreatmentIds(bookingDraft.items);

  const operators = useMemo(() => {
    return operatorProfiles.filter((profile) => {
      if (user.cityId && profile.cityId !== user.cityId) return false;
      if (categoryId && !profile.categories.includes(categoryId)) return false;
      if (!operatorOffersAll(profile, requiredTreatmentIds)) return false;
      return true;
    });
  }, [categoryId, operatorProfiles, requiredTreatmentIds, user.cityId]);

  const handleAutoAssign = () => {
    if (!operators.length) return;
    setAutoAssign(true);
    setDraftOperator(undefined, true);
    navigation.navigate('DateTime');
  };

  return (
    <ScreenContainer>
      <FlatList
        data={operators}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <Card style={styles.autoCard}>
            <View style={styles.autoRow}>
              <Text style={styles.autoTitle}>Assegna automaticamente il miglior operatore disponibile</Text>
              <Pressable
                onPress={() => {
                  setAutoAssign((prev) => {
                    const next = !prev;
                    setDraftOperator(undefined, next);
                    return next;
                  });
                }}
                style={[styles.toggle, autoAssign && styles.toggleActive]}
              >
                <View style={[styles.toggleThumb, autoAssign && styles.toggleThumbActive]} />
              </Pressable>
            </View>
            <PrimaryButton label="CONTINUA" onPress={handleAutoAssign} disabled={!operators.length} />
          </Card>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <EmptyState
              title="Nessun professionista disponibile"
              subtitle="Nessun professionista disponibile per i servizi selezionati. Prova a cambiare orario o servizio."
            />
            <PrimaryButton label="CAMBIA ORARIO" onPress={() => navigation.navigate('DateTime')} />
            <PrimaryButton label="MODIFICA SERVIZI" onPress={() => navigation.navigate('Categories')} variant="secondary" />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.navigate('OperatorProfile', { operatorId: item.id });
            }}
          >
            <Card style={styles.card}>
              <View style={styles.row}>
                <Image source={{ uri: item.photo }} style={styles.avatar} />
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.firstName || item.lastName
                      ? `${item.firstName} ${item.lastName}`.trim()
                      : dataSources.users.find((user) => user.id === item.userId)?.name ?? 'Operatore'}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={colors.accent} />
                    <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                    {item.verified ? (
                      <View style={styles.badge}>
                        <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                        <Text style={styles.badgeText}>Verificato</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.serviceMeta}>
                    Offre: {countServicesOffered(item, dataSources.treatments)} servizi
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md
  },
  autoCard: {
    marginBottom: spacing.md,
    gap: spacing.md
  },
  autoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md
  },
  autoTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md,
    flex: 1
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    justifyContent: 'center'
  },
  toggleActive: {
    backgroundColor: colors.primary
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.text,
    alignSelf: 'flex-start'
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#1B0F2A'
  },
  card: {
    gap: spacing.sm
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18
  },
  info: {
    flex: 1,
    gap: spacing.xs
  },
  name: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  rating: {
    color: colors.text,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
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
  serviceMeta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.xs
  },
  emptyWrapper: {
    gap: spacing.md,
    paddingVertical: spacing.lg
  }
});
