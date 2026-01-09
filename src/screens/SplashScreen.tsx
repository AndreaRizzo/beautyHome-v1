import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useAppStore } from '@/store/useAppStore';

export const SplashScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) => {
  const { user, role } = useAppStore((state) => ({ user: state.user, role: state.role }));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user.country || !user.cityId) {
        navigation.replace('Onboarding');
      } else if (role === 'operator') {
        navigation.replace('Operator');
      } else {
        navigation.replace('User');
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [navigation, role, user.country, user.cityId]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Beauty Home</Text>
      <Text style={styles.tagline}>Il tuo salone, a domicilio.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  logo: {
    color: colors.primary,
    fontFamily: typography.headingFont,
    fontSize: typography.sizes.xxl,
    letterSpacing: 1.2
  },
  tagline: {
    marginTop: 8,
    color: colors.textSubtle,
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.sm
  }
});
