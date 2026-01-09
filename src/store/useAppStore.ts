import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  Address,
  Booking,
  BookingItem,
  BookingStatus,
  GiftCard,
  Payment,
  PaymentMode,
  Role,
  User
} from '@/models/types';
import {
  availability,
  categories,
  cities,
  countries,
  operatorProfiles,
  subcategories,
  treatments,
  users
} from '@/data/mock';
import { addMinutesToTime, buildBookingTotals, generateId, nowISO } from '@/utils/format';
import { getRequiredTreatmentIds, operatorOffersAll } from '@/utils/booking';

export type BookingDraft = {
  items: BookingItem[];
  operatorId?: string;
  scheduledAt?: string;
  address?: Address;
  paymentMode?: PaymentMode;
  autoAssign?: boolean;
};

type AppState = {
  user: User;
  role: Role;
  bookingDraft: BookingDraft;
  bookings: Booking[];
  giftCards: GiftCard[];
  operatorProfiles: OperatorProfile[];
  setUserRole: (role: Role) => void;
  setLocation: (country: User['country'], cityId: User['cityId']) => void;
  addAddress: (address: Address) => void;
  updateAddresses: (addresses: Address[]) => void;
  updateUserProfile: (payload: Partial<User>) => void;
  selectTreatment: (treatmentId: string, quantity: number) => void;
  removeTreatment: (treatmentId: string) => void;
  setDraftOperator: (operatorId?: string, autoAssign?: boolean) => void;
  setDraftScheduledAt: (scheduledAt: string) => void;
  setDraftAddress: (address: Address) => void;
  setDraftPaymentMode: (mode: PaymentMode) => void;
  setDraftFromBooking: (bookingId: string) => void;
  updateOperatorProfile: (profileId: string, payload: Partial<OperatorProfile>) => void;
  toggleOfferedTreatment: (profileId: string, treatmentId: string) => void;
  setOfferedTreatments: (profileId: string, treatmentIds: string[]) => void;
  resetDraft: () => void;
  createBookingFromDraft: () => Booking | undefined;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  recordPayment: (bookingId: string, payment: Payment) => void;
  addGiftCard: (giftCard: GiftCard) => void;
  updateAvailability: (operatorId: string, day: string, start: string, end: string) => void;
};

