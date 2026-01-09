import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useAppStore } from '@/store/useAppStore';
import { SplashScreen } from '@/screens/SplashScreen';
import { OnboardingLocationScreen } from '@/screens/OnboardingLocationScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { CategoriesScreen } from '@/screens/CategoriesScreen';
import { SubcategoriesScreen } from '@/screens/SubcategoriesScreen';
import { TreatmentsScreen } from '@/screens/TreatmentsScreen';
import { OperatorListScreen } from '@/screens/OperatorListScreen';
import { DateTimeScreen } from '@/screens/DateTimeScreen';
import { AddressScreen } from '@/screens/AddressScreen';
import { BookingSummaryScreen } from '@/screens/BookingSummaryScreen';
import { PaymentScreen } from '@/screens/PaymentScreen';
import { ConfirmationScreen } from '@/screens/ConfirmationScreen';
import { GiftCardScreen } from '@/screens/GiftCardScreen';
import { BookingsScreen } from '@/screens/BookingsScreen';
import { BookingDetailScreen } from '@/screens/BookingDetailScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { OperatorDashboardScreen } from '@/screens/OperatorDashboardScreen';
import { OperatorAvailabilityScreen } from '@/screens/OperatorAvailabilityScreen';
import { OperatorBookingDetailScreen } from '@/screens/OperatorBookingDetailScreen';
import { OperatorProfileScreen } from '@/screens/OperatorProfileScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  User: undefined;
  Operator: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Categories: undefined;
  Subcategories: { categoryId: string };
  Treatments: { subcategoryId: string };
  Operators: { categoryId?: string };
  OperatorProfile: { operatorId: string };
  DateTime: undefined;
  Address: undefined;
  BookingSummary: undefined;
  Payment: { bookingId?: string };
  Confirmation: { bookingId: string };
  GiftCard: undefined;
};

export type BookingsStackParamList = {
  Bookings: undefined;
  BookingDetail: { bookingId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type OperatorStackParamList = {
  OperatorDashboard: undefined;
  OperatorAvailability: undefined;
  OperatorBookingDetail: { bookingId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const OperatorStack = createNativeStackNavigator<OperatorStackParamList>();
const Tabs = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border
  }
};

const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false
    }}
  >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Categories" component={CategoriesScreen} />
    <HomeStack.Screen name="Subcategories" component={SubcategoriesScreen} />
    <HomeStack.Screen name="Treatments" component={TreatmentsScreen} />
    <HomeStack.Screen name="Operators" component={OperatorListScreen} />
    <HomeStack.Screen name="OperatorProfile" component={OperatorProfileScreen} />
    <HomeStack.Screen name="DateTime" component={DateTimeScreen} />
    <HomeStack.Screen name="Address" component={AddressScreen} />
    <HomeStack.Screen name="BookingSummary" component={BookingSummaryScreen} />
    <HomeStack.Screen name="Payment" component={PaymentScreen} />
    <HomeStack.Screen name="Confirmation" component={ConfirmationScreen} />
    <HomeStack.Screen name="GiftCard" component={GiftCardScreen} />
  </HomeStack.Navigator>
);

const BookingsStackNavigator = () => (
  <BookingsStack.Navigator screenOptions={{ headerShown: false }}>
    <BookingsStack.Screen name="Bookings" component={BookingsScreen} />
    <BookingsStack.Screen name="BookingDetail" component={BookingDetailScreen} />
  </BookingsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const UserTabs = () => (
  <Tabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSubtle,
      tabBarIcon: ({ color, size }) => {
        const map: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: 'sparkles',
          Bookings: 'calendar',
          Profile: 'person'
        };
        return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
      }
    })}
  >
    <Tabs.Screen name="Home" component={HomeStackNavigator} options={{ tabBarLabel: 'Home' }} />
    <Tabs.Screen name="Bookings" component={BookingsStackNavigator} options={{ tabBarLabel: 'Prenotazioni' }} />
    <Tabs.Screen name="Profile" component={ProfileStackNavigator} options={{ tabBarLabel: 'Profilo' }} />
  </Tabs.Navigator>
);

const OperatorStackNavigator = () => (
  <OperatorStack.Navigator screenOptions={{ headerShown: false }}>
    <OperatorStack.Screen name="OperatorDashboard" component={OperatorDashboardScreen} />
    <OperatorStack.Screen name="OperatorAvailability" component={OperatorAvailabilityScreen} />
    <OperatorStack.Screen name="OperatorBookingDetail" component={OperatorBookingDetailScreen} />
  </OperatorStack.Navigator>
);

export const AppNavigator = () => {
  const role = useAppStore((state) => state.role);
  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Onboarding" component={OnboardingLocationScreen} />
        {role === 'operator' ? (
          <RootStack.Screen name="Operator" component={OperatorStackNavigator} />
        ) : (
          <RootStack.Screen name="User" component={UserTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
