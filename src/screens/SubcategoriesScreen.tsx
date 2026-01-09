import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources } from '@/store/useAppStore';

export const SubcategoriesScreen = ({
  route,
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'Subcategories'>) => {
  const { categoryId } = route.params;
  const filtered = dataSources.subcategories.filter((item) => item.categoryId === categoryId);

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Treatments', { subcategoryId: item.id })}>
            <Card style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
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
  card: {
    backgroundColor: colors.surfaceAlt
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.lg
  }
});
