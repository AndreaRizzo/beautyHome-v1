import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList } from '@/navigation';
import { ScreenContainer } from '@/components/ScreenContainer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const ConfirmationScreen = ({
  navigation
}: NativeStackScreenProps<HomeStackParamList, 'Confirmation'>) => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.title}>Prenotazione confermata</Text>
        <Text style={styles.subtitle}>Il professionista e pronto a raggiungerti.</Text>
        <PrimaryButton
          label="VEDI PRENOTAZIONI"
          onPress={() => navigation.getParent()?.navigate('Bookings')}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: typography.bodyFont,
    textAlign: 'center'
  }
});
