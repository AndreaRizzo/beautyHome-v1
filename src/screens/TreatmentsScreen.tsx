import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { BottomSheet } from '@/components/BottomSheet';
import { QuantitySelector } from '@/components/QuantitySelector';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';
import { formatMinutes, formatPrice } from '@/utils/format';

export const TreatmentsScreen = ({
  route,
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'Treatments'>) => {
  const { subcategoryId } = route.params;
  const treatments = useMemo(
    () => dataSources.treatments.filter((item) => item.subcategoryId === subcategoryId),
    [subcategoryId]
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { bookingDraft, selectTreatment } = useAppStore((state) => ({
    bookingDraft: state.bookingDraft,
    selectTreatment: state.selectTreatment
  }));

  const selected = treatments.find((item) => item.id === selectedId);

  const handleSelect = () => {
    if (!selected) return;
    selectTreatment(selected.id, quantity);
    setSelectedId(null);
    setQuantity(1);
  };

  return (
    <ScreenContainer>
      <FlatList
        data={treatments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Pressable onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.meta}>
                {formatMinutes(item.durationMinutes)} · da {formatPrice(item.price)}
              </Text>
              {expandedId === item.id ? <Text style={styles.description}>{item.description}</Text> : null}
            </Pressable>
            <PrimaryButton label="AGGIUNGI" onPress={() => setSelectedId(item.id)} />
          </Card>
        )}
      />
      {bookingDraft.items.length > 0 ? (
        <View style={styles.footer}>
          <PrimaryButton label="CONTINUA PRENOTAZIONE" onPress={() => navigation.navigate('Operators')} />
        </View>
      ) : null}
      <BottomSheet visible={!!selectedId} onClose={() => setSelectedId(null)}>
        <Text style={styles.sheetTitle}>{selected?.name ?? ''}</Text>
        <Text style={styles.sheetMeta}>Seleziona quantita</Text>
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <View style={styles.sheetSummary}>
          <Text style={styles.sheetSummaryText}>
            Totale · {formatPrice((selected?.price ?? 0) * quantity)}
          </Text>
          <Text style={styles.sheetSummaryText}>
            Durata · {formatMinutes((selected?.durationMinutes ?? 0) * quantity)}
          </Text>
        </View>
        <PrimaryButton label="CONTINUA" onPress={handleSelect} />
      </BottomSheet>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 120
  },
  card: {
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.lg
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  },
  description: {
    marginTop: spacing.sm,
    color: colors.text,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm,
    lineHeight: 18
  },
  footer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg
  },
  sheetTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.lg
  },
  sheetMeta: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    marginBottom: spacing.md
  },
  sheetSummary: {
    marginVertical: spacing.md
  },
  sheetSummaryText: {
    color: colors.text,
    fontFamily: typography.bodyFont,
    marginBottom: 4
  }
});
