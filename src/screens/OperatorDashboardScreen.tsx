import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OperatorStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';
import { formatDateTime, formatMinutes, formatPrice } from '@/utils/format';

export const OperatorDashboardScreen = ({
  navigation
}: NativeStackScreenProps<OperatorStackParamList, 'OperatorDashboard'>) => {
  const {
    user,
    bookings,
    setUserRole,
    operatorProfiles,
    updateOperatorProfile,
    toggleOfferedTreatment,
    setOfferedTreatments,
    updateAvailability
  } = useAppStore((state) => ({
    user: state.user,
    bookings: state.bookings,
    setUserRole: state.setUserRole,
    operatorProfiles: state.operatorProfiles,
    updateOperatorProfile: state.updateOperatorProfile,
    toggleOfferedTreatment: state.toggleOfferedTreatment,
    setOfferedTreatments: state.setOfferedTreatments,
    updateAvailability: state.updateAvailability
  }));
  const profile = operatorProfiles.find((item) => item.userId === user.id);
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

  const upcoming = useMemo(() => {
    return bookings.filter((booking) => booking.operatorId === profile?.id && booking.status !== 'completed');
  }, [bookings, profile?.id]);

  const categories = dataSources.categories.map((category) => ({
    ...category,
    subcategories: dataSources.subcategories.filter((sub) => sub.categoryId === category.id)
  }));

  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Dashboard operatore</Text>
        <PrimaryButton label="IMPOSTA DISPONIBILITA" onPress={() => navigation.navigate('OperatorAvailability')} />
        <PrimaryButton label="TORNA A CLIENTE" onPress={() => setUserRole('user')} variant="secondary" />

        {!profile ? (
          <EmptyState title="Profilo non collegato" subtitle="Contatta l'assistenza per completare l'onboarding." />
        ) : (
          <>
            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Profilo operatore</Text>
              <TextInput
                placeholder="Nome"
                placeholderTextColor={colors.textSubtle}
                value={firstName}
                onChangeText={(value) => {
                  setFirstName(value);
                  updateOperatorProfile(profile.id, { firstName: value });
                }}
                style={styles.input}
              />
              <TextInput
                placeholder="Cognome"
                placeholderTextColor={colors.textSubtle}
                value={lastName}
                onChangeText={(value) => {
                  setLastName(value);
                  updateOperatorProfile(profile.id, { lastName: value });
                }}
                style={styles.input}
              />
            </Card>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Servizi offerti</Text>
              {categories.map((category) => (
                <View key={category.id} style={styles.categoryBlock}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  {category.subcategories.map((sub) => {
                    const subTreatments = dataSources.treatments.filter(
                      (treatment) => treatment.subcategoryId === sub.id
                    );
                    if (!subTreatments.length) return null;
                    const allSelected = subTreatments.every((treatment) =>
                      profile.offeredTreatmentIds.includes(treatment.id)
                    );
                    return (
                      <View key={sub.id} style={styles.subBlock}>
                        <View style={styles.subHeader}>
                          <Text style={styles.subTitle}>{sub.name}</Text>
                          <View style={styles.subActions}>
                            <Pressable
                              onPress={() =>
                                setOfferedTreatments(
                                  profile.id,
                                  Array.from(
                                    new Set([
                                      ...profile.offeredTreatmentIds,
                                      ...subTreatments.map((treatment) => treatment.id)
                                    ])
                                  )
                                )
                              }
                            >
                              <Text style={styles.subActionText}>Seleziona tutti</Text>
                            </Pressable>
                            <Pressable
                              onPress={() =>
                                setOfferedTreatments(
                                  profile.id,
                                  profile.offeredTreatmentIds.filter(
                                    (id) => !subTreatments.some((treatment) => treatment.id === id)
                                  )
                                )
                              }
                            >
                              <Text style={styles.subActionText}>Deseleziona</Text>
                            </Pressable>
                          </View>
                        </View>
                        {subTreatments.map((treatment) => {
                          const enabled = profile.offeredTreatmentIds.includes(treatment.id);
                          return (
                            <View key={treatment.id} style={styles.treatmentRow}>
                              <View style={styles.treatmentInfo}>
                                <Text style={styles.treatmentName}>{treatment.name}</Text>
                                <Text style={styles.treatmentMeta}>
                                  {formatMinutes(treatment.durationMinutes)} · {formatPrice(treatment.price)}
                                </Text>
                              </View>
                              <Pressable
                                onPress={() => toggleOfferedTreatment(profile.id, treatment.id)}
                                style={[styles.toggle, enabled && styles.toggleActive]}
                              >
                                <View style={[styles.toggleThumb, enabled && styles.toggleThumbActive]} />
                              </Pressable>
                            </View>
                          );
                        })}
                        {allSelected ? <Text style={styles.subtle}>Tutti selezionati</Text> : null}
                      </View>
                    );
                  })}
                </View>
              ))}
            </Card>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Disponibilita</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
                {days.map((day) => (
                  <Pressable key={day} onPress={() => setSelectedDay(day)}>
                    <View style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}>
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
              <TextInput
                placeholder="Ora inizio (HH:MM)"
                placeholderTextColor={colors.textSubtle}
                value={startTime}
                onChangeText={setStartTime}
                style={styles.input}
              />
              <TextInput
                placeholder="Ora fine (HH:MM)"
                placeholderTextColor={colors.textSubtle}
                value={endTime}
                onChangeText={setEndTime}
                style={styles.input}
              />
              <PrimaryButton
                label="SALVA DISPONIBILITA"
                onPress={() => profile && updateAvailability(profile.id, selectedDay, startTime, endTime)}
                variant="secondary"
              />
            </Card>

            <View style={styles.sectionSpacer} />
            <Text style={styles.sectionTitle}>Prenotazioni</Text>
            {upcoming.length === 0 ? (
              <EmptyState
                title="Nessuna prenotazione in arrivo"
                subtitle="Aggiorna la disponibilita per ricevere richieste."
              />
            ) : (
              <View style={styles.list}>
                {upcoming.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => navigation.navigate('OperatorBookingDetail', { bookingId: item.id })}
                  >
                    <Card style={styles.card}>
                      <Text style={styles.cardTitle}>
                        {item.scheduledAt ? formatDateTime(item.scheduledAt) : 'Prenotazione'}
                      </Text>
                      <Text style={styles.cardMeta}>Totale · {formatPrice(item.totalPrice)}</Text>
                      {item.payment?.mode === 'deposit_balance_cash' ? (
                        <Text style={styles.cardMeta}>Contanti da incassare</Text>
                      ) : null}
                    </Card>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl
  },
  list: {
    gap: spacing.md
  },
  days: {
    gap: spacing.sm,
    paddingVertical: spacing.sm
  },
  dayChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt
  },
  dayChipActive: {
    borderColor: colors.primary
  },
  dayText: {
    color: colors.text,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  },
  sectionSpacer: {
    height: spacing.sm
  },
  card: {
    gap: spacing.xs
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm,
    letterSpacing: 1.2
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.headingFont
  },
  cardMeta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontFamily: typography.bodyFont,
    borderWidth: 1,
    borderColor: colors.border
  },
  categoryBlock: {
    marginTop: spacing.md,
    gap: spacing.sm
  },
  categoryTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md
  },
  subBlock: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm
  },
  subTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm
  },
  subActions: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  subActionText: {
    color: colors.primary,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.xs
  },
  treatmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md
  },
  treatmentInfo: {
    flex: 1
  },
  treatmentName: {
    color: colors.text,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  },
  treatmentMeta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.xs
  },
  toggle: {
    width: 44,
    height: 26,
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
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.text,
    alignSelf: 'flex-start'
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#1B0F2A'
  },
  subtle: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.xs
  }
});