const defaultUser = users[0];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      role: defaultUser.role,
      bookingDraft: { items: [] },
      bookings: [],
      giftCards: [],
      operatorProfiles: operatorProfiles,
      setUserRole: (role) =>
        set((state) => {
          if (role === 'operator') {
            const hasProfile = state.operatorProfiles.some((profile) => profile.userId === state.user.id);
            if (!hasProfile) {
              const [firstName, ...rest] = state.user.name.split(' ');
              const lastName = rest.join(' ');
              return {
                role,
                user: { ...state.user, role },
                operatorProfiles: [
                  ...state.operatorProfiles,
                  {
                    id: generateId('operator'),
                    userId: state.user.id,
                    cityId: state.user.cityId ?? 'bari',
                    firstName: state.user.firstName || firstName || 'Operatore',
                    lastName: state.user.lastName || lastName || '',
                    offeredTreatmentIds: [],
                    categories: [],
                    rating: 4.5,
                    verified: false,
                    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60'
                  }
                ]
              };
            }
          }
          return {
            role,
            user: { ...state.user, role }
          };
        }),
      setLocation: (country, cityId) =>
        set((state) => ({
          user: { ...state.user, country, cityId }
        })),
      updateUserProfile: (payload) =>
        set((state) => ({
          user: {
            ...state.user,
            ...payload,
            name:
              payload.firstName || payload.lastName
                ? `${payload.firstName ?? state.user.firstName} ${payload.lastName ?? state.user.lastName}`.trim()
                : state.user.name
          },
          operatorProfiles: state.operatorProfiles.map((profile) =>
            profile.userId === state.user.id
              ? {
                  ...profile,
                  firstName: payload.firstName ?? profile.firstName,
                  lastName: payload.lastName ?? profile.lastName
                }
              : profile
          )
        })),
      addAddress: (address) =>
        set((state) => ({
          user: { ...state.user, addresses: [...state.user.addresses, address] }
        })),
      updateAddresses: (addresses) =>
        set((state) => ({
          user: { ...state.user, addresses }
        })),
      selectTreatment: (treatmentId, quantity) =>
        set((state) => {
          const treatment = treatments.find((item) => item.id === treatmentId);
          if (!treatment) return state;
          const existing = state.bookingDraft.items.find((item) => item.treatmentId === treatmentId);
          const nextItems = existing
            ? state.bookingDraft.items.map((item) =>
                item.treatmentId === treatmentId
                  ? {
                      ...item,
                      quantity,
                      price: treatment.price * quantity,
                      durationMinutes: treatment.durationMinutes * quantity
                    }
                  : item
              )
            : [
                ...state.bookingDraft.items,
                {
                  treatmentId,
                  quantity,
                  price: treatment.price * quantity,
                  durationMinutes: treatment.durationMinutes * quantity
                }
              ];
          return {
            bookingDraft: {
              ...state.bookingDraft,
              items: nextItems
            }
          };
        }),
      removeTreatment: (treatmentId) =>
        set((state) => ({
          bookingDraft: {
            ...state.bookingDraft,
            items: state.bookingDraft.items.filter((item) => item.treatmentId !== treatmentId)
          }
        })),
      setDraftOperator: (operatorId, autoAssign) =>
        set((state) => ({
          bookingDraft: {
            ...state.bookingDraft,
            operatorId,
            autoAssign: autoAssign ?? state.bookingDraft.autoAssign
          }
        })),
      setDraftScheduledAt: (scheduledAt) =>
        set((state) => ({
          bookingDraft: {
            ...state.bookingDraft,
            scheduledAt
          }
        })),
      setDraftAddress: (address) =>
        set((state) => ({
          bookingDraft: {
            ...state.bookingDraft,
            address
          }
        })),
      setDraftPaymentMode: (mode) =>
        set((state) => ({
          bookingDraft: {
            ...state.bookingDraft,
            paymentMode: mode
          }
        })),
      setDraftFromBooking: (bookingId) => {
        const booking = get().bookings.find((item) => item.id === bookingId);
        if (!booking) return;
        set({
          bookingDraft: {
            items: booking.items,
            operatorId: booking.operatorId,
            scheduledAt: booking.scheduledAt,
            address: booking.address,
            paymentMode: booking.payment?.mode
          }
        });
      },
      updateOperatorProfile: (profileId, payload) =>
        set((state) => ({
          operatorProfiles: state.operatorProfiles.map((profile) =>
            profile.id === profileId ? { ...profile, ...payload } : profile
          )
        })),
      toggleOfferedTreatment: (profileId, treatmentId) =>
        set((state) => ({
          operatorProfiles: state.operatorProfiles.map((profile) => {
            if (profile.id !== profileId) return profile;
            const next = profile.offeredTreatmentIds.includes(treatmentId)
              ? profile.offeredTreatmentIds.filter((id) => id !== treatmentId)
              : [...profile.offeredTreatmentIds, treatmentId];
            return { ...profile, offeredTreatmentIds: next };
          })
        })),
      setOfferedTreatments: (profileId, treatmentIds) =>
        set((state) => ({
          operatorProfiles: state.operatorProfiles.map((profile) =>
            profile.id === profileId ? { ...profile, offeredTreatmentIds: treatmentIds } : profile
          )
        })),
      resetDraft: () => set({ bookingDraft: { items: [] } }),
      createBookingFromDraft: () => {
        const { bookingDraft, user, bookings } = get();
        if (!bookingDraft.items.length || !bookingDraft.scheduledAt || !bookingDraft.address) {
          return undefined;
        }
        const requiredTreatmentIds = getRequiredTreatmentIds(bookingDraft.items);
        const eligibleOperators = get()
          .operatorProfiles.filter((profile) => profile.cityId === user.cityId)
          .filter((profile) => operatorOffersAll(profile, requiredTreatmentIds));
        const assignedOperatorId =
          bookingDraft.operatorId ??
          eligibleOperators
            .sort((a, b) => {
              if (a.verified !== b.verified) return a.verified ? -1 : 1;
              return b.rating - a.rating;
            })[0]?.id;
        const totals = buildBookingTotals(bookingDraft.items);
        const booking: Booking = {
          id: generateId('booking'),
          userId: user.id,
          operatorId: assignedOperatorId,
          items: bookingDraft.items,
          totalPrice: totals.totalPrice,
          totalDurationMinutes: totals.totalDurationMinutes,
          scheduledAt: bookingDraft.scheduledAt,
          address: bookingDraft.address,
          status: 'pending_payment',
          createdAt: nowISO(),
          updatedAt: nowISO()
        };
        set({ bookings: [booking, ...bookings] });
        return booking;
      },
      updateBookingStatus: (bookingId, status) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  status,
                  updatedAt: nowISO()
                }
              : booking
          )
        })),
      recordPayment: (bookingId, payment) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  payment,
                  status: payment.status === 'paid' ? 'confirmed' : booking.status,
                  updatedAt: nowISO()
                }
              : booking
          )
        })),
      addGiftCard: (giftCard) => set((state) => ({ giftCards: [giftCard, ...state.giftCards] })),
      updateAvailability: (operatorId, day, start, end) => {
        const slot = availability.find((item) => item.operatorId === operatorId && item.day === day);
        if (slot) {
          slot.start = start;
          slot.end = end;
        } else {
          availability.push({
            id: generateId('slot'),
            operatorId,
            day,
            start,
            end
          });
        }
      }
    }),
    {
      name: 'beauty-home-store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export const dataSources = {
  countries,
  cities,
  categories,
  subcategories,
  treatments,
  users,
  availability
};

export const helper = {
  addMinutesToTime
};
