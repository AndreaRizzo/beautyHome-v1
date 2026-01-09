import { BookingItem } from '@/models/types';

export const formatPrice = (value: number) => `€${value.toFixed(2)}`;

export const formatMinutes = (minutes: number) => `${minutes} min`;

export const nowISO = () => new Date().toISOString();

export const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const buildBookingTotals = (items: BookingItem[]) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const totalDurationMinutes = items.reduce((sum, item) => sum + item.durationMinutes, 0);
  return { totalPrice, totalDurationMinutes };
};

export const toDayLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('it-IT', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (isoDate: string) =>
  new Date(isoDate).toLocaleString('it-IT', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

export const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    draft: 'bozza',
    pending_payment: 'in attesa di pagamento',
    confirmed: 'confermato',
    in_progress: 'in corso',
    completed: 'completato',
    cancelled_by_user: 'annullato dal cliente',
    cancelled_by_operator: "annullato dall'operatore",
    no_show: 'assenza'
  };
  return map[status] ?? status.replaceAll('_', ' ');
};

export const addMinutesToTime = (time: string, minutes: number) => {
  const [h, m] = time.split(':').map(Number);
  const base = new Date();
  base.setHours(h, m, 0, 0);
  base.setMinutes(base.getMinutes() + minutes);
  const nextH = `${base.getHours()}`.padStart(2, '0');
  const nextM = `${base.getMinutes()}`.padStart(2, '0');
  return `${nextH}:${nextM}`;
};
