import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { HomeHeader } from '@/components/HomeHeader';
import { Card } from '@/components/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { dataSources, useAppStore } from '@/store/useAppStore';

export const HomeScreen = ({ navigation }: NativeStackScreenProps<HomeStackParamList, 'Home'>) => {
  const { user } = useAppStore((state) => ({ user: state.user }));
  const city = dataSources.cities.find((item) => item.id === user.cityId);
  const locationLabel = `${user.country ?? 'IT'}, ${city?.name?.toUpperCase() ?? 'BARI'}`;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <HomeHeader
          locationLabel={locationLabel}
          onLocationPress={() => navigation.getParent()?.getParent()?.navigate('Onboarding')}
          onBookingsPress={() => navigation.getParent()?.navigate('Bookings')}
          onProfilePress={() => navigation.getParent()?.navigate('Profile')}
        />
        <Text style={styles.title}>Cosa vuoi prenotare oggi?</Text>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=800&q=60' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <Text style={styles.heroLabel}>PRENOTA SERVIZI</Text>
          <Text style={styles.heroSub}>Trattamenti selezionati, professionisti verificati.</Text>
          <View style={styles.heroSpacer} />
          <Card style={styles.heroAction}>
            <Text style={styles.heroActionText} onPress={() => navigation.navigate('Categories')}>
              Esplora categorie
            </Text>
          </Card>
        </ImageBackground>
        <View style={styles.row}>
          <Card style={styles.smallCard}>
            <Text style={styles.smallTitle} onPress={() => navigation.navigate('Operators')}>
              PRENOTA UN PROFESSIONISTA
            </Text>
            <Text style={styles.smallSubtitle}>Scegli chi viene da te.</Text>
          </Card>
          <Card style={styles.smallCard}>
            <Text style={styles.smallTitle} onPress={() => navigation.navigate('GiftCard')}>
              REGALA UN SERVIZIO
            </Text>
            <Text style={styles.smallSubtitle}>Invia un regalo immediato.</Text>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg
  },
  title: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl,
    lineHeight: 32
  },
  hero: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: spacing.lg,
    minHeight: 220,
    justifyContent: 'space-between'
  },
  heroImage: {
    borderRadius: 24
  },
  heroLabel: {
    color: colors.primaryStrong,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xl,
    letterSpacing: 1.1
  },
  heroSub: {
    color: colors.text,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.md,
    maxWidth: 220
  },
  heroSpacer: {
    flex: 1
  },
  heroAction: {
    backgroundColor: 'rgba(14, 13, 18, 0.72)',
    borderColor: 'transparent'
  },
  heroActionText: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.md
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md
  },
  smallCard: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'space-between'
  },
  smallTitle: {
    color: colors.text,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.sm,
    letterSpacing: 0.3
  },
  smallSubtitle: {
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  }
});
