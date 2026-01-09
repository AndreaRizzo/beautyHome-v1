export type Role = 'user' | 'operator';

export type CountryCode = 'IT' | 'ES';

export type BookingStatus =
  | 'draft'
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled_by_user'
  | 'cancelled_by_operator'
  | 'no_show';

export type PaymentMode = 'deposit_balance_app' | 'deposit_balance_cash' | 'full_app';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type Country = {
  code: CountryCode;
  name: string;
};

export type City = {
  id: string;
  name: string;
  countryCode: CountryCode;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
};

export type Treatment = {
  id: string;
  subcategoryId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
};

export type Address = {
  id: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  notes?: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: Role;
  country?: CountryCode;
  cityId?: string;
  phone?: string;
  preferences?: string[];
  addresses: Address[];
};

export type OperatorProfile = {
  id: string;
  userId: string;
  cityId: string;
  firstName: string;
  lastName: string;
  offeredTreatmentIds: string[];
  categories: string[];
  rating: number;
  verified: boolean;
  photo: string;
};

export type AvailabilitySlot = {
  id: string;
  operatorId: string;
  day: string;
  start: string;
  end: string;
};

export type BookingItem = {
  treatmentId: string;
  quantity: number;
  price: number;
  durationMinutes: number;
};

export type Payment = {
  id: string;
  mode: PaymentMode;
  depositAmount: number;
  balanceAmount: number;
  status: PaymentStatus;
};

export type Booking = {
  id: string;
  userId: string;
  operatorId?: string;
  items: BookingItem[];
  totalPrice: number;
  totalDurationMinutes: number;
  scheduledAt?: string;
  address?: Address;
  status: BookingStatus;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type GiftCard = {
  id: string;
  amount: number;
  recipientEmail: string;
  message?: string;
  code: string;
  createdAt: string;
};
