import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources } from '@/store/useAppStore';

export const CategoriesScreen = ({
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'Categories'>) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <LoadingSkeleton />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={dataSources.categories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Subcategories', { categoryId: item.id })}>
            <ImageBackground source={{ uri: item.image }} style={styles.card} imageStyle={styles.image}>
              <View style={styles.overlay} />
              <Text style={styles.cardTitle}>{item.name}</Text>
            </ImageBackground>
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
  loadingContainer: {
    padding: spacing.lg
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  card: {
    width: 160,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: spacing.md
  },
  image: {
    borderRadius: 20
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 11, 16, 0.45)'
  },
  cardTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md,
    letterSpacing: 0.4
  }
});
